import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { UserSearch01Icon } from "@hugeicons/core-free-icons"

interface DoctorsEmptyStateProps {
  onClearFilters: () => void
}

export function DoctorsEmptyState({ onClearFilters }: DoctorsEmptyStateProps) {
  return (
    <EmptyState
      icon={UserSearch01Icon}
      title="No doctors found."
      description="Try adjusting or clearing your filters to see more results."
      action={
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      }
      className="rounded-xl border border-dashed border-border/60"
    />
  )
}
