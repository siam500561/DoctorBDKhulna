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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const hospitalTypes = [
  { value: "government", label: "Government Hospital" },
  { value: "private", label: "Private Hospital" },
  { value: "medical_college", label: "Medical College Hospital" },
  { value: "diagnostic_center", label: "Diagnostic Center" },
  { value: "specialized", label: "Specialized Hospital" },
  { value: "children", label: "Children Hospital" },
  { value: "heart", label: "Heart Hospital" },
  { value: "cancer", label: "Cancer Hospital" },
  { value: "eye", label: "Eye Hospital" },
] as const

const hospitalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  type: z.enum(hospitalTypes.map((t) => t.value) as [string, ...string[]]),
  districtId: z.string().min(1, "District is required"),
  address: z.string().min(2, "Address is required"),
  phone: z.string().min(2, "Phone is required"),
  emergencyAvailable: z.boolean(),
  facilities: z.array(z.string()),
  departments: z.array(z.string()),
  workingHours: z.object({
    fromDay: z.string(),
    toDay: z.string(),
    startTime: z.string(),
    endTime: z.string(),
  }),
})

type HospitalFormValues = z.infer<typeof hospitalSchema>

interface HospitalFormProps {
  hospital?: Doc<"hospitals"> | null
}

export function HospitalForm({ hospital }: HospitalFormProps) {
  const router = useRouter()
  const districts = useQuery(api.districts.list)
  const createHospital = useMutation(api.hospitals.create)
  const updateHospital = useMutation(api.hospitals.update)
  const generateUploadUrl = useAction(api.uploads.generateUploadUrl)

  const [coverFile, setCoverFile] = React.useState<File | null>(null)
  const [coverStorageId, setCoverStorageId] = React.useState<string | null>(
    hospital?.coverImageStorageId ?? null
  )

  const existingCoverUrl = useQuery(
    api.uploads.getUrl,
    coverStorageId ? { storageId: coverStorageId } : "skip"
  )

  const uploadImage = React.useCallback(
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
  } = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "private",
      districtId: "",
      address: "",
      phone: "",
      emergencyAvailable: false,
      facilities: [],
      departments: [],
      workingHours: parseWorkingHours(undefined),
    },
  })

  const isEditing = !!hospital
  const { markSlugTouched } = useAutoSlug(
    watch,
    setValue,
    "name",
    "slug",
    !isEditing
  )

  React.useEffect(() => {
    if (hospital) {
      reset({
        name: hospital.name,
        slug: hospital.slug,
        type: hospital.type,
        districtId: hospital.districtId,
        address: hospital.address,
        phone: hospital.phone,
        emergencyAvailable: hospital.emergencyAvailable,
        facilities: hospital.facilities,
        departments: hospital.departments,
        workingHours: parseWorkingHours(hospital.workingHours),
      })
    } else {
      reset({
        name: "",
        slug: "",
        type: "private",
        districtId: districts?.find((d) => d.name === "Khulna")?._id ?? districts?.[0]?._id ?? "",
        address: "",
        phone: "",
        emergencyAvailable: false,
        facilities: [],
        departments: [],
      workingHours: parseWorkingHours(undefined),
      })
    }
  }, [hospital, districts, reset])

  const onSubmit = async (values: HospitalFormValues) => {
    let uploadedCoverId = coverStorageId

    if (coverFile) {
      uploadedCoverId = await uploadImage(coverFile)
      setCoverStorageId(uploadedCoverId)
    }

    const payload = {
      name: values.name,
      slug: values.slug,
      type: values.type as Doc<"hospitals">["type"],
      districtId: values.districtId as Id<"districts">,
      address: values.address,
      phone: values.phone,
      emergencyAvailable: values.emergencyAvailable,
      facilities: values.facilities,
      departments: values.departments,
      workingHours: formatWorkingHours(values.workingHours),
      coverImageStorageId: uploadedCoverId ?? undefined,
    }

    try {
      if (hospital) {
        await updateHospital({ id: hospital._id, ...payload })
        toast.success("Hospital updated")
      } else {
        await createHospital(payload)
        toast.success("Hospital created")
      }
      router.push("/admin/hospitals")
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  return (
    <AdminFormPage
      sectionLabel="Hospitals"
      sectionHref="/admin/hospitals"
      title={hospital ? "Edit Hospital" : "Add Hospital"}
      description="Hospital details shown on the public directory and doctor profiles."
      isDirty={isDirty}
      isSubmitting={isSubmitting}
      submitLabel={hospital ? "Save Changes" : "Create Hospital"}
      formId="hospital-form"
    >
      <form
        id="hospital-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <ImageDropPlaceholder
          label="Cover Image"
          value={coverFile}
          onChange={setCoverFile}
          defaultPreviewUrl={existingCoverUrl ?? undefined}
          aspect="wide"
        />

        <div className="space-y-1.5">
          <Label htmlFor="name">Hospital name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="khulna-medical-college"
            {...register("slug", { onBlur: markSlugTouched })}
          />
          {errors.slug && (
            <p className="text-xs text-destructive">{errors.slug.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="type">Hospital type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={hospitalTypes.map((t) => ({ value: t.value, label: t.label }))}
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="districtId">District</Label>
            <Controller
              control={control}
              name="districtId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={districts?.map((d) => ({ value: d._id, label: d.name }))}
                >
                  <SelectTrigger id="districtId" className="w-full">
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
            {errors.districtId && (
              <p className="text-xs text-destructive">
                {errors.districtId.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Working hours</Label>
          <Controller
            control={control}
            name="workingHours"
            render={({ field }) => (
              <WorkingHoursInput value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="facilities">Facilities</Label>
          <Controller
            control={control}
            name="facilities"
            render={({ field }) => (
              <TagInput
                id="facilities"
                value={field.value}
                onChange={field.onChange}
                placeholder="ICU, Ambulance, Pharmacy, Pathology Lab"
              />
            )}
          />
          <p className="text-[0.7rem] text-muted-foreground">
            Type a facility and press Enter to add.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="departments">Departments</Label>
          <Controller
            control={control}
            name="departments"
            render={({ field }) => (
              <TagInput
                id="departments"
                value={field.value}
                onChange={field.onChange}
                placeholder="Cardiology, Neurology, Orthopedics"
              />
            )}
          />
          <p className="text-[0.7rem] text-muted-foreground">
            Type a department and press Enter to add.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
          <div>
            <Label htmlFor="emergencyAvailable">Emergency available</Label>
            <p className="text-[0.7rem] text-muted-foreground">
              Shows the Emergency badge on the public site.
            </p>
          </div>
          <Controller
            control={control}
            name="emergencyAvailable"
            render={({ field }) => (
              <Switch
                id="emergencyAvailable"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
      </form>
    </AdminFormPage>
  )
}
