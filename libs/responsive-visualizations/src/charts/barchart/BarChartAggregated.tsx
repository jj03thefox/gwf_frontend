import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import type {
  ResponsiveVisualizationAggregatedObjectValue,
  ResponsiveVisualizationValue,
} from '../../types'
import type { BarChartByTypeProps } from '../types'

type AggregatedBarChartProps = BarChartByTypeProps<'aggregated'>

export function AggregatedBarChart({
  data,
  color,
  barLabel,
  valueKeys,
  labelKey,
  onClick,
  customTooltip,
  barValueFormatter,
}: AggregatedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        onClick={(d: any) => {
          onClick?.(d.activePayload[0].payload)
        }}
      >
        {data && <Tooltip content={customTooltip} />}
        {valueKeys.map((valueKey) => {
          const isValueObject = typeof data[0][valueKey] === 'object'
          const dataKey = isValueObject ? `${valueKey}.value` : valueKey
          const barColor = isValueObject
            ? (data[0][valueKey] as ResponsiveVisualizationAggregatedObjectValue).color || color
            : color
          return (
            <Bar
              key={valueKey}
              dataKey={dataKey}
              fill={barColor}
              stackId="a"
              onClick={(e) => onClick?.(e.activePayload as ResponsiveVisualizationValue)}
            >
              <LabelList
                position="top"
                valueAccessor={({ value }: { value: [number, number] }) => {
                  return barValueFormatter?.(value[1]) || value[1]
                }}
              />
            </Bar>
          )
        })}
        <XAxis
          dataKey={labelKey}
          interval="equidistantPreserveStart"
          tickLine={false}
          minTickGap={-1000}
          tick={barLabel}
          tickMargin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
