import { v } from "convex/values";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";

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

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const doctor = await ctx.db
      .query("doctors")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!doctor) return null;

    const affiliation = await ctx.db
      .query("doctorAffiliations")
      .withIndex("by_doctor_and_primary", (q) =>
        q.eq("doctorId", doctor._id).eq("isPrimary", true)
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

export async function joinDoctorPublicFields(
  ctx: QueryCtx,
  doctor: Doc<"doctors">
) {
  const affiliation = await ctx.db
    .query("doctorAffiliations")
    .withIndex("by_doctor_and_primary", (q) =>
      q.eq("doctorId", doctor._id).eq("isPrimary", true)
    )
    .first();

  const hospital = affiliation?.hospitalId
    ? await ctx.db.get(affiliation.hospitalId)
    : null;
  const district = await ctx.db.get(doctor.primaryDistrictId);

  const photoUrl = doctor.photoStorageId
    ? await ctx.storage.getUrl(doctor.photoStorageId)
    : null;

  return {
    ...doctor,
    photoUrl,
    hospitalId: affiliation?.hospitalId ?? null,
    hospitalName: hospital?.name ?? affiliation?.hospitalNameOverride ?? null,
    districtName: district?.name ?? null,
    designation: affiliation?.designation ?? null,
    workingHours: affiliation?.workingHours ?? null,
    newPatientFee: affiliation?.newPatientFee ?? doctor.startingFee,
    returningPatientFee:
      affiliation?.returningPatientFee ?? doctor.startingFee,
    returningPatientWindowDays: affiliation?.returningPatientWindowDays ?? 90,
    onlineFee: affiliation?.onlineFee,
    appointmentDurationMinutes: affiliation?.appointmentDurationMinutes ?? 20,
    supportsInPerson: affiliation?.supportsInPerson ?? true,
    supportsVideo: affiliation?.supportsVideo ?? false,
  };
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const doctors = await ctx.db.query("doctors").order("desc").collect();
    return Promise.all(doctors.map((d) => joinDoctorPublicFields(ctx, d)));
  },
});

export const getPublic = query({
  args: { id: v.id("doctors") },
  handler: async (ctx, { id }) => {
    const doctor = await ctx.db.get(id);
    if (!doctor) return null;
    return joinDoctorPublicFields(ctx, doctor);
  },
});

export const getPublicBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const doctor = await ctx.db
      .query("doctors")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!doctor) return null;
    return joinDoctorPublicFields(ctx, doctor);
  },
});

