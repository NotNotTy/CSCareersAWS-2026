"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasScaleBar } from "@/components/bias-scale-bar"
import type { SearchResult, BiasAnalysisResult } from "@/lib/bias-types"

const DEFAULT_QUERY = "top news today"
const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [featuredAnalysis, setFeaturedAnalysis] = useState<BiasAnalysisResult | null>(null)
  const [featuredAnalyzing, setFeaturedAnalyzing] = useState(false)

  async function analyzeFeatured(article: SearchResult) {
    setFeaturedAnalysis(null)
    setFeaturedAnalyzing(true)
    try {
      // Step 1: parse the article
      const parseRes = await fetch("/api/parse-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: article.url }),
      })
      if (!parseRes.ok) return
      const parsed = await parseRes.json()

      // Step 2: full bias analysis
      const analyzeRes = await fetch("/api/analyze-bias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: parsed.title,
          textContent: parsed.textContent,
          siteName: parsed.siteName,
          mode: "full",
        }),
      })
      if (!analyzeRes.ok) return
      const analysis: BiasAnalysisResult = await analyzeRes.json()
      setFeaturedAnalysis(analysis)
    } catch {
      // silently fail — the card still works without the badge
    } finally {
      setFeaturedAnalyzing(false)
    }
  }

  async function runSearch(q: string, updateUrl = true) {
    if (!q.trim()) return
    setSearchOpen(false)
    setLoading(true)
    setError(null)
    setLastQuery(q)
    setQuery("")
    if (updateUrl) {
      const params = new URLSearchParams()
      if (q !== DEFAULT_QUERY) params.set("q", q)
      router.replace(`/?${params.toString()}`, { scroll: false })
    }
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
      const articles = data.results ?? []
      setResults(articles)
      if (articles.length > 0) analyzeFeatured(articles[0])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const q = searchParams.get("q") || DEFAULT_QUERY
    runSearch(q, false)
  }, [])

  const featured = results[0]
  const topStories = results.slice(1, 4)
  const sidebarStories = results.slice(4, 7)
  const bottomGrid = results.slice(7, 11)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center pt-24 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (query.trim()) runSearch(query)
            }}
            className="w-full max-w-2xl"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                  placeholder="Search for news topics…"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-lg"
                />
              </div>
              <button type="submit" disabled={loading || !query.trim()}
                className="px-6 py-4 bg-foreground text-background font-medium rounded-lg hover:opacity-90 disabled:opacity-40">
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)}
                className="px-4 py-4 border border-border rounded-lg text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search bar strip */}
      <div className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {lastQuery && lastQuery !== DEFAULT_QUERY ? `Results for "${lastQuery}"` : "Top Stories · March 28, 2026"}
          </p>
          <button onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search topics</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-32 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Fetching and analyzing articles…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-32 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button onClick={() => runSearch(lastQuery)}
              className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            {/* Featured + Sidebar layout */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Featured hero — takes 2/3 */}
              {featured && (
                <div className="lg:col-span-2">
                  <Link href={`/article?url=${encodeURIComponent(featured.url)}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden mb-4">
                      <Image src={articleImage(featured.image)} alt={featured.title} fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium tracking-widest uppercase text-white/70">{featured.source}</span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-2">
                          {featured.title}
                        </h2>
                        <p className="text-white/80 text-sm md:text-base line-clamp-2 max-w-2xl">{featured.snippet}</p>
                        {/* Bias score for featured article */}
                        <div className="mt-3" onClick={(e) => e.preventDefault()}>
                          {featuredAnalyzing && (
                            <div className="flex items-center gap-2 text-white/60 text-xs">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Analyzing bias…
                            </div>
                          )}
                          {featuredAnalysis && (
                            <div className="bg-black/40 backdrop-blur rounded-lg px-4 py-3 inline-block">
                              <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">Political Bias</p>
                              <BiasScaleBar rating={featuredAnalysis.biasScale} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Sidebar stories — 1/3 */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                <h2 className="font-serif text-xl text-foreground border-b border-border pb-2">Latest</h2>
                {sidebarStories.map((article, i) => (
                  <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                    className="group flex gap-3 items-start">
                    <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden">
                      <Image src={articleImage(article.image)} alt={article.title} fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-muted-foreground truncate">{article.source}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Top Stories grid */}
            {topStories.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-foreground">Top Stories</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topStories.map((article, i) => (
                    <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden mb-3">
                        <Image src={articleImage(article.image)} alt={article.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">{article.source}</span>
                      </div>
                      <h3 className="font-serif text-lg text-foreground leading-snug group-hover:text-blue-600 transition-colors mb-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{article.snippet}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom grid — 4 columns */}
            {bottomGrid.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl text-foreground">More Stories</h2>
                  <button onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Search more <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {bottomGrid.map((article, i) => (
                    <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden mb-3">
                        <Image src={articleImage(article.image)} alt={article.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs text-muted-foreground truncate">{article.source}</span>
                      </div>
                      <h3 className="font-serif text-base text-foreground leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && results.length === 0 && lastQuery && (
          <p className="text-center text-sm text-muted-foreground py-32">
            No results found for &ldquo;{lastQuery}&rdquo;.
          </p>
        )}

        {/* Newsletter */}
        <section className="bg-primary text-primary-foreground py-12 px-8 lg:px-16 -mx-4 sm:-mx-6 lg:-mx-8 mb-0">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-4">Stay Informed</h2>
            <p className="text-primary-foreground/80 mb-8">Get the most important stories delivered to your inbox every morning.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30" />
              <button type="submit"
                className="px-6 py-3 bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </section>
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
            <div className="font-serif text-xl text-foreground">PoliNote</div>
            <p className="text-sm text-muted-foreground">© 2026 PoliNote. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
