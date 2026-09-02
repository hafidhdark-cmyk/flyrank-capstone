'use client'

import { Check, Copy, ShoppingBag, Trash2 } from 'lucide-react'
import React from 'react'
import type { GroceryItem } from '../../lib/types/meal'

interface GroceryListProps {
  items: GroceryItem[]
  copyFeedback: boolean
  onToggleItem: (id: string) => void
  onRemoveItem: (id: string) => void
  onClearCompleted: () => void
  onCopyToClipboard: () => void
}

export const GroceryList: React.FC<GroceryListProps> = ({
  items,
  copyFeedback,
  onToggleItem,
  onRemoveItem,
  onClearCompleted,
  onCopyToClipboard,
}) => {
  const completedCount = items.filter((i) => i.completed).length

  if (items.length === 0) {
    return (
      <div className="my-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Your grocery list is empty</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          Browse recipes and click &quot;Add All to Grocery&quot; on any recipe detail page to automatically populate your shopping list.
        </p>
      </div>
    )
  }

  // Group items by recipe title
  const grouped: Record<string, GroceryItem[]> = {}
  items.forEach((item) => {
    if (!grouped[item.mealTitle]) {
      grouped[item.mealTitle] = []
    }
    grouped[item.mealTitle].push(item)
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
        <div>
          <span className="text-xs font-semibold text-gray-700">
            {items.length} total items ({completedCount} purchased)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition shadow-xs"
            >
              Clear Checked ({completedCount})
            </button>
          )}

          <button
            type="button"
            onClick={onCopyToClipboard}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all shadow-xs ${
              copyFeedback
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {copyFeedback ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Checklist</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grouped lists */}
      {Object.entries(grouped).map(([mealTitle, groupItems]) => (
        <div
          key={mealTitle}
          className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-800 text-xs">
                🥘
              </span>
              <span>{mealTitle}</span>
            </h4>
            <span className="text-xs text-gray-400 font-medium">
              {groupItems.filter((i) => i.completed).length}/{groupItems.length} checked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {groupItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 transition ${
                  item.completed
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-gray-100 bg-gray-50/50'
                }`}
              >
                <label className="flex flex-1 items-center gap-3 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => onToggleItem(item.id)}
                    className="h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span
                    className={`text-sm truncate ${
                      item.completed ? 'line-through text-gray-400' : 'text-gray-900 font-medium'
                    }`}
                  >
                    {item.ingredient}
                  </span>
                </label>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {item.measure}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-300 hover:text-rose-500 transition p-1"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GroceryList
