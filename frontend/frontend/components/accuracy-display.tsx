import { AccuracyLabel } from "@/lib/bias-types"

const colorMap: Record<AccuracyLabel, string> = {
  "High Accuracy": "text-green-600",
  "Moderate Accuracy": "text-amber-500",
  "Low Accuracy": "text-red-600",
  "Unavailable": "text-gray-400",
}

interface AccuracyDisplayProps {
  score: number
  label: AccuracyLabel
}

export function AccuracyDisplay({ score, label }: AccuracyDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-3xl font-bold ${colorMap[label]}`}>
        {label === "Unavailable" ? "—" : score}
      </span>
      <span className={`text-sm font-medium ${colorMap[label]}`}>{label}</span>
    </div>
  )
}
