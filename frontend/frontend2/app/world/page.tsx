"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Globe, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function WorldPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "world news international" }),
        })
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setResults(data.results ?? [])
      } catch {
        setError("Failed to load articles")
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const featured = results[0]
  const mainArticles = results.slice(1, 5)

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">World News</span>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b-2 border-[#1a365d]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#1a365d] mb-4">World</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive coverage of international affairs, diplomacy, and global events.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a365d]" />
            <span className="text-sm text-muted-foreground">Loading world news…</span>
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

            <section className="grid md:grid-cols-2 gap-8">
              {mainArticles.map((article, i) => (
                <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                  className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video overflow-hidden rounded mb-3">
                    <Image src={articleImage(article.image)} alt={article.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[#1a365d] tracking-wider uppercase">{article.source}</span>
                  </div>
                  <h3 className="font-serif text-xl text-foreground leading-snug group-hover:text-[#1a365d] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.snippet}</p>
                </Link>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
