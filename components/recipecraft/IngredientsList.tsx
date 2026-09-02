'use client'

import { Check, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import type { IngredientItem } from '../../lib/types/meal'

interface IngredientsListProps {
  ingredients: IngredientItem[]
  checkedIngredients: Set<string>
  onToggleIngredient: (ingredient: string) => void
  onAddToGrocery: () => void
  addedToGroceryFeedback: boolean
}

export const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  checkedIngredients,
  onToggleIngredient,
  onAddToGrocery,
  addedToGroceryFeedback,
}) => {
  const completedCount = checkedIngredients.size
  const totalCount = ingredients.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
      {/* Header & Add to Grocery action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Ingredients & Measures</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {totalCount} items
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Check off ingredients as you prepare your dish
          </p>
        </div>

        <button
          type="button"
          onClick={onAddToGrocery}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs active:scale-95 ${
            addedToGroceryFeedback
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white hover:bg-amber-700'
          }`}
        >
          {addedToGroceryFeedback ? (
            <>
              <Check className="h-4 w-4" />
              <span>Added to Grocery List!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              <span>Add All to Grocery</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
            <span>Cooking Readiness</span>
            <span>
              {completedCount}/{totalCount} ({progressPercent}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Ingredients Grid / List */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ingredients.map((item, index) => {
          const isChecked = checkedIngredients.has(item.ingredient)
          return (
            <label
              key={`${item.ingredient}-${index}`}
              className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                isChecked
                  ? 'border-emerald-200 bg-emerald-50/40 text-gray-400'
                  : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100/70 text-gray-900'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleIngredient(item.ingredient)}
                className="h-4 w-4 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />

              {/* Ingredient thumbnail */}
              <Image
                src={item.imageUrl}
                alt={item.ingredient}
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain bg-white p-1 border border-gray-100 shrink-0"
              />

              <div className="flex flex-1 items-baseline justify-between gap-2 min-w-0">
                <span
                  className={`text-sm font-medium truncate ${
                    isChecked ? 'line-through text-gray-400' : 'text-gray-900'
                  }`}
                >
                  {item.ingredient}
                </span>
                <span className="text-xs font-semibold text-amber-700 shrink-0">
                  {item.measure}
                </span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default IngredientsList
