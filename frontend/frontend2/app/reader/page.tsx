"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { LinkIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReaderPage() {
  const [url, setUrl] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    router.push(`/article?url=${encodeURIComponent(url.trim())}`)
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
              Enter an article URL to read it and get a full bias and accuracy analysis.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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
                disabled={!url.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Analyze Article
              </button>
            </div>
          </form>

          {!url && (
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
