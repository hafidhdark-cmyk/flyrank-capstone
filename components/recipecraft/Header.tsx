'use client'

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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
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
          <svg
            className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
            <svg
              className={`h-4 w-4 ${pathname === '/favourites' ? 'text-amber-600 fill-amber-600' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Recipe Box</span>
            {savedCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-bold text-white shadow-xs">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            href="/settings-v2"
            className={`rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition ${
              pathname.includes('/settings') ? 'bg-gray-100 text-gray-700' : ''
            }`}
            title="Settings (FE-02 Milestone)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
