'use client'

import Link from 'next/link'
import React from 'react'
import GroceryList from '../../components/recipecraft/GroceryList'
import RecipeGrid from '../../components/recipecraft/RecipeGrid'
import { useFavouritesViewModel } from '../../lib/viewmodels/useFavouritesViewModel'

export default function FavouritesPage() {
  const {
    savedRecipes,
    groceryList,
    activeTab,
    copyFeedback,
    setActiveTab,
    handleRemoveSaved,
    handleToggleGrocery,
    handleRemoveGrocery,
    handleClearCompletedGrocery,
    handleCopyToClipboard,
  } = useFavouritesViewModel()

  const savedIds = new Set(savedRecipes.map((r) => r.idMeal))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Recipe Box & Meal Planner
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Access your bookmarked recipes and manage your shopping checklist.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('recipes')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'recipes'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Saved Recipes</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-100 px-1 text-[11px] font-bold text-amber-800">
              {savedRecipes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grocery')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'grocery'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Grocery List</span>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-100 px-1 text-[11px] font-bold text-emerald-800">
              {groceryList.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Recipes */}
      {activeTab === 'recipes' && (
        <div>
          {savedRecipes.length === 0 ? (
            <div className="my-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 mb-3">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your Recipe Box is empty</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Explore recipes and tap the heart icon on any dish card to bookmark your favorites here.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition"
              >
                Browse Recipes
              </Link>
            </div>
          ) : (
            <RecipeGrid
              meals={savedRecipes}
              loading={false}
              error={null}
              savedIds={savedIds}
              onToggleSave={handleRemoveSaved}
            />
          )}
        </div>
      )}

      {/* Tab 2: Grocery Planner */}
      {activeTab === 'grocery' && (
        <GroceryList
          items={groceryList}
          copyFeedback={copyFeedback}
          onToggleItem={handleToggleGrocery}
          onRemoveItem={handleRemoveGrocery}
          onClearCompleted={handleClearCompletedGrocery}
          onCopyToClipboard={handleCopyToClipboard}
        />
      )}
    </div>
  )
}
