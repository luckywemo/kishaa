interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  onClick?: () => void
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
}: StatsCardProps) {
  return (
    <div 
      className={`stats-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {icon && <div className="stats-icon">{icon}</div>}
      <div className="stats-content">
        <h4 className="stats-title">{title}</h4>
        <div className="stats-value">{value}</div>
        {subtitle && <p className="stats-subtitle">{subtitle}</p>}
        {trend && (
          <div className={`stats-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  )
}

