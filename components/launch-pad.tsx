"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { SiteIcon } from "./site-icon"
import { AddSiteDialog } from "./add-site-dialog"
import { EditSiteDialog } from "./edit-site-dialog"
import { Plus } from "lucide-react"
import Image from "next/image"

interface Site {
  id: string
  name: string
  url: string
  icon?: string | null
}

// defaultSites removed

export function LaunchPad() {
  const [sites, setSites] = useState<Site[]>([])
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch("/api/sites")
      if (res.ok) {
        const data = await res.json()
        setSites(data)
      }
    } catch (err) {
      console.error("Failed to fetch sites", err)
    }
  }, [])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault()
      if (!draggedId || draggedId === targetId) return

      setSites((prevSites) => {
        const draggedIndex = prevSites.findIndex((s) => s.id === draggedId)
        const targetIndex = prevSites.findIndex((s) => s.id === targetId)
        if (draggedIndex === -1 || targetIndex === -1) return prevSites

        const newSites = [...prevSites]
        const [draggedItem] = newSites.splice(draggedIndex, 1)
        newSites.splice(targetIndex, 0, draggedItem)
        return newSites
      })
    },
    [draggedId],
  )

  const handleDragEnd = useCallback(async () => {
    setDraggedId(null)
    // Save new order
    try {
      const orderIds = sites.map(s => s.id)
      await fetch("/api/sites", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderIds)
      })
    } catch (err) {
      console.error("Failed to save order", err)
    }
  }, [sites])

  const handleAddSite = useCallback(async (formData: FormData) => {
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        fetchSites()
      }
    } catch (err) {
      console.error("Failed to add site", err)
    }
  }, [fetchSites])

  const handleEditSite = useCallback(async (id: string, formData: FormData) => {
    try {
      const res = await fetch(`/api/sites/${id}`, {
        method: "PUT",
        body: formData
      })
      if (res.ok) {
        fetchSites()
        setEditingSite(null)
      }
    } catch (err) {
      console.error("Failed to edit site", err)
    }
  }, [fetchSites])

  const handleDeleteSite = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/sites/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchSites()
      }
    } catch (err) {
      console.error("Failed to delete site", err)
    }
  }, [fetchSites])

  const openEditDialog = useCallback((site: Site) => {
    setEditingSite(site)
    setEditDialogOpen(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="mb-12 text-center">
        
<Image
  src="/svg/nutab-logo.svg"
  alt="nu+ab"
  width={160}
  height={160}
  className="mx-auto"

/>
        
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {sites.map((site) => (
          <SiteIcon
            key={site.id}
            site={site}
            isDragging={draggedId === site.id}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onEdit={openEditDialog}
            onDelete={handleDeleteSite}
          />
        ))}

        {/* Add Button */}
        <button
          onClick={() => setAddDialogOpen(true)}
          className="group flex h-[100px] w-[100px] flex-col items-center justify-center gap-2 rounded-2xl border-1 border-dashed border-border bg-transparent transition-all duration-300 hover:border-accent hover:bg-secondary/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary transition-all duration-300 group-hover:bg-accent group-hover:scale-110">
            <Plus className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover:text-accent-foreground" />
          </div>
          <span className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            Add Site
          </span>
        </button>
      </div>

      {/* Subtle grid lines decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <AddSiteDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAdd={handleAddSite} />

      <EditSiteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        site={editingSite}
        onSave={handleEditSite}
      />
    </div>
  )
}
