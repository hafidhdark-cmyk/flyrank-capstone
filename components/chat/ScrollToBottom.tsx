'use client'

import { ArrowDown } from 'lucide-react'
import React from 'react'

export interface ScrollToBottomProps {
  visible: boolean
  onClick: () => void
}

/**
 * Floating "Jump to latest" affordance.
 * Appears when the user has scrolled up away from the bottom during streaming.
 * Clicking it returns the scroll position to bottom and re-enables auto-scroll pinning.
 */
export const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ visible, onClick }) => {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Scroll to newest messages"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-700 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <ArrowDown className="h-3.5 w-3.5" />
      <span>Jump to latest</span>
    </button>
  )
}

export default ScrollToBottom
