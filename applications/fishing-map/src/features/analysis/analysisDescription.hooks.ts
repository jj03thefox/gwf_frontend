import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { selectDataviewInstancesByIds } from 'features/dataviews/dataviews.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/activity/activity.utils'
import { t } from 'features/i18n/i18n'
import { getFlagsByIds } from 'utils/flags'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectAnalysisTimeComparison, selectAnalysisTypeQuery } from 'features/app/app.selectors'
import { WorkspaceAnalysisTimeComparison, WorkspaceAnalysisType } from 'types'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { selectShowTimeComparison } from './analysis.selectors'

export const FIELDS = [
  ['geartype', 'layer.gearType_other', 'Gear types'],
  ['fleet', 'layer.fleet_other', 'Fleets'],
  ['origin', 'vessel.origin', 'Origin'],
  ['vessel_type', 'vessel.vesselType_other', 'Vessel types'],
]

const sortStrings = (a: string, b: string) => a.localeCompare(b)

const getSerializedDatasets = (dataview: UrlDataviewInstance) => {
  return dataview.config?.datasets?.slice().sort(sortStrings).join(', ')
}

const getSerializedFilterFields = (dataview: UrlDataviewInstance, filterKey: string): string => {
  return dataview.config?.filters?.[filterKey]?.slice().sort(sortStrings).join(', ')
}

const getCommonProperties = (dataviews?: UrlDataviewInstance[], showTimeComparison?: boolean) => {
  const commonProperties: string[] = []
  const titleChunks: { label: string; strong?: boolean }[] = []

  if (dataviews && dataviews?.length > 0) {
    const firstDataviewDatasets = getSerializedDatasets(dataviews[0])

    if (showTimeComparison) {
      titleChunks.push({ label: t('analysis.changeIn', 'Change in') })
    }

    if (dataviews?.every((dataview) => dataview.name === dataviews[0].name)) {
      commonProperties.push('dataset')
      const fishingDataview = isFishingDataview(dataviews[0])
      const presenceDataview = isPresenceDataview(dataviews[0])
      if (fishingDataview || presenceDataview) {
        const mainLabel = presenceDataview
          ? t(`common.presence`, 'Vessel presence')
          : t(`common.apparentFishing`, 'Apparent Fishing Effort')
        titleChunks.push({ label: mainLabel, strong: true })
      } else {
        titleChunks.push({ label: dataviews[0].name || '', strong: true })
      }
    }

    if (
      dataviews?.every((dataview) => {
        const datasets = getSerializedDatasets(dataview)
        return datasets === firstDataviewDatasets
      })
    ) {
      commonProperties.push('source')
      const datasets = dataviews[0].datasets?.filter((d) =>
        dataviews[0].config?.datasets?.includes(d.id)
      )
      if (datasets?.length) {
        titleChunks.push({ label: ` (${datasets?.map((d) => d.name).join(', ')})` })
      }
    }

    const firstDataviewFlags = getSerializedFilterFields(dataviews[0], 'flag')
    if (
      dataviews?.every((dataview) => {
        const flags = getSerializedFilterFields(dataview, 'flag')
        return flags === firstDataviewFlags
      })
    ) {
      commonProperties.push('flag')
      const flags = getFlagsByIds(dataviews[0].config?.filters?.flag || [])
      if (firstDataviewFlags) {
        titleChunks.push({ label: t('analysis.vesselFlags', 'by vessels flagged by') })
        titleChunks.push({ label: `${flags?.map((d) => d.label).join(', ')}`, strong: true })
      }
    }

    // Collect common filters that are not 'flag'
    const firstDataviewGenericFilterKeys =
      dataviews[0].config && dataviews[0].config?.filters
        ? Object.keys(dataviews[0].config?.filters).filter((key) => key !== 'flag')
        : []

    const genericFilters: Record<string, string>[] = []
    firstDataviewGenericFilterKeys.forEach((filterKey) => {
      const firstDataviewGenericFilterFields = getSerializedFilterFields(dataviews[0], filterKey)
      if (
        dataviews?.every((dataview) => {
          const genericFilterFields = getSerializedFilterFields(dataview, filterKey)
          return genericFilterFields === firstDataviewGenericFilterFields
        })
      ) {
        const keyLabelField = FIELDS.find((field) => field[0] === filterKey)
        const keyLabel = keyLabelField
          ? t(keyLabelField[1], keyLabelField[2]).toLocaleLowerCase()
          : filterKey

        const valuesLabel = getSchemaFieldsSelectedInDataview(
          dataviews[0],
          filterKey as SupportedDatasetSchema
        )
          .map((f) => f.label.toLocaleLowerCase())
          .join(', ')
        genericFilters.push({
          keyLabel,
          valuesLabel,
        })
        commonProperties.push(filterKey)
      }
    })

    if (genericFilters.length) {
      titleChunks.push({ label: t('analysis.filteredBy', 'filtered by') })
      titleChunks.push({
        label: genericFilters
          .map((genericFilter) => `${genericFilter.keyLabel}: ${genericFilter.valuesLabel}`)
          .join('; '),
        strong: true,
      })
    }
  }

  return { titleChunks, commonProperties }
}

