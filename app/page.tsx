'use client'

import React from 'react'
import FilterBar from '../components/recipecraft/FilterBar'
import Hero from '../components/recipecraft/Hero'
import RecipeGrid from '../components/recipecraft/RecipeGrid'
import { useHomeViewModel } from '../lib/viewmodels/useHomeViewModel'

export default function HomePage() {
  const {
    selectedCategory,
    selectedArea,
    meals,
    categories,
    areas,
    loading,
    error,
    savedIds,
    handleSearch,
    handleSelectCategory,
    handleSelectArea,
    handleResetFilters,
    handleToggleSave,
  } = useHomeViewModel()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero Banner with quick seed tags */}
      <Hero onQuickSearch={handleSearch} />

      {/* Main Exploration Section */}
      <section className="mt-8">
        <FilterBar
          categories={categories}
          areas={areas}
          selectedCategory={selectedCategory}
          selectedArea={selectedArea}
          onSelectCategory={handleSelectCategory}
          onSelectArea={handleSelectArea}
          onReset={handleResetFilters}
        />

        {/* Recipe Grid Results */}
        <div className="mt-4">
          <RecipeGrid
            meals={meals}
            loading={loading}
            error={error}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onRetry={handleResetFilters}
          />
        </div>
      </section>
    </div>
  )
}
