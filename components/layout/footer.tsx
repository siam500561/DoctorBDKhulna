import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Separator } from "@/components/ui/separator"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiPhoneIcon, MapPinIcon } from "@hugeicons/core-free-icons"
import { categories, hospitals } from "@/components/home/data"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "All Doctors" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/contact", label: "Contact" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="grid gap-10 py-12 md:py-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                D
              </span>
              <span className="font-heading text-sm font-semibold text-foreground">
                DoctorBD
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Find trusted doctors in Bagerhat and Khulna. Book appointments and
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
                Bagerhat, Khulna, Bangladesh
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

          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Specialties
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {categories.slice(0, 10).map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/doctors?specialty=${cat.name}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Hospitals
            </h3>
            <ul className="mt-3 space-y-2">
              {hospitals.map((h) => (
                <li key={h.id}>
                  <Link
                    href={`/hospitals/${h.id}`}
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
        </div>

        <Separator />

        <div className="flex items-center justify-between py-5 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DoctorBD</p>
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
