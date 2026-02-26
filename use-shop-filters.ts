"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  type DbPlayer,
  type DbScenarioLog,
  type DbShopItem,
  type PlayerData,
  type LogEntry,
  type ShopItem,
  dbPlayerToPlayerData,
  dbLogToLogEntry,
  dbShopItemToShopItem,
} from "@/lib/types"

export function useRpgRealtime() {
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabaseRef = useRef(createClient())

  // Fetch initial data
  useEffect(() => {
    const supabase = supabaseRef.current

    async function fetchInitial() {
      const [playersRes, logsRes, shopRes] = await Promise.all([
        supabase.from("players").select("*").order("id", { ascending: true }),
        supabase.from("scenario_logs").select("*").order("created_at", { ascending: true }),
        supabase.from("shop_items").select("*").order("created_at", { ascending: true }),
      ])

      if (playersRes.data) {
        setPlayers((playersRes.data as DbPlayer[]).map(dbPlayerToPlayerData))
      }
      if (logsRes.data) {
        setLogs((logsRes.data as DbScenarioLog[]).map(dbLogToLogEntry))
      }
      if (shopRes.data) {
        setShopItems((shopRes.data as DbShopItem[]).map(dbShopItemToShopItem))
      }
      setLoading(false)
    }

    fetchInitial()
  }, [])

  // Subscribe to realtime changes
  useEffect(() => {
    const supabase = supabaseRef.current

    const playersChannel = supabase
      .channel("players-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = dbPlayerToPlayerData(payload.new as DbPlayer)
            setPlayers((prev) =>
              prev.map((p) => (p.id === updated.id ? { ...updated, coinFlash: true } : p))
            )
            // Reset flash after animation
            setTimeout(() => {
              setPlayers((prev) =>
                prev.map((p) => (p.id === updated.id ? { ...p, coinFlash: false } : p))
              )
            }, 700)
          } else if (payload.eventType === "INSERT") {
            const newPlayer = dbPlayerToPlayerData(payload.new as DbPlayer)
            setPlayers((prev) => {
              if (prev.find((p) => p.id === newPlayer.id)) return prev
              return [...prev, newPlayer]
            })
          } else if (payload.eventType === "DELETE") {
            const oldId = (payload.old as { id: number }).id
            setPlayers((prev) => prev.filter((p) => p.id !== oldId))
          }
        }
      )
      .subscribe()

    const logsChannel = supabase
      .channel("logs-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scenario_logs" },
        (payload) => {
          const newLog = dbLogToLogEntry(payload.new as DbScenarioLog)
          setLogs((prev) => {
            if (prev.find((l) => l.id === newLog.id)) return prev
            return [...prev, newLog]
          })
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
      .channel("shop-changes")
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
      supabase.removeChannel(playersChannel)
      supabase.removeChannel(logsChannel)
      supabase.removeChannel(shopChannel)
    }
  }, [])

  // GM actions: send message (inserts into scenario_logs AND updates Supabase)
  const sendMessage = useCallback(
    async (message: string, target: string, type: "system" | "constellation" | "scenario") => {
      const supabase = supabaseRef.current
      const now = new Date()
      const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      const targetLabel = target === "all"
        ? "All Players"
        : players.find((p) => String(p.id) === target)?.name ?? `Player ${target}`

      const prefix =
        type === "constellation"
          ? `[Constellation Message to ${targetLabel}]`
          : type === "scenario"
          ? `[Scenario Update for ${targetLabel}]`
          : `[System Broadcast to ${targetLabel}]`

      await supabase.from("scenario_logs").insert({
        text: `${prefix} ${message}`,
        type,
        target,
        timestamp,
      })
    },
    [players]
  )

  // GM actions: award coins
  const awardCoins = useCallback(
    async (playerId: number, amount: number) => {
      const supabase = supabaseRef.current
      const player = players.find((p) => p.id === playerId)
      if (!player) return

      const now = new Date()
      const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`

      // Update coins in DB (prevent going below 0)
      const newCoins = Math.max(0, player.coins + amount)
      await supabase
        .from("players")
        .update({ coins: newCoins, updated_at: new Date().toISOString() })
        .eq("id", playerId)

      // Log it
      const logText = amount >= 0
        ? `${amount} coins awarded to ${player.name}.`
        : `${Math.abs(amount)} coins removed from ${player.name}.`
      await supabase.from("scenario_logs").insert({
        text: logText,
        type: "system" as const,
        target: String(playerId),
        timestamp,
      })
    },
    [players]
  )

  // GM actions: clear all logs
  const clearLogs = useCallback(async () => {
    const supabase = supabaseRef.current
    await supabase.from("scenario_logs").delete().gte("id", 0)
    setLogs([])
  }, [])

  // GM actions: update a player stat
  const updatePlayerStat = useCallback(
    async (playerId: number, stat: string, value: number) => {
      const supabase = supabaseRef.current
      const clamped = Math.max(0, Math.min(100, value))
      await supabase
        .from("players")
        .update({ [stat]: clamped, updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    []
  )

  // GM actions: update a player's HP
  const updatePlayerHp = useCallback(
    async (playerId: number, currentHp: number, maxHp: number) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ current_hp: Math.max(0, Math.min(currentHp, maxHp)), max_hp: Math.max(1, maxHp), updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    []
  )

  // GM actions: update a player's abilities
  const updatePlayerAbilities = useCallback(
    async (playerId: number, abilities: import("@/lib/types").Ability[]) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ abilities: abilities as unknown as string[], updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    []
  )

  // GM actions: update a player's inventory
  const updatePlayerInventory = useCallback(
    async (playerId: number, items: import("@/lib/types").InventoryItem[]) => {
      const supabase = supabaseRef.current
      await supabase
        .from("players")
        .update({ inventory: items as unknown as string[], updated_at: new Date().toISOString() })
        .eq("id", playerId)
    },
    []
  )

  // Shop actions: add item
  const addShopItem = useCallback(
    async (item: { name: string; description: string; rarity: string; item_type: string; price: number; stock: number }) => {
      const supabase = supabaseRef.current
      await supabase.from("shop_items").insert(item)
    },
    []
  )

  // Shop actions: remove item
  const removeShopItem = useCallback(async (itemId: number) => {
    const supabase = supabaseRef.current
    await supabase.from("shop_items").delete().eq("id", itemId)
  }, [])

  // Shop actions: update item
  const updateShopItem = useCallback(
    async (itemId: number, updates: Partial<{ name: string; description: string; rarity: string; item_type: string; price: number; stock: number }>) => {
      const supabase = supabaseRef.current
      await supabase.from("shop_items").update(updates).eq("id", itemId)
    },
    []
  )

  return {
    players, logs, shopItems, loading,
    sendMessage, awardCoins, clearLogs, updatePlayerStat, updatePlayerHp, updatePlayerAbilities, updatePlayerInventory,
    addShopItem, removeShopItem, updateShopItem,
  }
}
