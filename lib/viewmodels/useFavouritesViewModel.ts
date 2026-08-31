'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  clearCompletedGrocery,
  getGroceryList,
  getSavedRecipes,
  removeGroceryItem,
  toggleGroceryItem,
  toggleSavedRecipe,
} from '../models/FavouritesModel'
import type { GroceryItem, MealSummary } from '../types/meal'

export function useFavouritesViewModel() {
  const [savedRecipes, setSavedRecipes] = useState<MealSummary[]>([])
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([])
  const [activeTab, setActiveTab] = useState<'recipes' | 'grocery'>('recipes')
  const [copyFeedback, setCopyFeedback] = useState(false)

  // Load from localStorage on mount & listen to updates
  const refreshData = useCallback(() => {
    setSavedRecipes(getSavedRecipes())
    setGroceryList(getGroceryList())
  }, [])

  useEffect(() => {
    refreshData()

    const handleFavUpdate = () => setSavedRecipes(getSavedRecipes())
    const handleGrocUpdate = () => setGroceryList(getGroceryList())

    window.addEventListener('recipecraft:favourites_updated', handleFavUpdate)
    window.addEventListener('recipecraft:grocery_updated', handleGrocUpdate)

    return () => {
      window.removeEventListener('recipecraft:favourites_updated', handleFavUpdate)
      window.removeEventListener('recipecraft:grocery_updated', handleGrocUpdate)
    }
  }, [refreshData])

  const handleRemoveSaved = useCallback((meal: MealSummary) => {
    toggleSavedRecipe(meal)
    setSavedRecipes(getSavedRecipes())
  }, [])

  const handleToggleGrocery = useCallback((id: string) => {
    const updated = toggleGroceryItem(id)
    setGroceryList(updated)
  }, [])

  const handleRemoveGrocery = useCallback((id: string) => {
    const updated = removeGroceryItem(id)
    setGroceryList(updated)
  }, [])

  const handleClearCompletedGrocery = useCallback(() => {
    const updated = clearCompletedGrocery()
    setGroceryList(updated)
  }, [])

  // Format grocery checklist for one-click copy to clipboard
  const handleCopyToClipboard = useCallback(async () => {
    if (groceryList.length === 0) return

    // Group items by recipe title
    const grouped: Record<string, GroceryItem[]> = {}
    groceryList.forEach((item) => {
      if (!grouped[item.mealTitle]) {
        grouped[item.mealTitle] = []
      }
      grouped[item.mealTitle].push(item)
    })

    let text = '🛒 RECIPECRAFT GROCERY LIST\n\n'
    Object.entries(grouped).forEach(([recipe, items]) => {
      text += `📋 ${recipe}:\n`
      items.forEach((item) => {
        const check = item.completed ? '[x]' : '[ ]'
        text += `  ${check} ${item.ingredient} (${item.measure})\n`
      })
      text += '\n'
    })

    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2500)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [groceryList])

  return {
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
  }
}
