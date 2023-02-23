import { useMemo } from 'react'
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ComposedChart,
  Area,
} from 'recharts'
import { min, max } from 'lodash'
import { DateTime } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import i18n from 'features/i18n/i18n'
import { toFixed } from 'utils/shared'
import { formatDateForInterval, getUTCDateTime } from 'utils/dates'
import styles from './AnalysisEvolutionGraph.module.css'
import { tickFormatter } from './analysis.utils'

export interface EvolutionGraphData {
  date: string
  min: number[]
  max: number[]
}

export interface AnalysisSublayerGraph {
  id: string
  legend: {
    color?: string
    unit?: string
  }
}
export interface AnalysisGraphProps {
  timeseries: EvolutionGraphData[]
  sublayers: AnalysisSublayerGraph[]
  interval: Interval
}

const formatDateTicks = (tick: number, timeChunkInterval: Interval) => {
  const date = getUTCDateTime(tick).setLocale(i18n.language)
  return formatDateForInterval(date, timeChunkInterval)
}

const formatTooltipValue = (value: number, payload: any, unit: string) => {
  if (value === undefined || !payload?.range) {
    return null
  }
  const index = payload.avg?.findIndex((avg: number) => avg === value)
  const range = payload.range?.[index]
  const difference = range ? range[1] - value : 0
  const imprecision = value > 0 && (difference / value) * 100
  // TODO review why abs is needed and why we have negative imprecision
  const imprecisionFormatted = imprecision ? toFixed(Math.abs(imprecision), 0) : '0'
  const valueFormatted = formatI18nNumber(value, { maximumFractionDigits: 2 })
  const valueLabel = `${valueFormatted} ${unit ? unit : ''}`
  const imprecisionLabel =
    imprecisionFormatted !== '0' && valueFormatted !== '0' ? ` ± ${imprecisionFormatted}%` : ''
  return valueLabel + imprecisionLabel
}

type AnalysisGraphTooltipProps = {
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
  timeChunkInterval: Interval
}

const AnalysisGraphTooltip = (props: any) => {
  const { active, payload, label, timeChunkInterval } = props as AnalysisGraphTooltipProps

  if (active && payload && payload.length) {
    const date = getUTCDateTime(label).setLocale(i18n.language)
    const formattedLabel = formatDateForInterval(date, timeChunkInterval)
    const formattedValues = payload.filter(({ name }) => name === 'line')
    return (
      <div className={styles.tooltipContainer}>
        <p className={styles.tooltipLabel}>{formattedLabel}</p>
        <ul>
          {formattedValues.map(({ value, payload, color, unit }, index) => {
            return (
              <li key={index} className={styles.tooltipValue}>
                <span className={styles.tooltipValueDot} style={{ color }}></span>
                {formatTooltipValue(value, payload, unit)}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return null
}

const AnalysisEvolutionGraph: React.FC<{
  graphData: AnalysisGraphProps
  start: string
  end: string
}> = (props) => {
  const { start, end } = props
  const { timeseries, interval, sublayers } = props.graphData
  const cleanEnd = DateTime.fromISO(end, { zone: 'utc' })
    .minus({ [interval]: 1 })
    .toISO()
  const dataFormated = useMemo(() => {
    return timeseries
      ?.map(({ date, min, max }) => {
        const range = min.map((m, i) => [m, max[i]])
        const avg = min.map((m, i) => (m + max[i]) / 2)
        return {
          date: new Date(date).getTime(),
          range,
          avg,
        }
      })
      .filter((d) => {
        return !isNaN(d.avg[0])
      })
  }, [timeseries])

  const domain = useMemo(
    () => [new Date(start).getTime(), new Date(cleanEnd).getTime()],
    [start, cleanEnd]
  )

  if (!dataFormated) return null

  const dataMin: number = dataFormated.length
    ? (min(dataFormated.flatMap(({ range }) => range[0][0])) as number)
    : 0
  const dataMax: number = dataFormated.length
    ? (max(dataFormated.flatMap(({ range }) => range[0][1])) as number)
    : 0

  const domainPadding = (dataMax - dataMin) / 8
  const paddedDomain: [number, number] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  return (
    <div className={styles.graph}>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={dataFormated} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            domain={domain}
            dataKey="date"
            interval="preserveStartEnd"
            tickFormatter={(tick: number) => formatDateTicks(tick, interval)}
            axisLine={paddedDomain[0] === 0}
            // scale={'time'}
            type={'number'}
          />
          <YAxis
            scale="linear"
            domain={paddedDomain}
            interval="preserveEnd"
            tickFormatter={tickFormatter}
            axisLine={false}
            tickLine={false}
            tickCount={4}
          />
          <Tooltip content={<AnalysisGraphTooltip timeChunkInterval={interval} />} />
          {sublayers.map(({ id, legend }, index) => (
            <Line
              key={`${id}-line`}
              name="line"
              type="monotone"
              dataKey={(data) => data.avg?.[index]}
              unit={legend.unit}
              dot={false}
              isAnimationActive={false}
              stroke={legend.color}
              strokeWidth={2}
            />
          ))}
          {sublayers.map(({ id, legend }, index) => (
            <Area
              key={`${id}-area`}
              name="area"
              type="monotone"
              dataKey={(data) => data.range[index]}
              activeDot={false}
              fill={legend.color}
              stroke="none"
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalysisEvolutionGraph
