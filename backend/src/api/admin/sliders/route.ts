import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import SliderModuleService from "../../../modules/slider/service"
import { SLIDER_MODULE } from "../../../modules/slider"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

  const slides = await sliderService.listSlides(
    {},
    { order: { position: "ASC" } }
  )

  res.json({ slides })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

  const slide = await sliderService.createSlides(req.body as any)

  res.json({ slide })
}
