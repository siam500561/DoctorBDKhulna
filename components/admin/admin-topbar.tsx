"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { AdminNavLinks } from "@/components/admin/admin-nav-links"
import LogoutButton from "@/components/admin/logout-button"
import { ThemeToggle } from "@/components/layout/theme-toggle"

interface AdminTopbarProps {
  email?: string
}

export function AdminTopbar({ email }: AdminTopbarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden" />}
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={1.5} className="size-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-border px-6 py-4">
              <SheetTitle>
                <Link
                  href="/admin"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                    D
                  </span>
                  <span className="font-heading text-base font-semibold text-foreground">
                    DoctorBD Admin
                  </span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-1 flex-col px-3 py-4">
              <AdminNavLinks onNavigate={() => setOpen(false)} />
              <Separator className="my-4" />
              <div className="px-1">
                <LogoutButton className="w-full" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <span className="font-heading text-sm font-semibold text-foreground md:hidden">
          DoctorBD Admin
        </span>
      </div>

      <div className="flex items-center gap-2">
        {email && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {email}
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
