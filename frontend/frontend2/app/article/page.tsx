"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { BiasScaleBar } from "@/components/bias-scale-bar"
import { AccuracyDisplay } from "@/components/accuracy-display"
import { AnnotatedArticle } from "@/components/annotated-article"
import type { ParsedArticle, BiasAnalysisResult } from "@/lib/bias-types"

function ArticleContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url") ?? ""

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [article, setArticle] = useState<ParsedArticle | null>(null)
  const [analysis, setAnalysis] = useState<BiasAnalysisResult | null>(null)

  useEffect(() => {
    if (!url) {
      setError("No article URL provided.")
      setLoading(false)
      return
    }

    async function fetchAndAnalyze() {
      setLoading(true)
      setError(null)

      try {
        // Step 1: Parse the article
        const parseRes = await fetch("/api/parse-article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
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

    fetchAndAnalyze()
  }, [url])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm">Fetching and analyzing article…</span>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium max-w-md">{error}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                Open original article
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Article content */}
        {!loading && !error && article && analysis && (
          <>
            {/* Title */}
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
    </div>
  )
}

export default function ArticlePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col">
          <SiteHeader />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      }
    >
      <ArticleContent />
    </Suspense>
  )
}
