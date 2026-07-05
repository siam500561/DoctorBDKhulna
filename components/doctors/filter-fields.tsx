"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { genderLabels, availabilityLabels } from "@/lib/labels"
import { experienceRanges, feeRanges } from "@/lib/filter-ranges"
import type {
  DoctorFilterArrayKey,
  DoctorFilterState,
} from "@/hooks/use-doctor-filters"

interface SpecialtyOption {
  value: string
  label: string
}

interface FilterFieldsProps {
  filters: DoctorFilterState
  onToggle: (key: DoctorFilterArrayKey, value: string) => void
  specialtyOptions: SpecialtyOption[]
  hospitalOptions: string[]
}

function CheckboxGroup({
  filterKey,
  values,
  options,
  onToggle,
}: {
  filterKey: DoctorFilterArrayKey
  values: string[]
  options: { value: string; label: string }[]
  onToggle: (key: DoctorFilterArrayKey, value: string) => void
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => {
        const id = `${filterKey}-${option.value}`
        return (
          <div key={option.value} className="flex items-center gap-2.5">
            <Checkbox
              id={id}
              checked={values.includes(option.value)}
              onCheckedChange={() => onToggle(filterKey, option.value)}
            />
            <Label htmlFor={id} className="font-normal text-foreground">
              {option.label}
            </Label>
          </div>
        )
      })}
    </div>
  )
}

export function FilterFields({
  filters,
  onToggle,
  specialtyOptions,
  hospitalOptions,
}: FilterFieldsProps) {
  return (
    <Accordion
      multiple
      defaultValue={["category", "hospital"]}
      className="rounded-none border-none"
    >
      <AccordionItem value="category">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Category
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
            <CheckboxGroup
              filterKey="categories"
              values={filters.categories}
              options={specialtyOptions}
              onToggle={onToggle}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="hospital">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Hospital
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <CheckboxGroup
            filterKey="hospitals"
            values={filters.hospitals}
            options={hospitalOptions.map((h) => ({ value: h, label: h }))}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="gender">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Gender
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <CheckboxGroup
            filterKey="genders"
            values={filters.genders}
            options={Object.entries(genderLabels).map(([value, label]) => ({
              value,
              label,
            }))}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="availability">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Availability
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <CheckboxGroup
            filterKey="availability"
            values={filters.availability}
            options={Object.entries(availabilityLabels).map(
              ([value, label]) => ({ value, label })
            )}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="experience">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Years of Experience
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <CheckboxGroup
            filterKey="experienceRanges"
            values={filters.experienceRanges}
            options={experienceRanges.map((r) => ({
              value: r.label,
              label: r.label,
            }))}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fee">
        <AccordionTrigger className="px-0 py-3 text-sm">
          Consultation Fee
        </AccordionTrigger>
        <AccordionContent className="px-0">
          <CheckboxGroup
            filterKey="feeRanges"
            values={filters.feeRanges}
            options={feeRanges.map((r) => ({ value: r.label, label: r.label }))}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
