"use client"

import { useState, useMemo, useCallback } from "react"
import type { InventoryItem, Rarity } from "@/lib/types"

const RARITY_ORDER: Record<Rarity, number> = {
  X: 0,
  S: 1,
  A: 2,
  B: 3,
  C: 4,
  D: 5,
  E: 6,
  F: 7,
}

export function useInventoryFilters(items: InventoryItem[]) {
  const [search, setSearch] = useState("")
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([])

  const toggleRarity = useCallback((rarity: Rarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    )
  }, [])

  const clearAll = useCallback(() => {
    setSearch("")
    setSelectedRarities([])
  }, [])

  const filtered = useMemo(() => {
    let result = items

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q))
      )
    }

    if (selectedRarities.length > 0) {
      result = result.filter((i) => selectedRarities.includes(i.rarity))
    }

    // Sort by rarity (highest first: X > S > A > B > C > D > E > F)
    result = [...result].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])

    return result
  }, [items, search, selectedRarities])

  return {
    search,
    setSearch,
    selectedRarities,
    toggleRarity,
    clearAll,
    filtered,
    totalItems: items.length,
  }
}
