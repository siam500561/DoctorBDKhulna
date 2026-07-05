import type { FunctionReturnType } from "convex/server"
import type { api } from "@/convex/_generated/api"

export type PublicDoctor = NonNullable<
  FunctionReturnType<typeof api.doctors.listPublic>
>[number]

export type PublicHospital = NonNullable<
  FunctionReturnType<typeof api.hospitals.listPublic>
>[number]
