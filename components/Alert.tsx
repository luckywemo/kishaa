import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  onClose?: () => void
  className?: string
}

export default function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}: AlertProps) {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }

  return (
    <div className={`alert alert-${variant} ${className}`.trim()}>
      <div className="alert-content">
        <div className="alert-icon">{icons[variant]}</div>
        <div className="alert-body">
          {title && <h4 className="alert-title">{title}</h4>}
          <div className="alert-message">{children}</div>
        </div>
        {onClose && (
          <button className="alert-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

