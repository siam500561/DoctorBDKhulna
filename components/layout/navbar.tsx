"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { MobileNav } from "@/components/layout/mobile-nav"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/hospitals", label: "Hospitals" },
]

export function Navbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-background"
      )}
    >
      <Container>
        <div className="flex h-13 items-center justify-between gap-4 md:h-14">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/favicon.png"
              alt="DoctorBDKhulna"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {!isAdmin && (
            <nav className="hidden items-center gap-0.5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[0.8rem] font-medium transition-colors",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {!isAdmin && <MobileNav />}
          </div>
        </div>
      </Container>
    </header>
  )
}
