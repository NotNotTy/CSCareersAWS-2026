import type { BiasScaleRating } from "./bias-types"

export const BIAS_COLORS: Record<BiasScaleRating, string> = {
  "Far Left":     "#1a3a6b",
  "Left":         "#3b6dbf",
  "Center-Left":  "#7aaee8",
  "Center":       "#9ca3af",
  "Center-Right": "#f4a261",
  "Right":        "#e05c2a",
  "Far Right":    "#8b1a1a",
}

export const BIAS_SCALE_RATINGS: BiasScaleRating[] = [
  "Far Left",
  "Left",
  "Center-Left",
  "Center",
  "Center-Right",
  "Right",
  "Far Right",
]
