import Link from "next/link"
import Image from "next/image"
import { fetchQuery } from "convex/nextjs"
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiPhoneIcon, MapPinIcon } from "@hugeicons/core-free-icons"
import { specialtyLabel } from "@/components/admin/specialties"
import { api } from "@/convex/_generated/api"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "All Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/contact", label: "Contact" },
]

export async function Footer() {
  const [doctors, hospitals] = await Promise.all([
    fetchQuery(api.doctors.listPublic).catch(() => []),
    fetchQuery(api.hospitals.listPublic).catch(() => []),
  ])

  const specialties = Array.from(
    new Set(doctors.map((d) => d.specialty))
  )
    .slice(0, 10)
    .map((value) => ({ value, label: specialtyLabel(value) }))

  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="grid gap-10 py-12 md:py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/favicon.png"
                alt="DoctorBDKhulna"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Find trusted doctors in Khulna. Book appointments and
              access quality healthcare.
            </p>
            <div className="mt-5 space-y-2">
              <a
                href="tel:+8801XXXXXXXXX"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon
                  icon={AiPhoneIcon}
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0 opacity-60"
                />
                +880 1XXX-XXXXXX
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon
                  icon={MapPinIcon}
                  strokeWidth={1.5}
                  className="mt-0.5 size-3.5 shrink-0 opacity-60"
                />
                Khulna, Bangladesh
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Links
            </h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {specialties.length > 0 && (
            <div className="lg:col-span-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Specialties
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                {specialties.map((cat) => (
                  <li key={cat.value}>
                    <Link
                      href={`/doctors?specialty=${cat.value}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hospitals.length > 0 && (
            <div className="lg:col-span-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Hospitals
              </h3>
              <ul className="mt-3 space-y-2">
                {hospitals.slice(0, 6).map((h) => (
                  <li key={h._id}>
                    <Link
                      href={`/hospitals?hospital=${encodeURIComponent(h.name)}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {h.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
                  Emergency
                </p>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="mt-1 block text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  +880 1XXX-XXXXXX
                </a>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between py-5 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DoctorBDKhulna</p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
