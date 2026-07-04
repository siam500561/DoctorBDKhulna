import { doctors, hospitals } from "@/components/home/data"

type Doctor = (typeof doctors)[number]

export function getDoctorById(id: string) {
  const numericId = Number(id)
  return doctors.find((doctor) => doctor.id === numericId)
}

export function getHospitalByName(name: string) {
  return hospitals.find((hospital) => hospital.name === name)
}

export function getRelatedDoctors(doctor: Doctor, count = 4) {
  const sameSpecialty = doctors.filter(
    (d) => d.id !== doctor.id && d.specialty === doctor.specialty
  )
  if (sameSpecialty.length >= count) return sameSpecialty.slice(0, count)

  const fillers = doctors.filter(
    (d) =>
      d.id !== doctor.id &&
      d.specialty !== doctor.specialty &&
      !sameSpecialty.includes(d)
  )
  return [...sameSpecialty, ...fillers].slice(0, count)
}

const specializationTags: Record<string, string[]> = {
  Medicine: [
    "Diabetes Management",
    "Hypertension",
    "Preventive Care",
    "Infectious Disease",
  ],
  Cardiology: [
    "Heart Failure",
    "Hypertension",
    "Preventive Cardiology",
    "Echocardiography",
  ],
  Neurology: [
    "Stroke Management",
    "Epilepsy",
    "Headache & Migraine",
    "Movement Disorders",
  ],
  Orthopedics: [
    "Joint Replacement",
    "Sports Injury",
    "Spine Care",
    "Fracture Care",
  ],
  ENT: ["Sinus Surgery", "Hearing Loss", "Throat Disorders", "Allergy"],
  Gynecology: [
    "Prenatal Care",
    "High-Risk Pregnancy",
    "Infertility",
    "Menstrual Disorders",
  ],
  "Child Specialist": [
    "Newborn Care",
    "Vaccination",
    "Growth & Nutrition",
    "Pediatric Infections",
  ],
  "Eye Specialist": [
    "Cataract Surgery",
    "Glaucoma",
    "Retina Care",
    "Refractive Errors",
  ],
  "Skin Specialist": [
    "Acne Treatment",
    "Eczema & Psoriasis",
    "Cosmetic Dermatology",
    "Hair Loss",
  ],
  Psychiatry: [
    "Anxiety & Depression",
    "Sleep Disorders",
    "Stress Management",
    "Addiction Care",
  ],
  Nephrology: [
    "Chronic Kidney Disease",
    "Dialysis Care",
    "Kidney Stones",
    "Hypertension",
  ],
  Urology: [
    "Kidney Stones",
    "Prostate Care",
    "Urinary Infections",
    "Male Infertility",
  ],
  Surgery: [
    "Laparoscopic Surgery",
    "Hernia Repair",
    "Appendectomy",
    "Trauma Surgery",
  ],
}

const institutePool = [
  "Dhaka Medical College",
  "Sir Salimullah Medical College",
  "Chittagong Medical College",
  "Rajshahi Medical College",
  "Bangabandhu Sheikh Mujib Medical University",
  "Khulna Medical College",
]

