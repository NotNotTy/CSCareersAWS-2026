# Requirements Document

## Introduction

The Political Bias Detector is a web application built on top of the existing Next.js "The Daily Chronicle" frontend. It provides two core experiences:

1. **Search Tab (Home Page)**: A search bar that queries Google, scrapes results, and displays them as a scrollable list with per-article bias labels (Left / Right / Neutral) and a factual accuracy grade.
2. **Analyze Tab (Sub-page)**: A URL input where users paste a specific article link. The system fetches and displays the article, runs an AI analysis, returns a 0–100 factual accuracy score, assigns a political bias rating on a consistent spectrum (Far Left → Left → Center-Left → Center → Center-Right → Right → Far Right), and annotates politically biased words/phrases inline with side-panel explanations.

The bias spectrum scale is identical across both tabs to ensure consistency.

---

## Glossary

- **Bias_Detector**: The overall web application system described in this document.
- **Search_Engine**: The server-side component that queries Google and returns a ranked list of article results.
- **Article_Fetcher**: The server-side component that retrieves and parses the full text of an article from a URL (extends the existing `/api/parse-article` route).
- **Bias_Analyzer**: The AI-powered component that evaluates political bias in article text.
- **Accuracy_Scorer**: The component that computes a 0–100 factual accuracy score by comparing an article against other sources on the same topic.
- **Annotator**: The component that identifies politically biased words/phrases in article text and produces inline highlight annotations with explanations.
- **Bias_Scale**: The seven-point political spectrum used consistently throughout the application: Far Left, Left, Center-Left, Center, Center-Right, Right, Far Right.
- **Bias_Label**: A simplified three-value label (Left, Right, Neutral) shown in search result listings.
- **Search_Result**: A single item returned by the Search_Engine, containing title, URL, source name, snippet, Bias_Label, and accuracy grade.
- **Annotation**: A highlighted word or phrase in the article body paired with a side-panel explanation of why it is considered politically biased.
- **Publisher_Profile**: Publicly available data about a news outlet's historical political leaning used as one signal in bias analysis.

---

## Requirements

### Requirement 1: Search Bar and Google Results

**User Story:** As a reader, I want to search for news topics and see results with bias labels, so that I can quickly assess the political slant of articles before clicking.

#### Acceptance Criteria

1. THE Bias_Detector SHALL display a prominent search bar on the home page.
2. WHEN a user submits a search query, THE Search_Engine SHALL retrieve the top 10 article results from Google for that query.
3. WHEN search results are returned, THE Bias_Detector SHALL display them as a scrollable list in a layout similar to Google Search results (title, source, URL snippet, excerpt).
4. WHEN search results are displayed, THE Bias_Detector SHALL show a Bias_Label (Left, Right, or Neutral) as a color-coded badge next to each article title.
5. WHEN search results are displayed, THE Bias_Detector SHALL show a letter-grade accuracy indicator (A–F) as a subtext beneath each article title.
6. IF the Search_Engine fails to retrieve results, THEN THE Bias_Detector SHALL display an error message describing the failure and prompt the user to retry.
7. WHILE a search is in progress, THE Bias_Detector SHALL display a loading indicator in place of the results list.

---

### Requirement 2: Article View with Bias Annotations

**User Story:** As a reader, I want to click a search result and read the full article with political bias highlighted inline, so that I can understand exactly which parts of the article are biased.

#### Acceptance Criteria

1. WHEN a user clicks a Search_Result, THE Bias_Detector SHALL navigate to an article detail view displaying the full article text.
2. WHEN the article detail view loads, THE Bias_Analyzer SHALL analyze the article text and produce a set of Annotations.
3. WHEN Annotations are available, THE Annotator SHALL highlight each biased word or phrase within the article body using a visually distinct color.
4. WHEN a highlighted phrase is present, THE Bias_Detector SHALL display a corresponding side-panel explanation describing why that phrase is considered politically biased.
5. WHEN the article detail view loads, THE Bias_Detector SHALL display the article's Bias_Scale rating using the consistent seven-point spectrum (Far Left → Left → Center-Left → Center → Center-Right → Right → Far Right).
6. WHILE the Bias_Analyzer is processing, THE Bias_Detector SHALL display a loading state within the article view.
7. IF the Article_Fetcher cannot retrieve the article content, THEN THE Bias_Detector SHALL display an error message and provide a link to the original URL.

