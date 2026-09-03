'use client'

import { ChefHat, Heart, Search, Settings, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getSavedRecipes } from '../../lib/models/FavouritesModel'

interface HeaderProps {
  onSearch?: (query: string) => void
  initialQuery?: string
}

export const Header: React.FC<HeaderProps> = ({ onSearch, initialQuery = '' }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(initialQuery)
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    setSearchValue(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getSavedRecipes().length)
    }
    updateCount()

    window.addEventListener('recipecraft:favourites_updated', updateCount)
    return () => {
      window.removeEventListener('recipecraft:favourites_updated', updateCount)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchValue)
    } else {
      router.push(`/?search=${encodeURIComponent(searchValue)}`)
    }
  }

  const handleClear = () => {
    setSearchValue('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-100/60 bg-white/95 backdrop-blur-md shadow-xs transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 transition-transform group-hover:scale-105">
            <ChefHat className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-1">
              Recipe<span className="text-amber-600">Craft</span>
            </span>
            <span className="hidden sm:block text-[11px] font-medium text-amber-800/60 -mt-1">
              Culinary Explorer & Planner
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="relative flex-1 max-w-md hidden md:block"
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search recipes, ingredients (e.g. Pasta, Chicken)..."
            className="w-full rounded-full border border-gray-200 bg-gray-50/70 pl-10 pr-10 py-2 text-sm text-gray-800 placeholder-gray-400 transition focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-3 focus:ring-amber-500/15"
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition ${
              pathname === '/'
                ? 'bg-amber-50 text-amber-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Explore
          </Link>

          <Link
            href="/favourites"
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition ${
              pathname === '/favourites'
                ? 'bg-amber-50 text-amber-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Heart
              className={`h-4 w-4 ${pathname === '/favourites' ? 'text-amber-600 fill-amber-600' : 'text-gray-500'}`}
            />
            <span>Recipe Box</span>
            {savedCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            href="/chat"
            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition ${
              pathname === '/chat'
                ? 'bg-amber-50 text-amber-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>ChefCraft AI</span>
          </Link>

          <Link
            href="/playground"
            className={`rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition ${
              pathname === '/playground'
                ? 'bg-amber-50 text-amber-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            A11y Playground
          </Link>

          <Link
            href="/settings-v2"
            className={`rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition ${
              pathname.includes('/settings') ? 'bg-gray-100 text-gray-700' : ''
            }`}
            title="Settings (FE-02 Milestone)"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
