import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  districts: defineTable({
    name: v.string(),
    division: v.optional(v.string()),
  }).index("by_name", ["name"]),

  hospitals: defineTable({
    name: v.string(),
    slug: v.string(),
    type: v.union(
      v.literal("government"),
      v.literal("private"),
      v.literal("medical_college"),
      v.literal("diagnostic_center"),
      v.literal("specialized"),
      v.literal("children"),
      v.literal("heart"),
      v.literal("cancer"),
      v.literal("eye")
    ),
    districtId: v.id("districts"),
    address: v.string(),
    phone: v.string(),
    workingHours: v.optional(v.string()),
    emergencyAvailable: v.boolean(),
    logoStorageId: v.optional(v.id("_storage")),
    coverImageStorageId: v.optional(v.id("_storage")),
    galleryStorageIds: v.array(v.id("_storage")),
    facilities: v.array(v.string()),
    departments: v.array(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_district", ["districtId"])
    .index("by_type", ["type"]),

  doctors: defineTable({
    name: v.string(),
    slug: v.string(),
    photoStorageId: v.optional(v.id("_storage")),
    specialty: v.string(),
    qualifications: v.array(v.string()),
    registrationNumber: v.optional(v.string()),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    primaryDistrictId: v.id("districts"),
    experienceYears: v.number(),
    languages: v.array(v.string()),
    bio: v.array(v.string()),
    specializations: v.array(v.string()),
    treatedConditions: v.array(v.string()),
    education: v.array(
      v.object({
        degree: v.string(),
        institute: v.string(),
        year: v.number(),
      })
    ),
    availabilityStatus: v.union(
      v.literal("available_today"),
      v.literal("available_this_week"),
      v.literal("unavailable")
    ),
    averageRating: v.number(),
    reviewCount: v.number(),
    startingFee: v.number(),
    whatsappNumber: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_specialty", ["specialty"])
    .index("by_gender", ["gender"])
    .index("by_district", ["primaryDistrictId"])
    .index("by_availabilityStatus", ["availabilityStatus"])
    .index("by_experienceYears", ["experienceYears"])
    .index("by_startingFee", ["startingFee"])
    .index("by_averageRating", ["averageRating"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  doctorAffiliations: defineTable({
    doctorId: v.id("doctors"),
    hospitalId: v.optional(v.id("hospitals")),
    hospitalNameOverride: v.optional(v.string()),
    designation: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    newPatientFee: v.number(),
    returningPatientFee: v.number(),
    returningPatientWindowDays: v.number(),
    onlineFee: v.optional(v.number()),
    appointmentDurationMinutes: v.number(),
    supportsInPerson: v.boolean(),
    supportsVideo: v.boolean(),
    workingHours: v.optional(v.string()),
    isPrimary: v.boolean(),
  })
    .index("by_doctor", ["doctorId"])
    .index("by_hospital", ["hospitalId"])
    .index("by_doctor_and_primary", ["doctorId", "isPrimary"]),

  users: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.union(
      v.literal("patient"),
      v.literal("doctor"),
      v.literal("admin"),
      v.literal("hospital_manager")
    ),
    linkedDoctorId: v.optional(v.id("doctors")),
  })
    .index("by_role", ["role"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_linkedDoctor", ["linkedDoctorId"]),

  favorites: defineTable({
    userId: v.id("users"),
    doctorId: v.id("doctors"),
  })
    .index("by_user", ["userId"])
    .index("by_doctor", ["doctorId"])
    .index("by_user_and_doctor", ["userId", "doctorId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("system"), v.literal("general")),
    title: v.string(),
    body: v.string(),
    relatedTable: v.optional(v.string()),
    relatedId: v.optional(v.string()),
    isRead: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_isRead", ["userId", "isRead"]),
});
