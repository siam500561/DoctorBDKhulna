"use client"

import * as React from "react"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form"
import { slugify } from "@/lib/slugify"

/**
 * Auto-fills a slug field from a name field while creating a new record.
 * Stops auto-updating as soon as the admin manually edits the slug, and
 * never touches an existing slug while editing.
 */
export function useAutoSlug<TFieldValues extends FieldValues>(
  watch: UseFormWatch<TFieldValues>,
  setValue: UseFormSetValue<TFieldValues>,
  nameField: Path<TFieldValues>,
  slugField: Path<TFieldValues>,
  enabled: boolean
) {
  const slugTouchedRef = React.useRef(false)
  const nameValue = watch(nameField)

  React.useEffect(() => {
    if (!enabled || slugTouchedRef.current) return
    setValue(
      slugField,
      slugify(String(nameValue ?? "")) as PathValue<
        TFieldValues,
        Path<TFieldValues>
      >,
      { shouldDirty: false, shouldValidate: false }
    )
  }, [nameValue, enabled, setValue, slugField])

  const markSlugTouched = React.useCallback(() => {
    slugTouchedRef.current = true
  }, [])

  return { markSlugTouched }
}
