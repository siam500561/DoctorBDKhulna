export const siteConfig = {
  name: "DoctorBDKhulna",
  title: "DoctorBDKhulna — Find Doctors & Hospitals in Khulna",
  description:
    "Search verified doctors and trusted hospitals across Khulna. Filter by specialty, hospital, district, and availability, then book with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/favicon.png",
  keywords: [
    "doctor Khulna",
    "hospital Khulna",
    "find doctor Bangladesh",
    "Khulna medical college",
    "specialist doctor Khulna",
    "book appointment doctor",
    "Khulna healthcare",
  ],
  locale: "en_US",
}

export type SiteConfig = typeof siteConfig
