"use client"

import {
  Landmark,
  UtensilsCrossed,
  CalendarDays,
  Palette,
  Gem,
  ShoppingBag,
  Trees,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import type { Category } from "@/lib/aurora/types"
import { cn } from "@/lib/utils"

export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Food: UtensilsCrossed,
  Attractions: Landmark,
  Events: CalendarDays,
  Culture: Palette,
  "Hidden Gems": Gem,
  Shopping: ShoppingBag,
  Outdoors: Trees,
}

interface CategoryChipsProps {
  categories: Category[]
  active: Category | "All"
  onChange: (value: Category | "All") => void
  includeAll?: boolean
}

export function CategoryChips({ categories, active, onChange, includeAll = true }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {includeAll && (
        <Chip label="All" icon={Sparkles} active={active === "All"} onClick={() => onChange("All")} />
      )}
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          icon={CATEGORY_ICON[cat]}
          active={active === cat}
          onClick={() => onChange(cat)}
        />
      ))}
    </div>
  )
}

function Chip({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string
  icon: LucideIcon
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
        active
          ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_0_20px_-6px_var(--color-primary)]"
          : "border-border bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
