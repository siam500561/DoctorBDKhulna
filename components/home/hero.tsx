"use client"

import * as React from "react"
import Image from "next/image"
import { Container } from "@/components/ui/container"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  SearchIcon,
  MapPinIcon,
  Hospital01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons"
import { hospitalNames } from "@/components/home/data"

const quickFilters = [
  "Medicine",
  "Cardiology",
  "Child Specialist",
  "Gynecology",
  "Orthopedics",
  "Eye",
  "Skin",
  "ENT",
]

const placeholders = [
  "Search doctor, specialty or hospital...",
  "Try “Cardiologist”",
  "Try “Khulna Medical College”",
  "Try “Dr. Ayesha Rahman”",
]

export function Hero() {
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
  const [isFocused, setIsFocused] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0)

  React.useEffect(() => {
    if (isFocused || query) return
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % placeholders.length)
    }, 2800)
    return () => clearInterval(id)
  }, [isFocused, query])

  return (
    <section className="bg-background">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 py-14 md:grid-cols-2 md:gap-8 md:py-16 lg:gap-16 lg:py-24">
          <div className="max-w-xl">
            <h1 className="font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-foreground md:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
              Find the right doctor,
              <br />
              <span className="text-primary">without the guesswork.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Search verified doctors across Bagerhat and Khulna by name,
              specialty, or hospital — and book an appointment in seconds.
            </p>

            <div className="mt-9 space-y-4">
              <div
                className={`rounded-2xl border bg-muted/40 transition-colors ${
                  isFocused
                    ? "border-primary/30 bg-muted/60"
                    : "border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <HugeiconsIcon
                    icon={SearchIcon}
                    strokeWidth={1.5}
                    className="size-5 shrink-0 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholders[placeholderIndex]}
                    className="h-6 w-full min-w-0 bg-transparent text-[0.95rem] text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center gap-2 border-t border-border/60 px-3 py-2.5 text-sm">
                  <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1.5 text-muted-foreground">
                    <HugeiconsIcon
                      icon={MapPinIcon}
                      strokeWidth={1.5}
                      className="size-4 shrink-0"
                    />
                    <select className="w-full min-w-0 appearance-none truncate bg-transparent text-foreground outline-none">
                      <option value="">Any location</option>
                      <option value="khulna">Khulna</option>
                      <option value="bagerhat">Bagerhat</option>
                    </select>
                  </div>

                  <span className="h-4 w-px shrink-0 bg-border" />

                  <div className="flex min-w-0 flex-1 items-center gap-1.5 px-1.5 text-muted-foreground">
                    <HugeiconsIcon
                      icon={Hospital01Icon}
                      strokeWidth={1.5}
                      className="size-4 shrink-0"
                    />
                    <select className="w-full min-w-0 appearance-none truncate bg-transparent text-foreground outline-none">
                      <option value="">Any hospital</option>
                      {hospitalNames.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:translate-y-px"
                  >
                    Search
                    <HugeiconsIcon
                      icon={ArrowRight02Icon}
                      strokeWidth={1.5}
                      className="size-4"
                    />
                  </button>
                </div>
              </div>

              <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() =>
                      setActiveFilter((f) => (f === filter ? null : filter))
                    }
                    className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium whitespace-nowrap transition-colors ${
                      activeFilter === filter
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-[2rem] md:aspect-square lg:aspect-[4/3.6]">
            <Image
              src="/images/home-banner.png"
              alt="Doctor consultation"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