const treatedConditionsBySpecialty: Record<string, string[]> = {
  Orthopedics: [
    "Knee pain and chronic knee joint disorders",
    "Osteoarthritis and age-related joint degeneration",
    "Rheumatoid arthritis and inflammatory joint diseases",
    "Gout and uric acid–related arthritis",
    "Back pain and spinal disorders",
    "Neck pain and cervical spine problems",
    "Shoulder pain and frozen shoulder",
    "Hip joint pain and mobility issues",
    "Osteoporosis and bone weakening diseases",
    "Bone fractures and orthopedic trauma",
    "Chronic joint pain and functional disability",
    "Hand and foot joint pain",
    "Persistent back pain with movement limitation",
    "Muscle pain and stiffness",
    "Sports injuries and ligament problems",
    "Bone weakness and pain-related conditions",
    "Difficulty in walking due to joint stiffness",
    "Joint swelling caused by arthritis",
    "Long-term bone and joint inflammation",
    "Arthritis-related crippling and mobility impairment",
  ],
  Medicine: [
    "Type 2 diabetes and blood sugar management",
    "Hypertension and blood pressure disorders",
    "Seasonal fever and viral infections",
    "Chronic fatigue and general weakness",
    "Thyroid function disorders",
    "Acid reflux and gastric problems",
    "Respiratory infections and chronic cough",
    "Cholesterol and lipid disorders",
    "Preventive health checkups",
    "Long-term lifestyle disease management",
  ],
  Cardiology: [
    "Coronary artery disease and chest pain",
    "Heart failure and reduced heart function",
    "Hypertension-related heart complications",
    "Irregular heartbeat and arrhythmia",
    "High cholesterol and atherosclerosis",
    "Post heart-attack recovery and care",
    "Valvular heart disease",
    "Breathlessness on exertion",
    "Palpitations and unexplained chest discomfort",
    "Preventive cardiac risk assessment",
  ],
  Neurology: [
    "Recurrent headache and migraine",
    "Stroke and post-stroke rehabilitation",
    "Epilepsy and recurrent seizures",
    "Numbness and tingling in limbs",
    "Memory loss and cognitive decline",
    "Parkinson's disease and tremors",
    "Nerve pain and neuropathy",
    "Dizziness and balance disorders",
    "Chronic back pain with nerve involvement",
    "Sleep disorders related to neurological causes",
  ],
  ENT: [
    "Chronic sinusitis and nasal blockage",
    "Recurrent throat infection and tonsillitis",
    "Hearing loss and ear infections",
    "Ringing in the ears (tinnitus)",
    "Nasal allergy and allergic rhinitis",
    "Voice hoarseness and vocal cord issues",
    "Snoring and sleep-related breathing problems",
    "Ear wax blockage and ear pain",
    "Sinus-related headaches",
    "Difficulty swallowing",
  ],
  Gynecology: [
    "Irregular menstrual cycles",
    "Pregnancy care and prenatal checkups",
    "High-risk pregnancy management",
    "Infertility and conception difficulties",
    "Polycystic ovary syndrome (PCOS)",
    "Menopause-related symptoms",
    "Pelvic pain and reproductive health issues",
    "Uterine fibroids and cysts",
    "Postpartum care and recovery",
    "Routine gynecological screening",
  ],
  "Child Specialist": [
    "Newborn care and routine checkups",
    "Vaccination and immunization schedules",
    "Growth and nutrition concerns",
    "Recurrent fever and childhood infections",
    "Respiratory infections in children",
    "Diarrhea and digestive issues in infants",
    "Skin rashes and allergies in children",
    "Developmental delays",
    "Asthma and wheezing in children",
    "Behavioral and feeding difficulties",
  ],
  "Eye Specialist": [
    "Cataract and blurred vision",
    "Glaucoma and increased eye pressure",
    "Refractive errors and vision correction",
    "Diabetic retinopathy",
    "Dry eyes and eye irritation",
    "Conjunctivitis and eye infections",
    "Age-related macular degeneration",
    "Eye strain from prolonged screen use",
    "Childhood vision problems",
    "Eye injuries and trauma care",
  ],
  "Skin Specialist": [
    "Acne and persistent breakouts",
    "Eczema and chronic skin irritation",
    "Psoriasis and scaly skin patches",
    "Fungal and bacterial skin infections",
    "Hair loss and scalp conditions",
    "Skin allergies and hives",
    "Pigmentation and dark spots",
    "Cosmetic dermatology concerns",
    "Nail infections and disorders",
    "Chronic itching and rashes",
  ],
  Psychiatry: [
    "Anxiety disorders and panic attacks",
    "Depression and persistent low mood",
    "Sleep disorders and insomnia",
    "Stress-related mental health concerns",
    "Obsessive-compulsive disorder (OCD)",
    "Substance use and addiction recovery",
    "Bipolar disorder management",
    "Attention and concentration difficulties",
    "Post-traumatic stress",
    "Relationship and adjustment issues",
  ],
  Nephrology: [
    "Chronic kidney disease management",
    "Kidney stones and recurrent pain",
    "Dialysis care and planning",
    "Protein or blood in urine",
    "Hypertension-related kidney complications",
    "Electrolyte and fluid imbalance",
    "Diabetic kidney disease",
    "Recurrent urinary tract infections",
    "Swelling in legs due to kidney issues",
    "Kidney function monitoring",
  ],
  Urology: [
    "Kidney stones and urinary blockage",
    "Prostate enlargement and related symptoms",
    "Recurrent urinary tract infections",
    "Male infertility concerns",
    "Erectile dysfunction",
    "Bladder control and incontinence issues",
    "Blood in urine",
    "Urinary tract pain and discomfort",
    "Post-surgical urological care",
    "Kidney and bladder screening",
  ],
  Surgery: [
    "Hernia repair and related discomfort",
    "Gallbladder stones and related pain",
    "Appendicitis and acute abdominal pain",
    "Abdominal lumps and swellings",
    "Post-traumatic surgical care",
    "Laparoscopic surgical procedures",
    "Wound care and post-surgical recovery",
    "Piles and anorectal conditions",
    "Thyroid and neck swellings",
    "Minor surgical procedures",
  ],
}

const priorHospitalPool = [
  "Rajshahi Medical College Hospital",
  "Dhaka Medical College Hospital",
  "Chittagong Medical College Hospital",
  "Sir Salimullah Medical College Hospital",
]

