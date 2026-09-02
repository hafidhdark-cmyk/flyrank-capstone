'use client'

import { X } from 'lucide-react'
import React, { useEffect, useId, useRef } from 'react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

/**
 * Accessible Modal Dialog built according to W3C ARIA APG:
 * - Role: 'dialog' with aria-modal="true"
 * - Labelled by dialog title and optionally described by dialog description
 * - Traps keyboard Tab focus inside dialog (Tab and Shift+Tab wrap around)
 * - Closes on Escape key press
 * - Restores focus to the triggering element upon closing
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const titleId = useId()
  const descId = useId()

  // 1. Focus Management: Save trigger element & restore on close
  useEffect(() => {
    if (isOpen) {
      // Remember the element that had focus before opening
      previousFocusRef.current = document.activeElement as HTMLElement | null

      // Lock background scrolling
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      // Move focus to first focusable element inside dialog or container itself
      const timer = setTimeout(() => {
        if (dialogRef.current) {
          const focusables = getFocusableElements(dialogRef.current)
          if (focusables.length > 0) {
            focusables[0].focus()
          } else {
            dialogRef.current.focus()
          }
        }
      }, 50)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = originalOverflow

        // Return focus to trigger element when closing
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [isOpen])

  // 2. Keyboard Focus Trap & Escape Key Handler
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key === 'Tab') {
      if (!dialogRef.current) return

      const focusables = getFocusableElements(dialogRef.current)
      if (focusables.length === 0) {
        event.preventDefault()
        return
      }

      const firstElement = focusables[0]
      const lastElement = focusables[focusables.length - 1]

      if (event.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-gray-900">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}

/**
 * Utility to find all keyboard focusable elements inside a container.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    '[tabindex]:not([tabindex="-1"])',
    '[contentEditable="true"]',
  ].join(',')

  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector))
  return elements.filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') {
      return false
    }
    if (el.style.display === 'none' || el.style.visibility === 'hidden') {
      return false
    }
    return true
  })
}

export default Modal
