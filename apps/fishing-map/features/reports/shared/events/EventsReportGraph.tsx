import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { DateTime } from 'luxon'
import { groupBy } from 'es-toolkit'
import { stringify } from 'qs'
import { getFourwingsInterval, type FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { BaseResponsiveTimeseriesProps } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveTimeseries } from '@globalfishingwatch/responsive-visualizations'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { ApiEvent, APIPagination } from '@globalfishingwatch/api-types'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getISODateByInterval, getUTCDateTime } from 'utils/dates'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { formatInfoField } from 'utils/info'
import styles from './EventsReportGraph.module.css'

type EventsReportGraphTooltipProps = {
  active: boolean
  payload: {
    name: string
    dataKey: string
    label: number
    value: number
    payload: any
    color: string
    unit: string
  }[]
  label: number
  timeChunkInterval: FourwingsInterval
}

const AggregatedGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as EventsReportGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <p className={styles.tooltipValue}>
          {formatI18nNumber(payload[0].payload.value)} {payload[0].unit}
        </p>
      </div>
    )
  }

  return null
}

const IndividualGraphTooltip = ({ data }: { data?: any }) => {
  if (!data?.vessel?.name) {
    return null
  }
  return formatInfoField(data.vessel.name, 'shipname')
}

const formatDateTicks: BaseResponsiveTimeseriesProps['tickLabelFormatter'] = (
  tick,
  timeChunkInterval
) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

export default function EventsReportGraph({
  datasetId,
  filters,
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  timeseries,
}: {
  datasetId: string
  filters?: Record<string, string | string[]>
  color?: string
  end: string
  start: string
  timeseries: { date: string; value: number }[]
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)
  const filtersMemo = useMemoCompare(filters)

  const getAggregatedData = useCallback(async () => timeseries, [timeseries])
  const getIndividualData = useCallback(async () => {
    // TODO add includes to fetch only the information needed
    const params = {
      'start-date': start,
      'end-date': end,
      'time-filter-mode': 'START-DATE',
      ...(filtersMemo && { ...filtersMemo }),
      datasets: [datasetId],
      limit: 1000,
      offset: 0,
    }
    const data = await GFWAPI.fetch<APIPagination<ApiEvent>>(`/v3/events?${stringify(params)}`)
    const groupedData = groupBy(data.entries, (item) =>
      getISODateByInterval(DateTime.fromISO(item.start as string), interval)
    )
    return Object.entries(groupedData)
      .map(([date, events]) => ({ date, values: events }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [datasetId, end, interval, filtersMemo, start])

  if (!timeseries.length) {
    return null
  }

  return (
    // TODO: remove this ref and move it inside
    <div ref={containerRef} className={styles.graph}>
      <ResponsiveTimeseries
        start={start}
        end={end}
        timeseriesInterval={interval}
        getAggregatedData={getAggregatedData}
        getIndividualData={getIndividualData}
        tickLabelFormatter={formatDateTicks}
        aggregatedTooltip={<AggregatedGraphTooltip />}
        individualTooltip={<IndividualGraphTooltip />}
        color={color}
      />
    </div>
  )
}
