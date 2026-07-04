import { cn } from "@/lib/utils"

interface HoverCardProps extends React.ComponentProps<"div"> {
  animate?: boolean
}

export function HoverCard({
  className,
  animate = true,
  children,
  ...props
}: HoverCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-sm transition-all duration-300",
        animate && "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
