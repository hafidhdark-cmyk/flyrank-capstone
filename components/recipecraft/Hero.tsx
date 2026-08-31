'use client'

import React from 'react'

interface HeroProps {
  onQuickSearch: (tag: string) => void
}

const QUICK_TAGS = [
  { label: '🍗 Chicken', query: 'Chicken' },
  { label: '🍝 Italian Pasta', query: 'Pasta' },
  { label: '🍛 Spicy Curry', query: 'Curry' },
  { label: '🥩 Hearty Beef', query: 'Beef' },
  { label: '🦐 Seafood', query: 'Seafood' },
  { label: '🍰 Desserts', query: 'Cake' },
  { label: '🥗 Salads', query: 'Salad' },
]

export const Hero: React.FC<HeroProps> = ({ onQuickSearch }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16">
      {/* Decorative Background Circles */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold tracking-wide uppercase text-amber-100 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Powered by TheMealDB API
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Discover, Cook & Plan Delicious Meals
        </h1>

        <p className="mt-3 text-base sm:text-lg text-amber-100/90 max-w-2xl mx-auto">
          Explore thousands of international recipes, check off ingredients as you cook, and curate your personalized grocery shopping list.
        </p>

        {/* Quick Suggestion Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-amber-200/80 mr-1">Popular:</span>
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag.query}
              type="button"
              onClick={() => onQuickSearch(tag.query)}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white hover:text-orange-600 hover:scale-105 active:scale-95 shadow-xs"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
