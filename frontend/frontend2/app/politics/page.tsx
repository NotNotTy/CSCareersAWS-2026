"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Landmark, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasLabelBadge } from "@/components/bias-label-badge"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function PoliticsPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "politics government congress" }),
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
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-[#8b0000] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Politics</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Congress</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">White House</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Judiciary</a>
              <a href="#" className="hidden md:block hover:text-red-200 transition-colors">Elections</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b-4 border-[#8b0000]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#8b0000] mb-4">Politics</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            In-depth coverage of government, policy, elections, and the forces shaping American democracy.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#8b0000]" />
            <span className="text-sm text-muted-foreground">Loading political news…</span>
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
                        <BiasLabelBadge label={featured.biasLabel} />
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

            <section>
              {mainArticles.map((article, i) => (
                <div key={i} className="mb-8 pb-8 border-b border-[#8b0000]/20 last:border-b-0">
                  <Link href={`/article?url=${encodeURIComponent(article.url)}`} className="grid md:grid-cols-5 gap-6 group">
                    <div className="md:col-span-2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded">
                        <Image src={articleImage(article.image)} alt={article.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold tracking-widest uppercase text-[#8b0000]">{article.source}</span>
                        <BiasLabelBadge label={article.biasLabel} />
                      </div>
                      <h3 className="font-serif text-xl md:text-2xl text-foreground leading-snug mb-3 group-hover:text-[#8b0000] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{article.snippet}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
