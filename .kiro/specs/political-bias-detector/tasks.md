# Implementation Plan: Political Bias Detector

## Overview

Extend the existing Next.js "The Daily Chronicle" app with a search-based bias detection tab and a URL-based article analysis page. All AI calls are server-side. Shared components ensure a consistent bias scale across all views.

## Tasks

- [x] 1. Define shared types and constants
  - Create `frontend/frontend/lib/bias-types.ts` with all shared TypeScript types: `BiasScaleRating`, `BiasLabel`, `AccuracyGrade`, `AccuracyLabel`, `SearchResult`, `Annotation`, `AnnotationReason`, `ParsedArticle`, `BiasAnalysisResult`, `LabelOnlyResult`
  - Create `frontend/frontend/lib/bias-constants.ts` with `BIAS_COLORS` record and `BIAS_SCALE_RATINGS` ordered array
  - _Requirements: 3.1, 3.3_

- [x] 2. Build shared UI components
  - [x] 2.1 Implement `<BiasScaleBar>` component
    - Create `frontend/frontend/components/bias-scale-bar.tsx`
    - Render a horizontal spectrum bar with seven labeled segments using `BIAS_COLORS`
    - Show a marker/indicator at the given `BiasScaleRating` position
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 2.2 Write property test for BiasScaleBar color consistency
    - **Property 1: Every BiasScaleRating maps to a unique color**
    - **Validates: Requirements 3.3**

  - [x] 2.3 Implement `<BiasLabelBadge>` component
    - Create `frontend/frontend/components/bias-label-badge.tsx`
    - Render a color-coded badge for `"Left" | "Right" | "Neutral"`
    - _Requirements: 1.4_

  - [x] 2.4 Implement `<AccuracyDisplay>` component
    - Create `frontend/frontend/components/accuracy-display.tsx`
    - Display numeric score (0–100) and descriptive label
    - _Requirements: 4.4_

  - [x] 2.5 Implement `<AnnotatedArticle>` component
    - Create `frontend/frontend/components/annotated-article.tsx`
    - Accept `htmlContent` and `annotations` props
    - Wrap matched phrases in highlight `<span>` elements
    - Use `ResizablePanelGroup` to split article body and annotation side panel
    - Clicking a highlight selects the corresponding annotation in the side panel
    - _Requirements: 2.3, 2.4, 4.8_

  - [ ]* 2.6 Write unit tests for AnnotatedArticle phrase matching
    - Test that all annotation phrases are highlighted in the rendered HTML
    - Test that overlapping or missing phrases are handled gracefully
    - _Requirements: 2.3_

- [x] 3. Extend `/api/parse-article` to return `textContent`
  - In `frontend/frontend/app/api/parse-article/route.ts`, add `textContent: article.textContent` to the JSON response alongside the existing `content` field
  - Update the return type to include `textContent: string`
  - _Requirements: 6.1, 6.4, 6.5_

  - [ ]* 3.1 Write property test for parse-article round-trip
    - **Property 2: Parsing an article, extracting textContent, and re-parsing produces equivalent body text**
    - **Validates: Requirements 6.6**

- [x] 4. Implement `/api/analyze-bias` route
  - Create `frontend/frontend/app/api/analyze-bias/route.ts`
  - Accept `{ title, textContent, siteName, mode }` in the POST body
  - Build a structured system prompt instructing the LLM to base ratings only on linguistic signals and publisher profile data, not its own opinions
  - For `mode="label-only"`: return `{ biasLabel, accuracyGrade }`
  - For `mode="full"`: return `{ biasScale, accuracyScore, accuracyLabel, annotations[] }`
  - Parse and validate the LLM JSON response before returning; return a 500 with a descriptive error if parsing fails
  - _Requirements: 2.2, 4.3, 4.5, 5.1, 5.2, 5.3, 5.4_

  - [ ]* 4.1 Write property test for analyze-bias response schema
    - **Property 3: Every full-mode response contains a valid BiasScaleRating, accuracyScore in [0,100], and a non-empty annotations array**
    - **Validates: Requirements 4.3, 4.5, 5.1**

  - [ ]* 4.2 Write property test for label-only mode
    - **Property 4: Every label-only response contains a BiasLabel and AccuracyGrade drawn from their respective allowed value sets**
    - **Validates: Requirements 1.4, 1.5**

- [x] 5. Implement `/api/search` route
  - Create `frontend/frontend/app/api/search/route.ts`
  - Accept `{ query: string }` in the POST body
  - Call the Google Custom Search JSON API to retrieve the top 10 results
  - For each result, call `/api/analyze-bias` with `mode="label-only"` to attach `biasLabel` and `accuracyGrade`
  - Return `{ results: SearchResult[] }`
  - Return a structured error response if the Google API call fails
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 5.1 Write unit tests for `/api/search` error handling
    - Test that a Google API failure returns a descriptive error JSON with appropriate HTTP status
    - _Requirements: 1.6_

- [x] 6. Checkpoint — Ensure all API routes and shared components compile without errors
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update home page (`/`) with search tab UI
  - Replace the static content in `frontend/frontend/app/page.tsx` with a search bar and results list
  - Add a tab bar with "Search" and "Analyze" tabs (Analyze tab links to `/analyze`)
  - On submit, POST to `/api/search` and render the returned `SearchResult[]` as a scrollable list
  - Each result row shows: title, source, URL, snippet, `<BiasLabelBadge>`, and accuracy grade
  - Show a loading spinner while the search is in progress
  - Show an error message with a retry prompt if the search fails
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 8. Implement `/article` page
  - Create `frontend/frontend/app/article/page.tsx`
  - Read the `url` query parameter from the URL
  - On mount, POST to `/api/parse-article` then POST to `/api/analyze-bias` with `mode="full"`
  - Display a loading state while both calls are in progress
  - Render `<BiasScaleBar>` with the returned `biasScale`
  - Render `<AccuracyDisplay>` with `accuracyScore` and `accuracyLabel`
  - Render `<AnnotatedArticle>` with the article HTML and annotations
  - If article fetching fails, show an error message and a link to the original URL
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [x] 9. Implement `/analyze` page
  - Create `frontend/frontend/app/analyze/page.tsx`
  - Render a URL input form
  - On submit, POST to `/api/parse-article` then POST to `/api/analyze-bias` with `mode="full"`
  - Display a loading state while processing
  - Render `<BiasScaleBar>`, `<AccuracyDisplay>`, and `<AnnotatedArticle>` with results
  - If article fetching fails, show a descriptive error and allow re-submission
  - If accuracy scoring is unavailable (`accuracyLabel === "Unavailable"`), display the unavailability message
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

- [x] 10. Wire search results to article detail page
  - In the home page search results list, make each result title a link to `/article?url=<encoded-url>`
  - Ensure the `<BiasScaleBar>` shown on the `/article` page uses the same `BIAS_COLORS` constant as the search result badges
  - _Requirements: 2.1, 3.1, 3.2, 3.3_

- [x] 11. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- OpenAI and Google Custom Search API keys must be set as environment variables (`OPENAI_API_KEY`, `GOOGLE_CSE_API_KEY`, `GOOGLE_CSE_ID`)
