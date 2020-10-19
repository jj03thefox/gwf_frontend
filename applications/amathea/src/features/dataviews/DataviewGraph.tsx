import React, { memo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  AxisDomain,
} from 'recharts'
import { format } from 'd3-format'
import { DateTime } from 'luxon'
import { Dataview } from '@globalfishingwatch/api-types'
import { GraphData } from 'data/data'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import './DataviewGraph.module.css'
import { useDataviewResource } from './dataviews.hook'

interface DataviewGraphProps {
  dataview: Dataview
  graphColor: string
  graphUnit?: string
}

const tickFormatter = (tick: number) => {
  const formatter = tick < 1 ? '~r' : '~s'
  return format(formatter)(tick)
}

const formatDates = (tick: string, withYear = false) => {
  const tickDate = DateTime.fromISO(tick)
  return tickDate.month === 1 || withYear ? tickDate.toFormat('LLL yy') : tickDate.toFormat('LLL')
}

const DataviewGraph: React.FC<DataviewGraphProps> = (props) => {
  const { dataview, graphColor, graphUnit = '' } = props
  const { start, end } = useTimerangeConnect()
  const { dataviewResource } = useDataviewResource(dataview)

  if (!dataviewResource || !dataviewResource.data) return null

  const data = dataviewResource.data.filter((current: any) => {
    const currentDate = DateTime.fromISO(current.date).startOf('day')
    const startDate = DateTime.fromISO(start).startOf('day')
    const endDate = DateTime.fromISO(end).startOf('day')
    return currentDate >= startDate && currentDate <= endDate
  })

  const dataMax: number = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.value > prev.value ? curr : prev))
        .value
    : 0
  const dataMin: number = data.length
    ? data.reduce((prev: GraphData, curr: GraphData) => (curr.value < prev.value ? curr : prev))
        .value
    : 0
  const domainPadding = (dataMax - dataMin) / 4
  const paddedDomain: [AxisDomain, AxisDomain] = [
    Math.max(0, Math.floor(dataMin - domainPadding)),
    Math.ceil(dataMax + domainPadding),
  ]

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 15, right: 20, left: -20, bottom: -10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          interval="preserveStartEnd"
          tickFormatter={(tick: string) => formatDates(tick)}
          axisLine={paddedDomain[0] === 0}
        />
        <YAxis
          scale="linear"
          domain={paddedDomain}
          tickFormatter={tickFormatter}
          axisLine={false}
          tickLine={false}
          tickCount={4}
        />
        <Tooltip
          labelFormatter={(label) => formatDates(label as string, true)}
          formatter={(value) => [`${(value as number).toFixed(2)} ${graphUnit}`, '']}
          separator=""
        />
        <Line
          type="linear"
          dataKey="value"
          stroke={graphColor}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default memo(DataviewGraph)
