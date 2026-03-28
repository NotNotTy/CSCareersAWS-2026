export type BiasScaleRating =
  | "Far Left"
  | "Left"
  | "Center-Left"
  | "Center"
  | "Center-Right"
  | "Right"
  | "Far Right"

export type BiasLabel = "Left" | "Right" | "Neutral"

export type AccuracyGrade = "A" | "B" | "C" | "D" | "F"

export type AccuracyLabel =
  | "High Accuracy"
  | "Moderate Accuracy"
  | "Low Accuracy"
  | "Unavailable"

export interface SearchResult {
  title: string
  url: string
  source: string
  snippet: string
  image: string | null
  biasLabel: BiasLabel
  accuracyGrade: AccuracyGrade
}

export type AnnotationReason =
  | "loaded-language"
  | "omits-opposing-viewpoint"
  | "publisher-profile"
  | "framing"
  | "source-selection"

export interface Annotation {
  phrase: string
  explanation: string
  reason: AnnotationReason
}

export interface ParsedArticle {
  title: string
  content: string
  textContent: string
  excerpt: string
  author: string | null
  siteName: string | null
  publishedTime: string | null
  image: string | null
}

export interface BiasAnalysisResult {
  biasScale: BiasScaleRating
  accuracyScore: number
  accuracyLabel: AccuracyLabel
  annotations: Annotation[]
}

export interface LabelOnlyResult {
  biasLabel: BiasLabel
  accuracyGrade: AccuracyGrade
}
