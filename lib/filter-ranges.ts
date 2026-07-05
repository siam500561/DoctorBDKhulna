export const experienceRanges = [
  { label: "0–5 years", min: 0, max: 5 },
  { label: "5–10 years", min: 5, max: 10 },
  { label: "10–15 years", min: 10, max: 15 },
  { label: "15+ years", min: 15, max: Infinity },
]

export const feeRanges = [
  { label: "Under ৳1,000", min: 0, max: 999 },
  { label: "৳1,000 – ৳1,500", min: 1000, max: 1500 },
  { label: "৳1,500 – ৳2,000", min: 1500, max: 2000 },
  { label: "৳2,000+", min: 2000, max: Infinity },
]

// UI-only sort labels — wire up to real ordering once the backend supports it.
export const sortOptions = [
  "Newest",
  "Most Experienced",
  "Highest Rated",
  "Lowest Fee",
  "Highest Fee",
  "Alphabetical",
] as const
