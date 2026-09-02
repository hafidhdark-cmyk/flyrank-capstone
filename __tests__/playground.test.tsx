import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Disclosure from '../playground/components/Disclosure'
import Modal from '../playground/components/Modal'
import Tabs from '../playground/components/Tabs'

describe('Playground Accessible Components (W3C ARIA APG)', () => {
  // ----------------------------------------------------
  // 1. Modal Dialog Tests
  // ----------------------------------------------------
  describe('Modal Component', () => {
    it('renders with role="dialog", aria-modal="true", and aria-labelledby', () => {
      render(
        <Modal
          isOpen={true}
          onClose={vi.fn()}
          title="Test Dialog Title"
          description="Test description text"
        >
          <button type="button">Inside Button</button>
        </Modal>
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby')
      expect(screen.getByText('Test Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Test description text')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Hidden Dialog">
          <div>Content</div>
        </Modal>
      )

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('triggers onClose when Escape key is pressed', () => {
      const handleClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={handleClose} title="Escape Test">
          <button type="button">Action</button>
        </Modal>
      )

      const dialog = screen.getByRole('dialog')
      fireEvent.keyDown(dialog, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('traps Tab focus: wraps from last element to first element', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Focus Trap Test">
          <button type="button" id="btn-1">First Button</button>
          <button type="button" id="btn-2">Second Button</button>
        </Modal>
      )

      const dialog = screen.getByRole('dialog')
      const closeBtn = screen.getByRole('button', { name: /close dialog/i })
      const btn1 = screen.getByRole('button', { name: 'First Button' })
      const btn2 = screen.getByRole('button', { name: 'Second Button' })

      // Focus last element (btn2)
      btn2.focus()
      expect(document.activeElement).toBe(btn2)

      // Pressing Tab on last element should wrap focus to closeBtn or first focusable
      fireEvent.keyDown(dialog, { key: 'Tab' })
      // In our modal, closeBtn is first in DOM, then btn1, then btn2
      expect(document.activeElement).toBe(closeBtn)

      // Pressing Shift+Tab on first element (closeBtn) should wrap back to last element (btn2)
      fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(btn2)
    })
  })

  // ----------------------------------------------------
  // 2. Tabs Component Tests
  // ----------------------------------------------------
  describe('Tabs Component', () => {
    const mockTabs = [
      { id: 'tab1', label: 'Tab 1', content: <div>Panel 1 Content</div> },
      { id: 'tab2', label: 'Tab 2', content: <div>Panel 2 Content</div> },
      { id: 'tab3', label: 'Tab 3', content: <div>Panel 3 Content</div> },
    ]

    it('renders with role="tablist", role="tab", and roving tabindex', () => {
      render(<Tabs tabs={mockTabs} defaultTabId="tab1" />)

      const tablist = screen.getByRole('tablist')
      expect(tablist).toBeInTheDocument()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(3)

      // First tab is active
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[0]).toHaveAttribute('tabindex', '0')

      // Other tabs have tabindex="-1" (Roving tabindex)
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[1]).toHaveAttribute('tabindex', '-1')
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false')
      expect(tabs[2]).toHaveAttribute('tabindex', '-1')
    })

    it('navigates with ArrowRight and ArrowLeft keys with circular wrap-around', () => {
      render(<Tabs tabs={mockTabs} defaultTabId="tab1" />)

      const tablist = screen.getByRole('tablist')
      const tabs = screen.getAllByRole('tab')

      // Press ArrowRight -> moves to Tab 2
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
      expect(screen.getByText('Panel 2 Content')).toBeVisible()

      // Press ArrowRight -> moves to Tab 3
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')

      // Press ArrowRight on last tab -> wraps around to Tab 1
      fireEvent.keyDown(tablist, { key: 'ArrowRight' })
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

      // Press ArrowLeft on first tab -> wraps around to Tab 3
      fireEvent.keyDown(tablist, { key: 'ArrowLeft' })
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    })

    it('jumps to first and last tabs with Home and End keys', () => {
      render(<Tabs tabs={mockTabs} defaultTabId="tab2" />)

      const tablist = screen.getByRole('tablist')
      const tabs = screen.getAllByRole('tab')

      // Press Home -> jumps to Tab 1
      fireEvent.keyDown(tablist, { key: 'Home' })
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true')

      // Press End -> jumps to Tab 3
      fireEvent.keyDown(tablist, { key: 'End' })
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    })
  })

  // ----------------------------------------------------
  // 3. Disclosure Component Tests
  // ----------------------------------------------------
  describe('Disclosure Component', () => {
    it('renders with button aria-expanded and toggles on click', () => {
      render(
        <Disclosure title="Frequently Asked Question" defaultOpen={false}>
          <p>Answer text goes here</p>
        </Disclosure>
      )

      const button = screen.getByRole('button', { name: /Frequently Asked Question/i })
      expect(button).toHaveAttribute('aria-expanded', 'false')

      // Click to open
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(screen.getByRole('region')).toBeVisible()
      expect(screen.getByText('Answer text goes here')).toBeInTheDocument()

      // Click to close
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })
})
