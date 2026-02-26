"use client"

import { Search, X } from "lucide-react"
import type { Rarity } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"

const RARITIES: Rarity[] = ["F", "E", "D", "C", "B", "A", "S", "X"]

interface InventoryFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  selectedRarities: Rarity[]
  onToggleRarity: (rarity: Rarity) => void
  onClearAll: () => void
  totalItems: number
  filteredCount: number
}

export function InventoryFilterBar({
  search,
  onSearchChange,
  selectedRarities,
  onToggleRarity,
  onClearAll,
  totalItems,
  filteredCount,
}: InventoryFilterBarProps) {
  const hasFilters = search.length > 0 || selectedRarities.length > 0

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar item..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-background/60 border border-glass-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Rarity chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground shrink-0">Raridade:</span>
        {RARITIES.map((rarity) => {
          const cfg = RARITY_CONFIG[rarity]
          const active = selectedRarities.includes(rarity)
          return (
            <button
              key={rarity}
              onClick={() => onToggleRarity(rarity)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer border ${
                active
                  ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                  : "text-muted-foreground bg-transparent border-glass-border hover:border-muted-foreground/50"
              }`}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Active filter summary */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground">
          {filteredCount} de {totalItems} itens
        </span>
        {hasFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-neon-red/70 hover:text-neon-red transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" />
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  )
}
