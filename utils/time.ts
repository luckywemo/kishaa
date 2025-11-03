import { formatDistanceToNow, format } from 'date-fns'

/**
 * Format timestamp as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number | Date): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
    return formatDistanceToNow(date, { addSuffix: true })
  } catch {
    return 'Unknown time'
  }
}

/**
 * Format timestamp as readable date
 */
export function formatDate(timestamp: number | Date, formatStr = 'PPp'): string {
  try {
    const date = typeof timestamp === 'number' ? new Date(timestamp) : timestamp
    return format(date, formatStr)
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Get time ago in short format
 */
export function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(timestamp)
}

/**
 * Format block timestamp
 */
export function formatBlockTime(blockTimestamp: number): string {
  return formatDate(blockTimestamp * 1000)
}

