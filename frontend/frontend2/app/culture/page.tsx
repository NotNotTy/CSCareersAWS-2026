"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Film, Music, Book, Palette, Theater, Camera, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasLabelBadge } from "@/components/bias-label-badge"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

const categories = [
  { name: "Film", icon: Film },
  { name: "Music", icon: Music },
  { name: "Books", icon: Book },
  { name: "Art", icon: Palette },
  { name: "Theater", icon: Theater },
  { name: "Photo", icon: Camera },
]

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function CulturePage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "entertainment movies music" }),
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
    <div className="min-h-screen bg-[#fdfbf7]">
      <div className="bg-[#c47d5b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Culture</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Film</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Music</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Art</a>
              <a href="#" className="hidden md:block hover:text-orange-100 transition-colors">Books</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b-2 border-[#c47d5b]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#8b4513] mb-4 italic">Culture</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Art, film, music, literature, and the creative expressions that define our time.
          </p>
        </header>

        <section className="flex flex-wrap justify-center gap-8 mb-12">
          {categories.map((cat) => (
            <a key={cat.name} href="#" className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full bg-[#c47d5b]/10 flex items-center justify-center group-hover:bg-[#c47d5b] transition-colors">
                <cat.icon className="w-7 h-7 text-[#c47d5b] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-[#8b4513] transition-colors">
                {cat.name}
              </span>
            </a>
          ))}
        </section>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#c47d5b]" />
            <span className="text-sm text-muted-foreground">Loading culture news…</span>
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
                  <div className="relative aspect-[21/9] rounded-lg overflow-hidden">
                    <Image src={articleImage(featured.image)} alt={featured.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#e8a87c] text-sm font-medium tracking-widest uppercase">
                          {featured.source}
                        </span>
                        <BiasLabelBadge label={featured.biasLabel} />
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4 italic">
                        {featured.title}
                      </h2>
                      <p className="text-gray-300 text-lg max-w-lg hidden md:block">{featured.snippet}</p>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mainArticles.map((article, i) => (
                <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={articleImage(article.image)} alt={article.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-0.5 bg-[#c47d5b]"></span>
                      <span className="text-xs text-[#c47d5b] font-medium uppercase tracking-wider">{article.source}</span>
                      <BiasLabelBadge label={article.biasLabel} />
                    </div>
                    <h3 className="font-serif text-xl text-foreground leading-snug mb-3 group-hover:text-[#8b4513] transition-colors italic">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{article.snippet}</p>
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
