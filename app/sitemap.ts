import type { MetadataRoute } from "next"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { siteConfig } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, hospitals] = await Promise.all([
    fetchQuery(api.doctors.listPublic).catch(() => []),
    fetchQuery(api.hospitals.listPublic).catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/doctors`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/hospitals`, changeFrequency: "daily", priority: 0.9 },
  ]

  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((doctor) => ({
    url: `${siteConfig.url}/doctors/${doctor.slug}`,
    lastModified: new Date(doctor._creationTime),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const hospitalRoutes: MetadataRoute.Sitemap = hospitals.map((hospital) => ({
    url: `${siteConfig.url}/hospitals/${hospital.slug}`,
    lastModified: new Date(hospital._creationTime),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticRoutes, ...doctorRoutes, ...hospitalRoutes]
}
