import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { joinDoctorPublicFields } from "./doctors";

async function deleteFileIfExists(ctx: MutationCtx, storageId?: string) {
  if (storageId) {
    await ctx.storage.delete(storageId as Id<"_storage">);
  }
}

async function getCoverImageUrl(ctx: QueryCtx, storageId?: string): Promise<string | null> {
  if (!storageId) return null;
  const url = await ctx.storage.getUrl(storageId as Id<"_storage">);
  return url;
}

const hospitalTypeValidator = v.union(
  v.literal("government"),
  v.literal("private"),
  v.literal("medical_college"),
  v.literal("diagnostic_center"),
  v.literal("specialized"),
  v.literal("children"),
  v.literal("heart"),
  v.literal("cancer"),
  v.literal("eye")
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("hospitals").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("hospitals") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("hospitals")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    type: hospitalTypeValidator,
    districtId: v.id("districts"),
    address: v.string(),
    phone: v.string(),
    workingHours: v.optional(v.string()),
    emergencyAvailable: v.boolean(),
    facilities: v.array(v.string()),
    departments: v.array(v.string()),
    coverImageStorageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { coverImageStorageId, ...rest } = args;
    return await ctx.db.insert("hospitals", {
      ...rest,
      galleryStorageIds: [],
      ...(coverImageStorageId ? { coverImageStorageId: coverImageStorageId as Id<"_storage"> } : {}),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("hospitals"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    type: v.optional(hospitalTypeValidator),
    districtId: v.optional(v.id("districts")),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    workingHours: v.optional(v.string()),
    emergencyAvailable: v.optional(v.boolean()),
    facilities: v.optional(v.array(v.string())),
    departments: v.optional(v.array(v.string())),
    coverImageStorageId: v.optional(v.string()),
  },
  handler: async (ctx, { id, coverImageStorageId, ...patch }) => {
    await ctx.db.patch(id, {
      ...patch,
      ...(coverImageStorageId ? { coverImageStorageId: coverImageStorageId as Id<"_storage"> } : {}),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("hospitals") },
  handler: async (ctx, { id }) => {
    const hospital = await ctx.db.get(id);
    if (hospital?.coverImageStorageId) {
      await deleteFileIfExists(ctx, hospital.coverImageStorageId);
    }
    await ctx.db.delete(id);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("hospitals")) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      const hospital = await ctx.db.get(id);
      if (hospital?.coverImageStorageId) {
        await deleteFileIfExists(ctx, hospital.coverImageStorageId);
      }
      await ctx.db.delete(id);
    }
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const hospitals = await ctx.db.query("hospitals").order("desc").collect();
    return Promise.all(
      hospitals.map(async (hospital) => {
        const district = await ctx.db.get(hospital.districtId);
        const coverImageUrl = await getCoverImageUrl(ctx, hospital.coverImageStorageId);
        return { ...hospital, districtName: district?.name ?? null, coverImageUrl };
      })
    );
  },
});

export const getPublic = query({
  args: { id: v.id("hospitals") },
  handler: async (ctx, { id }) => {
    const hospital = await ctx.db.get(id);
    if (!hospital) return null;

    const district = await ctx.db.get(hospital.districtId);
    const coverImageUrl = await getCoverImageUrl(ctx, hospital.coverImageStorageId);

    const affiliations = await ctx.db
      .query("doctorAffiliations")
      .withIndex("by_hospital", (q) => q.eq("hospitalId", id))
      .collect();

    const doctors = await Promise.all(
      affiliations.map(async (affiliation) => {
        const doctor = await ctx.db.get(affiliation.doctorId);
        return doctor ? joinDoctorPublicFields(ctx, doctor) : null;
      })
    );

    return {
      hospital: { ...hospital, districtName: district?.name ?? null, coverImageUrl },
      doctors: doctors.filter((d): d is NonNullable<typeof d> => d !== null),
    };
  },
});

export const getPublicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const hospital = await ctx.db
      .query("hospitals")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!hospital) return null;

    const district = await ctx.db.get(hospital.districtId);
    const coverImageUrl = await getCoverImageUrl(ctx, hospital.coverImageStorageId);

    const affiliations = await ctx.db
      .query("doctorAffiliations")
      .withIndex("by_hospital", (q) => q.eq("hospitalId", hospital._id))
      .collect();

    const doctors = await Promise.all(
      affiliations.map(async (affiliation) => {
        const doctor = await ctx.db.get(affiliation.doctorId);
        return doctor ? joinDoctorPublicFields(ctx, doctor) : null;
      })
    );

    return {
      hospital: { ...hospital, districtName: district?.name ?? null, coverImageUrl },
      doctors: doctors.filter((d): d is NonNullable<typeof d> => d !== null),
    };
  },
});

