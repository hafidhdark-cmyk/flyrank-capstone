import type { GroceryItem, IngredientItem, MealSummary } from '../types/meal'

const SAVED_RECIPES_KEY = 'recipecraft_saved_meals'
const GROCERY_LIST_KEY = 'recipecraft_grocery_items'

/**
 * Checks if running in browser environment.
 */
function isClient(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/**
 * Retrieves saved favorite recipes from localStorage.
 */
export function getSavedRecipes(): MealSummary[] {
  if (!isClient()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(SAVED_RECIPES_KEY)
    if (!raw) {
      return []
    }
    return JSON.parse(raw) as MealSummary[]
  } catch (error) {
    console.error('FavouritesModel.getSavedRecipes error:', error)
    return []
  }
}

/**
 * Saves or updates the full saved recipes list.
 */
function setSavedRecipes(recipes: MealSummary[]): void {
  if (!isClient()) {
    return
  }

  try {
    window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(recipes))
    // Dispatch custom storage event for multi-tab or cross-component reactivity
    window.dispatchEvent(new Event('recipecraft:favourites_updated'))
  } catch (error) {
    console.error('FavouritesModel.setSavedRecipes error:', error)
  }
}

/**
 * Toggles a recipe in the saved list.
 */
export function toggleSavedRecipe(meal: MealSummary): {
  isSaved: boolean
  recipes: MealSummary[]
} {
  const current = getSavedRecipes()
  const exists = current.some((item) => item.idMeal === meal.idMeal)

  let updated: MealSummary[]
  if (exists) {
    updated = current.filter((item) => item.idMeal !== meal.idMeal)
  } else {
    updated = [meal, ...current]
  }

  setSavedRecipes(updated)
  return { isSaved: !exists, recipes: updated }
}

/**
 * Checks whether a specific meal ID is saved in favorites.
 */
export function isRecipeSaved(idMeal: string): boolean {
  const current = getSavedRecipes()
  return current.some((item) => item.idMeal === idMeal)
}

/**
 * Retrieves the grocery shopping list from localStorage.
 */
export function getGroceryList(): GroceryItem[] {
  if (!isClient()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(GROCERY_LIST_KEY)
    if (!raw) {
      return []
    }
    return JSON.parse(raw) as GroceryItem[]
  } catch (error) {
    console.error('FavouritesModel.getGroceryList error:', error)
    return []
  }
}

/**
 * Saves or updates the grocery list in localStorage.
 */
function setGroceryList(items: GroceryItem[]): void {
  if (!isClient()) {
    return
  }

  try {
    window.localStorage.setItem(GROCERY_LIST_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('recipecraft:grocery_updated'))
  } catch (error) {
    console.error('FavouritesModel.setGroceryList error:', error)
  }
}

/**
 * Adds a recipe's ingredients into the grocery list.
 */
export function addIngredientsToGrocery(
  meal: { idMeal: string; strMeal: string },
  ingredients: IngredientItem[]
): GroceryItem[] {
  const current = getGroceryList()

  const newItems: GroceryItem[] = ingredients.map((item) => ({
    id: `${meal.idMeal}_${encodeURIComponent(item.ingredient)}_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 6)}`,
    mealId: meal.idMeal,
    mealTitle: meal.strMeal,
    ingredient: item.ingredient,
    measure: item.measure,
    completed: false,
    createdAt: Date.now(),
  }))

  const updated = [...current, ...newItems]
  setGroceryList(updated)
  return updated
}

/**
 * Toggles the completion status of a grocery item.
 */
export function toggleGroceryItem(id: string): GroceryItem[] {
  const current = getGroceryList()
  const updated = current.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  )
  setGroceryList(updated)
  return updated
}

/**
 * Removes a single item from the grocery list.
 */
export function removeGroceryItem(id: string): GroceryItem[] {
  const current = getGroceryList()
  const updated = current.filter((item) => item.id !== id)
  setGroceryList(updated)
  return updated
}

/**
 * Clears all completed items from the grocery list.
 */
export function clearCompletedGrocery(): GroceryItem[] {
  const current = getGroceryList()
  const updated = current.filter((item) => !item.completed)
  setGroceryList(updated)
  return updated
}
