import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import {
  Container,
  Heading,
  Button,
  Input,
  Label,
  Switch,
  Table,
  Toaster,
  toast,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

type Slide = {
  id: string
  title: string | null
  image_url: string
  link: string | null
  position: number
  is_active: boolean
}

const SlidersPage = () => {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [link, setLink] = useState("")
  const [position, setPosition] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const fetchSlides = async () => {
    try {
      const res = await fetch("/admin/sliders", {
        credentials: "include",
      })
      const data = await res.json()
      setSlides(data.slides || [])
    } catch (err) {
      toast.error("Error", { description: "Failed to fetch slides" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])

  const resetForm = () => {
    setTitle("")
    setImageUrl("")
    setLink("")
    setPosition(slides.length)
    setIsActive(true)
    setEditingSlide(null)
    setShowForm(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const res = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const data = await res.json()
      if (data.files && data.files.length > 0) {
        setImageUrl(data.files[0].url)
        toast.success("Success", { description: "Image uploaded" })
      }
    } catch (err) {
      toast.error("Error", { description: "Failed to upload image" })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!imageUrl) {
      toast.error("Error", { description: "Please upload an image" })
      return
    }

    try {
      const body = {
        title: title || null,
        image_url: imageUrl,
        link: link || null,
        position,
        is_active: isActive,
      }

      if (editingSlide) {
        await fetch(`/admin/sliders/${editingSlide.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        toast.success("Success", { description: "Slide updated" })
      } else {
        await fetch("/admin/sliders", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        toast.success("Success", { description: "Slide created" })
      }

      resetForm()
      fetchSlides()
    } catch (err) {
      toast.error("Error", { description: "Failed to save slide" })
    }
  }

  const handleEdit = (slide: Slide) => {
    setTitle(slide.title || "")
    setImageUrl(slide.image_url)
    setLink(slide.link || "")
    setPosition(slide.position)
    setIsActive(slide.is_active)
    setEditingSlide(slide)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return

    try {
      await fetch(`/admin/sliders/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      toast.success("Success", { description: "Slide deleted" })
      fetchSlides()
    } catch (err) {
      toast.error("Error", { description: "Failed to delete slide" })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Toaster />

      <Container>
        <div className="flex items-center justify-between mb-6">
          <Heading level="h1">Homepage Slider</Heading>
          <Button
            variant="primary"
            onClick={() => {
              resetForm()
              setPosition(slides.length)
              setShowForm(true)
            }}
          >
            Add Slide
          </Button>
        </div>

        {showForm && (
          <div className="border border-ui-border-base rounded-lg p-6 mb-6 bg-ui-bg-subtle">
            <Heading level="h2" className="mb-4">
              {editingSlide ? "Edit Slide" : "New Slide"}
            </Heading>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Title (optional)</Label>
                <Input
                  placeholder="Slide title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Link URL (optional)</Label>
                <Input
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>

              <div>
                <Label>Position</Label>
                <Input
                  type="number"
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label>Active</Label>
              </div>

              <div className="col-span-full">
                <Label>Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-ui-fg-subtle
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-ui-bg-interactive file:text-ui-fg-on-color
                    hover:file:bg-ui-bg-interactive-hover
                    file:cursor-pointer cursor-pointer mt-1"
                />
                {uploading && (
                  <p className="text-sm text-ui-fg-muted mt-1">Uploading...</p>
                )}
                {imageUrl && (
                  <div className="mt-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-40 rounded-lg border border-ui-border-base"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="primary" onClick={handleSubmit}>
                {editingSlide ? "Update" : "Save"}
              </Button>
              <Button variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-ui-fg-muted">Loading...</p>
        ) : slides.length === 0 ? (
          <p className="text-ui-fg-muted text-center py-8">
            No slides yet. Click "Add Slide" to create one.
          </p>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Image</Table.HeaderCell>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Link</Table.HeaderCell>
                <Table.HeaderCell>Position</Table.HeaderCell>
                <Table.HeaderCell>Active</Table.HeaderCell>
                <Table.HeaderCell className="text-right">
                  Actions
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {slides.map((slide) => (
                <Table.Row key={slide.id}>
                  <Table.Cell>
                    <img
                      src={slide.image_url}
                      alt={slide.title || "Slide"}
                      className="h-12 w-20 object-cover rounded"
                    />
                  </Table.Cell>
                  <Table.Cell>{slide.title || "-"}</Table.Cell>
                  <Table.Cell>
                    {slide.link ? (
                      <a
                        href={slide.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-ui-fg-interactive underline"
                      >
                        {slide.link.length > 30
                          ? slide.link.substring(0, 30) + "..."
                          : slide.link}
                      </a>
                    ) : (
                      "-"
                    )}
                  </Table.Cell>
                  <Table.Cell>{slide.position}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        slide.is_active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEdit(slide)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(slide.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Slider",
  icon: PhotoSolid,
})

export default SlidersPage
