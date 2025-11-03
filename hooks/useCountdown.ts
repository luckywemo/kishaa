import { useState, useEffect } from 'react'

/**
 * Countdown timer hook
 */
export function useCountdown(targetDate: Date | number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const target = typeof targetDate === 'number' ? targetDate : targetDate.getTime()

    const updateCountdown = () => {
      const now = Date.now()
      const difference = target - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        })
        return
      }

      setIsExpired(false)
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return { ...timeLeft, isExpired }
}
