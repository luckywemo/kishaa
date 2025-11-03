interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
  className?: string
}

export default function Skeleton({
  width,
  height,
  variant = 'rectangular',
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '1rem',
  }

  const variantClass = `skeleton-${variant}`

  return (
    <div
      className={`skeleton ${variantClass} ${className}`.trim()}
      style={style}
    />
  )
}

