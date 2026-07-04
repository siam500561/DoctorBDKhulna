"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { Container } from "@/components/ui/container"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const slides = [
  {
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop",
    alt: "Doctor examining a patient with a stethoscope",
  },
  {
    src: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1600&auto=format&fit=crop",
    alt: "Doctor consulting with a patient",
  },
  {
    src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1600&auto=format&fit=crop",
    alt: "Medical team in a hospital",
  },
  {
    src: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1600&auto=format&fit=crop",
    alt: "Modern hospital hallway",
  },
]

export function Hero() {
  const [autoplay] = React.useState(() =>
    Autoplay({ delay: 3200, stopOnInteraction: false })
  )

  return (
    <section className="bg-background py-6 md:py-8">
      <Container>
        <div className="relative overflow-hidden rounded-2xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[autoplay]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {slides.map((slide) => (
                <CarouselItem key={slide.src} className="basis-full pl-0">
                  <div className="relative aspect-16/7 w-full md:aspect-21/8">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Container>
    </section>
  )
}
