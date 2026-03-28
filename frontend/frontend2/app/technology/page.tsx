"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Cpu, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function TechnologyPage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "technology AI software" }),
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
  const mainArticles = results.slice(1)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Technology</span>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b border-white/10">
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-4">Technology</h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            The latest in AI, software, hardware, and the innovations shaping our digital future.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="text-sm text-gray-400">Loading tech news…</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 py-32">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            {featured && (
              <section className="mb-12 rounded-xl overflow-hidden">
                <Link href={`/article?url=${encodeURIComponent(featured.url)}`} className="group block">
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <Image src={articleImage(featured.image)} alt={featured.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-medium tracking-wider uppercase rounded-full">
                          {featured.source}
                        </span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
                        {featured.title}
                      </h2>
                      <p className="text-gray-300 text-lg max-w-3xl">{featured.snippet}</p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            <section className="grid lg:grid-cols-3 gap-6">
              {mainArticles.map((article, i) => (
                <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                  className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={articleImage(article.image)} alt={article.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-black/60 backdrop-blur text-white text-xs font-medium rounded">
                        {article.source}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-white leading-snug mb-3 group-hover:text-purple-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{article.snippet}</p>
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
