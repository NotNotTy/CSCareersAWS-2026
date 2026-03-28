import { BiasLabel } from "@/lib/bias-types"

const colorMap: Record<BiasLabel, string> = {
  Left: "bg-blue-100 text-blue-800",
  Right: "bg-red-100 text-red-800",
  Neutral: "bg-gray-100 text-gray-700",
}

interface BiasLabelBadgeProps {
  label: BiasLabel
}

export function BiasLabelBadge({ label }: BiasLabelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[label]}`}
    >
      {label}
    </span>
  )
}
