import { useTranslation } from 'react-i18next'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { getFlagsByIds } from 'utils/flags'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { getSchemaFilterOperationInDataview } from 'features/datasets/datasets.utils'
import { useDataviewInstancesConnect } from '../workspace.hook'

type DatasetFlagFieldProps = {
  dataview: UrlDataviewInstance
  showWhenEmpty?: boolean
}

function DatasetFlagField({ dataview, showWhenEmpty = false }: DatasetFlagFieldProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const filterOperation = getSchemaFilterOperationInDataview(dataview, 'flag')
  let fishingFiltersOptions = getFlagsByIds(dataview.config?.filters?.flag || [])

  const onRemoveClick = (tag: TagItem, tags: TagItem[]) => {
    console.log(tags)
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          ['flag']: tags.length ? tags.map((t) => t.id) : undefined,
        },
      },
    })
  }

  if (!fishingFiltersOptions?.length) {
    if (showWhenEmpty) {
      fishingFiltersOptions = [
        {
          id: 'all',
          label: 'All',
        },
      ]
    } else return null
  }

  return (
    <div className={styles.filter}>
      <label>
        {t('layer.flagState_other', 'Flag States')}
        {filterOperation === EXCLUDE_FILTER_ID && ` (${t('common.excluded', 'Excluded')})`}
      </label>
      <TagList
        tags={fishingFiltersOptions}
        color={dataview.config?.color}
        className={styles.tagList}
        onRemove={onRemoveClick}
      />
    </div>
  )
}

export default DatasetFlagField
