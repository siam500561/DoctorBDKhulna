"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ImageUpload01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageDropPlaceholderProps {
  label: string
  value?: File | null
  onChange: (file: File | null) => void
  defaultPreviewUrl?: string
  aspect?: "square" | "wide"
  className?: string
}

export function ImageDropPlaceholder({
  label,
  value,
  onChange,
  defaultPreviewUrl,
  aspect = "wide",
  className,
}: ImageDropPlaceholderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const previewUrl = React.useMemo(
    () => (value ? URL.createObjectURL(value) : null),
    [value]
  )

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const displayUrl = previewUrl ?? defaultPreviewUrl

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-medium text-foreground">{label}</p>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0]
          if (file) onChange(file)
        }}
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/30 transition-colors hover:border-border hover:bg-muted/50",
          aspect === "square" ? "aspect-square w-24" : "aspect-video w-full"
        )}
      >
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayUrl}
            alt={label}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 p-4 text-center">
            <HugeiconsIcon
              icon={ImageUpload01Icon}
              strokeWidth={1.5}
              className="size-5 text-muted-foreground"
            />
            <p className="text-[0.7rem] text-muted-foreground">
              Click or drop an image
            </p>
          </div>
        )}

        {displayUrl && (
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute top-1.5 right-1.5"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            aria-label={`Remove ${label}`}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.5} />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onChange(e.target.files?.[0] ?? null)
          e.target.value = ""
        }}
      />
    </div>
  )
}
