import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`input-wrapper ${fullWidth ? 'full-width' : ''}`}>
        {label && (
          <label className="input-label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className={`input-container ${error ? 'error' : ''}`}>
          {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
          <input
            ref={ref}
            className={`input ${className}`}
            {...props}
          />
          {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
        </div>
        {error && <span className="input-error">{error}</span>}
        {helperText && !error && <span className="input-helper">{helperText}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input

