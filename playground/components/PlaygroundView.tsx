'use client'

import React, { useState } from 'react'
import Disclosure from './Disclosure'
import Modal from './Modal'
import Tabs from './Tabs'

export const PlaygroundView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTabName, setActiveTabName] = useState('Overview')

  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div>
          <h4 className="text-base font-bold text-gray-950">W3C APG Tabs Pattern</h4>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            This tablist utilizes a <strong>roving tabindex</strong>. Notice that only the active tab is in the browser&apos;s tab order (<code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-amber-800">tabindex=&quot;0&quot;</code>). All other inactive tabs have <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-amber-800">tabindex=&quot;-1&quot;</code>.
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
            💡 <strong>Keyboard Test:</strong> Focus the tab and press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">←</kbd> and <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">→</kbd> to switch tabs. Press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Home</kbd> for the first tab and <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">End</kbd> for the last tab.
          </div>
        </div>
      ),
    },
    {
      id: 'specifications',
      label: 'Specifications',
      content: (
        <div>
          <h4 className="text-base font-bold text-gray-950">ARIA Roles & Properties</h4>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">role=&quot;tablist&quot;</code> on the outer container</li>
            <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">role=&quot;tab&quot;</code> with <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">aria-selected=&quot;true/false&quot;</code> and <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">aria-controls</code></li>
            <li><code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">role=&quot;tabpanel&quot;</code> with <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">aria-labelledby</code> pointing to the tab ID</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'keyboard',
      label: 'Keyboard Map',
      content: (
        <div>
          <h4 className="text-base font-bold text-gray-950">Tested Keystrokes</h4>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
              <span className="font-bold text-gray-950">Right Arrow / Left Arrow:</span>
              <p className="text-gray-600 mt-0.5">Navigates tabs with circular wrap-around</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
              <span className="font-bold text-gray-950">Home / End:</span>
              <p className="text-gray-600 mt-0.5">Jumps immediately to first/last tab</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
              <span className="font-bold text-gray-950">Tab:</span>
              <p className="text-gray-600 mt-0.5">Exits the tablist straight into the active panel</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Title & Badge */}
      <div className="border-b border-gray-200 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
          FlyRank Phase: Foundations • A11y & ARIA
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950">
          Component Accessibility Playground
        </h1>
        <p className="mt-2 text-base text-gray-600 max-w-3xl">
          Three interactive components built strictly from scratch against the W3C ARIA Authoring Practices Guide (APG) with zero component libraries. Test with your keyboard only!
        </p>
      </div>

      <div className="mt-8 space-y-12">
        {/* ================================================================= */}
        {/* 1. MODAL DIALOG SHOWCASE */}
        {/* ================================================================= */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
                <span>1. Modal Dialog Component</span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Focus Trap + Escape
                </span>
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                W3C Pattern: Traps Tab inside dialog, closes on Escape, restores focus to trigger button on close.
              </p>
            </div>

            <button
              type="button"
              id="open-modal-trigger"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition focus:outline-none focus:ring-2 focus:ring-amber-500 active:scale-95 shrink-0"
            >
              Open Accessible Modal
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-xs text-gray-600">
            ⌨️ <strong>How to verify via keyboard:</strong>
            <ol className="mt-2 list-decimal pl-5 space-y-1">
              <li>Press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Tab</kbd> to focus the &quot;Open Accessible Modal&quot; button, then press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Enter</kbd>.</li>
              <li>Press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Tab</kbd> repeatedly. Focus will cycle continuously between the input, confirmation button, and close icon without escaping.</li>
              <li>Press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Shift + Tab</kbd> from the first element to wrap to the close icon.</li>
              <li>Press <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Escape</kbd>. The modal will close, and focus returns directly to the &quot;Open Accessible Modal&quot; button.</li>
            </ol>
          </div>

          {/* Render Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Confirm Reservation"
            description="Please confirm your dining reservation details below."
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="guest-name" className="block text-xs font-bold text-gray-700">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  id="guest-name"
                  placeholder="e.g. Al-Ameen"
                  defaultValue="Al-Ameen"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label htmlFor="special-requests" className="block text-xs font-bold text-gray-700">
                  Special Dietary Notes
                </label>
                <input
                  type="text"
                  id="special-requests"
                  placeholder="e.g. Vegetarian only"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </Modal>
        </section>

        {/* ================================================================= */}
        {/* 2. TABS SHOWCASE */}
        {/* ================================================================= */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <span>2. Tabs Component</span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Roving Tabindex + Arrow Keys
              </span>
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Active tab: <strong className="text-amber-700">{activeTabName}</strong> • Roving tabindex ensures smooth keyboard accessibility.
            </p>
          </div>

          <Tabs
            tabs={tabItems}
            defaultTabId="overview"
            ariaLabel="Playground Documentation Tabs"
            onChange={(id) => {
              const selected = tabItems.find((t) => t.id === id)
              if (selected) setActiveTabName(selected.label)
            }}
          />
        </section>

        {/* ================================================================= */}
        {/* 3. DISCLOSURE (ACCORDION) SHOWCASE */}
        {/* ================================================================= */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              <span>3. Disclosure Component</span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                aria-expanded + Enter/Space
              </span>
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              W3C Pattern: Expandable FAQ/Accordion widget operated via Enter and Space keys.
            </p>
          </div>

          <div className="space-y-3">
            <Disclosure
              title="What is the purpose of ARIA Authoring Practices Guide (APG)?"
              badge="Concept"
              defaultOpen={true}
            >
              The W3C ARIA APG defines the canonical specifications for how interactive web widgets should behave. It dictates exact ARIA roles (e.g. <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">dialog</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-amber-800">tablist</code>), keyboard navigation conventions (roving tabindex, Escape to close), and focus management.
            </Disclosure>

            <Disclosure
              title="Why does shadcn/ui use Radix UI Primitives under the hood?"
              badge="Architecture"
            >
              Radix UI provides headless, unstyled primitives that have battle-tested accessibility built in. They solve notoriously complex edge cases such as scrollbar layout shift compensation, portal-based DOM rendering, outside click boundary detection, and background element invalidation for assistive tech.
            </Disclosure>

            <Disclosure
              title="How does a focus trap prevent accessibility failures?"
              badge="A11y Rule"
            >
              Without a focus trap, pressing the <kbd className="rounded bg-white px-1.5 py-0.5 border shadow-2xs font-bold text-gray-900">Tab</kbd> key inside an open popup would cause focus to jump into hidden, invisible elements on the background webpage. This completely disorients visually impaired users and keyboard-only navigators.
            </Disclosure>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PlaygroundView
