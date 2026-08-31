'use client'

import React from 'react'
import type { MealSummary } from '../../lib/types/meal'
import RecipeCard from './RecipeCard'

interface RecipeGridProps {
  meals: MealSummary[]
  loading: boolean
  error: string | null
  savedIds: Set<string>
  onToggleSave: (meal: MealSummary) => void
  onRetry?: () => void
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  meals,
  loading,
  error,
  savedIds,
  onToggleSave,
  onRetry,
}) => {
  // 1. Error State
  if (error) {
    return (
      <div className="my-10 flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-900">Oops! Failed to load recipes</h3>
        <p className="mt-1 text-sm text-gray-600 max-w-md">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-xl bg-amber-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition"
          >
            Try Again
          </button>
        )}
      </div>
    )
  }

  // 2. Loading State (Shimmer Skeletons)
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xs animate-pulse"
          >
            <div className="aspect-4/3 w-full rounded-xl bg-gray-200" />
            <div className="mt-4 flex gap-2">
              <div className="h-4 w-16 rounded-md bg-gray-200" />
              <div className="h-4 w-20 rounded-md bg-gray-200" />
            </div>
            <div className="mt-3 h-5 w-4/5 rounded-md bg-gray-200" />
            <div className="mt-4 flex justify-between pt-3 border-t border-gray-100">
              <div className="h-4 w-20 rounded-md bg-gray-200" />
              <div className="h-4 w-12 rounded-md bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 3. Empty State
  if (meals.length === 0) {
    return (
      <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-3">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">No recipes matched your search</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">
          Try searching for a different ingredient (like &quot;Chicken&quot;, &quot;Pasta&quot;, or &quot;Curry&quot;) or clear your active filters.
        </p>
      </div>
    )
  }

  // 4. Populated Grid
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
      {meals.map((meal) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          isSaved={savedIds.has(meal.idMeal)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  )
}

export default RecipeGrid
