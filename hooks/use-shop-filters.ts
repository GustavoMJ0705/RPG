"use client"

import { useState, useMemo, useCallback } from "react"
import type { ShopItem, Rarity, ItemType } from "@/lib/types"

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

export function useShopFilters(items: ShopItem[]) {
  const [search, setSearch] = useState("")
  const [selectedRarities, setSelectedRarities] = useState<Rarity[]>([])
  const [selectedTypes, setSelectedTypes] = useState<ItemType[]>([])

  const toggleRarity = useCallback((rarity: Rarity) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    )
  }, [])

  const toggleType = useCallback((type: ItemType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }, [])

  const clearAll = useCallback(() => {
    setSearch("")
    setSelectedRarities([])
    setSelectedTypes([])
  }, [])

  const filtered = useMemo(() => {
    let result = items

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      )
    }

    if (selectedRarities.length > 0) {
      result = result.filter((i) => selectedRarities.includes(i.rarity))
    }

    if (selectedTypes.length > 0) {
      result = result.filter((i) => selectedTypes.includes(i.item_type))
    }

    // Sort by rarity (highest first: X > S > A > B > C > D > E > F)
    result = [...result].sort((a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity])

    return result
  }, [items, search, selectedRarities, selectedTypes])

  return {
    search,
    setSearch,
    selectedRarities,
    toggleRarity,
    selectedTypes,
    toggleType,
    clearAll,
    filtered,
    totalItems: items.length,
  }
}
