import { useRef } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualTimeseriesSupported } from '../../lib/density'
import type { BaseResponsiveChartProps, BaseResponsiveTimeseriesProps } from '../types'
import { useResponsiveVisualization, useValueKeys } from '../hooks'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_DATE_KEY,
} from '../config'
import TimeseriesPlaceholder from '../placeholders/TimeseriesPlaceholder'
import { IndividualTimeseries } from './TimeseriesIndividual'
import { AggregatedTimeseries } from './TimeseriesAggregated'
import styles from './Timeseries.module.css'

type ResponsiveTimeseriesProps = BaseResponsiveChartProps &
  BaseResponsiveTimeseriesProps & {
    dateKey?: keyof ResponsiveVisualizationData[0]
  }

export function ResponsiveTimeseries({
  start,
  end,
  dateKey = DEFAULT_DATE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  timeseriesInterval,
  getIndividualData,
  getAggregatedData,
  color,
  tickLabelFormatter,
  aggregatedTooltip,
  individualTooltip,
  onIndividualItemClick,
  onAggregatedItemClick,
  individualIcon,
}: ResponsiveTimeseriesProps) {
  // TODO: add support for multiple value keys
  const { individualValueKeys, aggregatedValueKeys } = useValueKeys(
    individualValueKey,
    aggregatedValueKey
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const { width, data, isIndividualSupported } = useResponsiveVisualization(containerRef, {
    start,
    end,
    timeseriesInterval,
    labelKey: dateKey,
    aggregatedValueKeys,
    individualValueKeys,
    getAggregatedData,
    getIndividualData,
    getIsIndividualSupported: getIsIndividualTimeseriesSupported,
  })

  if (!getAggregatedData && !getIndividualData) {
    console.warn('No data getters functions provided')
    return null
  }

  return (
    <div ref={containerRef} className={styles.container}>
      {!data ? (
        <TimeseriesPlaceholder />
      ) : isIndividualSupported ? (
        <IndividualTimeseries
          width={width}
          data={data as ResponsiveVisualizationData<'individual'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          timeseriesInterval={timeseriesInterval}
          valueKeys={individualValueKeys}
          onClick={onIndividualItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={individualTooltip}
          icon={individualIcon}
        />
      ) : (
        <AggregatedTimeseries
          data={data as ResponsiveVisualizationData<'aggregated'>}
          start={start}
          end={end}
          color={color}
          dateKey={dateKey}
          timeseriesInterval={timeseriesInterval}
          valueKeys={aggregatedValueKeys}
          onClick={onAggregatedItemClick}
          tickLabelFormatter={tickLabelFormatter}
          customTooltip={aggregatedTooltip}
        />
      )}
    </div>
  )
}
