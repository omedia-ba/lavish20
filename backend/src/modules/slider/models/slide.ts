import { model } from "@medusajs/framework/utils"

const Slide = model.define("slide", {
  id: model.id().primaryKey(),
  title: model.text().nullable(),
  image_url: model.text(),
  link: model.text().nullable(),
  position: model.number().default(0),
  is_active: model.boolean().default(true),
})

export default Slide
