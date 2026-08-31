'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  getAreas,
  getCategories,
} from '../services/mealService'
import {
  filterMeals,
  getInitialMeals,
} from '../models/HomeModel'
import {
  getSavedRecipes,
  toggleSavedRecipe,
} from '../models/FavouritesModel'
import type { Category, MealSummary } from '../types/meal'

export function useHomeViewModel() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedArea, setSelectedArea] = useState('All')

  const [meals, setMeals] = useState<MealSummary[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<string[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  // Sync saved IDs from localStorage
  const refreshSavedIds = useCallback(() => {
    const saved = getSavedRecipes()
    setSavedIds(new Set(saved.map((item) => item.idMeal)))
  }, [])

  // Initial load: Categories, Areas, Initial Randomized Meals
  useEffect(() => {
    let isMounted = true

    async function initialize() {
      setLoading(true)
      setError(null)

      try {
        const [cats, regions, initialMeals] = await Promise.all([
          getCategories().catch(() => []),
          getAreas().catch(() => []),
          getInitialMeals(12).catch(() => []),
        ])

        if (isMounted) {
          setCategories(cats)
          setAreas(regions)
          setMeals(initialMeals)
          refreshSavedIds()
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load initial recipes'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initialize()

    // Listen for cross-component favorites changes
    const handleStorageUpdate = () => refreshSavedIds()
    window.addEventListener('recipecraft:favourites_updated', handleStorageUpdate)

    return () => {
      isMounted = false
      window.removeEventListener('recipecraft:favourites_updated', handleStorageUpdate)
    }
  }, [refreshSavedIds])

  // Execute search & filter
  const executeFilter = useCallback(
    async (q: string, cat: string, ar: string) => {
      setLoading(true)
      setError(null)

      try {
        const results = await filterMeals({
          query: q,
          category: cat,
          area: ar,
        })
        setMeals(results)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to filter recipes')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery)
      setSelectedCategory('All')
      setSelectedArea('All')
      executeFilter(searchQuery, 'All', 'All')
    },
    [executeFilter]
  )

  const handleSelectCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category)
      setSelectedArea('All')
      setQuery('')
      executeFilter('', category, 'All')
    },
    [executeFilter]
  )

  const handleSelectArea = useCallback(
    (area: string) => {
      setSelectedArea(area)
      setSelectedCategory('All')
      setQuery('')
      executeFilter('', 'All', area)
    },
    [executeFilter]
  )

  const handleResetFilters = useCallback(() => {
    setQuery('')
    setSelectedCategory('All')
    setSelectedArea('All')
    executeFilter('', 'All', 'All')
  }, [executeFilter])

  const handleToggleSave = useCallback(
    (meal: MealSummary) => {
      const { isSaved } = toggleSavedRecipe(meal)
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (isSaved) {
          next.add(meal.idMeal)
        } else {
          next.delete(meal.idMeal)
        }
        return next
      })
    },
    []
  )

  return {
    query,
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
  }
}
