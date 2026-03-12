"use client"

import type React from "react"

import { useState } from "react"
import { MoreVertical, Pencil, Trash2, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Site {
  id: string
  name: string
  url: string
  icon?: string | null
}

interface SiteIconProps {
  site: Site
  isDragging: boolean
  onDragStart: (id: string) => void
  onDragOver: (e: React.DragEvent, id: string) => void
  onDragEnd: () => void
  onEdit: (site: Site) => void
  onDelete: (id: string) => void
}

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return null
  }
}

export function SiteIcon({ site, isDragging, onDragStart, onDragOver, onDragEnd, onEdit, onDelete }: SiteIconProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Use DB icon if available (and not null), otherwise fallback to Google favicon service
  const displayIcon = site.icon || getFaviconUrl(site.url)

  const handleLaunch = () => {
    window.open(site.url, "_self", "noopener,noreferrer")
  }

  return (
    <div
      draggable
      onDragStart={() => onDragStart(site.id)}
      onDragOver={(e) => onDragOver(e, site.id)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex h-[120px] w-[120px] cursor-grab flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card/25 backdrop-blur-sm p-3 transition-all duration-300 active:cursor-grabbing",
        isDragging && "scale-105 opacity-50 ring-2 ring-accent",
        !isDragging && "hover:border-accent/50 hover:bg-card/20 hover:backdrop-blur-none hover:shadow-lg hover:shadow-accent/5",
      )}
    >
      {/* Action Menu */}
      <div
        className={cn(
          "absolute right-1 top-1 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/0 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-secondary hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => window.open(site.url, "_blank", "noopener,noreferrer")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(site)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(site.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Icon */}
      <button
        onClick={handleLaunch}
        className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-500/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/50 overflow-hidden"
      >
        {displayIcon && !imageError ? (
          <img
            src={displayIcon}
            alt={`${site.name} icon`}
            className="h-8 w-8 rounded-lg object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-xl font-bold text-foreground">{site.name.charAt(0).toUpperCase()}</span>
        )}
      </button>

      {/* Label */}
      <span className="max-w-full truncate text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {site.name}
      </span>

      {/* Glow effect on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl bg-accent/10 opacity-0 blur-xl transition-opacity duration-300",
          isHovered && "opacity-100",
        )}
      />
    </div>
  )
}
