export const medicalSpecialties = [
  { value: "medicine", label: "Medicine" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "orthopedics", label: "Orthopedics" },
  { value: "ENT", label: "ENT" },
  { value: "gynecology", label: "Gynecology" },
  { value: "child_specialist", label: "Child Specialist" },
  { value: "eye_specialist", label: "Eye Specialist" },
  { value: "skin_specialist", label: "Skin Specialist" },
  { value: "psychiatry", label: "Psychiatry" },
  { value: "nephrology", label: "Nephrology" },
  { value: "urology", label: "Urology" },
  { value: "surgery", label: "Surgery" },
] as const

export function specialtyLabel(value: string): string {
  return medicalSpecialties.find((s) => s.value === value)?.label ?? value
}
