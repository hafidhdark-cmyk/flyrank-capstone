'use client'

import React from 'react'
import type { Category } from '../../lib/types/meal'

interface FilterBarProps {
  categories: Category[]
  areas: string[]
  selectedCategory: string
  selectedArea: string
  onSelectCategory: (category: string) => void
  onSelectArea: (area: string) => void
  onReset: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  areas,
  selectedCategory,
  selectedArea,
  onSelectCategory,
  onSelectArea,
  onReset,
}) => {
  const isFiltered = selectedCategory !== 'All' || selectedArea !== 'All'

  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Category Pills Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Filter by Category</span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2 transition"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Cuisine Region Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="cuisine-select" className="text-xs font-medium text-gray-600">
            Cuisine Region:
          </label>
          <select
            id="cuisine-select"
            value={selectedArea}
            onChange={(e) => onSelectArea(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 shadow-xs transition focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="All">All Cuisines 🌍</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area} Cuisine
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Horizontal Scrollable Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            selectedCategory === 'All'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🍽️ All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat.idCategory}
            type="button"
            onClick={() => onSelectCategory(cat.strCategory)}
            className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === cat.strCategory
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {/* Category thumbnail if available */}
            {cat.strCategoryThumb && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.strCategoryThumb}
                alt={cat.strCategory}
                className="h-4 w-4 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <span>{cat.strCategory}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
