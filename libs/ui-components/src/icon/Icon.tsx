import React, { Suspense, lazy } from 'react'
import { Placement } from 'tippy.js'
import cx from 'classnames'
import { Tooltip } from '../tooltip'
import { TooltipTypes } from '../types/types'
import styles from './Icon.module.css'
import icons, { IconType } from './icon.config'

const IconComponents = icons.reduce((acc, icon) => {
  acc[icon] = lazy(() =>
    import(
      /* webpackChunkName: "icon-[request]" */
      `./icons/${icon}.svg?react`
    ).then((m) => ({ default: m.ReactComponent || m.default || m }))
  )
  return acc
}, {} as Record<IconType, any>)

export interface IconProps {
  className?: string
  icon: IconType
  style?: React.CSSProperties
  type?: 'default' | 'warning' | 'original-colors'
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  testId?: string
}

const defaultStyle = {}

export function Icon(props: IconProps) {
  const { icon, tooltip, type = 'default', className = '', style = defaultStyle, testId } = props
  const Component = IconComponents[icon]
  if (!Component) {
    console.warn(`<Icon /> ui-component is missing "${icon}" icon. Rendering null`)
    return null
  }
  return (
    <Tooltip content={tooltip as React.ReactNode} placement="auto">
      <Suspense fallback={null}>
        <Component
          className={cx(styles.icon, styles[type], className)}
          style={style}
          {...(testId && { 'data-test': testId })}
        />
      </Suspense>
    </Tooltip>
  )
}
