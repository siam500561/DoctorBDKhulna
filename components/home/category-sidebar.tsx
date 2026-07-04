"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { MenuIcon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { categories } from "@/components/home/data"

interface CategorySidebarProps {
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategorySidebar({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Specialties
          </p>
          <nav className="space-y-0.5">
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                activeCategory === null
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <span>All Doctors</span>
              <span className="text-xs text-muted-foreground">
                {categories.reduce((sum, c) => sum + c.count, 0)}
              </span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onCategoryChange(cat.name)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeCategory === cat.name
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <HugeiconsIcon
                  icon={cat.icon}
                  strokeWidth={1.5}
                  className="size-4 shrink-0 opacity-60"
                />
                <span className="flex-1 text-left">{cat.name}</span>
                <span className="text-xs text-muted-foreground/70">
                  {cat.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <MobileCategoryDrawer
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </>
  )
}

function MobileCategoryDrawer({
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-muted-foreground"
      >
        <HugeiconsIcon icon={MenuIcon} strokeWidth={1.5} className="size-4" />
        Categories
        {activeCategory && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.6rem] font-medium text-foreground">
            {activeCategory}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Specialties
              </p>
              <button
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={1.5}
                  className="size-4"
                />
              </button>
            </div>
            <nav className="space-y-0.5 px-3">
              <button
                onClick={() => {
                  onCategoryChange(null)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                  activeCategory === null
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <span>All Doctors</span>
                <span className="text-xs text-muted-foreground">
                  {categories.reduce((sum, c) => sum + c.count, 0)}
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    onCategoryChange(cat.name)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    activeCategory === cat.name
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <HugeiconsIcon
                    icon={cat.icon}
                    strokeWidth={1.5}
                    className="size-4 shrink-0 opacity-60"
                  />
                  <span className="flex-1 text-left">{cat.name}</span>
                  <span className="text-xs text-muted-foreground/70">
                    {cat.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
