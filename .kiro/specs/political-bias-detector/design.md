# Design Document: Political Bias Detector

## Overview

The Political Bias Detector extends the existing "The Daily Chronicle" Next.js application with two new experiences:

1. **Search Tab** (home page replacement): A search bar that queries Google via a server-side API route, returns the top 10 article results, and displays each with a color-coded Bias_Label (Left / Right / Neutral) and a letter-grade accuracy indicator.
2. **Analyze Tab** (`/analyze` page): A URL input that fetches and parses an article, runs AI-powered bias and accuracy analysis, renders the full article text with inline highlighted annotations, and displays a seven-point Bias_Scale spectrum.

The system is entirely contained within the Next.js frontend. All AI calls are made server-side via API routes to avoid exposing API keys. The existing `/api/parse-article` route (using `@mozilla/readability` + `jsdom`) is reused and extended.

---

## Architecture

```mermaid
graph TD
    subgraph Browser
        A[Home Page - Search Tab]
        B[Analyze Page - /analyze]
        C[Article Detail - /article?url=...]
    end

    subgraph Next.js API Routes
        D[/api/search]
        E[/api/parse-article - existing, extended]
        F[/api/analyze-bias]
    end

    subgraph External Services
        G[Google Custom Search API]
        H[OpenAI API / LLM]
        I[Target Article URLs]
    end

    A -->|POST query| D
    D -->|Google CSE request| G
    D -->|bias label per result| F
    B -->|POST url| E
    B -->|POST article text| F
    C -->|POST url| E
    C -->|POST article text| F
    E -->|fetch + Readability| I
    F -->|prompt| H
```

**Key architectural decisions:**

- All LLM calls happen in API routes (server-side) — no API keys in the browser.
- The `/api/analyze-bias` route accepts article text + metadata and returns a structured JSON response containing the bias scale rating, accuracy score, and annotations array.
- The `/api/search` route calls the Google Custom Search JSON API and then calls `/api/analyze-bias` for each result to attach bias labels and accuracy grades.
- The `BiasScaleBar` component is a shared React component used in both the search results list and the Analyze page to guarantee visual consistency.

---

## Components and Interfaces

### API Routes

#### `POST /api/search`

Request:
```ts
{ query: string }
```

Response:
```ts
{
  results: SearchResult[]
}

type SearchResult = {
  title: string
  url: string
  source: string       // publisher name
  snippet: string
  biasLabel: "Left" | "Right" | "Neutral"
  accuracyGrade: "A" | "B" | "C" | "D" | "F"
}
```

#### `POST /api/parse-article` (extended)

Existing route is unchanged. Returns:
```ts
{
  title: string
  content: string      // HTML suitable for rendering
  excerpt: string
  author: string | null
  siteName: string | null
  publishedTime: string | null
  image: string | null
  textContent: string  // NEW: plain-text body for AI analysis
}
```

The `textContent` field is added by extracting `article.textContent` from Readability alongside the existing `article.content`.

#### `POST /api/analyze-bias`

Request:
```ts
{
  title: string
  textContent: string   // plain text body
  siteName: string | null
  mode: "full" | "label-only"
  // mode="label-only" returns just biasLabel + accuracyGrade (used by /api/search)
  // mode="full" returns the complete analysis with annotations
}
```

Response (`mode="label-only"`):
```ts
{
  biasLabel: "Left" | "Right" | "Neutral"
  accuracyGrade: "A" | "B" | "C" | "D" | "F"
}
```

Response (`mode="full"`):
```ts
{
  biasScale: BiasScaleRating
  accuracyScore: number          // 0–100
  accuracyLabel: "High Accuracy" | "Moderate Accuracy" | "Low Accuracy" | "Unavailable"
  annotations: Annotation[]
}
```

### React Components

#### `<BiasScaleBar rating={BiasScaleRating} />`

Renders the seven-point spectrum bar with a marker at the given position. Used in both search result detail cards and the Analyze page. Color mapping is defined in a shared constant:

```ts
const BIAS_COLORS: Record<BiasScaleRating, string> = {
  "Far Left":     "#1a3a6b",  // deep blue
  "Left":         "#3b6dbf",
  "Center-Left":  "#7aaee8",
  "Center":       "#9ca3af",  // gray
  "Center-Right": "#f4a261",
  "Right":        "#e05c2a",
  "Far Right":    "#8b1a1a",  // deep red
}
```

#### `<BiasLabelBadge label={"Left"|"Right"|"Neutral"} />`

Color-coded badge shown in search result rows.

#### `<AnnotatedArticle htmlContent={string} annotations={Annotation[]} />`

Renders the article HTML and overlays highlight spans for each annotation. Clicking a highlight opens the corresponding side-panel explanation. Uses a `<ResizablePanelGroup>` (already in the component library) to split the article body and the annotation side panel.

#### `<AccuracyDisplay score={number} label={string} />`

Displays the 0–100 numeric score with a descriptive label.

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` (updated) | Search bar + results list |
| `/analyze` | `AnalyzePage` | URL input + full analysis view |
| `/article` | `ArticlePage` | Article detail from search result click |

---

## Data Models

```ts
type BiasScaleRating =
  | "Far Left"
  | "Left"
  | "Center-Left"
  | "Center"
  | "Center-Right"
  | "Right"
  | "Far Right"

type BiasLabel = "Left" | "Right" | "Neutral"

type AccuracyGrade = "A" | "B" | "C" | "D" | "F"

type AccuracyLabel =
  | "High Accuracy"
  | "Moderate Accuracy"
  | "Low Accuracy"
  | "Unavailable"

interface SearchResult {
  title: string
  url: string
  source: string
  snippet: string
  biasLabel: BiasLabel
  accuracyGrade: AccuracyGrade
}

interface Annotation {
  phrase: string          // exact text to highlight
  explanation: string     // why this phrase is considered biased
  reason: AnnotationReason
}

type AnnotationReason =
  | "loaded-language"
  | "omits-opposing-viewpoint"
  | "publisher-profile"
  | "framing"
  | "source-selection"

interface ParsedArticle {
  title: string
  content: string         // HTML
  textContent: string     // plain text
  excerpt: string
  author: string | null
  siteName: string | null
  publishedTime: string | null
  image: string | null
}

interface BiasAnalysisResult {
  biasScale: BiasScaleRating
  accuracyScore: number
  accuracyLabel: AccuracyLabel
  annotations: Annotation[]
}

interface LabelOnlyResult {
  biasLabel: BiasLabel
  accuracyGrade: AccuracyGrade
}
```

### LLM Prompt Design

The `/api/analyze-bias` route constructs a structured prompt instructing the model to:

1. Identify the political bias position on the seven-point scale based solely on linguistic signals (loaded language, framing, source selection) and publisher profile data.
2. Estimate factual accuracy (0–100) by reasoning about claim verifiability against multiple independent sources.
3. Return a JSON object matching the `BiasAnalysisResult` schema.

The system prompt explicitly instructs the model not to inject its own political opinions and to cite specific linguistic reasons for each annotation. The response is parsed with `JSON.parse` and validated against the expected schema before being returned to the client.

---

