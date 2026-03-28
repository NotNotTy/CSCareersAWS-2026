"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Loader2, AlertCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasScaleBar } from "@/components/bias-scale-bar"
import { AccuracyDisplay } from "@/components/accuracy-display"
import { AnnotatedArticle } from "@/components/annotated-article"
import type { ParsedArticle, BiasAnalysisResult } from "@/lib/bias-types"

export default function AnalyzePage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [article, setArticle] = useState<ParsedArticle | null>(null)
  const [analysis, setAnalysis] = useState<BiasAnalysisResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setArticle(null)
    setAnalysis(null)

    try {
      // Step 1: Parse the article
      const parseRes = await fetch("/api/parse-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!parseRes.ok) {
        const data = await parseRes.json().catch(() => ({}))
        throw new Error(data.error ?? `Failed to fetch article (${parseRes.status})`)
      }

      const parsed: ParsedArticle = await parseRes.json()
      setArticle(parsed)

      // Step 2: Analyze bias
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

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json().catch(() => ({}))
        throw new Error(data.error ?? `Bias analysis failed (${analyzeRes.status})`)
      }

      const result: BiasAnalysisResult = await analyzeRes.json()
      setAnalysis(result)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-border mb-8">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Search
          </Link>
          <span className="px-4 py-2 text-sm font-medium text-foreground border-b-2 border-foreground -mb-px">
            Analyze
          </span>
        </div>

        {/* URL input form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste an article URL…"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-5 py-3 rounded-lg bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Analyze
            </button>
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Fetching and analyzing article…</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium max-w-md">{error}</p>
            <p className="text-xs text-muted-foreground">
              Check the URL and try again, or paste a different article link above.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && article && analysis && (
          <>
            {/* Article title */}
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight mb-6">
              {article.title}
            </h1>

            {/* Analysis card: BiasScaleBar + AccuracyDisplay side by side */}
            <div className="rounded-lg border border-border bg-card p-5 mb-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Political Bias
                </p>
                <BiasScaleBar rating={analysis.biasScale} />
              </div>
              <div className="sm:border-l sm:border-border sm:pl-6 flex flex-col items-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Accuracy
                </p>
                <AccuracyDisplay score={analysis.accuracyScore} label={analysis.accuracyLabel} />
              </div>
            </div>

            {/* Annotated article */}
            <div className="h-[600px] rounded-lg border border-border overflow-hidden">
              <AnnotatedArticle
                htmlContent={article.content}
                annotations={analysis.annotations}
              />
            </div>
          </>
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
            <div className="font-serif text-xl text-foreground">PoliNote</div>
            <p className="text-sm text-muted-foreground">
              © 2026 PoliNote. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
