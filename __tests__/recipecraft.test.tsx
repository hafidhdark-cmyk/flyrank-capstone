import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  deduplicateMeals,
  filterMeals,
  getInitialMeals,
} from '../lib/models/HomeModel'
import {
  formatMealDetail,
  getYouTubeEmbedUrl,
  parseIngredients,
} from '../lib/models/RecipeDetailModel'
import {
  addIngredientsToGrocery,
  clearCompletedGrocery,
  getGroceryList,
  getSavedRecipes,
  isRecipeSaved,
  removeGroceryItem,
  toggleGroceryItem,
  toggleSavedRecipe,
} from '../lib/models/FavouritesModel'
import * as mealService from '../lib/services/mealService'
import type { MealSummary, RawTheMealDBMeal } from '../lib/types/meal'

describe('RecipeCraft Model Layer Tests', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  // ----------------------------------------------------
  // 1. HomeModel Tests
  // ----------------------------------------------------
  describe('HomeModel', () => {
    it('deduplicateMeals removes duplicate meals by idMeal', () => {
      const mockMeals: MealSummary[] = [
        { idMeal: '1', strMeal: 'Pasta', strMealThumb: 'thumb1.jpg' },
        { idMeal: '2', strMeal: 'Pizza', strMealThumb: 'thumb2.jpg' },
        { idMeal: '1', strMeal: 'Pasta Duplicate', strMealThumb: 'thumb1.jpg' },
      ]

      const unique = deduplicateMeals(mockMeals)
      expect(unique).toHaveLength(2)
      expect(unique.map((m) => m.idMeal)).toEqual(['1', '2'])
    })

    it('getInitialMeals fetches, deduplicates, and randomizes recipes', async () => {
      const mockApiResults: MealSummary[] = [
        { idMeal: '101', strMeal: 'Chicken Curry', strMealThumb: 'curry.jpg' },
        { idMeal: '102', strMeal: 'Chicken Soup', strMealThumb: 'soup.jpg' },
      ]

      vi.spyOn(mealService, 'searchMeals').mockResolvedValue(mockApiResults)

      const initial = await getInitialMeals(5)
      expect(initial).toBeInstanceOf(Array)
      expect(initial.length).toBeGreaterThan(0)
      expect(initial[0]).toHaveProperty('idMeal')
    })

    it('filterMeals routes to searchMeals when query is provided', async () => {
      const searchSpy = vi.spyOn(mealService, 'searchMeals').mockResolvedValue([
        { idMeal: '301', strMeal: 'Arrabiata', strMealThumb: 'pasta.jpg' },
      ])

      const results = await filterMeals({ query: 'Arrabiata' })
      expect(searchSpy).toHaveBeenCalledWith('Arrabiata')
      expect(results).toHaveLength(1)
      expect(results[0].strMeal).toBe('Arrabiata')
    })

    it('filterMeals routes to category filter when category is selected', async () => {
      const catSpy = vi.spyOn(mealService, 'getMealsByCategory').mockResolvedValue([
        { idMeal: '401', strMeal: 'Salmon', strMealThumb: 'salmon.jpg' },
      ])

      const results = await filterMeals({ category: 'Seafood' })
      expect(catSpy).toHaveBeenCalledWith('Seafood')
      expect(results).toHaveLength(1)
    })

    it('filterMeals routes to area filter when area is selected', async () => {
      const areaSpy = vi.spyOn(mealService, 'getMealsByArea').mockResolvedValue([
        { idMeal: '501', strMeal: 'Tacos', strMealThumb: 'tacos.jpg' },
      ])

      const results = await filterMeals({ area: 'Mexican' })
      expect(areaSpy).toHaveBeenCalledWith('Mexican')
      expect(results).toHaveLength(1)
    })
  })

  // ----------------------------------------------------
  // 2. RecipeDetailModel Tests
  // ----------------------------------------------------
  describe('RecipeDetailModel', () => {
    const sampleRawMeal: RawTheMealDBMeal = {
      idMeal: '52772',
      strMeal: 'Teriyaki Chicken Casserole',
      strDrinkAlternate: null,
      strCategory: 'Chicken',
      strArea: 'Japanese',
      strInstructions: 'Preheat oven to 350 F. Bake for 30 minutes.',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
      strTags: 'Meat,Casserole',
      strYoutube: 'https://www.youtube.com/watch?v=4aZr5hZXP_s',
      strSource: null,
      strImageSource: null,
      strCreativeCommonsConfirmed: null,
      dateModified: null,
      strIngredient1: 'soy sauce',
      strIngredient2: 'water',
      strIngredient3: 'brown sugar',
      strIngredient4: '',
      strIngredient5: 'null',
      strMeasure1: '3/4 cup',
      strMeasure2: '1/2 cup',
      strMeasure3: '1/4 cup',
      strMeasure4: '',
      strMeasure5: '',
    }

    it('parseIngredients extracts non-empty ingredients and attaches thumbnail URLs', () => {
      const ingredients = parseIngredients(sampleRawMeal)

      expect(ingredients).toHaveLength(3)
      expect(ingredients[0]).toEqual({
        ingredient: 'soy sauce',
        measure: '3/4 cup',
        imageUrl: 'https://www.themealdb.com/images/ingredients/soy%20sauce-Small.png',
      })
      expect(ingredients[1].ingredient).toBe('water')
      expect(ingredients[2].ingredient).toBe('brown sugar')
    })

    it('getYouTubeEmbedUrl correctly transforms standard and short YouTube links', () => {
      // Standard watch link
      const watchUrl = 'https://www.youtube.com/watch?v=4aZr5hZXP_s'
      expect(getYouTubeEmbedUrl(watchUrl)).toBe('https://www.youtube-nocookie.com/embed/4aZr5hZXP_s')

      // Short link
      const shortUrl = 'https://youtu.be/4aZr5hZXP_s'
      expect(getYouTubeEmbedUrl(shortUrl)).toBe('https://www.youtube-nocookie.com/embed/4aZr5hZXP_s')

      // Invalid / Null URL
      expect(getYouTubeEmbedUrl(null)).toBeNull()
      expect(getYouTubeEmbedUrl('')).toBeNull()
    })

    it('formatMealDetail formats raw meal into a clean typed MealDetail object', () => {
      const detail = formatMealDetail(sampleRawMeal)

      expect(detail.idMeal).toBe('52772')
      expect(detail.strMeal).toBe('Teriyaki Chicken Casserole')
      expect(detail.strCategory).toBe('Chicken')
      expect(detail.strArea).toBe('Japanese')
      expect(detail.ingredients).toHaveLength(3)
    })
  })

  // ----------------------------------------------------
  // 3. FavouritesModel Tests
  // ----------------------------------------------------
  describe('FavouritesModel', () => {
    const mockMeal: MealSummary = {
      idMeal: '52772',
      strMeal: 'Teriyaki Chicken Casserole',
      strMealThumb: 'thumb.jpg',
      strCategory: 'Chicken',
      strArea: 'Japanese',
    }

    it('toggleSavedRecipe adds and removes recipes from localStorage', () => {
      expect(getSavedRecipes()).toEqual([])

      // 1. Add to favorites
      const result1 = toggleSavedRecipe(mockMeal)
      expect(result1.isSaved).toBe(true)
      expect(result1.recipes).toHaveLength(1)
      expect(isRecipeSaved('52772')).toBe(true)

      // 2. Remove from favorites
      const result2 = toggleSavedRecipe(mockMeal)
      expect(result2.isSaved).toBe(false)
      expect(result2.recipes).toHaveLength(0)
      expect(isRecipeSaved('52772')).toBe(false)
    })

    it('manages grocery shopping list lifecycle (add, toggle, remove, clear)', () => {
      const mockIngredients = [
        { ingredient: 'Garlic', measure: '2 cloves', imageUrl: 'garlic.jpg' },
        { ingredient: 'Olive Oil', measure: '1 tbsp', imageUrl: 'oil.jpg' },
      ]

      // 1. Add to grocery
      const items = addIngredientsToGrocery(
        { idMeal: '52772', strMeal: 'Teriyaki Chicken' },
        mockIngredients
      )
      expect(items).toHaveLength(2)
      expect(getGroceryList()).toHaveLength(2)

      const itemId = items[0].id

      // 2. Toggle grocery item
      const toggled = toggleGroceryItem(itemId)
      expect(toggled.find((i) => i.id === itemId)?.completed).toBe(true)

      // 3. Clear completed
      const afterClear = clearCompletedGrocery()
      expect(afterClear).toHaveLength(1)
      expect(afterClear[0].ingredient).toBe('Olive Oil')

      // 4. Remove remaining item
      const remainingId = afterClear[0].id
      const finalItems = removeGroceryItem(remainingId)
      expect(finalItems).toHaveLength(0)
    })
  })
})