export const seedKhulna = mutation({
  args: {},
  handler: async (ctx) => {
    const khulnaDistrict = await ctx.db
      .query("districts")
      .withIndex("by_name", (q) => q.eq("name", "Khulna"))
      .first();

    if (!khulnaDistrict) {
      return { error: "Khulna district not found. Run districts seed first." };
    }

    const existing = await ctx.db.query("hospitals").collect();
    const existingSlugs = new Set(existing.map((h) => h.slug));

    const hospitals = [
      {
        name: "Khulna Medical College Hospital",
        slug: "khulna-medical-college-hospital",
        type: "medical_college" as const,
        address: "Sherpur, Khulna 9100",
        phone: "+880 41-720123",
        workingHours: "24/7",
        emergencyAvailable: true,
        facilities: ["Emergency", "ICU", "Operation Theater", "Pharmacy", "Diagnostic Lab", "Blood Bank"],
        departments: ["Medicine", "Surgery", "Orthopedics", "Cardiology", "Neurology", "Pediatrics", "Gynecology"],
      },
      {
        name: "Khulna City Medical Center",
        slug: "khulna-city-medical-center",
        type: "private" as const,
        address: "KDA Avenue, Khulna 9100",
        phone: "+880 41-725678",
        workingHours: "8:00 AM - 10:00 PM",
        emergencyAvailable: true,
        facilities: ["Emergency", "ICU", "Pharmacy", "Diagnostic Lab", "Cafeteria"],
        departments: ["Medicine", "Surgery", "Cardiology", "ENT", "Eye", "Skin"],
      },
      {
        name: "Square Hospital Khulna",
        slug: "square-hospital-khulna",
        type: "private" as const,
        address: "Boyra, Khulna 9100",
        phone: "+880 41-730123",
        workingHours: "24/7",
        emergencyAvailable: true,
        facilities: ["Emergency", "ICU", "CCU", "Operation Theater", "Pharmacy", "Diagnostic Lab", "MRI", "CT Scan"],
        departments: ["Medicine", "Surgery", "Cardiology", "Neurology", "Orthopedics", "Nephrology", "Urology"],
      },
      {
        name: "Padma Diagnostic Center",
        slug: "padma-diagnostic-center",
        type: "diagnostic_center" as const,
        address: "Daulatpur, Khulna 9100",
        phone: "+880 41-740123",
        workingHours: "7:00 AM - 10:00 PM",
        emergencyAvailable: false,
        facilities: ["X-Ray", "Ultrasound", "ECG", "Pathology", "Pharmacy"],
        departments: ["Radiology", "Pathology", "Cardiology"],
      },
      {
        name: "Star Life Hospital",
        slug: "star-life-hospital",
        type: "private" as const,
        address: "Khan Jahan Ali Road, Khulna 9100",
        phone: "+880 41-750123",
        workingHours: "24/7",
        emergencyAvailable: true,
        facilities: ["Emergency", "ICU", "Operation Theater", "Pharmacy", "Diagnostic Lab"],
        departments: ["Medicine", "Surgery", "Orthopedics", "Gynecology", "Pediatrics"],
      },
      {
        name: "Khulna Eye Hospital",
        slug: "khulna-eye-hospital",
        type: "eye" as const,
        address: "Sherpur Road, Khulna 9100",
        phone: "+880 41-760123",
        workingHours: "9:00 AM - 8:00 PM",
        emergencyAvailable: false,
        facilities: ["Eye Surgery", "LASIK", "Glaucoma Clinic", "Pharmacy"],
        departments: ["Ophthalmology", "Retina", "Cornea"],
      },
    ];

    const inserted = [];
    for (const h of hospitals) {
      if (!existingSlugs.has(h.slug)) {
        const id = await ctx.db.insert("hospitals", {
          ...h,
          districtId: khulnaDistrict._id,
          galleryStorageIds: [],
        });
        inserted.push({ id, name: h.name, slug: h.slug });
      }
    }

    return { inserted: inserted.length, hospitals: inserted };
  },
});
