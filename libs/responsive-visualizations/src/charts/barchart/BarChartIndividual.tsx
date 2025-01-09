import { BarChart, XAxis, ResponsiveContainer } from 'recharts'
import { useFloating, offset, flip, shift, useInteractions, useHover } from '@floating-ui/react'
import type { ReactElement } from 'react'
import cx from 'classnames'
import { useState } from 'react'
import React from 'react'
import type { ResponsiveVisualizationItem } from '../../types'
import type { BarChartByTypeProps } from './BarChart'
import styles from './BarChartIndividual.module.css'

type IndividualBarChartProps = BarChartByTypeProps<'individual'>

type IndividualBarChartPointProps = {
  color?: string
  point: ResponsiveVisualizationItem
  tooltip?: ReactElement
  className?: string
}

export function IndividualBarChartPoint({
  point,
  color,
  tooltip,
  className,
}: IndividualBarChartPointProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: setIsOpen,
    middleware: [offset(2), flip(), shift()],
  })

  const hover = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])
  return (
    <li
      ref={refs.setReference}
      {...getReferenceProps()}
      className={styles.point}
      style={color ? { backgroundColor: color } : {}}
    >
      {isOpen && (
        <div
          ref={refs.setFloating}
          className={cx(styles.tooltip, className)}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {tooltip ? React.cloneElement(tooltip, { data: point } as any) : point.name}
        </div>
      )}
    </li>
  )
}
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
                      <IndividualBarChartPoint
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
