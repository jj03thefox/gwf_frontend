import type { ReactElement } from 'react'
import React, { useCallback } from 'react'
import { DateTime } from 'luxon'
import { groupBy } from 'es-toolkit'
import { stringify } from 'qs'
import { useTranslation } from 'react-i18next'
import { getEventsStatsQuery } from 'queries/report-events-stats-api'
import type { BaseReportEventsVesselsParamsFilters } from 'queries/report-events-stats-api'
import { getFourwingsInterval, type FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { BaseResponsiveTimeseriesProps } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveTimeseries } from '@globalfishingwatch/responsive-visualizations'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { ApiEvent, APIPagination, EventType } from '@globalfishingwatch/api-types'
import { useMemoCompare } from '@globalfishingwatch/react-hooks'
import { getISODateByInterval } from '@globalfishingwatch/data-transforms'
import i18n from 'features/i18n/i18n'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { formatInfoField } from 'utils/info'
import { getTimeLabels } from 'utils/events'
import EncounterIcon from '../../shared/events/icons/event-encounter.svg'
import LoiteringIcon from '../../shared/events/icons/event-loitering.svg'
import PortVisitIcon from '../../shared/events/icons/event-port.svg'
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

const IndividualGraphTooltip = ({ data, eventType }: { data?: any; eventType?: EventType }) => {
  const { t } = useTranslation()
  if (!data?.vessel?.name) {
    return null
  }
  console.log('data:', data)
  if (eventType === 'encounter') {
    const { start, duration } = getTimeLabels({ start: data.start, end: data.end })
    return (
      <div className={styles.event}>
        <div className={styles.properties}>
          <div className={styles.property}>
            <label>{t('eventInfo.start', 'Start')}</label>
            <span>{start}</span>
          </div>
          <div className={styles.property}>
            <label>{t('eventInfo.duration', 'Duration')}</label>
            <span>{duration}</span>
          </div>
        </div>
        <div className={styles.properties}>
          <div className={styles.property}>
            <label>{formatInfoField(data.vessel?.type, 'shiptypes')}</label>
            <span>{formatInfoField(data.vessel?.name, 'shipname')}</span>
          </div>
          <div className={styles.property}>
            <label>{formatInfoField(data.encounter?.vessel?.type, 'shiptypes')}</label>
            <span>{formatInfoField(data.encounter?.vessel?.name, 'shipname')}</span>
          </div>
        </div>
      </div>
    )
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
  includes,
  color = COLOR_PRIMARY_BLUE,
  end,
  start,
  timeseries,
  eventType,
}: {
  datasetId: string
  filters?: BaseReportEventsVesselsParamsFilters
  includes?: string[]
  color?: string
  end: string
  start: string
  timeseries: { date: string; value: number }[]
  eventType?: EventType
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const startMillis = DateTime.fromISO(start).toMillis()
  const endMillis = DateTime.fromISO(end).toMillis()
  const interval = getFourwingsInterval(startMillis, endMillis)
  const filtersMemo = useMemoCompare(filters)
  const includesMemo = useMemoCompare(includes)

  let icon: ReactElement | undefined
  if (eventType === 'encounter') {
    icon = <EncounterIcon />
  } else if (eventType === 'loitering') {
    icon = <LoiteringIcon />
  } else if (eventType === 'port_visit') {
    icon = <PortVisitIcon />
  }

  const getAggregatedData = useCallback(async () => timeseries, [timeseries])
  const getIndividualData = useCallback(async () => {
    const params = {
      ...getEventsStatsQuery({
        start,
        end,
        filters: filtersMemo,
        dataset: datasetId,
      }),
      ...(includesMemo && { includes: includesMemo }),
      limit: 1000,
      offset: 0,
    }
    const data = await GFWAPI.fetch<APIPagination<ApiEvent>>(`/v3/events?${stringify(params)}`)
    const groupedData = groupBy(data.entries, (item) => getISODateByInterval(item.start, interval))
    console.log(
      Object.entries(groupedData)
        .map(([date, events]) => ({ date, values: events }))
        .sort((a, b) => a.date.localeCompare(b.date))
    )

    return Object.entries(groupedData)
      .map(([date, events]) => ({ date, values: events }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [start, end, filtersMemo, includesMemo, datasetId, interval])

  if (!timeseries.length) {
    return null
  }

  return (
    <div ref={containerRef} className={styles.graph}>
      <ResponsiveTimeseries
        start={start}
        end={end}
        timeseriesInterval={interval}
        getAggregatedData={getAggregatedData}
        getIndividualData={getIndividualData}
        tickLabelFormatter={formatDateTicks}
        aggregatedTooltip={<AggregatedGraphTooltip />}
        individualTooltip={<IndividualGraphTooltip eventType={eventType} />}
        color={color}
        individualIcon={icon}
      />
    </div>
  )
}
