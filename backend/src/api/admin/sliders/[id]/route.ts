import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { SLIDER_MODULE } from "../../../../modules/slider"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService = req.scope.resolve(SLIDER_MODULE)

  const slide = await sliderService.retrieveSlide(req.params.id)

  res.json({ slide })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService = req.scope.resolve(SLIDER_MODULE)

  const slide = await sliderService.updateSlides({
    id: req.params.id,
    ...req.body,
  })

  res.json({ slide })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const sliderService = req.scope.resolve(SLIDER_MODULE)

  await sliderService.deleteSlides(req.params.id)

  res.json({ id: req.params.id, deleted: true })
}
