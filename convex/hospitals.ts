import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

async function deleteFileIfExists(ctx: any, storageId?: string) {
  if (storageId) {
    await ctx.storage.delete(storageId as Id<"_storage">);
  }
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
