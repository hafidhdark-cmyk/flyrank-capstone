import type {
  Category,
  MealDBAreaResponse,
  MealDBCategoryResponse,
  MealDBFilterResponse,
  MealDBSearchResponse,
  MealSummary,
  RawTheMealDBMeal,
} from '../types/meal'

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

/**
 * Searches meals by name query.
 */
export async function searchMeals(query: string): Promise<MealSummary[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(trimmed)}`)
  if (!response.ok) {
    throw new Error(`TheMealDB search request failed with status ${response.status}`)
  }

  const data: MealDBSearchResponse = await response.json()
  if (!data.meals) {
    return []
  }

  return data.meals.map((meal) => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: meal.strCategory,
    strArea: meal.strArea,
  }))
}

/**
 * Fetches single meal details by ID.
 */
export async function getMealById(id: string): Promise<RawTheMealDBMeal | null> {
  const trimmedId = id.trim()
  if (!trimmedId) {
    throw new Error('Meal ID is required')
  }

  const response = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(trimmedId)}`)
  if (!response.ok) {
    throw new Error(`TheMealDB lookup failed with status ${response.status}`)
  }

  const data: MealDBSearchResponse = await response.json()
  if (!data.meals || data.meals.length === 0) {
    return null
  }

  return data.meals[0]
}

/**
 * Fetches all available categories.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories.php`)
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`)
  }

  const data: MealDBCategoryResponse = await response.json()
  return data.categories || []
}

/**
 * Fetches all available cuisine areas/regions.
 */
export async function getAreas(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/list.php?a=list`)
  if (!response.ok) {
    throw new Error(`Failed to fetch areas: ${response.status}`)
  }

  const data: MealDBAreaResponse = await response.json()
  if (!data.meals) {
    return []
  }

  return data.meals.map((item) => item.strArea).filter(Boolean)
}

/**
 * Filters meals by category name.
 */
export async function getMealsByCategory(category: string): Promise<MealSummary[]> {
  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`)
  if (!response.ok) {
    throw new Error(`Failed to filter meals by category: ${response.status}`)
  }

  const data: MealDBFilterResponse = await response.json()
  if (!data.meals) {
    return []
  }

  return data.meals.map((meal) => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strCategory: category,
  }))
}

/**
 * Filters meals by cuisine area/region.
 */
export async function getMealsByArea(area: string): Promise<MealSummary[]> {
  const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`)
  if (!response.ok) {
    throw new Error(`Failed to filter meals by area: ${response.status}`)
  }

  const data: MealDBFilterResponse = await response.json()
  if (!data.meals) {
    return []
  }

  return data.meals.map((meal) => ({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strArea: area,
  }))
}

/**
 * Fetches a single random meal.
 */
export async function getRandomMeal(): Promise<RawTheMealDBMeal | null> {
  const response = await fetch(`${BASE_URL}/random.php`)
  if (!response.ok) {
    throw new Error(`Failed to fetch random meal: ${response.status}`)
  }

  const data: MealDBSearchResponse = await response.json()
  if (!data.meals || data.meals.length === 0) {
    return null
  }

  return data.meals[0]
}
