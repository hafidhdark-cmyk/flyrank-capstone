# RecipeCraft — AI Collaboration & Engineering Report

## FlyRank AI Internship — Front-end AI Engineering Track
**Student**: Al-Ameen  
**Project**: RecipeCraft (Culinary Explorer & Meal Planner)  
**Repository**: [github.com/hafidhdark-cmyk/flyrank-capstone](https://github.com/hafidhdark-cmyk/flyrank-capstone)  
**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS v4, Vitest, React Testing Library, TheMealDB API  

---

## 1. How AI Assisted Throughout Implementation

AI served as an interactive pair-programmer, architectural sounding board, and rapid scaffolding assistant throughout development. Specifically, AI assisted in:

1. **Architectural Translation**: Adapting the **MVVM (Model-View-ViewModel)** pattern demonstrated in mentor Ishak's session into Next.js 15 App Router conventions.
2. **Schema & Contract Definition**: Accelerating the translation of TheMealDB's raw REST responses into strictly-typed TypeScript interfaces (`lib/types/meal.ts`) with zero `any` types.
3. **Data Transformation & Logic**: Rapidly writing parsing routines for un-normalized API structures (e.g. 20 pairs of ingredient/measurement fields) and Fisher-Yates shuffling algorithms.
4. **Test Case Scaffolding**: Generating comprehensive test suites in `__tests__/recipecraft.test.tsx` verifying model logic, deduplication, YouTube embed parsing, and `localStorage` persistence.

---

## 2. Manual Reviews, Improvements & Refactorings

During code review and validation of AI-generated implementations, three critical manual improvements and refactorings were made:

### 🔍 Improvement 1: Defensive Ingredient Extraction & CDN Sanitization (`lib/models/RecipeDetailModel.ts`)
* **AI Initial Code**: The initial AI draft iterated over `strIngredient1..20` using a basic `Boolean(rawMeal[key])` check.
* **Problem Found**: TheMealDB API frequently returns literal string `"null"`, empty whitespace strings `""`, or undefined fields, causing broken ingredient cards with broken image URLs.
* **Manual Correction**: Refactored the extraction loop to enforce strict string trimming, ignore case-insensitive `"null"` strings, provide a default `"To taste"` measurement fallback, and URL-encode ingredient names when generating CDN thumbnail URLs (`https://www.themealdb.com/images/ingredients/{encoded}-Small.png`).

```typescript
// Refactored Implementation in RecipeDetailModel.ts:
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
```

---

### 🔍 Improvement 2: Next.js SSR Hydration Safety & Custom Event Bus (`lib/models/FavouritesModel.ts`)
* **AI Initial Code**: Directly accessed `window.localStorage.getItem(...)` at module top-level and inside model helper functions.
* **Problem Found**: Next.js App Router executes initial renders on the server where `window` is undefined, resulting in SSR hydration crashes (`ReferenceError: window is not defined`). Additionally, adding a recipe to favorites in the card did not instantly update the badge count in the Header navigation.
* **Manual Correction**: 
  1. Wrapped all storage access with an `isClient()` guard (`typeof window !== 'undefined'`).
  2. Implemented a custom browser event bus (`recipecraft:favourites_updated` and `recipecraft:grocery_updated`) dispatched upon every mutation, ensuring instant reactive badge updates across Header and Favourites pages without requiring complex external state libraries.

---

### 🔍 Improvement 3: Multi-Seed Parallel Fetching & Duplicate Deduplication (`lib/models/HomeModel.ts`)
* **AI Initial Code**: Called a single search query on initial load, which often returned a limited, repetitive list of meals.
* **Problem Found**: Initial screen lacked variety and when multiple seeds were fetched, duplicate recipes with identical `idMeal` values caused React key reconciliation warnings.
* **Manual Correction**: Refactored `getInitialMeals` to select 3 randomized seeds from a curated list (`['Chicken', 'Pasta', 'Curry', 'Beef', 'Seafood', 'Salad', 'Soup', 'Rice', 'Cake']`), execute parallel `Promise.all` requests, filter duplicates using a `Set<string>` on `idMeal`, and apply a Fisher-Yates shuffle to guarantee a fresh, diverse 12-recipe feed on every session launch.

---

## 3. Test Suite Verification
All 14 unit tests pass with zero regressions:
```bash
 ✓ __tests__/recipecraft.test.tsx (10 tests)
 ✓ components/settings/SettingsFormV2.test.tsx (4 tests)
 Test Files  2 passed (2)
      Tests  14 passed (14)
```
Production build verification (`next build`) compiled with zero type or lint errors across all dynamic and static routes.
