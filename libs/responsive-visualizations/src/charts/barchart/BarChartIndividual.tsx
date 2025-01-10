import { BarChart, XAxis, ResponsiveContainer } from 'recharts'
import React from 'react'
import type { ResponsiveVisualizationItem } from '../../types'
import type { BarChartByTypeProps } from '../types'
import { IndividualPoint } from '../points/IndividualPoint'
import styles from './BarChartIndividual.module.css'

type IndividualBarChartProps = BarChartByTypeProps<'individual'>

export function IndividualBarChart({
  data,
  color,
  barLabel,
  valueKey,
  labelKey,
  barValueFormatter,
  customTooltip,
}: IndividualBarChartProps) {
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
        // onClick={onBarClick}
      >
        <foreignObject width="100%" height="100%">
          <div className={styles.container}>
            {data.map((item, index) => {
              const points = item?.[valueKey] as ResponsiveVisualizationItem[]
              return (
                <div className={styles.barContainer}>
                  <label className={styles.label}>
                    {barValueFormatter?.(points.length) || points.length}
                  </label>
                  <ul key={index} className={styles.bar}>
                    {points?.map((point, pointIndex) => (
                      <IndividualPoint
                        key={pointIndex}
                        point={point}
                        color={color}
                        tooltip={customTooltip}
                      />
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </foreignObject>
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
