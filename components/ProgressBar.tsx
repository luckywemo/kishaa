interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
  size = 'medium',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={`progress-bar progress-${size}`}>
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          {showPercentage && <span>{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="progress-track">
        <div
          className={`progress-fill progress-${variant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

