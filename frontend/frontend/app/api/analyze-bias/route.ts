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

const SYSTEM_PROMPT_BASE = `You are a neutral political bias and factual accuracy analyst. Your role is to evaluate news articles objectively.

CRITICAL RULES:
1. Base ALL political bias determinations SOLELY on verifiable linguistic signals (loaded language, framing, source selection) and publicly available publisher profile data.
2. Do NOT incorporate your own political opinions, preferences, or beliefs into any rating or annotation.
3. Treat all political positions equally — apply the same analytical rigor to left-leaning and right-leaning content.
4. For every annotation, you MUST cite the specific linguistic or factual reason for flagging a phrase.`

const LABEL_ONLY_PROMPT = `${SYSTEM_PROMPT_BASE}

Analyze the provided article and return a JSON object with exactly these fields:
- "biasLabel": one of "Left", "Right", or "Neutral"
- "accuracyGrade": one of "A", "B", "C", "D", or "F"

Return ONLY valid JSON with no additional text.`

const FULL_ANALYSIS_PROMPT = `${SYSTEM_PROMPT_BASE}

Analyze the provided article and return a JSON object with exactly these fields:
- "biasScale": one of "Far Left", "Left", "Center-Left", "Center", "Center-Right", "Right", "Far Right"
- "accuracyScore": a number between 0 and 100
- "accuracyLabel": one of "High Accuracy", "Moderate Accuracy", "Low Accuracy", or "Unavailable"
- "annotations": an array of objects, each with:
  - "phrase": the exact word or phrase from the article
  - "explanation": specific explanation of why this phrase is biased
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
      // Strip markdown code fences if Claude wraps the response
      const cleaned = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()
      parsed = JSON.parse(cleaned)
    } catch {
      console.error("Failed to parse Bedrock JSON response:", rawContent)
      return NextResponse.json({ error: "Failed to parse JSON response from Bedrock" }, { status: 500 })
    }

    if (mode === "label-only") {
      if (!validateLabelOnlyResult(parsed))
        return NextResponse.json({ error: "Bedrock response did not match expected schema" }, { status: 500 })
      return NextResponse.json(parsed satisfies LabelOnlyResult)
    }

    if (!validateFullResult(parsed))
      return NextResponse.json({ error: "Bedrock response did not match expected schema" }, { status: 500 })
    return NextResponse.json(parsed satisfies BiasAnalysisResult)
  } catch (error) {
    console.error("Unexpected error in /api/analyze-bias:", error)
    return NextResponse.json({ error: "An unexpected error occurred while analyzing bias." }, { status: 500 })
  }
}
