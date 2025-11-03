/**
 * Performance utilities
 */

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Memoize expensive calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Batch function calls
 */
export function batchCalls<T extends (...args: any[]) => any>(
  func: T,
  delay = 100
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  const batch: Array<Parameters<T>> = []

  return function (this: any, ...args: Parameters<T>) {
    batch.push(args)

    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      if (batch.length > 0) {
        func.apply(this, batch[batch.length - 1])
        batch.length = 0
      }
    }, delay)
  }
}

