import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import SliderModuleService from "../../../modules/slider/service"
import { SLIDER_MODULE } from "../../../modules/slider"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService: SliderModuleService = req.scope.resolve(SLIDER_MODULE)

  const slides = await sliderService.listSlides(
    { is_active: true },
    { order: { position: "ASC" } }
  )

  res.json({ slides })
}
