import { NextRequest, NextResponse } from "next/server"
import { Readability } from "@mozilla/readability"
import { JSDOM } from "jsdom"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Fetch the article
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ArticleReader/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch article: ${response.status}` },
        { status: 400 }
      )
    }

    const html = await response.text()

    // Parse the HTML
    const dom = new JSDOM(html, { url: parsedUrl.toString() })
    const document = dom.window.document

    // Extract metadata
    const getMetaContent = (selectors: string[]): string | null => {
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          return element.getAttribute("content") || element.textContent
        }
      }
      return null
    }

    const ogImage = getMetaContent([
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="twitter:image"]',
    ])

    const author = getMetaContent([
      'meta[name="author"]',
      'meta[property="article:author"]',
      'meta[name="dc.creator"]',
      '[rel="author"]',
    ])

    const siteName = getMetaContent([
      'meta[property="og:site_name"]',
      'meta[name="application-name"]',
    ]) || parsedUrl.hostname.replace("www.", "")

    const publishedTime = getMetaContent([
      'meta[property="article:published_time"]',
      'meta[name="date"]',
      'meta[name="DC.date.issued"]',
      'time[datetime]',
    ])

    // Use Readability to parse the article content
    const reader = new Readability(document)
    const article = reader.parse()

    if (!article) {
      return NextResponse.json(
        { error: "Could not extract article content. The page may not contain readable article content." },
        { status: 400 }
      )
    }

    return NextResponse.json({
      title: article.title,
      content: article.content,
      textContent: article.textContent,
      excerpt: article.excerpt,
      author: author || article.byline,
      siteName,
      publishedTime,
      image: ogImage,
    })
  } catch (error) {
    console.error("Error parsing article:", error)
    return NextResponse.json(
      { error: "Failed to parse article. Please check the URL and try again." },
      { status: 500 }
    )
  }
}
