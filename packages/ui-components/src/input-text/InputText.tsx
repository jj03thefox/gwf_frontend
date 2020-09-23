import React, { useRef, forwardRef, useImperativeHandle, memo, Ref } from 'react'
import cx from 'classnames'
import Icon from '../icon'
import styles from './InputText.module.css'

export type InputSize = 'default' | 'small'
export type InputType = 'text' | 'email' | 'search' | 'number'

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  label?: string
  type?: InputType
  inputSize?: InputSize
  inputKey?: string
}

const defaultKey = Date.now().toString()

function InputText(props: InputTextProps, forwardedRef: Ref<HTMLInputElement>) {
  const {
    className,
    label,
    type = 'text',
    inputSize = 'default',
    inputKey = defaultKey,
    ...rest
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement)

  return (
    <div className={cx(styles.inputText, styles[inputSize], className)}>
      {label && <label htmlFor={label}>{label}</label>}
      <input key={inputKey} ref={inputRef} id={label} name={label} type={type} {...rest} />
      {type !== 'text' && type !== 'number' && (
        <Icon
          icon={type}
          className={styles.icon}
          type={!inputRef.current || inputRef.current.validity.valid ? 'default' : 'warning'}
        />
      )}
    </div>
  )
}

export default memo(forwardRef<HTMLInputElement, InputTextProps>(InputText))