export type DescriptionChunks = {
  label: string
  strong?: boolean
}[]

const getDescription = (
  titleChunks: { label: string; strong?: boolean }[],
  analysisAreaName: string,
  start: string | undefined,
  end: string | undefined,
  graphData: AnalysisGraphProps | undefined,
  analysisType: WorkspaceAnalysisType,
  timeComparison: WorkspaceAnalysisTimeComparison
): DescriptionChunks => {
  if (!titleChunks || !titleChunks.length) return []
  const dateFormat =
    graphData?.interval === 'hour'
      ? DateTime.DATETIME_MED_WITH_WEEKDAY
      : DateTime.DATE_MED_WITH_WEEKDAY
  const descriptionChunks = [...titleChunks]
  if (analysisAreaName) {
    descriptionChunks.push({ label: t('common.in', 'in') })
    descriptionChunks.push({ label: analysisAreaName, strong: true })
  }
  if (timeComparison && (analysisType === 'periodComparison' || analysisType === 'beforeAfter')) {
    const startLabel = formatI18nDate(timeComparison.start, { format: dateFormat })
    // TODO Plural and i18n
    const durationLabel = [timeComparison.duration, timeComparison.durationType].join(' ')
    const label =
      analysisType === 'periodComparison'
        ? t('analysis.periodComparisonRange', {
            compareStart: formatI18nDate(timeComparison.compareStart, { format: dateFormat }),
            start: startLabel,
            duration: durationLabel,
            defaultValue: 'between the {{duration}} after {{start}} and after {{compareStart}}',
          })
        : t('analysis.beforeAfterRange', {
            start: startLabel,
            duration: durationLabel,
            defaultValue: 'between the {{duration}} before and after {{start}}',
          })
    descriptionChunks.push({
      label,
      strong: true,
    })
  } else if (start && end) {
    descriptionChunks.push({
      label: t('common.dateRange', {
        start: formatI18nDate(start, { format: dateFormat }),
        end: formatI18nDate(end, { format: dateFormat }),
        defaultValue: 'between {{start}} and {{end}}',
      }),
      strong: true,
    })
  }
  return descriptionChunks
}

const useAnalysisDescription = (analysisAreaName: string, graphData?: AnalysisGraphProps) => {
  const { start, end } = useTimerangeConnect()
  const dataviewsIds = useMemo(() => {
    return graphData ? graphData.sublayers.map((s) => s.id) : []
  }, [graphData])
  const dataviews = useSelector(selectDataviewInstancesByIds(dataviewsIds))
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const timeComparison = useSelector(selectAnalysisTimeComparison)
  const showTimeComparison = useSelector(selectShowTimeComparison)
  const { titleChunks, commonProperties } = useMemo(() => {
    return getCommonProperties(dataviews, showTimeComparison)
  }, [dataviews, showTimeComparison])
  const description = getDescription(
    titleChunks,
    analysisAreaName,
    start,
    end,
    graphData,
    analysisType,
    timeComparison
  )
  return { description, commonProperties }
}

export default useAnalysisDescription
