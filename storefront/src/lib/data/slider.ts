import { sdk } from "@lib/config"
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
  try {
    const data = await sdk.client.fetch<{ slides: Slide[] }>(
      "/store/sliders",
      {
        method: "GET",
        next: { revalidate: 60 },
      }
    )
    return data?.slides || []
  } catch (error) {
    console.error("Failed to fetch slides:", error)
    return []
  }
})
