"use client"

import { useEffect, useState, useCallback } from "react"

type Slide = {
  id: string
  title: string | null
  image_url: string
  link: string | null
  position: number
  is_active: boolean
}

const Hero = ({ slides = [] }: { slides?: Slide[] }) => {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide, slides.length])

  // Fallback if no slides
  if (!slides || slides.length === 0) {
    return (
      <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
          <h1 className="text-3xl leading-10 text-ui-fg-base font-normal">
            Welcome to our store
          </h1>
          <h2 className="text-3xl leading-10 text-ui-fg-subtle font-normal">
            Browse our latest collections
          </h2>
        </div>
      </div>
    )
  }

  const SlideContent = ({ slide }: { slide: Slide }) => {
    const content = (
      <div className="relative w-full h-full">
        <img
          src={slide.image_url}
          alt={slide.title || "Slide"}
          className="w-full h-full object-cover"
        />
        {slide.title && (
          <div className="absolute inset-0 flex items-end justify-center pb-16 bg-gradient-to-t from-black/40 to-transparent">
            <h2 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg text-center px-4">
              {slide.title}
            </h2>
          </div>
        )}
      </div>
    )

    if (slide.link) {
      return (
        <a href={slide.link} className="block w-full h-full">
          {content}
        </a>
      )
    }

    return content
  }

  return (
    <div
      className="relative w-full h-[75vh] overflow-hidden border-b border-ui-border-base"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full flex-shrink-0">
            <SlideContent slide={slide} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Hero
