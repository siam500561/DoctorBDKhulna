"use client"

import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { StethoscopeIcon } from "@hugeicons/core-free-icons"

export interface CategoryOption {
  value: string
  label: string
  count: number
}

interface CategorySidebarProps {
  categories: CategoryOption[]
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function CategorySidebar({
  categories,
  activeCategory,
  onCategoryChange,
}: CategorySidebarProps) {
  return (
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
            <span>Popular Doctors</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                activeCategory === cat.value
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <HugeiconsIcon
                icon={StethoscopeIcon}
                strokeWidth={1.5}
                className="size-4 shrink-0 opacity-60"
              />
              <span className="flex-1 text-left">{cat.label}</span>
              <span className="text-xs text-muted-foreground/70">
                {cat.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
