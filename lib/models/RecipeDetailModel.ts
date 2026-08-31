import type {
  IngredientItem,
  MealDetail,
  RawTheMealDBMeal,
} from '../types/meal'

/**
 * Extracts and normalizes up to 20 ingredients and measures from a raw TheMealDB meal object.
 */
export function parseIngredients(rawMeal: RawTheMealDBMeal): IngredientItem[] {
  const ingredients: IngredientItem[] = []

  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof RawTheMealDBMeal
    const measureKey = `strMeasure${i}` as keyof RawTheMealDBMeal

    const rawIngredient = rawMeal[ingredientKey]
    const rawMeasure = rawMeal[measureKey]

    if (
      typeof rawIngredient === 'string' &&
      rawIngredient.trim() !== '' &&
      rawIngredient.trim().toLowerCase() !== 'null'
    ) {
      const cleanIngredient = rawIngredient.trim()
      const cleanMeasure =
        typeof rawMeasure === 'string' && rawMeasure.trim() !== ''
          ? rawMeasure.trim()
          : 'To taste'

      ingredients.push({
        ingredient: cleanIngredient,
        measure: cleanMeasure,
        imageUrl: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(
          cleanIngredient
        )}-Small.png`,
      })
    }
  }

  return ingredients
}

/**
 * Converts standard YouTube links into safe, privacy-enhanced embed URLs.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null
  }

  const trimmed = url.trim()
  if (!trimmed) {
    return null
  }

  // Handle standard watch url: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`
  }

  // Handle short url: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`
  }

  // Handle embed url: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch && embedMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`
  }

  return null
}

/**
 * Transforms a raw API meal object into a structured, typed MealDetail.
 */
export function formatMealDetail(rawMeal: RawTheMealDBMeal): MealDetail {
  return {
    idMeal: rawMeal.idMeal,
    strMeal: rawMeal.strMeal,
    strCategory: rawMeal.strCategory || 'General',
    strArea: rawMeal.strArea || 'International',
    strInstructions: rawMeal.strInstructions || '',
    strMealThumb: rawMeal.strMealThumb,
    strTags: rawMeal.strTags,
    strYoutube: rawMeal.strYoutube,
    strSource: rawMeal.strSource,
    ingredients: parseIngredients(rawMeal),
  }
}
