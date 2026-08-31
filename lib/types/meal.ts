export interface MealSummary {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string
  strArea?: string
}

export interface IngredientItem {
  ingredient: string
  measure: string
  imageUrl: string
}

export interface MealDetail {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags?: string | null
  strYoutube?: string | null
  strSource?: string | null
  ingredients: IngredientItem[]
}

export interface Category {
  idCategory: string
  strCategory: string
  strCategoryThumb: string
  strCategoryDescription: string
}

export interface Area {
  strArea: string
}

export interface GroceryItem {
  id: string
  mealId: string
  mealTitle: string
  ingredient: string
  measure: string
  completed: boolean
  createdAt: number
}

export interface RawTheMealDBMeal {
  idMeal: string
  strMeal: string
  strDrinkAlternate: string | null
  strCategory: string
  strArea: string
  strInstructions: string
  strMealThumb: string
  strTags: string | null
  strYoutube: string | null
  strSource: string | null
  strImageSource: string | null
  strCreativeCommonsConfirmed: string | null
  dateModified: string | null
  [key: `strIngredient${number}`]: string | null | undefined
  [key: `strMeasure${number}`]: string | null | undefined
}

export interface MealDBSearchResponse {
  meals: RawTheMealDBMeal[] | null
}

export interface MealDBCategoryResponse {
  categories: Category[]
}

export interface MealDBAreaResponse {
  meals: { strArea: string }[] | null
}

export interface MealDBFilterResponse {
  meals: {
    strMeal: string
    strMealThumb: string
    idMeal: string
  }[] | null
}
