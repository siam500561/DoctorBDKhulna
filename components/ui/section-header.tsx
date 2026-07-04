import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  centered?: boolean
  badge?: string
}

export function SectionHeader({
  title,
  description,
  centered = true,
  badge,
  className,
  children,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 space-y-3 md:mb-12",
        centered && "text-center",
        className
      )}
      {...props}
    >
      {badge && (
        <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          {badge}
        </span>
      )}
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
