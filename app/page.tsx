"use client"

import * as React from "react"
import { Container } from "@/components/ui/container"
import { Hero, CategorySidebar, DoctorList, Hospitals } from "@/components/home"

export default function Page() {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null
  )

  return (
    <>
      <Hero />

      <Container>
        <div className="flex gap-8 py-10 md:py-14 lg:gap-12">
          <CategorySidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <main className="min-w-0 flex-1">
            <DoctorList activeCategory={activeCategory} />
          </main>
        </div>
      </Container>

      <Hospitals />
    </>
  )
}
