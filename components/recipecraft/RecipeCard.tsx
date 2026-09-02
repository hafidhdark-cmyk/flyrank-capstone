'use client'

import { ArrowRight, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { MealSummary } from '../../lib/types/meal'

interface RecipeCardProps {
  meal: MealSummary
  isSaved: boolean
  onToggleSave: (meal: MealSummary) => void
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  meal,
  isSaved,
  onToggleSave,
}) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10">
      {/* Thumbnail Container */}
      <Link href={`/recipe/${meal.idMeal}`} className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
        <Image
          src={meal.strMealThumb}
          alt={meal.strMeal}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Save / Favorite Heart Button */}
      <button
        type="button"
        aria-label={isSaved ? `Remove ${meal.strMeal} from favorites` : `Save ${meal.strMeal} to favorites`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleSave(meal)
        }}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all active:scale-90 ${
          isSaved
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
            : 'bg-black/30 text-white hover:bg-black/50 hover:scale-105'
        }`}
      >
        <Heart
          className={`h-4.5 w-4.5 transition-transform ${isSaved ? 'fill-current' : 'fill-none'}`}
        />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {meal.strCategory && (
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                {meal.strCategory}
              </span>
            )}
            {meal.strArea && (
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                {meal.strArea} Cuisine
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/recipe/${meal.idMeal}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors">
              {meal.strMeal}
            </h3>
          </Link>
        </div>

        {/* View Recipe Button */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <Link
            href={`/recipe/${meal.idMeal}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 transition group/btn"
          >
            <span>View Recipe</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
          <span className="text-[11px] font-medium text-gray-400">TheMealDB #{meal.idMeal}</span>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard
