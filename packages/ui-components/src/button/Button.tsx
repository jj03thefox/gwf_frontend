import React from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Tooltip from '../tooltip'
import styles from './Button.module.css'

export type ButtonType = 'default' | 'secondary'
export type ButtonSize = 'default' | 'small'

interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  className?: string
  children: React.ReactChild | React.ReactChild[]
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
  onClick?: (e: React.MouseEvent) => void
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    type = 'default',
    size = 'default',
    disabled = false,
    className,
    children,
    tooltip,
    tooltipPlacement = 'auto',
    onClick,
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        className={cx(styles.button, styles[type], styles[size], className)}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </Tooltip>
  )
}

export default Button
