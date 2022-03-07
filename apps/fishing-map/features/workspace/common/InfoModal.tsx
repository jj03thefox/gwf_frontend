import { Fragment, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'lodash'
import {
  getVesselIdFromDatasetConfig,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Tabs, Tab, Modal, IconButton } from '@globalfishingwatch/ui-components'
import { DatasetStatus } from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import InfoModalContent from 'features/workspace/common/InfoModalContent'
import { ROOT_DOM_ELEMENT } from 'data/config'
import styles from './InfoModal.module.css'

type InfoModalProps = {
  dataview: UrlDataviewInstance
  onClick?: (e: React.MouseEvent) => void
  className?: string
  onModalStateChange?: (open: boolean) => void
}

const InfoModal = ({ dataview, onClick, className, onModalStateChange }: InfoModalProps) => {
  const { t } = useTranslation()
  const [modalInfoOpen, setModalInfoOpen] = useState(false)
  const dataset = dataview.datasets?.[0]

  const tabs = useMemo(() => {
    const uniqDatasets = dataview.datasets ? uniqBy(dataview.datasets, (dataset) => dataset.id) : []
    return uniqDatasets.flatMap((dataset) => {
      if (dataview.config?.type === GeneratorType.Track) {
        const datasetConfig = dataview.datasetsConfig?.find(
          (datasetConfig) => datasetConfig.datasetId === dataset.id
        )
        if (!datasetConfig) return []
        const hasDatasetVesselId = getVesselIdFromDatasetConfig(datasetConfig)
        if (!hasDatasetVesselId) return []
      } else if (dataview.config?.datasets && !dataview.config?.datasets?.includes(dataset.id)) {
        return []
      }
      return {
        id: dataset.id,
        title: getDatasetLabel(dataset),
        content: <InfoModalContent dataset={dataset} />,
      }
    })
    // Updating tabs when t changes to ensure the content is updated on lang change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataview, t])

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setModalInfoOpen(true)
      if (onModalStateChange) onModalStateChange(true)
      if (onClick) {
        onClick(e)
      }
    },
    [onClick, onModalStateChange]
  )
  const onModalClose = useCallback(() => {
    setModalInfoOpen(false)
    if (onModalStateChange) onModalStateChange(false)
  }, [onModalStateChange])

  const isSingleTab = tabs?.length === 1

  const datasetImporting = dataset?.status === DatasetStatus.Importing
  const datasetError = dataset?.status === DatasetStatus.Error

  let tooltip = t(`layer.seeDescription`, 'Click to see layer description')
  if (datasetImporting) {
    tooltip = t('dataset.importing', 'Dataset is being imported')
  }
  if (datasetError) {
    tooltip = `${t('errors.uploadError', 'There was an error uploading your dataset')} - ${
      dataset?.importLogs
    }`
  }

  if (dataset?.configuration?.geometryType === 'draw') {
    return datasetImporting || datasetError ? (
      <IconButton
        size="small"
        icon={'info'}
        type={datasetError ? 'warning' : 'default'}
        loading={datasetImporting}
        className={className}
        tooltip={tooltip}
        tooltipPlacement="top"
      />
    ) : null
  }
  const hasLongTitleTab = tabs.some((tab) => tab.title.length > 30)
  return (
    <Fragment>
      <IconButton
        icon={datasetError ? 'warning' : 'info'}
        type={datasetError ? 'warning' : 'default'}
        size="small"
        loading={datasetImporting}
        className={className}
        tooltip={tooltip}
        tooltipPlacement="top"
        onClick={handleClick}
      />
      {tabs && tabs.length > 0 && modalInfoOpen && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={isSingleTab ? tabs[0].title : dataview.name}
          isOpen={modalInfoOpen}
          onClose={onModalClose}
          contentClassName={styles.modalContent}
        >
          {isSingleTab ? (
            tabs[0]?.content
          ) : (
            <Tabs
              tabs={tabs}
              activeTab={activeTab?.id}
              onTabClick={(tab: Tab) => setActiveTab(tab)}
              buttonSize={hasLongTitleTab ? 'verybig' : 'default'}
            />
          )}
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoModal
