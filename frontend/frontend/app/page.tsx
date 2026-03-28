"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasLabelBadge } from "@/components/bias-label-badge"
import type { SearchResult } from "@/lib/bias-types"

const DEFAULT_QUERY = "top news today"

export default function HomePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState("")

  async function runSearch(q: string) {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setLastQuery(q)
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Search failed (${res.status})`)
      }
      const data = await res.json()
      setResults(data.results ?? [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runSearch(DEFAULT_QUERY)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch(query || DEFAULT_QUERY)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-3">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for news topics…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scrollable article feed */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-border mb-6">
          <span className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-foreground -mb-px">
            Feed
          </span>
          <Link
            href="/analyze"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Analyze
          </Link>
        </div>

        {/* Section heading */}
        <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
          {lastQuery && lastQuery !== DEFAULT_QUERY ? `Results for "${lastQuery}"` : "Top Stories"}
        </p>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Fetching and analyzing articles…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => runSearch(lastQuery)}
              className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Article feed */}
        {!loading && !error && results.length > 0 && (
          <ol className="divide-y divide-border">
            {results.map((result, i) => (
              <li key={i} className="py-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                        {result.source}
                      </span>
                      <BiasLabelBadge label={result.biasLabel} />
                      <span className="text-xs text-muted-foreground">Grade: {result.accuracyGrade}</span>
                    </div>
                    <Link
                      href={`/article?url=${encodeURIComponent(result.url)}`}
                      className="block text-base font-semibold text-foreground group-hover:text-blue-600 transition-colors leading-snug mb-1"
                    >
                      {result.title}
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && lastQuery && (
          <p className="text-center text-sm text-muted-foreground py-24">
            No results found for &ldquo;{lastQuery}&rdquo;.
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-medium text-foreground mb-4">News</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">World</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Politics</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Technology</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">Opinion</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Editorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Columnists</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Letters</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Sunday Review</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">Culture</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Arts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Books</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Music</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-4">More</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Podcasts</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Newsletters</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Video</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Photography</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <div className="font-serif text-xl text-foreground">The Daily Chronicle</div>
            <p className="text-sm text-muted-foreground">
              © 2026 The Daily Chronicle. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
