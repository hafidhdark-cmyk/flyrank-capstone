import {
  getMealsByArea,
  getMealsByCategory,
  searchMeals,
} from '../services/mealService'
import type { MealSummary } from '../types/meal'

const SEED_KEYWORDS = [
  'Chicken',
  'Pasta',
  'Curry',
  'Beef',
  'Seafood',
  'Salad',
  'Soup',
  'Rice',
  'Cake',
  'Lamb',
  'Pork',
  'Pie',
]

/**
 * Fisher-Yates array shuffle.
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }
  return shuffled
}

/**
 * Deduplicates meals by their idMeal.
 */
export function deduplicateMeals(meals: MealSummary[]): MealSummary[] {
  const seen = new Set<string>()
  return meals.filter((meal) => {
    if (seen.has(meal.idMeal)) {
      return false
    }
    seen.add(meal.idMeal)
    return true
  })
}

/**
 * Fetches an initial batch of diverse recipes by randomly selecting seed keywords.
 */
export async function getInitialMeals(count = 12): Promise<MealSummary[]> {
  // Pick 3 random distinct seed keywords
  const shuffledSeeds = shuffleArray(SEED_KEYWORDS).slice(0, 3)

  try {
    const results = await Promise.all(
      shuffledSeeds.map((seed) => searchMeals(seed).catch(() => []))
    )

    const merged = results.flat()
    const unique = deduplicateMeals(merged)
    const randomized = shuffleArray(unique)

    return randomized.slice(0, count)
  } catch (error) {
    console.error('HomeModel.getInitialMeals error:', error)
    return []
  }
}

export interface FilterParams {
  query?: string
  category?: string
  area?: string
}

/**
 * Routes meal retrieval based on query, category, or area filter.
 */
export async function filterMeals(params: FilterParams): Promise<MealSummary[]> {
  const { query, category, area } = params

  if (query && query.trim().length > 0) {
    return searchMeals(query.trim())
  }

  if (category && category.trim().length > 0 && category !== 'All') {
    return getMealsByCategory(category.trim())
  }

  if (area && area.trim().length > 0 && area !== 'All') {
    return getMealsByArea(area.trim())
  }

  return getInitialMeals()
}
