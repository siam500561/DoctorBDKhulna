"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAction, useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { AdminFormPage } from "@/components/admin/admin-form-page"
import { ImageDropPlaceholder } from "@/components/admin/image-drop-placeholder"
import { useAutoSlug } from "@/components/admin/use-auto-slug"
import { TagInput } from "@/components/admin/tag-input"
import {
  WorkingHoursInput,
  parseWorkingHours,
  formatWorkingHours,
} from "@/components/admin/working-hours-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { medicalSpecialties } from "@/components/admin/specialties"

const genderOptions = ["male", "female", "other"] as const
const availabilityOptions = [
  { value: "available_today", label: "Available Today" },
  { value: "available_this_week", label: "Available This Week" },
  { value: "unavailable", label: "Unavailable" },
] as const

const doctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  specialty: z.string().min(2, "Specialty is required"),
  qualifications: z.array(z.string()).min(1, "At least one qualification is required"),
  gender: z.enum(genderOptions),
  primaryDistrictId: z.string().min(1, "District is required"),
  experienceYears: z.number().int().min(0),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  bio: z.string().min(2, "Biography is required"),
  specializations: z.array(z.string()),
  treatedConditions: z.array(z.string()),
  education: z.array(
    z.object({
      degree: z.string(),
      institute: z.string(),
      year: z.number(),
    })
  ),
  availabilityStatus: z.enum([
    "available_today",
    "available_this_week",
    "unavailable",
  ]),
  averageRating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  whatsappNumber: z.string().optional(),
  hospitalId: z.string().optional(),
  designation: z.string().min(2, "Designation is required"),
  newPatientFee: z.number().min(0),
  returningPatientFee: z.number().min(0),
  returningPatientWindowDays: z.number().int().min(0),
  onlineFee: z.number().min(0).optional(),
  appointmentDurationMinutes: z.number().int().min(5),
  supportsInPerson: z.boolean(),
  supportsVideo: z.boolean(),
  schedule: z.object({
    fromDay: z.string(),
    toDay: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }),
})

type DoctorFormValues = z.infer<typeof doctorSchema>

interface DoctorFormProps {
  doctor?: Doc<"doctors"> | null
  affiliation?: {
    hospitalId?: string
    designation: string
    newPatientFee: number
    returningPatientFee: number
    returningPatientWindowDays: number
    onlineFee?: number
    appointmentDurationMinutes: number
    supportsInPerson: boolean
    supportsVideo: boolean
    workingHours?: string
  } | null
}

