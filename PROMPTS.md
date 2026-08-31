# RecipeCraft — AI Development Prompts Log

This document records the step-by-step engineering prompts used to build **RecipeCraft** (Culinary Explorer & Meal Planner), following the MVVM architectural pattern established in the FlyRank Front-end AI Engineering track.

---

## 1. Architecture Setup & Data Contracts

### Prompt 1.1: Architecture & Type Definitions
```text
Define strict TypeScript interfaces for RecipeCraft inside lib/types/meal.ts based on TheMealDB API response structures.

Requirements:
- MealSummary: idMeal, strMeal, strMealThumb, strCategory (optional), strArea (optional)
- IngredientItem: ingredient, measure, imageUrl
- MealDetail: idMeal, strMeal, strCategory, strArea, strInstructions, strMealThumb, strTags (optional), strYoutube (optional), strSource (optional), ingredients: IngredientItem[]
- Category: idCategory, strCategory, strCategoryThumb, strCategoryDescription
- Area: strArea
- GroceryItem: id, mealId, mealTitle, ingredient, measure, completed, createdAt
- RawTheMealDBMeal: index signature for strIngredient1..20 and strMeasure1..20
- Enforce strict typing with zero 'any' types.
```

### Prompt 1.2: TheMealDB Service Layer
```text
Implement the low-level API communication service inside lib/services/mealService.ts.

Requirements:
- Base URL: https://www.themealdb.com/api/json/v1/1
- Exported async functions:
  1. searchMeals(query: string): Promise<MealSummary[]>
  2. getMealById(id: string): Promise<RawTheMealDBMeal | null>
  3. getCategories(): Promise<Category[]>
  4. getAreas(): Promise<string[]>
  5. getMealsByCategory(category: string): Promise<MealSummary[]>
  6. getMealsByArea(area: string): Promise<MealSummary[]>
  7. getRandomMeal(): Promise<RawTheMealDBMeal | null>
- Throw descriptive errors on HTTP failure or malformed payload.
- Do NOT use React hooks, useState, or JSX in this file. Keep it a pure data service.
```

---

## 2. Model Layer (Pure TypeScript Business Logic)

### Prompt 2.1: Home Model (`lib/models/HomeModel.ts`)
```text
Implement the HomeModel business logic inside lib/models/HomeModel.ts.

Requirements:
- Exported functions:
  1. getInitialMeals(count?: number): Promise<MealSummary[]>
     - Pick 3-4 random seeds from a curated list: ['Chicken', 'Pasta', 'Curry', 'Beef', 'Seafood', 'Salad', 'Soup', 'Rice', 'Cake']
     - Fetch search results in parallel using Promise.all
     - Flatten and deduplicate meals by idMeal
     - Shuffle the array using Fisher-Yates algorithm
     - Return the specified count (default: 12)
  2. filterMeals(params: { query?: string; category?: string; area?: string }): Promise<MealSummary[]>
     - Route request based on query priority: search query -> category filter -> area filter -> initial meals fallback.
- No React hooks, no useState, no useEffect, no JSX.
```

### Prompt 2.2: Recipe Detail Model (`lib/models/RecipeDetailModel.ts`)
```text
Implement RecipeDetailModel inside lib/models/RecipeDetailModel.ts.

Requirements:
- Exported functions:
  1. parseIngredients(rawMeal: RawTheMealDBMeal): IngredientItem[]
     - Iterate from index 1 to 20 over strIngredient{i} and strMeasure{i}
     - Filter out null, undefined, empty strings, or strings with only whitespace
     - Attach ingredient thumbnail URL from: https://www.themealdb.com/images/ingredients/{name}-Small.png
  2. getYouTubeEmbedUrl(url: string | null | undefined): string | null
     - Parse standard YouTube watch URLs (youtube.com/watch?v=ID) or short URLs (youtu.be/ID)
     - Return standard embed format: https://www.youtube-nocookie.com/embed/{ID}
  3. formatMealDetail(rawMeal: RawTheMealDBMeal): MealDetail
- No React hooks or JSX.
```

### Prompt 2.3: Favourites & Grocery Planner Model (`lib/models/FavouritesModel.ts`)
```text
Implement FavouritesModel inside lib/models/FavouritesModel.ts.

Requirements:
- Manage LocalStorage persistence for Saved Recipes ('recipecraft_saved_meals') and Grocery Shopping Items ('recipecraft_grocery_items').
- Safe SSR guards (typeof window !== 'undefined') to prevent Next.js hydration errors.
- Exported functions:
  1. getSavedRecipes(): MealSummary[]
  2. saveRecipe(meal: MealSummary): MealSummary[]
  3. removeRecipe(idMeal: string): MealSummary[]
  4. isRecipeSaved(idMeal: string): boolean
  5. getGroceryList(): GroceryItem[]
  6. addIngredientsToGrocery(meal: { idMeal: string; strMeal: string }, ingredients: IngredientItem[]): GroceryItem[]
  7. toggleGroceryItem(id: string): GroceryItem[]
  8. removeGroceryItem(id: string): GroceryItem[]
  9. clearCompletedGrocery(): GroceryItem[]
- Return immutable arrays on state changes.
```

---

## 3. ViewModel Layer (Custom React Hooks)

