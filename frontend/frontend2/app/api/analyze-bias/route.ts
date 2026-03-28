import { NextRequest, NextResponse } from "next/server"
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"
import type {
  BiasAnalysisResult,
  LabelOnlyResult,
  BiasScaleRating,
  BiasLabel,
  AccuracyGrade,
  AccuracyLabel,
  AnnotationReason,
} from "@/lib/bias-types"

const MODEL_ID = "amazon.nova-lite-v1:0"
const MAX_TEXT_LENGTH = 8000

const VALID_BIAS_SCALE: BiasScaleRating[] = [
  "Far Left", "Left", "Center-Left", "Center", "Center-Right", "Right", "Far Right",
]
const VALID_BIAS_LABELS: BiasLabel[] = ["Left", "Right", "Neutral"]
const VALID_ACCURACY_GRADES: AccuracyGrade[] = ["A", "B", "C", "D", "F"]
const VALID_ACCURACY_LABELS: AccuracyLabel[] = [
  "High Accuracy", "Moderate Accuracy", "Low Accuracy", "Unavailable",
]
const VALID_ANNOTATION_REASONS: AnnotationReason[] = [
  "loaded-language", "omits-opposing-viewpoint", "publisher-profile", "framing", "source-selection",
]

const SYSTEM_PROMPT_BASE = `You are a neutral political bias and factual accuracy analyst. Your role is to evaluate news articles objectively using a strict, consistent rubric.

CRITICAL RULES:
1. Base ALL political bias determinations SOLELY on verifiable linguistic signals and publicly available publisher profile data.
2. Do NOT incorporate your own political opinions or beliefs into any rating.
3. Treat all political positions equally — apply the same rigor to left-leaning and right-leaning content.
4. Always follow the rubrics below exactly. Do not deviate.

═══════════════════════════════════════
POLITICAL BIAS RUBRIC
═══════════════════════════════════════
Score each of the following 4 dimensions (0–25 pts each), then map the total to a bias scale rating.

DIMENSION 1 — LOADED LANGUAGE (0–25 pts)
  0  pts: Entirely neutral, clinical word choices. Zero emotionally charged terms.
  1–8 pts: One or two mild adjectives but the overall tone is factual.
  9–16 pts: Noticeable use of charged language (e.g. "radical", "extremist", "regime", "woke", "socialist", "MAGA") that favors one side.
  17–25 pts: Pervasive emotionally loaded language clearly designed to provoke a partisan reaction.

DIMENSION 2 — FRAMING & OMISSION (0–25 pts)
  0  pts: Both sides represented fairly, proportionally, and with equal depth.
  1–8 pts: Very slight imbalance but opposing views are substantively present.
  9–16 pts: One perspective clearly dominates; opposing views are brief, minimized, or strawmanned.
  17–25 pts: Entirely one-sided. No meaningful representation of the opposing view.

DIMENSION 3 — SOURCE SELECTION (0–25 pts)
  0  pts: Sources are diverse, credible, and explicitly balanced across the political spectrum.
  1–8 pts: Mostly credible sources; minor ideological lean in selection.
  9–16 pts: Sources predominantly from one ideological camp, or several lack credibility.
  17–25 pts: Sources are exclusively partisan, anonymous, or unverifiable.

DIMENSION 4 — PUBLISHER PROFILE (0–25 pts)
  0  pts: Publisher is rated Center by ALL major independent monitors (AllSides, Ad Fontes, MBFC).
  1–8 pts: Publisher is rated Center-Left or Center-Right by most monitors.
  9–16 pts: Publisher is rated Left or Right by most monitors.
  17–25 pts: Publisher is rated Far Left or Far Right, or has documented history of misinformation.

IMPORTANT: Be strict. Most real-world news articles have SOME bias signal. A score of 0 should be extremely rare — reserve it only for wire service reports (AP, Reuters) with zero editorial content.

TOTAL SCORE → BIAS SCALE MAPPING:
  0–5:   Center (extremely rare — only pure wire-service reporting)
  6–15:  Center-Left or Center-Right (use linguistic signals to determine direction)
  16–30: Left or Right (use linguistic signals to determine direction)
  31–50: Far Left or Far Right (use linguistic signals to determine direction)
  51–100: Far Left or Far Right (extreme cases)

For biasLabel (label-only mode), map as follows:
  Center only → "Neutral"
  Center-Left, Center-Right → "Neutral"
  Left, Far Left → "Left"
  Right, Far Right → "Right"

═══════════════════════════════════════
ACCURACY RUBRIC
═══════════════════════════════════════
Score each of the following 4 dimensions (0–25 pts each), then map the total to an accuracy score.

DIMENSION 1 — FACTUAL VERIFIABILITY (0–25 pts)
  0  pts: All key claims are verifiable via primary sources or established facts.
  1–8 pts: Most claims are verifiable; minor unverified assertions present.
  9–16 pts: Several key claims are unverified, speculative, or rely on anonymous sources.
  17–25 pts: Core claims are unverifiable, fabricated, or directly contradict established facts.

DIMENSION 2 — HEADLINE ACCURACY (0–25 pts)
  0  pts: Headline accurately reflects the article content.
  1–8 pts: Headline is slightly sensationalized but not misleading.
  9–16 pts: Headline exaggerates or misrepresents the article content.
  17–25 pts: Headline is clickbait or directly contradicts the article body.

DIMENSION 3 — CONTEXT & COMPLETENESS (0–25 pts)
  0  pts: Full context is provided; no misleading omissions.
  1–8 pts: Minor context missing but does not materially mislead.
  9–16 pts: Important context is omitted in a way that could mislead readers.
  17–25 pts: Critical context is deliberately omitted to create a false impression.

DIMENSION 4 — TRANSPARENCY (0–25 pts)
  0  pts: Sources are named, methods are clear, corrections policy is evident.
  1–8 pts: Most sources named; minor transparency issues.
  9–16 pts: Heavy reliance on anonymous sources or unclear methodology.
  17–25 pts: No sourcing, no transparency, or publisher has documented history of corrections/retractions.

TOTAL ACCURACY SCORE = 100 − (sum of 4 dimensions)
  90–100: "High Accuracy"    → accuracyLabel: "High Accuracy"
  70–89:  "Moderate Accuracy" → accuracyLabel: "Moderate Accuracy"
  50–69:  "Low Accuracy"     → accuracyLabel: "Low Accuracy"
  0–49:   "Unavailable"      → accuracyLabel: "Unavailable"

ACCURACY GRADE MAPPING:
  90–100 → "A"
  80–89  → "B"
  70–79  → "C"
  50–69  → "D"
  0–49   → "F"`

