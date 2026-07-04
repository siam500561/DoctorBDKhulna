"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { CategorySidebar } from "@/components/home/category-sidebar"
import { DoctorList } from "@/components/home/doctor-list"
import { doctors } from "@/components/home/data"

export function DoctorDirectory() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  )

  const filtered = activeCategory
    ? doctors.filter((doctor) => doctor.specialty === activeCategory)
    : doctors

  return (
    <section id="doctor-directory" className="scroll-mt-20 bg-background">
      <Container>
        <div className="py-12 md:py-16">
          <div className="mb-8 max-w-2xl">
            <p className="mb-1.5 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Doctor Directory
            </p>
            <h2 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
              Find your doctor
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Browse verified doctors by specialty and book with confidence.
            </p>
          </div>

          <div className="flex gap-8 lg:gap-12">
            <CategorySidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <main className="min-w-0 flex-1">
              <DoctorList
                doctors={filtered}
                title={activeCategory ?? "Popular Doctors"}
              />
            </main>
          </div>
        </div>
      </Container>
    </section>
  )
}
