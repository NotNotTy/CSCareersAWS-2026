import { NextRequest, NextResponse } from "next/server"
import type { SearchResult, BiasLabel, AccuracyGrade } from "@/lib/bias-types"

const GNEWS_URL = "https://gnews.io/api/v4/search"

interface GNewsArticle {
  title: string
  url: string
  source: { name: string }
  description: string | null
  image: string | null
}

async function fetchBiasLabel(
  article: GNewsArticle,
  baseUrl: string
): Promise<{ biasLabel: BiasLabel; accuracyGrade: AccuracyGrade }> {
  try {
    const response = await fetch(`${baseUrl}/api/analyze-bias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        textContent: article.description ?? article.title,
        siteName: article.source.name,
        mode: "label-only",
      }),
    })
    if (!response.ok) return { biasLabel: "Neutral", accuracyGrade: "C" }
    const data = await response.json()
    return {
      biasLabel: data.biasLabel ?? "Neutral",
      accuracyGrade: data.accuracyGrade ?? "C",
    }
  } catch {
    return { biasLabel: "Neutral", accuracyGrade: "C" }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body as { query?: unknown }

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "query must be a non-empty string" }, { status: 400 })
    }

    const apiKey = process.env.GNEWS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GNews API is not configured" }, { status: 500 })
    }

    const url = `${GNEWS_URL}?q=${encodeURIComponent(query.trim())}&lang=en&max=10&apikey=${apiKey}`
    const newsResponse = await fetch(url)

    if (!newsResponse.ok) {
      const text = await newsResponse.text()
      console.error("GNews API error:", newsResponse.status, text)
      return NextResponse.json(
        { error: `News API request failed (${newsResponse.status})` },
        { status: 500 }
      )
    }

    const newsData = await newsResponse.json()
    const articles: GNewsArticle[] = (newsData.articles ?? []).filter(
      (a: GNewsArticle) => a.title && a.title !== "[Removed]"
    )

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const results: SearchResult[] = await Promise.all(
      articles.map(async (article) => {
        const { biasLabel, accuracyGrade } = await fetchBiasLabel(article, baseUrl)
        return {
          title: article.title,
          url: article.url,
          source: article.source.name,
          snippet: article.description ?? "",
          image: article.image ?? null,
          biasLabel,
          accuracyGrade,
        }
      })
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Unexpected error in /api/search:", error)
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 })
  }
}
