import { cache } from "react"

export type Slide = {
  id: string
  title: string | null
  image_url: string
  link: string | null
  position: number
  is_active: boolean
}

export const getSlides = cache(async function (): Promise<Slide[]> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  try {
    const res = await fetch(`${backendUrl}/store/sliders`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    return data.slides || []
  } catch (error) {
    console.error("Failed to fetch slides:", error)
    return []
  }
})
