"use client"

import { useState, useRef, useEffect } from "react"
import { Annotation } from "@/lib/bias-types"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AnnotatedArticleProps {
  htmlContent: string
  annotations: Annotation[]
}

const REASON_LABELS: Record<string, string> = {
  "loaded-language": "Loaded Language",
  "omits-opposing-viewpoint": "Omits Opposing Viewpoint",
  "publisher-profile": "Publisher Profile",
  "framing": "Framing",
  "source-selection": "Source Selection",
}

function buildAnnotatedHtml(htmlContent: string, annotations: Annotation[]): string {
  let result = htmlContent
  annotations.forEach((annotation, index) => {
    if (!annotation.phrase) return
    // Escape special regex characters in the phrase
    const escaped = annotation.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const regex = new RegExp(escaped, "g")
    result = result.replace(
      regex,
      `<span data-annotation-index="${index}" class="bg-yellow-200 cursor-pointer rounded px-0.5 hover:bg-yellow-300 transition-colors">${annotation.phrase}</span>`
    )
  })
  return result
}

export function AnnotatedArticle({ htmlContent, annotations }: AnnotatedArticleProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const articleRef = useRef<HTMLDivElement>(null)
  const annotationRefs = useRef<(HTMLDivElement | null)[]>([])

  const processedHtml = buildAnnotatedHtml(htmlContent, annotations)

  useEffect(() => {
    const container = articleRef.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const span = target.closest("[data-annotation-index]") as HTMLElement | null
      if (span) {
        const idx = parseInt(span.getAttribute("data-annotation-index") ?? "-1", 10)
        if (idx >= 0) {
          setSelectedIndex(idx)
        }
      }
    }

    container.addEventListener("click", handleClick)
    return () => container.removeEventListener("click", handleClick)
  }, [processedHtml])

  useEffect(() => {
    if (selectedIndex !== null) {
      annotationRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
    }
  }, [selectedIndex])

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={65} minSize={30}>
        <ScrollArea className="h-full">
          <div
            ref={articleRef}
            className="prose prose-sm max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
          />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={35} minSize={20}>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Annotations ({annotations.length})
            </h3>
            {annotations.length === 0 && (
              <p className="text-sm text-muted-foreground">No annotations found.</p>
            )}
            {annotations.map((annotation, index) => (
              <div
                key={index}
                ref={(el) => { annotationRefs.current[index] = el }}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  "rounded-lg border p-3 cursor-pointer transition-colors",
                  selectedIndex === index
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <p className="text-sm font-medium text-foreground mb-1">
                  &ldquo;{annotation.phrase}&rdquo;
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {annotation.explanation}
                </p>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {REASON_LABELS[annotation.reason] ?? annotation.reason}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
