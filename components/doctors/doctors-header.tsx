import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface DoctorsHeaderProps {
  from: number
  to: number
  total: number
}

export function DoctorsHeader({ from, to, total }: DoctorsHeaderProps) {
  return (
    <div className="py-8 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Doctors</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Find Your Doctor
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Browse verified doctors across Khulna, filtered your way.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {total > 0
          ? `Showing ${from}–${to} of ${total} Doctors`
          : "No doctors found"}
      </p>
    </div>
  )
}
