import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Notification } from '../components/NotificationCenter'

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false,
    }
    setNotifications([newNotification, ...notifications])
  }, [notifications, setNotifications])

  const removeNotification = useCallback((id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }, [notifications, setNotifications])

  const markAsRead = useCallback((id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }, [notifications, setNotifications])

  const markAllAsRead = useCallback(() => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }, [notifications, setNotifications])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [setNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount,
  }
}

