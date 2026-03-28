import { BIAS_COLORS, BIAS_SCALE_RATINGS } from "@/lib/bias-constants"
import type { BiasScaleRating } from "@/lib/bias-types"

interface BiasScaleBarProps {
  rating: BiasScaleRating
}

export function BiasScaleBar({ rating }: BiasScaleBarProps) {
  return (
    <div className="w-full">
      {/* Segments */}
      <div className="flex w-full rounded overflow-hidden h-6">
        {BIAS_SCALE_RATINGS.map((r) => (
          <div
            key={r}
            className="flex-1"
            style={{ backgroundColor: BIAS_COLORS[r] }}
          />
        ))}
      </div>

      {/* Labels + marker row */}
      <div className="flex w-full mt-1">
        {BIAS_SCALE_RATINGS.map((r) => (
          <div key={r} className="flex-1 flex flex-col items-center gap-0.5">
            {r === rating && (
              <div className="w-2 h-2 rounded-full bg-white border-2 border-gray-800" />
            )}
            <span
              className="text-[9px] leading-tight text-center text-gray-600 dark:text-gray-400 select-none"
              style={{ wordBreak: "break-word" }}
            >
              {r}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
