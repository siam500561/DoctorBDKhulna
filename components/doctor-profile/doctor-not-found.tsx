import Link from "next/link"
import { Container } from "@/components/ui/container"
import { EmptyState } from "@/components/ui/empty-state"
import { Button } from "@/components/ui/button"
import { UserSearch01Icon } from "@hugeicons/core-free-icons"

export function DoctorNotFound() {
  return (
    <Container>
      <div className="py-16">
        <EmptyState
          icon={UserSearch01Icon}
          title="Doctor not found."
          description="The doctor profile you're looking for doesn't exist or may have been removed."
          action={
            <Button nativeButton={false} render={<Link href="/doctors" />}>
              Return to Doctors
            </Button>
          }
        />
      </div>
    </Container>
  )
}
