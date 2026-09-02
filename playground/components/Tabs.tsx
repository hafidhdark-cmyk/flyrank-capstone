'use client'

import React, { useId, useRef, useState } from 'react'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTabId?: string
  ariaLabel?: string
  onChange?: (tabId: string) => void
}

/**
 * Accessible Tabs Component built according to W3C ARIA APG:
 * - Role: 'tablist' on container, 'tab' on tab buttons, 'tabpanel' on content panels
 * - Roving tabindex: active tab has tabindex=0, all other tabs have tabindex=-1
 * - Keyboard navigation:
 *   - ArrowRight / ArrowLeft: navigates between tabs with circular wrap-around
 *   - Home: jumps to first tab
 *   - End: jumps to last tab
 *   - Tab: moves focus out of tablist into the selected tabpanel
 */
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  ariaLabel = 'Navigation Tabs',
  onChange,
}) => {
  const baseId = useId()
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTabId || (tabs[0]?.id ?? '')
  )

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = tabs.findIndex((t) => t.id === activeTabId)

  const selectTab = (id: string, index: number) => {
    setActiveTabId(id)
    onChange?.(id)
    tabRefs.current[index]?.focus()
  }

  // Keyboard Navigation: Arrow keys, Home, End
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const totalTabs = tabs.length
    if (totalTabs === 0) return

    let nextIndex = activeIndex

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = (activeIndex + 1) % totalTabs
        break

      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = (activeIndex - 1 + totalTabs) % totalTabs
        break

      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break

      case 'End':
        event.preventDefault()
        nextIndex = totalTabs - 1
        break

      default:
        return
    }

    const nextTab = tabs[nextIndex]
    if (nextTab) {
      selectTab(nextTab.id, nextIndex)
    }
  }

  return (
    <div className="w-full">
      {/* Tablist Container */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className="flex border-b border-gray-200 gap-1 bg-gray-50/70 p-1 rounded-xl"
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId
          const tabId = `${baseId}-tab-${tab.id}`
          const panelId = `${baseId}-panel-${tab.id}`

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              role="tab"
              id={tabId}
              aria-controls={panelId}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1} // Roving tabindex
              onClick={() => selectTab(tab.id, index)}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isActive
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/60'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          const tabId = `${baseId}-tab-${tab.id}`
          const panelId = `${baseId}-panel-${tab.id}`

          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              tabIndex={0} // Focusable via Tab key
              hidden={!isActive}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {tab.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Tabs
