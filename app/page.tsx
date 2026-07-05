import type { Metadata } from "next"
import { preloadQuery } from "convex/nextjs"
import { Hero, DoctorDirectory, Hospitals } from "@/components/home"
import { api } from "@/convex/_generated/api"
import { siteConfig } from "@/lib/site"

export const revalidate = 300

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
}

export default async function Page() {
  const [preloadedDoctors, preloadedHospitals] = await Promise.all([
    preloadQuery(api.doctors.listPublic),
    preloadQuery(api.hospitals.listPublic),
  ])

  return (
    <>
      <Hero />
      <DoctorDirectory preloadedDoctors={preloadedDoctors} />
      <Hospitals preloadedHospitals={preloadedHospitals} />
    </>
  )
}