export const listRelatedPublic = query({
  args: { id: v.id("doctors"), specialty: v.string() },
  handler: async (ctx, { id, specialty }) => {
    const sameSpecialty = await ctx.db
      .query("doctors")
      .withIndex("by_specialty", (q) => q.eq("specialty", specialty))
      .collect();
    const same = sameSpecialty.filter((d) => d._id !== id);

    let pool = same;
    if (pool.length < 4) {
      const others = await ctx.db.query("doctors").collect();
      const fillers = others.filter(
        (d) => d._id !== id && d.specialty !== specialty
      );
      pool = [...same, ...fillers];
    }

    const picked = pool.slice(0, 4);
    return Promise.all(picked.map((d) => joinDoctorPublicFields(ctx, d)));
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

    const hospitals = await ctx.db.query("hospitals").collect();
    const hospitalMap = new Map(hospitals.map((h) => [h.slug, h._id]));

    const existing = await ctx.db.query("doctors").collect();
    const existingSlugs = new Set(existing.map((d) => d.slug));

    const doctors = [
      {
        name: "Dr. Rafiqul Islam",
        slug: "dr-rafiqul-islam",
        specialty: "medicine",
        qualifications: ["MBBS", "FCPS (Medicine)"],
        gender: "male" as const,
        experienceYears: 18,
        languages: ["Bangla", "English"],
        bio: ["Senior consultant in internal medicine with 18 years of experience.", "Specialized in diabetes management and cardiac diseases."],
        specializations: ["Diabetes", "Hypertension", "Cardiac Diseases"],
        treatedConditions: ["Diabetes", "Hypertension", "Heart Disease", "Thyroid Disorders"],
        education: [{ degree: "MBBS", institute: "Khulna Medical College", year: 2005 }, { degree: "FCPS (Medicine)", institute: "Bangladesh College of Physicians and Surgeons", year: 2012 }],
        availabilityStatus: "available_this_week" as const,
        averageRating: 4.7,
        reviewCount: 124,
        whatsappNumber: "+8801712345601",
        hospitalSlug: "khulna-medical-college-hospital",
        designation: "Senior Consultant",
        newPatientFee: 800,
        returningPatientFee: 500,
      },
      {
        name: "Dr. Fatema Begum",
        slug: "dr-fatema-begum",
        specialty: "gynecology",
        qualifications: ["MBBS", "FCPS (OBGYN)"],
        gender: "female" as const,
        experienceYears: 14,
        languages: ["Bangla", "English"],
        bio: ["Experienced gynecologist specializing in high-risk pregnancies.", "Expert in minimally invasive gynecological surgery."],
        specializations: ["High-Risk Pregnancy", "Laparoscopic Surgery", "Infertility Treatment"],
        treatedConditions: ["Pregnancy Complications", "PCOS", "Infertility", "Menstrual Disorders"],
        education: [{ degree: "MBBS", institute: "Sir Salimullah Medical College", year: 2008 }, { degree: "FCPS (OBGYN)", institute: "Bangladesh College of Physicians and Surgeons", year: 2015 }],
        availabilityStatus: "available_today" as const,
        averageRating: 4.8,
        reviewCount: 98,
        whatsappNumber: "+8801712345602",
        hospitalSlug: "khulna-city-medical-center",
        designation: "Consultant",
        newPatientFee: 1000,
        returningPatientFee: 600,
      },
      {
        name: "Dr. Ahsan Habib",
        slug: "dr-ahsan-habib",
        specialty: "cardiology",
        qualifications: ["MBBS", "MD (Cardiology)", "FACC"],
        gender: "male" as const,
        experienceYears: 22,
        languages: ["Bangla", "English"],
        bio: ["Interventional cardiologist with expertise in coronary angioplasty.", "Fellow of the American College of Cardiology."],
        specializations: ["Coronary Angioplasty", "Heart Failure Management", "Cardiac Rehabilitation"],
        treatedConditions: ["Coronary Artery Disease", "Heart Failure", "Arrhythmia", "Valvular Heart Disease"],
        education: [{ degree: "MBBS", institute: "Dhaka Medical College", year: 2001 }, { degree: "MD (Cardiology)", institute: "National Heart Foundation", year: 2008 }],
        availabilityStatus: "available_this_week" as const,
        averageRating: 4.9,
        reviewCount: 210,
        whatsappNumber: "+8801712345603",
        hospitalSlug: "square-hospital-khulna",
        designation: "Head of Cardiology",
        newPatientFee: 1500,
        returningPatientFee: 1000,
      },
      {
        name: "Dr. Nasima Khatun",
        slug: "dr-nasima-khatun",
        specialty: "child_specialist",
        qualifications: ["MBBS", "DCH", "FCPS (Pediatrics)"],
        gender: "female" as const,
        experienceYears: 12,
        languages: ["Bangla", "English"],
        bio: ["Pediatrician with special interest in neonatal care.", "Experienced in managing childhood infections and developmental disorders."],
        specializations: ["Neonatal Care", "Childhood Infections", "Vaccination"],
        treatedConditions: ["Febrile Illness", "Pneumonia", "Diarrhea", "Growth Disorders"],
        education: [{ degree: "MBBS", institute: "Rajshahi Medical College", year: 2010 }, { degree: "FCPS (Pediatrics)", institute: "Bangladesh College of Physicians and Surgeons", year: 2017 }],
        availabilityStatus: "available_today" as const,
        averageRating: 4.6,
        reviewCount: 75,
        whatsappNumber: "+8801712345604",
        hospitalSlug: "star-life-hospital",
        designation: "Consultant",
        newPatientFee: 700,
        returningPatientFee: 400,
      },
      {
        name: "Dr. Mohammad Karim",
        slug: "dr-mohammad-karim",
        specialty: "orthopedics",
        qualifications: ["MBBS", "MS (Orthopedics)"],
        gender: "male" as const,
        experienceYears: 16,
        languages: ["Bangla", "English"],
        bio: ["Orthopedic surgeon specializing in joint replacement and trauma surgery.", "Trained in minimally invasive orthopedic procedures."],
        specializations: ["Joint Replacement", "Trauma Surgery", "Spine Surgery"],
        treatedConditions: ["Fractures", "Arthritis", "Back Pain", "Sports Injuries"],
        education: [{ degree: "MBBS", institute: "Chittagong Medical College", year: 2006 }, { degree: "MS (Orthopedics)", institute: "BSMMU", year: 2013 }],
        availabilityStatus: "available_this_week" as const,
        averageRating: 4.5,
        reviewCount: 89,
        whatsappNumber: "+8801712345605",
        hospitalSlug: "square-hospital-khulna",
        designation: "Consultant Surgeon",
        newPatientFee: 1200,
        returningPatientFee: 800,
      },
      {
        name: "Dr. Salma Akter",
        slug: "dr-salma-akter",
        specialty: "ent",
        qualifications: ["MBBS", "FCPS (ENT)"],
        gender: "female" as const,
        experienceYears: 10,
        languages: ["Bangla", "English"],
        bio: ["ENT specialist with expertise in endoscopic sinus surgery.", "Experienced in treating hearing disorders and throat conditions."],
        specializations: ["Endoscopic Sinus Surgery", "Hearing Disorders", "Throat Surgery"],
        treatedConditions: ["Sinusitis", "Hearing Loss", "Tonsillitis", "Nasal Polyps"],
        education: [{ degree: "MBBS", institute: "Sylhet MAG Osmani Medical College", year: 2012 }, { degree: "FCPS (ENT)", institute: "Bangladesh College of Physicians and Surgeons", year: 2019 }],
        availabilityStatus: "available_today" as const,
        averageRating: 4.4,
        reviewCount: 56,
        whatsappNumber: "+8801712345606",
        hospitalSlug: "khulna-city-medical-center",
        designation: "Specialist",
        newPatientFee: 800,
        returningPatientFee: 500,
      },
    ];

    const inserted = [];
    for (const d of doctors) {
      if (!existingSlugs.has(d.slug)) {
        const hospitalId = d.hospitalSlug ? hospitalMap.get(d.hospitalSlug) : undefined;

        const doctorId = await ctx.db.insert("doctors", {
          name: d.name,
          slug: d.slug,
          specialty: d.specialty,
          qualifications: d.qualifications,
          gender: d.gender,
          primaryDistrictId: khulnaDistrict._id,
          experienceYears: d.experienceYears,
          languages: d.languages,
          bio: d.bio,
          specializations: d.specializations,
          treatedConditions: d.treatedConditions,
          education: d.education,
          availabilityStatus: d.availabilityStatus,
          averageRating: d.averageRating,
          reviewCount: d.reviewCount,
          startingFee: d.newPatientFee,
          whatsappNumber: d.whatsappNumber,
        });

        if (hospitalId) {
          await ctx.db.insert("doctorAffiliations", {
            doctorId,
            hospitalId,
            designation: d.designation,
            startDate: "2020-01-01",
            newPatientFee: d.newPatientFee,
            returningPatientFee: d.returningPatientFee,
            returningPatientWindowDays: 90,
            appointmentDurationMinutes: 20,
            supportsInPerson: true,
            supportsVideo: false,
            isPrimary: true,
          });
        }

        inserted.push({ id: doctorId, name: d.name, slug: d.slug });
      }
    }

    return { inserted: inserted.length, doctors: inserted };
  },
});
