import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { debounce } from 'lodash'
import {
  MultiSelect,
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import {
  getFiltersBySchema,
  getCommonSchemaFieldsInDataview,
  isDataviewSchemaSupported,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import ActivitySchemaFilter, {
  showSchemaFilter,
} from 'features/workspace/activity/ActivitySchemaFilter'
import styles from './ActivityFilters.module.css'
import {
  areAllSourcesSelectedInDataview,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
} from './activity.utils'

type ActivityFiltersProps = {
  dataview: UrlDataviewInstance
}

const filterIds: SupportedDatasetSchema[] = [
  'geartype',
  'fleet',
  'shiptype',
  'origin',
  'matched',
  'source',
  'radiance',
  'target_species',
  'license_category',
  'vessel_type',
]

const trackEvent = debounce((filterKey: string, label: string) => {
  uaEvent({
    category: 'Activity data',
    action: `Click on ${filterKey} filter`,
    label: label,
  })
}, 200)

function ActivityFilters({ dataview }: ActivityFiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  // insert the "All" option only when more than one option available
  const allOption = { id: 'all', label: t('selects.allSelected', 'All') }
  const allSourceOptions = sourceOptions.length > 1 ? [allOption, ...sourceOptions] : sourceOptions
  const allSelected = areAllSourcesSelectedInDataview(dataview)
  const sourcesSelected = allSelected ? [allOption] : getSourcesSelectedInDataview(dataview)

  const flagOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const flags = useMemo(getFlags, [])

  const flagFiltersSupported = isDataviewSchemaSupported(dataview, 'flag')
  const showSourceFilter = sourceOptions && sourceOptions?.length > 1

  const schemaFilters = filterIds.map((id) => getFiltersBySchema(dataview, id))

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    let datasets: string[] = []
    if (source.id === allOption.id) {
      datasets = sourceOptions.map((s) => s.id)
    } else {
      datasets = allSelected ? [source.id] : [...(dataview.config?.datasets || []), source.id]
    }
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    if (filters['geartype']) {
      const newGeartypeOptions = getCommonSchemaFieldsInDataview(newDataview, 'geartype')
      const newGeartypeSelection = newGeartypeOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newGeartypeOptions.length === 0) {
        delete filters['geartype']
        // or keep only the options that every dataset have in common
      } else if (!newGeartypeSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.geartype = newGeartypeSelection.map(({ id }) => id)
      }
    }

    if (filters['fleet']) {
      const newFleetOptions = getCommonSchemaFieldsInDataview(newDataview, 'fleet')
      const newFleetSelection = newFleetOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newFleetOptions.length === 0) {
        delete filters['fleet']
        // or keep only the options that every dataset have in common
      } else if (!newFleetSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.fleet = newFleetSelection.map(({ id }) => id)
      }
    }
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        datasets,
        filters,
      },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || null
    upsertDataviewInstance({
      id: dataview.id,
      config: { datasets },
    })
  }

  const onSelectFilterClick = (
    filterKey: string,
    selection: MultiSelectOption | MultiSelectOption[]
  ) => {
    const filterValues = Array.isArray(selection)
      ? selection.map(({ id }) => id).sort((a, b) => a - b)
      : [...(dataview.config?.filters?.[filterKey] || []), selection.id]
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          [filterKey]: filterValues,
        },
      },
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ [filterKey]: filterValues }),
    ])
    trackEvent(filterKey, eventLabel)
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel([
        'deselect',
        getActivitySources(dataview),
        ...getActivityFilters({ [filterKey]: filterValue ?? [] }),
      ]),
    })
  }

  const onCleanFilterClick = (filterKey: string) => {
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    delete filters[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
    })
    uaEvent({
      category: 'Activity data',
      action: `Click on ${filterKey} filter`,
      label: getEventLabel(['clear', getActivitySources(dataview)]),
    })
  }

  const showSchemaFilters =
    flagFiltersSupported || showSourceFilter || schemaFilters.some(showSchemaFilter)

  if (!showSchemaFilters) {
    return <p className={styles.placeholder}>{t('dataset.emptyFilters', 'No filters available')}</p>
  }

  return (
    <Fragment>
      {showSourceFilter && (
        <MultiSelect
          label={t('layer.source_other', 'Sources')}
          placeholder={getPlaceholderBySelections(sourcesSelected)}
          options={allSourceOptions}
          selectedOptions={sourcesSelected}
          onSelect={onSelectSourceClick}
          onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
        />
      )}
      {flagFiltersSupported && (
        <MultiSelect
          label={t('layer.flagState_other', 'Flag States')}
          placeholder={getPlaceholderBySelections(flagOptions)}
          options={flags}
          selectedOptions={flagOptions}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('flag', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('flag', rest)}
          onCleanClick={() => onCleanFilterClick('flag')}
        />
      )}
      {schemaFilters.map((schemaFilter) => {
        if (!showSchemaFilter(schemaFilter)) {
          return null
        }
        return (
          <ActivitySchemaFilter
            key={schemaFilter.id}
            schemaFilter={schemaFilter}
            onSelect={onSelectFilterClick}
            onRemove={onRemoveFilterClick}
            onClean={onCleanFilterClick}
          />
        )
      })}
    </Fragment>
  )
}

export default ActivityFilters
