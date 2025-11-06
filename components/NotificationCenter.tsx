import { useState } from 'react'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'
import { formatRelativeTime } from '../utils/formatting'
import { useNotifications } from '../hooks/useNotifications'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export default function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'error' | 'warning' | 'info'>('all')

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const deleteNotification = (id: string) => {
    removeNotification(id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  return (
    <Card title="Notifications">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['all', 'unread', 'success', 'error', 'warning', 'info'] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? 'primary' : 'outline'}
              size="small"
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unreadCount > 0 && (
                <Badge variant="error" size="small" style={{ marginLeft: '0.5rem' }}>
                  {unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="small">
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button onClick={clearAll} variant="outline" size="small">
              Clear All
            </Button>
          )}
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
          <p>No notifications</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '600px', overflowY: 'auto' }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '1rem',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: notification.read ? '#fafafa' : 'white',
                borderLeft: `4px solid ${
                  notification.type === 'success' ? '#2e7d32' :
                  notification.type === 'error' ? '#c62828' :
                  notification.type === 'warning' ? '#e65100' :
                  '#1976d2'
                }`,
                opacity: notification.read ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1 }}>
                  <div style={{ fontSize: '1.5rem' }}>{getNotificationIcon(notification.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{notification.title}</div>
                    <div style={{ fontSize: '0.875rem', color: '#666' }}>{notification.message}</div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                      {formatRelativeTime(notification.timestamp)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {!notification.read && (
                    <Badge variant="error" size="small">New</Badge>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    variant="outline"
                    size="small"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              {notification.action && (
                <div style={{ marginTop: '0.75rem' }}>
                  <Button
                    onClick={() => {
                      notification.action?.onClick()
                      markAsRead(notification.id)
                    }}
                    variant="outline"
                    size="small"
                  >
                    {notification.action.label}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

