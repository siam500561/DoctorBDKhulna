"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  categories,
  hospitalNames,
  genders,
  availabilityOptions,
  experienceRanges,
  feeRanges,
} from "@/components/home/data"
import type {
  DoctorFilterKey,
  DoctorFilterState,
} from "@/hooks/use-doctor-filters"

interface FilterFieldsProps {
  filters: DoctorFilterState
  onToggle: (key: DoctorFilterKey, value: string) => void
}

function CheckboxGroup({
  filterKey,
  values,
  options,
  onToggle,
}: {
  filterKey: DoctorFilterKey
  values: string[]
  options: string[]
  onToggle: (key: DoctorFilterKey, value: string) => void
}) {
  return (
    <div className="space-y-2.5">
      {options.map((option) => {
        const id = `${filterKey}-${option}`
        return (
          <div key={option} className="flex items-center gap-2.5">
            <Checkbox
              id={id}
              checked={values.includes(option)}
              onCheckedChange={() => onToggle(filterKey, option)}
            />
            <Label htmlFor={id} className="font-normal text-foreground">
              {option}
            </Label>
          </div>
        )
      })}
    </div>
  )
}

export function FilterFields({ filters, onToggle }: FilterFieldsProps) {
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
            {categories.map((cat) => {
              const id = `categories-${cat.name}`
              return (
                <div key={cat.name} className="flex items-center gap-2.5">
                  <Checkbox
                    id={id}
                    checked={filters.categories.includes(cat.name)}
                    onCheckedChange={() => onToggle("categories", cat.name)}
                  />
                  <Label
                    htmlFor={id}
                    className="flex-1 font-normal text-foreground"
                  >
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={cat.icon}
                        strokeWidth={1.5}
                        className="size-3.5 opacity-60"
                      />
                      {cat.name}
                    </span>
                  </Label>
                </div>
              )
            })}
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
            options={hospitalNames}
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
            options={genders}
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
            options={availabilityOptions}
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
            options={experienceRanges.map((r) => r.label)}
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
            options={feeRanges.map((r) => r.label)}
            onToggle={onToggle}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
