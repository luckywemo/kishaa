import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  fullWidth = false,
  disabled,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: ButtonProps) {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const sizeClass = `btn-${size}`
  const widthClass = fullWidth ? 'btn-full' : ''
  const loadingClass = isLoading ? 'btn-loading' : ''

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spinner"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