const LABEL_ONLY_PROMPT = `${SYSTEM_PROMPT_BASE}

Apply the rubrics above and return a JSON object with exactly these fields:
- "biasLabel": one of "Left", "Right", or "Neutral"
- "accuracyGrade": one of "A", "B", "C", "D", or "F"

Return ONLY valid JSON with no additional text.`

const FULL_ANALYSIS_PROMPT = `${SYSTEM_PROMPT_BASE}

Apply the rubrics above and return a JSON object with exactly these fields:
- "biasScale": one of "Far Left", "Left", "Center-Left", "Center", "Center-Right", "Right", "Far Right"
- "accuracyScore": a number between 0 and 100 (calculated as 100 minus your accuracy penalty total)
- "accuracyLabel": one of "High Accuracy", "Moderate Accuracy", "Low Accuracy", or "Unavailable"
- "annotations": an array of objects, each with:
  - "phrase": the exact word or phrase from the article that triggered a bias flag
  - "explanation": specific explanation citing which rubric dimension and why (e.g. "Loaded Language: emotionally charged term implying wrongdoing without evidence")
  - "reason": one of "loaded-language", "omits-opposing-viewpoint", "publisher-profile", "framing", "source-selection"

Return ONLY valid JSON with no additional text.`

function buildUserMessage(title: string, textContent: string, siteName: string | null): string {
  const truncated = textContent.slice(0, MAX_TEXT_LENGTH)
  const publisherLine = siteName ? `Publisher: ${siteName}\n` : ""
  return `Article Title: ${title}\n${publisherLine}\nArticle Text:\n${truncated}`
}

