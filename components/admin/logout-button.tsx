"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout03Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
  className?: string
  iconOnly?: boolean
}

export default function LogoutButton({
  className,
  iconOnly,
}: LogoutButtonProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/sign-out", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  if (iconOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        disabled={isLoading}
        aria-label="Sign out"
        className={cn("w-full", className)}
      >
        <HugeiconsIcon icon={Logout03Icon} strokeWidth={1.5} />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn("gap-2", className)}
    >
      <HugeiconsIcon icon={Logout03Icon} strokeWidth={1.5} className="size-4" />
      {isLoading ? "Signing out..." : "Sign Out"}
    </Button>
  )
}
