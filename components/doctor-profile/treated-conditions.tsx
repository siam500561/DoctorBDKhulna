import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

interface TreatedConditionsProps {
  conditions: string[]
}

export function TreatedConditions({ conditions }: TreatedConditionsProps) {
  return (
    <section aria-labelledby="treated-conditions-heading">
      <h2
        id="treated-conditions-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        Treated Conditions
      </h2>
      <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {conditions.map((condition) => (
          <li key={condition} className="flex items-start gap-2 text-sm">
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="mt-0.5 size-3.5 shrink-0 text-primary"
            />
            <span className="text-muted-foreground">{condition}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