function validateLabelOnlyResult(data: unknown): data is LabelOnlyResult {
  if (!data || typeof data !== "object") return false
  const obj = data as Record<string, unknown>
  return (
    VALID_BIAS_LABELS.includes(obj.biasLabel as BiasLabel) &&
    VALID_ACCURACY_GRADES.includes(obj.accuracyGrade as AccuracyGrade)
  )
}

function validateFullResult(data: unknown): data is BiasAnalysisResult {
  if (!data || typeof data !== "object") return false
  const obj = data as Record<string, unknown>
  if (!VALID_BIAS_SCALE.includes(obj.biasScale as BiasScaleRating)) return false
  if (typeof obj.accuracyScore !== "number" || obj.accuracyScore < 0 || obj.accuracyScore > 100) return false
  if (!VALID_ACCURACY_LABELS.includes(obj.accuracyLabel as AccuracyLabel)) return false
  if (!Array.isArray(obj.annotations)) return false
  for (const ann of obj.annotations) {
    if (!ann || typeof ann !== "object") return false
    const a = ann as Record<string, unknown>
    if (typeof a.phrase !== "string" || !a.phrase) return false
    if (typeof a.explanation !== "string" || !a.explanation) return false
    if (!VALID_ANNOTATION_REASONS.includes(a.reason as AnnotationReason)) return false
  }
  return true
}

