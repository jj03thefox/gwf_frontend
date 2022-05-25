import { useEffect } from 'react'
import cx from 'classnames'
import { useTranslation, Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetCategory } from '@globalfishingwatch/api-types'
import LocalStorageLoginLink from 'routes/LoginLink'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUserDatasetsNotUsed } from 'features/user/user.selectors'
import { isGuestUser } from 'features/user/user.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useAddDataviewFromDatasetToWorkspace, useAddDataset } from './datasets.hook'
import styles from './NewDatasetTooltip.module.css'
import {
  fetchAllDatasetsThunk,
  selectAllDatasetsRequested,
  selectDatasetsStatus,
} from './datasets.slice'

export interface NewDatasetTooltipProps {
  datasetCategory: DatasetCategory
  onSelect?: (dataset?: Dataset) => void
}

function NewDatasetTooltip({ onSelect, datasetCategory }: NewDatasetTooltipProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { addDataviewFromDatasetToWorkspace } = useAddDataviewFromDatasetToWorkspace()
  const datasets = useSelector(selectUserDatasetsNotUsed(datasetCategory))
  const guestuser = useSelector(isGuestUser)
  const datasetsStatus = useSelector(selectDatasetsStatus)
  const allDatasetsRequested = useSelector(selectAllDatasetsRequested)

  useEffect(() => {
    if (!allDatasetsRequested) {
      dispatch(fetchAllDatasetsThunk())
    }
  }, [allDatasetsRequested, dispatch])

  const onAddNewClick = useAddDataset({ onSelect, datasetCategory })

  const onSelectClick = async (dataset: any) => {
    addDataviewFromDatasetToWorkspace(dataset)
    if (onSelect) {
      onSelect(dataset)
    }
  }

  if (guestuser) {
    return (
      <div className={styles.container}>
        <div className={styles.contentPlaceholder}>
          <p>
            <Trans i18nKey="dataset.uploadLogin">
              You need to
              <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink>
              to upload datasets
            </Trans>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <ul className={styles.listContainer}>
        <li className={cx(styles.dataset, styles.create)} onClick={onAddNewClick}>
          {datasetCategory === DatasetCategory.Context
            ? t('dataset.uploadNewContext', 'Upload new context areas')
            : t('dataset.uploadNewEnviroment', 'Upload new environment dataset')}
        </li>
        {datasetsStatus === AsyncReducerStatus.Loading ? (
          <li className={styles.loadingPlaceholder}>
            <Spinner size="small" />
          </li>
        ) : datasets?.length > 0 ? (
          datasets.map((dataset) => (
            <li key={dataset.id} className={styles.dataset} onClick={() => onSelectClick(dataset)}>
              {dataset.name}
            </li>
          ))
        ) : (
          <li className={cx(styles.dataset, styles.empty)}>
            {datasetCategory === DatasetCategory.Context
              ? t('dataset.notUploadedYet', 'No context layers uploaded yet')
              : t('dataset.notUploadedYetEnvironment', 'No environment layers uploaded yet')}
          </li>
        )}
      </ul>
    </div>
  )
}

export default NewDatasetTooltip
