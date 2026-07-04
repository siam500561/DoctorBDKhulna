"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"

interface AdminFormPageProps {
  sectionLabel: string
  sectionHref: string
  title: string
  description?: string
  isDirty: boolean
  isSubmitting: boolean
  submitLabel: string
  formId: string
  children: React.ReactNode
}

export function AdminFormPage({
  sectionLabel,
  sectionHref,
  title,
  description,
  isDirty,
  isSubmitting,
  submitLabel,
  formId,
  children,
}: AdminFormPageProps) {
  const router = useRouter()
  const [showLeaveConfirm, setShowLeaveConfirm] = React.useState(false)

  React.useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [isDirty])

  const handleCancel = () => {
    if (isDirty) {
      setShowLeaveConfirm(true)
      return
    }
    router.push(sectionHref)
  }

  return (
    <div className="mx-auto max-w-3xl pb-24">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/admin" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={sectionHref} />}>
              {sectionLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="font-heading text-xl font-semibold text-foreground md:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}

      <div className="sticky bottom-0 z-30 mt-6 flex items-center justify-end gap-2 border-t border-border/60 bg-background/95 py-3 backdrop-blur-sm">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" form={formId} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>

      <ConfirmDialog
        open={showLeaveConfirm}
        onOpenChange={setShowLeaveConfirm}
        title="Discard unsaved changes?"
        description="You have unsaved changes. If you leave now, they will be lost."
        confirmLabel="Discard"
        onConfirm={() => router.push(sectionHref)}
      />
    </div>
  )
}