const reviewPool = [
  {
    name: "Rezaul Karim",
    comment:
      "Very attentive and explained everything clearly. Didn't feel rushed at all.",
  },
  {
    name: "Nasrin Sultana",
    comment:
      "Excellent doctor. The consultation was thorough and the follow-up advice was easy to follow.",
  },
  {
    name: "Shafiqul Islam",
    comment:
      "Waiting time was short and the doctor listened patiently to all my concerns.",
  },
  {
    name: "Tania Ferdous",
    comment: "Very professional and caring. I would definitely recommend.",
  },
  {
    name: "Mizanur Rahman",
    comment:
      "Diagnosed the issue quickly and the treatment plan worked well for me.",
  },
  {
    name: "Farhana Yesmin",
    comment:
      "Great experience overall. The staff and the doctor were both very helpful.",
  },
  {
    name: "Abdul Kader",
    comment:
      "Took time to answer all my questions in detail. Highly recommended.",
  },
  {
    name: "Sumaiya Akter",
    comment: "One of the best consultations I've had. Very knowledgeable.",
  },
]

const relativeDates = [
  "3 days ago",
  "1 week ago",
  "2 weeks ago",
  "1 month ago",
  "2 months ago",
]

export interface DoctorProfile {
  registrationNumber: string
  bio: string[]
  education: { degree: string; institute: string; year: number }[]
  experience: { designation: string; hospital: string; period: string }[]
  specializations: string[]
  treatedConditions: string[]
  consultation: {
    newPatientFee: number
    returningPatientFee: number
    returningPatientNote: string
    onlineFee: number | null
    duration: string
    emergencyAvailable: boolean
  }
  schedule: string
  reviews: {
    name: string
    rating: number
    date: string
    comment: string
  }[]
}

export function buildDoctorProfile(doctor: Doctor): DoctorProfile {
  const currentYear = 2026
  const degrees = doctor.qualifications.split(",").map((d) => d.trim())

  const education = degrees.map((degree, i) => ({
    degree,
    institute: institutePool[(doctor.id + i) % institutePool.length],
    year: currentYear - doctor.experience - (degrees.length - i) * 2,
  }))

  const experience = [
    {
      designation: `Senior Consultant, ${doctor.specialty}`,
      hospital: doctor.hospital,
      period: `${currentYear - 3} – Present`,
    },
    {
      designation: `Consultant, ${doctor.specialty}`,
      hospital: priorHospitalPool[doctor.id % priorHospitalPool.length],
      period: `${currentYear - doctor.experience} – ${currentYear - 3}`,
    },
  ]

  const specializations =
    specializationTags[doctor.specialty] ?? specializationTags.Medicine

  const treatedConditions =
    treatedConditionsBySpecialty[doctor.specialty] ??
    treatedConditionsBySpecialty.Medicine

  const isVideo =
    doctor.consultationType === "Video Call" || doctor.consultationType === "Both"

  const consultation = {
    newPatientFee: doctor.fee,
    returningPatientFee: Math.round((doctor.fee * 0.85) / 50) * 50,
    returningPatientNote:
      "Patients who have not visited within 3 months will be considered new patients.",
    onlineFee: isVideo ? Math.round(doctor.fee * 0.8) : null,
    duration: "20 minutes",
    emergencyAvailable: doctor.availability === "Available Today",
  }

  const schedulePatterns = [
    "Sat-Thu: 2:00 PM – 11:00 PM",
    "Sat-Thu: 9:00 AM – 5:00 PM",
    "Sat-Thu: 10:00 AM – 8:00 PM",
    "Sat-Thu: 3:00 PM – 10:00 PM",
    "Sat-Thu: 8:00 AM – 4:00 PM",
    "Sat-Thu: 6:00 PM – 11:00 PM",
  ]
  const schedule = schedulePatterns[doctor.id % schedulePatterns.length]

  const reviews = Array.from({ length: 5 }).map((_, i) => {
    const source = reviewPool[(doctor.id + i) % reviewPool.length]
    const ratingOffset = ((doctor.id + i) % 3) * 0.1
    return {
      name: source.name,
      comment: source.comment,
      rating: Math.min(5, Math.round((doctor.rating - ratingOffset) * 10) / 10),
      date: relativeDates[(doctor.id + i) % relativeDates.length],
    }
  })

  return {
    registrationNumber: `BM&DC-A-${10000 + doctor.id}`,
    bio: [
      `${doctor.name} is a dedicated ${doctor.specialty.toLowerCase()} specialist with over ${doctor.experience} years of clinical experience, currently practicing at ${doctor.hospital}. Known for a patient-first approach, ${doctor.name.split(" ").slice(-1)[0]} combines evidence-based medicine with clear, compassionate communication to help patients understand their diagnosis and treatment options.`,
      `Throughout the career, particular focus has been placed on ${specializations.slice(0, 2).join(" and ").toLowerCase()}, with a commitment to continuing education and staying current with the latest advances in the field. Consultations are available in ${doctor.languages.join(" and ")}, both online and in person, depending on patient needs.`,
    ],
    education,
    experience,
    specializations,
    treatedConditions,
    consultation,
    schedule,
    reviews,
  }
}
