import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"

interface SectionProps extends React.ComponentProps<"section"> {
  containerSize?: "sm" | "md" | "lg" | "xl"
}

export function Section({
  className,
  containerSize = "lg",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)} {...props}>
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
