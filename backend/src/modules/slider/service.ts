import { MedusaService } from "@medusajs/framework/utils"
import Slide from "./models/slide"

class SliderModuleService extends MedusaService({
  Slide,
}) {}

export default SliderModuleService
