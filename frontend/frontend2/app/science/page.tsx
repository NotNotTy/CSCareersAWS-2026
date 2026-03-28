"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FlaskConical, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasLabelBadge } from "@/components/bias-label-badge"
import type { SearchResult } from "@/lib/bias-types"

const PLACEHOLDER_IMAGE = "/placeholder.jpg"

function articleImage(image: string | null): string {
  return image || PLACEHOLDER_IMAGE
}

export default function SciencePage() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "science research discovery" }),
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
    <div className="min-h-screen bg-[#f0f4f3]">
      <div className="bg-[#1e5245] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Science</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Space</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Health</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Climate</a>
              <a href="#" className="hidden md:block hover:text-emerald-200 transition-colors">Biology</a>
            </div>
          </div>
        </div>
      </div>

      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <header className="mb-10 pb-8 border-b-2 border-[#1e5245]">
          <h1 className="font-serif text-5xl md:text-6xl text-[#1e5245] mb-4">Science</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discoveries, research, and breakthroughs expanding the frontiers of human knowledge.
          </p>
        </header>

        {loading && (
          <div className="flex flex-col items-center gap-3 py-32">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e5245]" />
            <span className="text-sm text-muted-foreground">Loading science news…</span>
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
              <section className="mb-12 bg-white rounded-lg overflow-hidden shadow-sm">
                <Link href={`/article?url=${encodeURIComponent(featured.url)}`} className="grid md:grid-cols-2 group">
                  <div className="relative aspect-square md:aspect-auto overflow-hidden">
                    <Image src={articleImage(featured.image)} alt={featured.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-[#1e5245] text-white text-xs font-medium tracking-wider uppercase rounded">
                        {featured.source}
                      </span>
                      <BiasLabelBadge label={featured.biasLabel} />
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-foreground leading-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground text-lg">{featured.snippet}</p>
                  </div>
                </Link>
              </section>
            )}

            <section className="grid lg:grid-cols-3 gap-6">
              {mainArticles.map((article, i) => (
                <Link key={i} href={`/article?url=${encodeURIComponent(article.url)}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={articleImage(article.image)} alt={article.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-[#1e5245] text-xs font-medium rounded">
                        {article.source}
                      </span>
                      <BiasLabelBadge label={article.biasLabel} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-xl text-foreground leading-snug mb-3 group-hover:text-[#1e5245] transition-colors">
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
