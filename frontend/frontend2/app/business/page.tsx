"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, TrendingDown, BarChart3, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

interface MarketData {
  name: string
  value: string
  change: string
  up: boolean
}

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function BusinessPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([
    { name: "S&P 500", value: "5,847.23", change: "+1.2%", up: true },
    { name: "DOW", value: "42,156.89", change: "+0.8%", up: true },
    { name: "Oil (WTI)", value: "$72.45", change: "+2.1%", up: true },
    { name: "Bitcoin", value: "$43,250", change: "-1.3%", up: false },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch articles
        const articlesRes = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "business economy markets" }),
        })
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          setResults(articlesData.results ?? [])
        }

        // Fetch market data
        const marketRes = await fetch("/api/market-data")
        if (marketRes.ok) {
          const marketDataRes = await marketRes.json()
          if (marketDataRes.data && marketDataRes.data.length > 0) {
            setMarketData(marketDataRes.data)
          }
        }
      } catch {
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const featured = results[0]
  const mainArticles = results.slice(1, 5)

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="bg-[#0d1f2d] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 py-2 overflow-x-auto">
            {marketData.map((item) => (
              <div key={item.name} className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="text-sm font-medium">{item.value}</span>
                <span className={`text-sm flex items-center gap-1 ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#1a3a4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Business</span>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b-2 border-[#1a3a4a]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#0d1f2d] mb-4">Business</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Markets, economy, and corporate news driving global commerce and financial decisions.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {marketData.map((item) => (
            <div key={item.name} className="bg-white p-4 rounded border-l-4 border-[#1a3a4a]">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.name}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-semibold text-[#0d1f2d]">{item.value}</span>
                <span className={`text-sm font-medium flex items-center gap-1 ${item.up ? 'text-emerald-600' : 'text-red-600'}`}>
                  {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </section>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a4a]" />
            <span className="text-sm text-muted-foreground">Loading business news…</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 py-32">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            {featured && (
              <section className="mb-12">
                <Link href={`/article?url=${encodeURIComponent(featured.url)}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded">
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
                      <p className="text-white/80 text-sm md:text-base line-clamp-2">{featured.snippet}</p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            <section className="grid md:grid-cols-2 gap-6">
              {mainArticles.map((article, i) => (
                <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                  className="bg-white rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={articleImage(article.image)} alt={article.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground">{article.source}</span>
                    </div>
                    <h3 className="font-serif text-lg text-foreground leading-snug group-hover:text-[#1a3a4a] transition-colors mb-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{article.snippet}</p>
                  </div>
                </Link>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
