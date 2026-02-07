import { defineRouteConfig } from "@medusajs/admin-sdk"
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
  const [message, setMessage] = useState("")

  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [link, setLink] = useState("")
  const [position, setPosition] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const fetchSlides = async () => {
    try {
      const res = await fetch("/admin/sliders", { credentials: "include" })
      const data = await res.json()
      setSlides(data.slides || [])
    } catch (err) {
      setMessage("Failed to fetch slides")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSlides() }, [])

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
        setMessage("Image uploaded!")
      }
    } catch (err) {
      setMessage("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!imageUrl) { setMessage("Please upload an image"); return }
    try {
      const body = { title: title || null, image_url: imageUrl, link: link || null, position, is_active: isActive }
      if (editingSlide) {
        await fetch(`/admin/sliders/${editingSlide.id}`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        setMessage("Slide updated!")
      } else {
        await fetch("/admin/sliders", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        setMessage("Slide created!")
      }
      resetForm()
      fetchSlides()
    } catch (err) {
      setMessage("Failed to save slide")
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
      await fetch(`/admin/sliders/${id}`, { method: "DELETE", credentials: "include" })
      setMessage("Slide deleted!")
      fetchSlides()
    } catch (err) {
      setMessage("Failed to delete slide")
    }
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Homepage Slider</h1>
        <button
          onClick={() => { resetForm(); setPosition(slides.length); setShowForm(true) }}
          style={{ padding: "8px 16px", backgroundColor: "#7c3aed", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500" }}
        >
          + Add Slide
        </button>
      </div>

      {message && (
        <div style={{ padding: "12px", marginBottom: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534" }}>
          {message}
          <button onClick={() => setMessage("")} style={{ float: "right", border: "none", background: "none", cursor: "pointer", fontWeight: "bold" }}>x</button>
        </div>
      )}

      {showForm && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", marginBottom: "24px", backgroundColor: "#f9fafb" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>{editingSlide ? "Edit Slide" : "New Slide"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Title (optional)</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Slide title" style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Link URL (optional)</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Position</label>
              <input type="number" value={position} onChange={(e) => setPosition(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "24px" }}>
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: "18px", height: "18px" }} />
              <label style={{ fontSize: "14px", fontWeight: "500" }}>Active</label>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "14px" }} />
              {uploading && <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Uploading...</p>}
              {imageUrl && <img src={imageUrl} alt="Preview" style={{ maxHeight: "160px", borderRadius: "8px", marginTop: "12px", border: "1px solid #e5e7eb" }} />}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
            <button onClick={handleSubmit} style={{ padding: "8px 20px", backgroundColor: "#7c3aed", color: "white", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500" }}>
              {editingSlide ? "Update" : "Save"}
            </button>
            <button onClick={resetForm} style={{ padding: "8px 20px", backgroundColor: "#e5e7eb", color: "#374151", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "500" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "#6b7280" }}>Loading...</p>
      ) : slides.length === 0 ? (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>No slides yet. Click "Add Slide" to create one.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600" }}>Image</th>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600" }}>Title</th>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600" }}>Link</th>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600" }}>Pos</th>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600" }}>Active</th>
              <th style={{ padding: "12px 8px", fontSize: "14px", fontWeight: "600", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((slide) => (
              <tr key={slide.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "8px" }}>
                  <img src={slide.image_url} alt={slide.title || "Slide"} style={{ height: "48px", width: "80px", objectFit: "cover", borderRadius: "4px" }} />
                </td>
                <td style={{ padding: "8px", fontSize: "14px" }}>{slide.title || "-"}</td>
                <td style={{ padding: "8px", fontSize: "14px" }}>
                  {slide.link ? <a href={slide.link} target="_blank" rel="noreferrer" style={{ color: "#7c3aed", textDecoration: "underline" }}>{slide.link.length > 30 ? slide.link.substring(0, 30) + "..." : slide.link}</a> : "-"}
                </td>
                <td style={{ padding: "8px", fontSize: "14px" }}>{slide.position}</td>
                <td style={{ padding: "8px" }}>
                  <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: slide.is_active ? "#22c55e" : "#9ca3af" }} />
                </td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  <button onClick={() => handleEdit(slide)} style={{ padding: "4px 12px", marginRight: "4px", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>Edit</button>
                  <button onClick={() => handleDelete(slide.id)} style={{ padding: "4px 12px", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", cursor: "pointer", fontSize: "13px", color: "#dc2626" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Slider",
})

export default SlidersPage