export function DoctorForm({ doctor, affiliation }: DoctorFormProps) {
  const router = useRouter()
  const districts = useQuery(api.districts.list)
  const hospitals = useQuery(api.hospitals.list)
  const createDoctor = useMutation(api.doctors.create)
  const updateDoctor = useMutation(api.doctors.update)
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl)

  const [photoFile, setPhotoFile] = React.useState<File | null>(null)
  const [photoStorageId, setPhotoStorageId] = React.useState<string | null>(
    doctor?.photoStorageId ?? null
  )

  const existingPhotoUrl = useQuery(
    api.uploads.getUrl,
    photoStorageId ? { storageId: photoStorageId } : "skip"
  )

  const uploadPhoto = React.useCallback(
    async (file: File) => {
      const url = await generateUploadUrl()
      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      return storageId as string
    },
    [generateUploadUrl]
  )

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      slug: "",
      specialty: "",
      qualifications: [],
      gender: "male",
      primaryDistrictId: "",
      experienceYears: 0,
      languages: ["Bangla", "English"],
      bio: "",
      specializations: [],
      treatedConditions: [],
      education: [],
      availabilityStatus: "available_this_week",
      averageRating: 4.5,
      reviewCount: 0,
      whatsappNumber: "",
      hospitalId: "",
      designation: "",
      newPatientFee: 0,
      returningPatientFee: 0,
      returningPatientWindowDays: 90,
      onlineFee: undefined,
      appointmentDurationMinutes: 20,
      supportsInPerson: true,
      supportsVideo: false,
      schedule: parseWorkingHours(undefined),
    },
  })

  const isEditing = !!doctor
  const { markSlugTouched } = useAutoSlug(
    watch,
    setValue,
    "name",
    "slug",
    !isEditing
  )

  React.useEffect(() => {
    if (doctor) {
      setPhotoStorageId(doctor.photoStorageId ?? null)
      reset({
        name: doctor.name,
        slug: doctor.slug,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        gender: doctor.gender,
        primaryDistrictId: doctor.primaryDistrictId,
        experienceYears: doctor.experienceYears,
        languages: doctor.languages,
        bio: doctor.bio.join("\n\n"),
        specializations: doctor.specializations,
        treatedConditions: doctor.treatedConditions,
        education: doctor.education,
        availabilityStatus: doctor.availabilityStatus,
        averageRating: doctor.averageRating,
        reviewCount: doctor.reviewCount,
        whatsappNumber: doctor.whatsappNumber ?? "",
        hospitalId: affiliation?.hospitalId ?? "",
        designation: affiliation?.designation ?? "",
        newPatientFee: affiliation?.newPatientFee ?? 0,
        returningPatientFee: affiliation?.returningPatientFee ?? 0,
        returningPatientWindowDays:
          affiliation?.returningPatientWindowDays ?? 90,
        onlineFee: affiliation?.onlineFee,
        appointmentDurationMinutes:
          affiliation?.appointmentDurationMinutes ?? 20,
        supportsInPerson: affiliation?.supportsInPerson ?? true,
        supportsVideo: affiliation?.supportsVideo ?? false,
        schedule: parseWorkingHours(affiliation?.workingHours),
      })
    } else {
      reset({
        name: "",
        slug: "",
        specialty: "",
        qualifications: [],
        gender: "male",
        primaryDistrictId: districts?.[0]?._id ?? "",
        experienceYears: 0,
        languages: ["Bangla", "English"],
        bio: "",
        specializations: [],
        treatedConditions: [],
        education: [],
        availabilityStatus: "available_this_week",
        averageRating: 4.5,
        reviewCount: 0,
        whatsappNumber: "",
        hospitalId: "",
        designation: "",
        newPatientFee: 0,
        returningPatientFee: 0,
        returningPatientWindowDays: 90,
        onlineFee: undefined,
        appointmentDurationMinutes: 20,
        supportsInPerson: true,
        supportsVideo: false,
        schedule: parseWorkingHours(undefined),
      })
    }
  }, [doctor, affiliation, districts, reset])

  const onSubmit = async (values: DoctorFormValues) => {
    let uploadedPhotoId = photoStorageId
    if (photoFile) {
      uploadedPhotoId = await uploadPhoto(photoFile)
      setPhotoStorageId(uploadedPhotoId)
    }

    const payload = {
      name: values.name,
      slug: values.slug,
      specialty: values.specialty,
      qualifications: values.qualifications,
      gender: values.gender,
      primaryDistrictId: values.primaryDistrictId as Id<"districts">,
      experienceYears: values.experienceYears,
      languages: values.languages,
      bio: values.bio
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      specializations: values.specializations,
      treatedConditions: values.treatedConditions,
      education: values.education,
      availabilityStatus: values.availabilityStatus,
      averageRating: values.averageRating,
      reviewCount: values.reviewCount,
      whatsappNumber: values.whatsappNumber || undefined,
      photoStorageId: uploadedPhotoId ?? undefined,
      hospitalId: values.hospitalId
        ? (values.hospitalId as Id<"hospitals">)
        : undefined,
      designation: values.designation,
      newPatientFee: values.newPatientFee,
      returningPatientFee: values.returningPatientFee,
      returningPatientWindowDays: values.returningPatientWindowDays,
      onlineFee: values.supportsVideo ? values.onlineFee : undefined,
      appointmentDurationMinutes: values.appointmentDurationMinutes,
      supportsInPerson: values.supportsInPerson,
      supportsVideo: values.supportsVideo,
      workingHours: formatWorkingHours(values.schedule),
    }

    try {
      if (doctor) {
        await updateDoctor({ id: doctor._id, ...payload })
        toast.success("Doctor updated")
      } else {
        await createDoctor(payload)
        toast.success("Doctor created")
      }
      router.push("/admin/doctors")
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <AdminFormPage
      sectionLabel="Doctors"
      sectionHref="/admin/doctors"
      title={doctor ? "Edit Doctor" : "Add Doctor"}
      description="Doctor profile shown on the public directory and profile page."
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      submitLabel={doctor ? "Save Changes" : "Create Doctor"}
      formId="doctor-form"
    >
      <form
        id="doctor-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <section className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Basic Info
          </h3>

          <ImageDropPlaceholder
            label="Profile Photo"
            value={photoFile}
            onChange={setPhotoFile}
            defaultPreviewUrl={existingPhotoUrl ?? undefined}
            aspect="square"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">SEO Slug</Label>
              <Input
                id="slug"
                placeholder="dr-ayesha-rahman"
                {...register("slug", { onBlur: markSlugTouched })}
              />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="specialty">Specialty</Label>
              <Controller
                control={control}
                name="specialty"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={medicalSpecialties}
                  >
                    <SelectTrigger id="specialty" className="w-full">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalSpecialties.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.specialty && (
                <p className="text-xs text-destructive">
                  {errors.specialty.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={genderOptions.map((g) => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))}
                  >
                    <SelectTrigger id="gender" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((g) => (
                        <SelectItem key={g} value={g} className="capitalize">
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="primaryDistrictId">District</Label>
              <Controller
                control={control}
                name="primaryDistrictId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={districts?.map((d) => ({ value: d._id, label: d.name }))}
                  >
                    <SelectTrigger id="primaryDistrictId" className="w-full">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts?.map((d) => (
                        <SelectItem key={d._id} value={d._id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.primaryDistrictId && (
                <p className="text-xs text-destructive">
                  {errors.primaryDistrictId.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="experienceYears">Years of experience</Label>
              <Input
                id="experienceYears"
                type="number"
                {...register("experienceYears", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsappNumber">WhatsApp number</Label>
            <Input
              id="whatsappNumber"
              placeholder="+8801XXXXXXXXX"
              {...register("whatsappNumber")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="availabilityStatus">Availability</Label>
              <Controller
                control={control}
                name="availabilityStatus"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={availabilityOptions.map((a) => ({ value: a.value, label: a.label }))}
                  >
                    <SelectTrigger id="availabilityStatus" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="averageRating">Average rating</Label>
                <Input
                  id="averageRating"
                  type="number"
                  step="0.1"
                  {...register("averageRating", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reviewCount">Review count</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  {...register("reviewCount", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Bio, Qualifications & Languages
          </h3>

          <div className="space-y-1.5">
            <Label htmlFor="qualifications">Qualifications</Label>
            <Controller
              control={control}
              name="qualifications"
              render={({ field }) => (
                <TagInput
                  id="qualifications"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="MBBS, MD (Cardiology)"
                />
              )}
            />
            {errors.qualifications && (
              <p className="text-xs text-destructive">
                {(errors.qualifications as any).message}
              </p>
            )}
            <p className="text-[0.7rem] text-muted-foreground">
              Type a qualification and press Enter to add.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="languages">Languages</Label>
            <Controller
              control={control}
              name="languages"
              render={({ field }) => (
                <TagInput
                  id="languages"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Bangla, English"
                />
              )}
            />
            {errors.languages && (
              <p className="text-xs text-destructive">
                {(errors.languages as any).message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Biography</Label>
            <Textarea id="bio" rows={5} {...register("bio")} />
            <p className="text-[0.7rem] text-muted-foreground">
              Separate paragraphs with a blank line.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specializations">Specializations</Label>
            <Controller
              control={control}
              name="specializations"
              render={({ field }) => (
                <TagInput
                  id="specializations"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Heart Failure, Hypertension"
                />
              )}
            />
            <p className="text-[0.7rem] text-muted-foreground">
              Type a specialization and press Enter to add.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="treatedConditions">Treated conditions</Label>
            <Controller
              control={control}
              name="treatedConditions"
              render={({ field }) => (
                <TagInput
                  id="treatedConditions"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Hypertension, Diabetes"
                />
              )}
            />
            <p className="text-[0.7rem] text-muted-foreground">
              Type a condition and press Enter to add.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Education
          </h3>
          <div className="space-y-3">
            {watch("education")?.map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_100px_32px] items-end gap-2"
              >
                <div className="space-y-1.5">
                  <Label className="text-xs">Degree</Label>
                  <Input
                    placeholder="MBBS"
                    value={watch(`education.${index}.degree`) ?? ""}
                    onChange={(e) =>
                      setValue(`education.${index}.degree`, e.target.value, {
                        shouldDirty: true,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Institute</Label>
                  <Input
                    placeholder="Dhaka Medical College"
                    value={watch(`education.${index}.institute`) ?? ""}
                    onChange={(e) =>
                      setValue(`education.${index}.institute`, e.target.value, {
                        shouldDirty: true,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Year</Label>
                  <Input
                    type="number"
                    placeholder="2015"
                    value={watch(`education.${index}.year`) ?? ""}
                    onChange={(e) =>
                      setValue(
                        `education.${index}.year`,
                        Number(e.target.value),
                        { shouldDirty: true }
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() => {
                    const current = watch("education")
                    const updated = current.filter((_, i) => i !== index)
                    setValue("education", updated, { shouldDirty: true })
                  }}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const current = watch("education") ?? []
                setValue(
                  "education",
                  [...current, { degree: "", institute: "", year: 0 }],
                  { shouldDirty: true }
                )
              }}
            >
              + Add education
            </Button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Hospital & Fees
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="hospitalId">Hospital</Label>
              <Controller
                control={control}
                name="hospitalId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={hospitals?.map((h) => ({ value: h._id, label: h.name }))}
                  >
                    <SelectTrigger id="hospitalId" className="w-full">
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      {hospitals?.map((h) => (
                        <SelectItem key={h._id} value={h._id}>
                          {h.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="Senior Consultant, Cardiology"
                {...register("designation")}
              />
              {errors.designation && (
                <p className="text-xs text-destructive">
                  {errors.designation.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="newPatientFee">New patient fee (৳)</Label>
              <Input
                id="newPatientFee"
                type="number"
                {...register("newPatientFee", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="returningPatientFee">
                Returning patient fee (৳)
              </Label>
              <Input
                id="returningPatientFee"
                type="number"
                {...register("returningPatientFee", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="returningPatientWindowDays">
                Returning window (days)
              </Label>
              <Input
                id="returningPatientWindowDays"
                type="number"
                {...register("returningPatientWindowDays", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appointmentDurationMinutes">
                Appointment duration (min)
              </Label>
              <Input
                id="appointmentDurationMinutes"
                type="number"
                {...register("appointmentDurationMinutes", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <Label htmlFor="supportsInPerson">In-person consultation</Label>
            <Controller
              control={control}
              name="supportsInPerson"
              render={({ field }) => (
                <Switch
                  id="supportsInPerson"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <Label htmlFor="supportsVideo">Video consultation</Label>
            <Controller
              control={control}
              name="supportsVideo"
              render={({ field }) => (
                <Switch
                  id="supportsVideo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {watch("supportsVideo") && (
            <div className="space-y-1.5">
              <Label htmlFor="onlineFee">Online consultation fee (৳)</Label>
              <Controller
                control={control}
                name="onlineFee"
                render={({ field }) => (
                  <Input
                    id="onlineFee"
                    type="number"
                    placeholder="Enter fee"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value
                      field.onChange(v === "" ? undefined : Number(v))
                    }}
                  />
                )}
              />
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Schedule
          </h3>
          <Controller
            control={control}
            name="schedule"
            render={({ field }) => (
              <WorkingHoursInput value={field.value} onChange={field.onChange} />
            )}
          />
        </section>
      </form>
    </AdminFormPage>
  )
}
