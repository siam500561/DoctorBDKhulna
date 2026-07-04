import { Container } from "@/components/ui/container"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiPhoneIcon, MailIcon, Clock01Icon } from "@hugeicons/core-free-icons"

const announcements = [
  {
    icon: AiPhoneIcon,
    label: "Emergency",
    value: "+880 1XXX-XXXXXX",
  },
  {
    icon: MailIcon,
    label: "Email",
    value: "info@doctorbdkhulna.com",
  },
  {
    icon: Clock01Icon,
    label: "Working Hours",
    value: "Sun - Fri: 8:00 AM - 10:00 PM",
  },
]

export function AnnouncementBar() {
  return (
    <div className="bg-primary">
      <Container>
        <div className="flex h-9 items-center justify-between text-xs text-primary-foreground">
          <div className="flex items-center gap-4 md:gap-6">
            {announcements.map((item) => (
              <div
                key={item.label}
                className="hidden items-center gap-1.5 sm:flex"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  strokeWidth={1.5}
                  className="size-3.5 shrink-0 text-primary-foreground"
                />
                <span className="whitespace-nowrap">
                  <span className="font-medium text-primary-foreground">
                    {item.label}:
                  </span>{" "}
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="ml-auto hidden text-xs font-medium text-primary-foreground sm:block">
            24/7 Emergency Service Available
          </div>
        </div>
      </Container>
    </div>
  )
}