function getBedrockClient() {
  return new BedrockRuntimeClient({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, textContent, siteName, mode } = body as {
      title: string
      textContent: string
      siteName: string | null
      mode: "full" | "label-only"
    }

    if (!title || typeof title !== "string")
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    if (!textContent || typeof textContent !== "string")
      return NextResponse.json({ error: "textContent is required" }, { status: 400 })
    if (mode !== "full" && mode !== "label-only")
      return NextResponse.json({ error: 'mode must be "full" or "label-only"' }, { status: 400 })

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
      return NextResponse.json({ error: "AWS credentials are not configured" }, { status: 500 })

    const client = getBedrockClient()
    const systemPrompt = mode === "label-only" ? LABEL_ONLY_PROMPT : FULL_ANALYSIS_PROMPT
    const userMessage = buildUserMessage(title, textContent, siteName)

    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: `${systemPrompt}\n\n${userMessage}` }],
          },
        ],
        inferenceConfig: { max_new_tokens: 1024, temperature: 0.1 },
      }),
    })

    const response = await client.send(command)
    const rawBody = new TextDecoder().decode(response.body)
    const bedrockData = JSON.parse(rawBody)
    const rawContent = bedrockData?.output?.message?.content?.[0]?.text

    if (!rawContent || typeof rawContent !== "string")
      return NextResponse.json({ error: "Bedrock returned an empty response" }, { status: 500 })

    let parsed: unknown
    try {
      // Strip markdown code fences (handles ```json, ``` with/without newlines)
      const cleaned = rawContent
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim()
      parsed = JSON.parse(cleaned)
    } catch {
      console.error("Failed to parse Bedrock JSON response:", rawContent)
      return NextResponse.json({ error: "Failed to parse JSON response from Bedrock" }, { status: 500 })
    }

    // Normalize the parsed object to fix casing/spacing issues from the model
    if (parsed && typeof parsed === "object") {
      const obj = parsed as Record<string, unknown>

      // Normalize biasScale
      if (typeof obj.biasScale === "string") {
        const biasMap: Record<string, BiasScaleRating> = {
          "far left": "Far Left", "farleft": "Far Left",
          "left": "Left",
          "center-left": "Center-Left", "center left": "Center-Left", "centerleft": "Center-Left",
          "center": "Center",
          "center-right": "Center-Right", "center right": "Center-Right", "centerright": "Center-Right",
          "right": "Right",
          "far right": "Far Right", "farright": "Far Right",
        }
        obj.biasScale = biasMap[obj.biasScale.toLowerCase().trim()] ?? obj.biasScale
      }

      // Normalize biasLabel
      if (typeof obj.biasLabel === "string") {
        const labelMap: Record<string, BiasLabel> = {
          "left": "Left", "far left": "Left",
          "right": "Right", "far right": "Right",
          "neutral": "Neutral", "center": "Neutral", "center-left": "Neutral", "center-right": "Neutral",
        }
        obj.biasLabel = labelMap[obj.biasLabel.toLowerCase().trim()] ?? obj.biasLabel
      }

      // Normalize accuracyGrade
      if (typeof obj.accuracyGrade === "string") {
        obj.accuracyGrade = obj.accuracyGrade.toUpperCase().trim().charAt(0)
      }

      // Normalize accuracyLabel
      if (typeof obj.accuracyLabel === "string") {
        const accMap: Record<string, AccuracyLabel> = {
          "high accuracy": "High Accuracy", "high": "High Accuracy",
          "moderate accuracy": "Moderate Accuracy", "moderate": "Moderate Accuracy",
          "low accuracy": "Low Accuracy", "low": "Low Accuracy",
          "unavailable": "Unavailable", "n/a": "Unavailable",
        }
        obj.accuracyLabel = accMap[obj.accuracyLabel.toLowerCase().trim()] ?? obj.accuracyLabel
      }

      // Normalize annotation reasons
      if (Array.isArray(obj.annotations)) {
        const reasonMap: Record<string, AnnotationReason> = {
          "loaded language": "loaded-language", "loaded-language": "loaded-language",
          "omits opposing viewpoint": "omits-opposing-viewpoint", "omits-opposing-viewpoint": "omits-opposing-viewpoint",
          "omits opposing viewpoints": "omits-opposing-viewpoint",
          "publisher profile": "publisher-profile", "publisher-profile": "publisher-profile",
          "framing": "framing", "framing & omission": "framing",
          "source selection": "source-selection", "source-selection": "source-selection",
          "factual verifiability": "framing", "factual-verifiability": "framing",
        }
        obj.annotations = obj.annotations
          .map((ann: unknown) => {
            if (ann && typeof ann === "object") {
              const a = ann as Record<string, unknown>
              if (typeof a.reason === "string") {
                a.reason = reasonMap[a.reason.toLowerCase().trim()] ?? null
              }
            }
            return ann
          })
          // Filter out annotations with unmappable reasons (e.g. "none")
          .filter((ann: unknown) => {
            if (ann && typeof ann === "object") {
              const a = ann as Record<string, unknown>
              return VALID_ANNOTATION_REASONS.includes(a.reason as AnnotationReason)
            }
            return false
          })
      }
    }

    if (mode === "label-only") {
      if (!validateLabelOnlyResult(parsed)) {
        console.error("Invalid label-only schema:", JSON.stringify(parsed))
        return NextResponse.json({ error: "Bedrock response did not match expected schema" }, { status: 500 })
      }
      return NextResponse.json(parsed satisfies LabelOnlyResult)
    }

    if (!validateFullResult(parsed)) {
      console.error("Invalid full analysis schema:", JSON.stringify(parsed))
      return NextResponse.json({ error: "Bedrock response did not match expected schema" }, { status: 500 })
    }
    return NextResponse.json(parsed satisfies BiasAnalysisResult)
  } catch (error) {
    console.error("Unexpected error in /api/analyze-bias:", error)
    return NextResponse.json({ error: "An unexpected error occurred while analyzing bias." }, { status: 500 })
  }
}