### Prompt 3.1: Home ViewModel (`lib/viewmodels/useHomeViewModel.ts`)
```text
Implement the useHomeViewModel hook inside lib/viewmodels/useHomeViewModel.ts.

Requirements:
- State management:
  - query: string
  - selectedCategory: string ('All' or category name)
  - selectedArea: string ('All' or area name)
  - meals: MealSummary[]
  - categories: Category[]
  - areas: string[]
  - loading: boolean
  - error: string | null
  - savedIds: Set<string>
- Actions & Handlers:
  - handleSearch(searchQuery: string)
  - handleSelectCategory(category: string)
  - handleSelectArea(area: string)
  - handleToggleSave(meal: MealSummary)
  - handleResetFilters()
- Automatically fetch initial categories, areas, and initial meals on mount.
- Listen for cross-component favorites updates via window event 'recipecraft:favourites_updated'.
- Do NOT render JSX in this file.
```

### Prompt 3.2: Recipe Detail ViewModel (`lib/viewmodels/useRecipeDetailViewModel.ts`)
```text
Implement useRecipeDetailViewModel inside lib/viewmodels/useRecipeDetailViewModel.ts.

Requirements:
- Parameters: mealId (string)
- State management:
  - meal: MealDetail | null
  - embedUrl: string | null
  - loading: boolean
  - error: string | null
  - isSaved: boolean
  - checkedIngredients: Set<string>
  - addedToGrocery: boolean
- Actions:
  - toggleIngredient(ingredient: string)
  - toggleSave()
  - addToGrocery()
- Fetch meal by ID on mount and format with formatMealDetail and getYouTubeEmbedUrl from RecipeDetailModel.
```

### Prompt 3.3: Favourites ViewModel (`lib/viewmodels/useFavouritesViewModel.ts`)
```text
Implement useFavouritesViewModel inside lib/viewmodels/useFavouritesViewModel.ts.

Requirements:
- State management:
  - savedRecipes: MealSummary[]
  - groceryList: GroceryItem[]
  - activeTab: 'recipes' | 'grocery'
  - copyFeedback: boolean
- Actions:
  - handleRemoveSaved(idMeal: string)
  - handleToggleGrocery(id: string)
  - handleRemoveGrocery(id: string)
  - handleClearCompletedGrocery()
  - handleCopyToClipboard() -> formats items as a clean text checklist
```

---

## 4. Presentational Components Layer

### Prompt 4.1: Component Suite (`components/recipecraft/`)
```text
Create a suite of modern, accessible presentational components inside components/recipecraft/:

1. Header.tsx:
   - Sticky navbar with warm amber/emerald accents
   - Brand logo with culinary badge
   - Active route links: Explore (/), Recipe Box (/favourites), Settings (/settings-v2)
   - Live search input with debounced submission and clear button
   - Saved badge counter reflecting saved recipes count

2. Hero.tsx:
   - Engaging tagline and subtitle
   - Quick-seed category tags (e.g. "Quick Dinner", "Seafood", "Italian Pasta", "Desserts") that trigger search/filter on click

3. FilterBar.tsx:
   - Scrollable Category Pills (All, Seafood, Beef, Pasta, Vegetarian, etc.)
   - Cuisine Region Dropdown (All Cuisines, Italian, Mexican, Japanese, etc.)
   - Clear/Reset filters action

4. RecipeCard.tsx:
   - High-quality dish image with hover zoom
   - Category and Cuisine tags
   - Heart button with smooth toggle animation
   - Direct link to /recipe/[id]

5. RecipeGrid.tsx:
   - Responsive CSS grid (1 col mobile, 2 col tablet, 3-4 col desktop)
   - Shimmer / Skeleton cards while loading
   - Error banner with Retry action
   - Empty search fallback with suggestions

6. IngredientsList.tsx:
   - Interactive cooking checklist with strike-through completion
   - Dish ingredient thumbnails from TheMealDB CDN

7. GroceryList.tsx:
   - Grouped shopping list by recipe title
   - Checkboxes to check off purchased items
   - Copy to Clipboard button with visual confirmation
   - Clear Completed items button
```

---

## 5. Next.js 15 App Router Views

### Prompt 5.1: Root Layout (`app/layout.tsx`)
```text
Update app/layout.tsx to integrate the global Header, responsive container wrapper, and footer.
```

### Prompt 5.2: Home Page (`app/page.tsx`)
```text
Implement the RecipeCraft Home view inside app/page.tsx using useHomeViewModel, Hero, FilterBar, and RecipeGrid.
```

### Prompt 5.3: Recipe Detail Page (`app/recipe/[id]/page.tsx`)
```text
Implement the dynamic recipe detail page inside app/recipe/[id]/page.tsx using useRecipeDetailViewModel, IngredientsList, and embedded YouTube player.
```

### Prompt 5.4: Favourites & Grocery Planner Page (`app/favourites/page.tsx`)
```text
Implement the Favourites and Grocery Planner view inside app/favourites/page.tsx using useFavouritesViewModel, RecipeGrid, and GroceryList.
```

---

## 6. Testing & Quality Assurance

### Prompt 6.1: Vitest Unit Test Suite (`__tests__/recipecraft.test.tsx`)
```text
Create a comprehensive unit test suite in __tests__/recipecraft.test.tsx using Vitest:
- Test HomeModel deduplication, random seed fetching, and filter routing
- Test RecipeDetailModel ingredient extraction and YouTube URL parser
- Test FavouritesModel localStorage persistence, grocery list creation, item toggling, and clearing
- Guarantee 100% test pass rate with zero flaky tests.
```
