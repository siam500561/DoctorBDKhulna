"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const weekDays = [
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
] as const

export interface WorkingHoursValue {
  fromDay: string
  toDay: string
  startTime: string
  endTime: string
}

export const defaultWorkingHours: WorkingHoursValue = {
  fromDay: "Sat",
  toDay: "Thu",
  startTime: "09:00",
  endTime: "17:00",
}

function to12Hour(time24: string): string {
  const [hourStr, minute] = time24.split(":")
  const hour = Number(hourStr)
  const period = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${period}`
}

function to24Hour(time12: string): string {
  const match = time12.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i)
  if (!match) return "09:00"
  let [, hourStr, minute, period] = match
  let hour = Number(hourStr)
  if (period.toUpperCase() === "PM" && hour !== 12) hour += 12
  if (period.toUpperCase() === "AM" && hour === 12) hour = 0
  return `${String(hour).padStart(2, "0")}:${minute}`
}

export function formatWorkingHours(value: WorkingHoursValue): string {
  return `${value.fromDay}-${value.toDay}: ${to12Hour(value.startTime)} to ${to12Hour(value.endTime)}`
}

export function parseWorkingHours(text: string | undefined): WorkingHoursValue {
  if (!text) return defaultWorkingHours
  const match = text.match(
    /^(\w{3})-(\w{3}):\s*(\d{1,2}:\d{2}\s?[AP]M)\s*to\s*(\d{1,2}:\d{2}\s?[AP]M)$/i
  )
  if (!match) return defaultWorkingHours
  const [, fromDay, toDay, startTime, endTime] = match
  return {
    fromDay,
    toDay,
    startTime: to24Hour(startTime),
    endTime: to24Hour(endTime),
  }
}

interface WorkingHoursInputProps {
  value: WorkingHoursValue
  onChange: (value: WorkingHoursValue) => void
}

export function WorkingHoursInput({ value, onChange }: WorkingHoursInputProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/60 p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">From day</Label>
          <Select
            value={value.fromDay}
            onValueChange={(fromDay) => fromDay && onChange({ ...value, fromDay })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">To day</Label>
          <Select
            value={value.toDay}
            onValueChange={(toDay) => toDay && onChange({ ...value, toDay })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map((d) => (
                <SelectItem key={d.key} value={d.key}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Opens at</Label>
          <Input
            type="time"
            value={value.startTime}
            onChange={(e) => onChange({ ...value, startTime: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Closes at</Label>
          <Input
            type="time"
            value={value.endTime}
            onChange={(e) => onChange({ ...value, endTime: e.target.value })}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Preview: <span className="font-medium text-foreground">{formatWorkingHours(value)}</span>
      </p>
    </div>
  )
}
