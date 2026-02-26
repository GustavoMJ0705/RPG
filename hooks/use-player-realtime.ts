"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  type DbPlayer,
  type DbScenarioLog,
  type DbShopItem,
  type PlayerData,
  type LogEntry,
  type ShopItem,
  type InventoryItem,
  dbPlayerToPlayerData,
  dbLogToLogEntry,
  dbShopItemToShopItem,
} from "@/lib/types"

export function usePlayerRealtime(playerId: number) {
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const supabaseRef = useRef(createClient())

  // Fetch initial data
  useEffect(() => {
    const supabase = supabaseRef.current

    async function fetchInitial() {
      const [playerRes, logsRes, shopRes] = await Promise.all([
        supabase.from("players").select("*").eq("id", playerId).single(),
        supabase
          .from("scenario_logs")
          .select("*")
          .or(`target.eq.all,target.eq.${playerId}`)
          .order("created_at", { ascending: true }),
        supabase.from("shop_items").select("*").order("created_at", { ascending: true }),
      ])

      if (playerRes.error || !playerRes.data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setPlayer(dbPlayerToPlayerData(playerRes.data as DbPlayer))

      if (logsRes.data) {
        setLogs((logsRes.data as DbScenarioLog[]).map(dbLogToLogEntry))
      }
      if (shopRes.data) {
        setShopItems((shopRes.data as DbShopItem[]).map(dbShopItemToShopItem))
      }
      setLoading(false)
    }

    fetchInitial()
  }, [playerId])

  // Subscribe to realtime changes
  useEffect(() => {
    const supabase = supabaseRef.current

    const playerChannel = supabase
      .channel(`player-${playerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "players",
          filter: `id=eq.${playerId}`,
        },
        (payload) => {
          const updated = dbPlayerToPlayerData(payload.new as DbPlayer)
          setPlayer((prev) => (prev ? { ...updated, coinFlash: true } : updated))
          setTimeout(() => {
            setPlayer((prev) => (prev ? { ...prev, coinFlash: false } : prev))
          }, 700)
        }
      )
      .subscribe()

    // Listen for new logs targeted to this player or all, and deletions
    const logsChannel = supabase
      .channel(`logs-player-${playerId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scenario_logs" },
        (payload) => {
          const newLog = payload.new as DbScenarioLog
          // Only show logs for this player or all players
          if (newLog.target === "all" || newLog.target === String(playerId)) {
            const entry = dbLogToLogEntry(newLog)
            setLogs((prev) => {
              if (prev.find((l) => l.id === entry.id)) return prev
              return [...prev, entry]
            })
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "scenario_logs" },
        (payload) => {
          const oldId = (payload.old as { id: number }).id
          setLogs((prev) => prev.filter((l) => l.id !== oldId))
        }
      )
      .subscribe()

    const shopChannel = supabase
      .channel(`shop-player-${playerId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shop_items" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newItem = dbShopItemToShopItem(payload.new as DbShopItem)
            setShopItems((prev) => {
              if (prev.find((i) => i.id === newItem.id)) return prev
              return [...prev, newItem]
            })
          } else if (payload.eventType === "UPDATE") {
            const updated = dbShopItemToShopItem(payload.new as DbShopItem)
            setShopItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: number }).id
            setShopItems((prev) => prev.filter((i) => i.id !== oldId))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(playerChannel)
      supabase.removeChannel(logsChannel)
      supabase.removeChannel(shopChannel)
    }
  }, [playerId])

  const updateHp = useCallback(
    async (currentHp: number, maxHp: number) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ current_hp: Math.max(0, Math.min(currentHp, maxHp)), max_hp: Math.max(1, maxHp), updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    [playerId]
  )

  const updateAbilities = useCallback(
    async (abilities: import("@/lib/types").Ability[]) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ abilities: abilities as unknown as string[], updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    [playerId]
  )

  const updateInventory = useCallback(
    async (items: InventoryItem[]) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ inventory: items as unknown as string[], updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    [playerId]
  )

  // Clear feed locally (does not delete from DB)
  const clearLocalLogs = useCallback(() => {
    setLogs([])
  }, [])

  // Buy an item from the shop
  const buyShopItem = useCallback(
    async (shopItem: ShopItem): Promise<{ success: boolean; error?: string }> => {
      if (!player) return { success: false, error: "Player not found" }
      if (player.coins < shopItem.price) return { success: false, error: "Coins insuficientes!" }
      if (shopItem.stock === 0) return { success: false, error: "Item fora de estoque!" }

      const supabase = supabaseRef.current

      // Deduct coins
      const newCoins = player.coins - shopItem.price
      await supabase
        .from("players")
        .update({ coins: newCoins, updated_at: new Date().toISOString() })
        .eq("id", playerId)

      // Add item to inventory
      const currentInventory = [...(player.inventory ?? [])]
      const existingIdx = currentInventory.findIndex(
        (i) => i.name === shopItem.name && i.rarity === shopItem.rarity
      )
      if (existingIdx >= 0) {
        currentInventory[existingIdx] = {
          ...currentInventory[existingIdx],
          quantity: currentInventory[existingIdx].quantity + 1,
        }
      } else {
        currentInventory.push({
          id: crypto.randomUUID(),
          name: shopItem.name,
          description: shopItem.description,
          rarity: shopItem.rarity,
          quantity: 1,
        })
      }
      await supabase
        .from("players")
        .update({ inventory: currentInventory as unknown as string[], updated_at: new Date().toISOString() })
        .eq("id", playerId)

      // Decrement stock if not unlimited
      if (shopItem.stock > 0) {
        await supabase
          .from("shop_items")
          .update({ stock: shopItem.stock - 1 })
          .eq("id", shopItem.id)
      }

      return { success: true }
    },
    [player, playerId]
  )

  return { player, logs, shopItems, loading, notFound, updateHp, updateAbilities, updateInventory, clearLocalLogs, buyShopItem }
}
