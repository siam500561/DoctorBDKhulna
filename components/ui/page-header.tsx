import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string
  description?: string
  centered?: boolean
}

export function PageHeader({
  title,
  description,
  centered = true,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-3 pt-12 pb-8 md:pt-16",
        centered && "text-center",
        className
      )}
      {...props}
    >
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
