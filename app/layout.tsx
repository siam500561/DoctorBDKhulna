import { headers } from "next/headers"
import { Geist_Mono, Inter, Manrope } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { AnnouncementBar } from "@/components/layout/announcement-bar"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld"
import { siteConfig } from "@/lib/site"

const manropeHeading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  icons: { icon: "/favicon.png" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const isAdmin = headersList.get("x-admin-route") === "1"

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        manropeHeading.variable
      )}
    >
      <head>
        {convexUrl && <link rel="preconnect" href={convexUrl} />}
        {convexUrl && <link rel="dns-prefetch" href={convexUrl} />}
        {!isAdmin && <OrganizationJsonLd />}
      </head>
      <body>
        <ConvexClientProvider>
          <ThemeProvider>
            <TooltipProvider>
              {isAdmin ? (
                children
              ) : (
                <div className="flex min-h-screen flex-col">
                  <AnnouncementBar />
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              )}
              <Toaster position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