---

### Requirement 3: Consistent Bias Scale

**User Story:** As a reader, I want the political bias scale to look and behave the same everywhere in the app, so that I can compare ratings across different views without confusion.

#### Acceptance Criteria

1. THE Bias_Detector SHALL use the Bias_Scale (Far Left, Left, Center-Left, Center, Center-Right, Right, Far Right) as the sole political spectrum representation across all views.
2. THE Bias_Detector SHALL render the Bias_Scale as a visual spectrum bar with the article's rating position marked consistently in both the search results detail view and the Analyze tab.
3. WHEN a Bias_Scale rating is displayed, THE Bias_Detector SHALL use the same color coding for each position on the spectrum in every view (e.g., Far Left = deep blue, Far Right = deep red, Center = gray).

---

### Requirement 4: Article URL Analysis Tab

**User Story:** As a reader, I want to paste a specific article URL and receive a detailed bias and accuracy report, so that I can fact-check any article I encounter.

#### Acceptance Criteria

1. THE Bias_Detector SHALL provide a dedicated "Analyze" tab or page separate from the home search page.
2. WHEN a user submits a URL in the Analyze tab, THE Article_Fetcher SHALL retrieve and parse the article content from that URL.
3. WHEN the article content is retrieved, THE Accuracy_Scorer SHALL compute a factual accuracy score between 0 and 100 by comparing the article's claims against other published sources on the same topic.
4. WHEN the accuracy score is computed, THE Bias_Detector SHALL display it as a numeric value (0–100) with a descriptive label (e.g., "High Accuracy", "Moderate Accuracy", "Low Accuracy").
5. WHEN the article content is retrieved, THE Bias_Analyzer SHALL determine the article's political bias using publisher profile data and linguistic analysis of the article text.
6. WHEN the bias analysis is complete, THE Bias_Detector SHALL display the result on the Bias_Scale spectrum.
7. WHEN the article content is retrieved, THE Bias_Detector SHALL display the full article text in a dedicated reading box positioned below the analysis results.
8. WHEN the article is displayed in the reading box, THE Annotator SHALL highlight each politically biased word or phrase inline and display side-panel annotations explaining each highlight.
9. IF the Article_Fetcher cannot retrieve content from the submitted URL, THEN THE Bias_Detector SHALL display a descriptive error message and allow the user to submit a different URL.
10. IF the Accuracy_Scorer cannot find sufficient comparison sources, THEN THE Bias_Detector SHALL display a message indicating that accuracy scoring is unavailable for this article.

---

### Requirement 5: AI Neutrality and Factual Grounding

**User Story:** As a reader, I want the AI analysis to be politically neutral and fact-based, so that I can trust the ratings are not themselves biased.

#### Acceptance Criteria

1. THE Bias_Analyzer SHALL base political bias determinations solely on verifiable linguistic signals (loaded language, framing, source selection) and publicly available Publisher_Profile data.
2. THE Bias_Analyzer SHALL not incorporate the AI model's own political opinions or preferences into any rating or annotation.
3. WHEN generating an Annotation explanation, THE Bias_Analyzer SHALL cite the specific linguistic or factual reason for flagging a phrase (e.g., "emotionally loaded term", "omits opposing viewpoint", "publisher historically rated Left-leaning by independent media monitors").
4. THE Accuracy_Scorer SHALL compare article claims only against multiple independent published sources and SHALL NOT treat any single source as the ground truth.

---

### Requirement 6: Article Parsing

**User Story:** As a developer, I want the system to reliably parse article content from arbitrary URLs, so that analysis can be performed on any article the user provides.

#### Acceptance Criteria

1. WHEN a valid article URL is provided, THE Article_Fetcher SHALL extract the article title, body text, author, publication date, and source name.
2. WHEN article HTML is parsed, THE Article_Fetcher SHALL strip navigation, advertisements, and non-article content from the extracted body text.
3. IF an article URL returns a non-200 HTTP status, THEN THE Article_Fetcher SHALL return a structured error indicating the HTTP status code.
4. THE Article_Fetcher SHALL produce a plain-text representation of the article body suitable for AI analysis.
5. THE Article_Fetcher SHALL produce an HTML representation of the article body suitable for inline annotation rendering.
6. FOR ALL valid article URLs, parsing the article then re-serializing the body to plain text then re-parsing SHALL produce an equivalent body text (round-trip property).
