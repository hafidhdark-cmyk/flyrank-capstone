import type { Metadata } from 'next'
import Header from '../components/recipecraft/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'RecipeCraft — Culinary Explorer & Meal Planner',
  description:
    'Discover delicious recipes, filter by international cuisines, check off ingredients, and curate your grocery shopping list.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-gray-50/60 antialiased">
      <body className="flex min-h-full flex-col font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
        <Header />
        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-100 bg-white py-8 text-center text-xs text-gray-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="flex items-center justify-center gap-1.5 font-medium text-gray-600">
              <span>Built with</span>
              <span className="text-rose-500">❤️</span>
              <span>for the FlyRank AI Internship — Powered by TheMealDB</span>
            </p>
            <p className="mt-1 text-[11px] text-gray-400">
              MVVM Architecture • Next.js 15 App Router • React 19 • Tailwind CSS v4 • TypeScript
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
