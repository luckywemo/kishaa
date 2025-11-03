import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
  onClick?: () => void
  className?: string
  variant?: 'default' | 'outlined' | 'elevated'
}

export default function Card({
  children,
  title,
  subtitle,
  footer,
  onClick,
  className = '',
  variant = 'default',
}: CardProps) {
  const baseClass = 'card'
  const variantClass = `card-${variant}`
  const clickableClass = onClick ? 'card-clickable' : ''

  return (
    <div
      className={`${baseClass} ${variantClass} ${clickableClass} ${className}`.trim()}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

