import React, { MouseEvent } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import { TooltipTypes } from '../types/types'
import { Tooltip } from '../tooltip'
import styles from './Switch.module.css'

// TODO Maybe a simple way is to have the Switch component wrap an <input type="checkbox"> so that we can use the React native event
export interface SwitchEvent extends MouseEvent {
  active: boolean
}

export interface SwitchProps {
  id?: string
  active: boolean
  disabled?: boolean
  onClick: (event: SwitchEvent) => void
  color?: string
  tooltip?: TooltipTypes
  tooltipPlacement?: Placement
  className?: string
}

export function Switch(props: SwitchProps) {
  const {
    id,
    active = false,
    disabled = false,
    color,
    onClick,
    tooltip,
    tooltipPlacement = 'top',
    className,
  } = props

  const onClickCallback = (event: React.MouseEvent) => {
    if (!disabled) {
      onClick({
        ...event,
        active,
      })
    }
  }

  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={active}
        {...(typeof tooltip === 'string' && { 'aria-label': tooltip })}
        onClick={onClickCallback}
        className={cx(
          styles.switch,
          { [styles.disabled]: disabled, [styles.customColor]: color },
          className
        )}
        {...(color && { style: { color } })}
      >
        <span className={styles.nib}></span>
      </button>
    </Tooltip>
  )
}
