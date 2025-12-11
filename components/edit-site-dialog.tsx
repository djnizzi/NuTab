"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Site {
  id: string
  name: string
  url: string
}

interface EditSiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  site: Site | null
  onSave: (id: string, formData: FormData) => Promise<void>
}

export function EditSiteDialog({ open, onOpenChange, site, onSave }: EditSiteDialogProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [icon, setIcon] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (site) {
      setName(site.name)
      setUrl(site.url)
      setIcon(null)
    }
  }, [site])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (site && name.trim() && url.trim()) {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("url", url.trim())
      if (icon) {
        formData.append("icon", icon)
      }

      await onSave(site.id, formData)

      setLoading(false)
      onOpenChange(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIcon(e.target.files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-foreground">
              Name
            </Label>
            <Input
              id="edit-name"
              placeholder="GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-url" className="text-foreground">
              URL
            </Label>
            <Input
              id="edit-url"
              placeholder="https://github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-icon" className="text-foreground">
              Icon (Optional)
            </Label>
            <Input
              id="edit-icon"
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.ico"
              onChange={handleFileChange}
              className="border-border bg-secondary text-foreground file:text-foreground hover:file:bg-accent/10"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border bg-transparent text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
