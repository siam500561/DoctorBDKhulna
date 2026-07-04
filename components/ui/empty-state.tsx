import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { InboxIcon } from "@hugeicons/core-free-icons"

interface EmptyStateProps extends React.ComponentProps<"div"> {
  icon?: typeof InboxIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon = InboxIcon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
      {...props}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
        <HugeiconsIcon
          icon={icon}
          strokeWidth={1.5}
          className="size-6 text-muted-foreground"
        />
      </div>
      <h3 className="font-heading text-base font-medium text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
