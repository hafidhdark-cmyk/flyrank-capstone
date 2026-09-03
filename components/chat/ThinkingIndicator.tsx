'use client'

import { ChefHat } from 'lucide-react'
import React from 'react'

export interface ThinkingIndicatorProps {
  visible: boolean
}

/**
 * ThinkingIndicator provides a flicker-free handoff state before the first token arrives.
 * Uses a gentle pulse animation and CSS opacity transitions so the interface never jumps.
 */
export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ visible }) => {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-label="ChefCraft is thinking"
      className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-xs font-medium text-amber-900 shadow-2xs transition-opacity duration-200 animate-in fade-in"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs animate-pulse">
        <ChefHat className="h-4 w-4" />
      </div>

      <div className="flex items-center gap-1.5">
        <span>ChefCraft is preparing recommendations</span>
        <span className="flex gap-1 pl-1">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  )
}

export default ThinkingIndicator
