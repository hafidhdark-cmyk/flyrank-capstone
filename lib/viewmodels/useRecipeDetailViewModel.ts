'use client'

import { useCallback, useEffect, useState } from 'react'
import { getMealById } from '../services/mealService'
import {
  formatMealDetail,
  getYouTubeEmbedUrl,
} from '../models/RecipeDetailModel'
import {
  addIngredientsToGrocery,
  isRecipeSaved,
  toggleSavedRecipe,
} from '../models/FavouritesModel'
import type { MealDetail } from '../types/meal'

export function useRecipeDetailViewModel(mealId: string) {
  const [meal, setMeal] = useState<MealDetail | null>(null)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set()
  )
  const [addedToGrocery, setAddedToGrocery] = useState(false)

  // Load meal detail on mount / mealId change
  useEffect(() => {
    let isMounted = true

    async function loadDetails() {
      if (!mealId) {
        setError('No meal ID provided')
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const rawMeal = await getMealById(mealId)
        if (!rawMeal) {
          throw new Error('Recipe not found in TheMealDB database')
        }

        if (isMounted) {
          const detail = formatMealDetail(rawMeal)
          setMeal(detail)
          setEmbedUrl(getYouTubeEmbedUrl(detail.strYoutube))
          setIsSaved(isRecipeSaved(detail.idMeal))
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch recipe details'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDetails()

    return () => {
      isMounted = false
    }
  }, [mealId])

  // Toggle ingredient check-off in step-by-step mode
  const toggleIngredient = useCallback((ingredient: string) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev)
      if (next.has(ingredient)) {
        next.delete(ingredient)
      } else {
        next.add(ingredient)
      }
      return next
    })
  }, [])

  // Toggle save to recipe box
  const toggleSave = useCallback(() => {
    if (!meal) return
    const result = toggleSavedRecipe({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
    })
    setIsSaved(result.isSaved)
  }, [meal])

  // Add all ingredients into the grocery list
  const addToGrocery = useCallback(() => {
    if (!meal || meal.ingredients.length === 0) return

    addIngredientsToGrocery(
      { idMeal: meal.idMeal, strMeal: meal.strMeal },
      meal.ingredients
    )
    setAddedToGrocery(true)

    setTimeout(() => {
      setAddedToGrocery(false)
    }, 3000)
  }, [meal])

  return {
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
  }
}
