'use client'

import { ChevronDown } from 'lucide-react'
import React, { useId, useState } from 'react'

export interface DisclosureProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: string
}

/**
 * Accessible Disclosure (Accordion) built according to W3C ARIA APG:
 * - Trigger element uses native button with aria-expanded & aria-controls
 * - Content panel uses role="region" and is labelled by the trigger button
 * - Operates via keyboard: Enter and Space keys toggle disclosure
 * - Tab key moves focus into the expanded region content
 */
export const Disclosure: React.FC<DisclosureProps> = ({
  title,
  defaultOpen = false,
  children,
  badge,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const baseId = useId()

  const buttonId = `${baseId}-button`
  const panelId = `${baseId}-panel`

  const toggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full items-center justify-between p-5 text-left transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base font-bold text-gray-900">{title}</span>
            {badge && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                {badge}
              </span>
            )}
          </div>

          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-amber-600' : ''
            }`}
          />
        </button>
      </h3>

      {/* Content panel */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={`border-t border-gray-100 p-5 text-sm leading-relaxed text-gray-600 bg-gray-50/40 ${
          !isOpen ? 'hidden' : 'block'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export default Disclosure
