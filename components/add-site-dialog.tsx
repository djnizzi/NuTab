"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSiteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (formData: FormData) => Promise<void>
}

export function AddSiteDialog({ open, onOpenChange, onAdd }: AddSiteDialogProps) {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [icon, setIcon] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && url.trim()) {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", name.trim())
      formData.append("url", url.trim())
      if (icon) {
        formData.append("icon", icon)
      }

      await onAdd(formData)

      setName("")
      setUrl("")
      setIcon(null)
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
          <DialogTitle className="text-foreground">Add New Site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Name
            </Label>
            <Input
              id="name"
              placeholder="GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url" className="text-foreground">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://github.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-foreground">
              Icon (Optional)
            </Label>
            <Input
              id="icon"
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
              {loading ? "Adding..." : "Add Site"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
