interface DoctorAboutProps {
  bio: string[]
}

export function DoctorAbout({ bio }: DoctorAboutProps) {
  return (
    <section aria-labelledby="about-heading">
      <h2
        id="about-heading"
        className="font-heading text-lg font-semibold text-foreground"
      >
        About
      </h2>
      <div className="mt-3 space-y-3">
        {bio.map((paragraph, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
