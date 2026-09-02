'use client'

import { AlertCircle, ArrowLeft, ExternalLink, Heart, Video } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'
import IngredientsList from '../../../components/recipecraft/IngredientsList'
import { useRecipeDetailViewModel } from '../../../lib/viewmodels/useRecipeDetailViewModel'

export default function RecipeDetailPage() {
  const params = useParams()
  const mealId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''

  const {
    meal,
    embedUrl,
    loading,
    error,
    isSaved,
    checkedIngredients,
    addedToGrocery,
    toggleIngredient,
    toggleSave,
    addToGrocery,
  } = useRecipeDetailViewModel(mealId)

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded-md bg-gray-200" />
          <div className="h-80 w-full rounded-3xl bg-gray-200" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-gray-200" />
            <div className="h-64 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !meal) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Recipe Not Found</h2>
        <p className="mt-1 text-sm text-gray-500">{error || 'Could not load recipe details.'}</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Explore</span>
        </Link>
      </div>
    )
  }

  // Parse instruction paragraphs
  const instructionParagraphs = meal.strInstructions
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-amber-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Recipes</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-amber-500/5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Photo */}
          <div className="relative aspect-4/3 md:aspect-auto w-full overflow-hidden bg-gray-100 min-h-[300px]">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Details & Action */}
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                  {meal.strCategory}
                </span>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  {meal.strArea} Cuisine
                </span>
                {meal.strTags && (
                  <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    🏷️ {meal.strTags.split(',').slice(0, 2).join(', ')}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {meal.strMeal}
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-gray-500">
                Cataloged via TheMealDB #{meal.idMeal} • {meal.ingredients.length} Total Ingredients
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={toggleSave}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-xs active:scale-95 ${
                  isSaved
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : 'fill-none'}`} />
                <span>{isSaved ? 'Saved in Recipe Box' : 'Save to Recipe Box'}</span>
              </button>

              {meal.strSource && (
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  <span>Original Recipe</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Ingredients on Left, Instructions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredients Column */}
        <div className="lg:col-span-5">
          <IngredientsList
            ingredients={meal.ingredients}
            checkedIngredients={checkedIngredients}
            onToggleIngredient={toggleIngredient}
            onAddToGrocery={addToGrocery}
            addedToGroceryFeedback={addedToGrocery}
          />
        </div>

        {/* Step-by-Step Instructions & Video */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Instructions */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <span>👨‍🍳 Cooking Instructions</span>
            </h3>

            <div className="space-y-4 text-sm leading-relaxed text-gray-700">
              {instructionParagraphs.map((paragraph, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="flex-1">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Video Player Embed */}
          {embedUrl && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-rose-500" />
                <span>Video Cooking Tutorial</span>
              </h3>

              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={embedUrl}
                  title={`${meal.strMeal} cooking video tutorial`}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
