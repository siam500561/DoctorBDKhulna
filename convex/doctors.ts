import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

async function deleteFileIfExists(ctx: MutationCtx, storageId?: string) {
  if (storageId) {
    await ctx.storage.delete(storageId as Id<"_storage">);
  }
}

const doctorFields = {
  name: v.string(),
  slug: v.string(),
  specialty: v.string(),
  qualifications: v.array(v.string()),
  gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
  primaryDistrictId: v.id("districts"),
  experienceYears: v.number(),
  languages: v.array(v.string()),
  bio: v.array(v.string()),
  specializations: v.array(v.string()),
  treatedConditions: v.array(v.string()),
  education: v.array(
    v.object({ degree: v.string(), institute: v.string(), year: v.number() })
  ),
  availabilityStatus: v.union(
    v.literal("available_today"),
    v.literal("available_this_week"),
    v.literal("unavailable")
  ),
  averageRating: v.number(),
  reviewCount: v.number(),
  whatsappNumber: v.optional(v.string()),
  photoStorageId: v.optional(v.string()),
};

const affiliationFields = {
  hospitalId: v.optional(v.id("hospitals")),
  hospitalNameOverride: v.optional(v.string()),
  designation: v.string(),
  newPatientFee: v.number(),
  returningPatientFee: v.number(),
  returningPatientWindowDays: v.number(),
  onlineFee: v.optional(v.number()),
  appointmentDurationMinutes: v.number(),
  supportsInPerson: v.boolean(),
  supportsVideo: v.boolean(),
  workingHours: v.optional(v.string()),
};

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("doctors").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("doctors") },
  handler: async (ctx, { id }) => {
    const doctor = await ctx.db.get(id);
    if (!doctor) return null;

    const affiliation = await ctx.db
      .query("doctorAffiliations")
      .withIndex("by_doctor_and_primary", (q) =>
        q.eq("doctorId", id).eq("isPrimary", true)
      )
      .first();

    return { doctor, affiliation };
  },
});

export const create = mutation({
  args: {
    ...doctorFields,
    ...affiliationFields,
  },
  handler: async (ctx, args) => {
    const {
      hospitalId,
      hospitalNameOverride,
      designation,
      newPatientFee,
      returningPatientFee,
      returningPatientWindowDays,
      onlineFee,
      appointmentDurationMinutes,
      supportsInPerson,
      supportsVideo,
      workingHours,
      photoStorageId,
      ...doctorArgs
    } = args;

    const doctorId = await ctx.db.insert("doctors", {
      ...doctorArgs,
      startingFee: newPatientFee,
      ...(photoStorageId ? { photoStorageId: photoStorageId as Id<"_storage"> } : {}),
    });

    await ctx.db.insert("doctorAffiliations", {
      doctorId,
      hospitalId,
      hospitalNameOverride,
      designation,
      startDate: new Date().toISOString().slice(0, 10),
      newPatientFee,
      returningPatientFee,
      returningPatientWindowDays,
      onlineFee,
      appointmentDurationMinutes,
      supportsInPerson,
      supportsVideo,
      workingHours,
      isPrimary: true,
    });

    return doctorId;
  },
});

export const update = mutation({
  args: {
    id: v.id("doctors"),
    ...doctorFields,
    ...affiliationFields,
  },
  handler: async (ctx, args) => {
    const {
      id,
      hospitalId,
      hospitalNameOverride,
      designation,
      newPatientFee,
      returningPatientFee,
      returningPatientWindowDays,
      onlineFee,
      appointmentDurationMinutes,
      supportsInPerson,
      supportsVideo,
      workingHours,
      photoStorageId,
      ...doctorArgs
    } = args;

    await ctx.db.patch(id, {
      ...doctorArgs,
      startingFee: newPatientFee,
      ...(photoStorageId ? { photoStorageId: photoStorageId as Id<"_storage"> } : {}),
    });

    const affiliation = await ctx.db
      .query("doctorAffiliations")
      .withIndex("by_doctor_and_primary", (q) =>
        q.eq("doctorId", id).eq("isPrimary", true)
      )
      .first();

    const affiliationPatch = {
      hospitalId,
      hospitalNameOverride,
      designation,
      newPatientFee,
      returningPatientFee,
      returningPatientWindowDays,
      onlineFee,
      appointmentDurationMinutes,
      supportsInPerson,
      supportsVideo,
      workingHours,
    };

    if (affiliation) {
      await ctx.db.patch(affiliation._id, affiliationPatch);
    } else {
      await ctx.db.insert("doctorAffiliations", {
        doctorId: id,
        startDate: new Date().toISOString().slice(0, 10),
        isPrimary: true,
        ...affiliationPatch,
      });
    }
  },
});

async function deleteDoctorCascade(ctx: MutationCtx, doctorId: Id<"doctors">) {
  const doctor = await ctx.db.get(doctorId);
  if (doctor?.photoStorageId) {
    await deleteFileIfExists(ctx, doctor.photoStorageId);
  }

  const affiliations = await ctx.db
    .query("doctorAffiliations")
    .withIndex("by_doctor", (q) => q.eq("doctorId", doctorId))
    .collect();

  await Promise.all(
    affiliations.map((affiliation) => ctx.db.delete(affiliation._id))
  );

  await ctx.db.delete(doctorId);
}

export const remove = mutation({
  args: { id: v.id("doctors") },
  handler: async (ctx, { id }) => {
    await deleteDoctorCascade(ctx, id);
  },
});

export const bulkRemove = mutation({
  args: { ids: v.array(v.id("doctors")) },
  handler: async (ctx, { ids }) => {
    for (const id of ids) {
      await deleteDoctorCascade(ctx, id);
    }
  },
});
