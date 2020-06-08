import React, { forwardRef } from 'react'
import cx from 'classnames'
import { Placement } from 'tippy.js'
import Icon, { IconType } from '../icon'
import Tooltip from '../tooltip'
import styles from './IconButton.module.css'

export type IconButtonType = 'default' | 'invert' | 'border' | 'destructive'
export type IconButtonSize = 'default' | 'small' | 'tiny'

interface IconButtonProps {
  icon: IconType
  type?: IconButtonType
  size?: IconButtonSize
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    type = 'default',
    size = 'default',
    disabled = false,
    className,
    icon,
    onClick,
    tooltip,
    tooltipPlacement = 'auto',
    ...rest
  } = props
  return (
    <Tooltip content={tooltip} placement={tooltipPlacement}>
      <button
        className={cx(styles.IconButton, styles[type], styles[`${size}Size`], className)}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        <Icon icon={icon} />
      </button>
    </Tooltip>
  )
}

export default IconButton
