import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onTabChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
}

export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id)
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab

  const handleTabChange = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId)
    } else {
      setInternalActiveTab(tabId)
    }
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={`tabs-container tabs-${variant}`}>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${
              tab.disabled ? 'disabled' : ''
            }`}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">{activeTabContent}</div>
    </div>
  )
}

