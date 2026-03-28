"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { LinkIcon, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ArticleData {
  title: string
  content: string
  excerpt: string
  author: string | null
  siteName: string | null
  publishedTime: string | null
  image: string | null
}

export default function ReaderPage() {
  const [url, setUrl] = useState("")
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError(null)
    setArticle(null)

    try {
      const response = await fetch("/api/parse-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch article")
      }

      const data = await response.json()
      setArticle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>

          <div className="mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
              Article Reader
            </h1>
            <p className="text-muted-foreground">
              Enter an article URL to read it in a clean, distraction-free format.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Read Article</span>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm text-destructive mb-8">
              {error}
            </div>
          )}

          {article && (
            <article className="bg-card border border-border rounded-sm overflow-hidden">
              {article.image && (
                <div className="aspect-[2/1] relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6 md:p-10">
                <header className="mb-8 pb-8 border-b border-border">
                  <h2 className="font-serif text-2xl md:text-4xl font-bold text-foreground leading-tight mb-4 text-balance">
                    {article.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    {article.author && (
                      <span>By <span className="font-medium text-foreground">{article.author}</span></span>
                    )}
                    {article.siteName && (
                      <span className="text-accent">{article.siteName}</span>
                    )}
                    {article.publishedTime && (
                      <time>{new Date(article.publishedTime).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</time>
                    )}
                  </div>

                  {article.excerpt && (
                    <p className="mt-4 text-lg text-muted-foreground italic">
                      {article.excerpt}
                    </p>
                  )}
                </header>

                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:text-foreground
                    prose-p:text-foreground prose-p:leading-relaxed
                    prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-blockquote:italic
                    prose-img:rounded-sm
                    prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </article>
          )}

          {!article && !loading && !error && (
            <div className="text-center py-16 text-muted-foreground">
              <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Paste an article URL above to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
