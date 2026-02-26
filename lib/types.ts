export type Rarity = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "X"

export type ItemType = "utilitario" | "equipamento" | "diversos"

export interface InventoryItem {
  id: string
  name: string
  description: string
  rarity: Rarity
  quantity: number
}

export interface Ability {
  id: string
  name: string
  description: string
  level: number
  cooldown: number // number of rounds
}

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; border: string; bg: string }> = {
  F: { label: "Rank F", color: "text-zinc-400",    border: "border-zinc-500/40",    bg: "bg-zinc-500/10" },
  E: { label: "Rank E", color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/10" },
  D: { label: "Rank D", color: "text-teal-400",    border: "border-teal-500/40",    bg: "bg-teal-500/10" },
  C: { label: "Rank C", color: "text-sky-400",     border: "border-sky-500/40",     bg: "bg-sky-500/10" },
  B: { label: "Rank B", color: "text-indigo-400",  border: "border-indigo-500/40",  bg: "bg-indigo-500/10" },
  A: { label: "Rank A", color: "text-fuchsia-400", border: "border-fuchsia-500/40", bg: "bg-fuchsia-500/10" },
  S: { label: "Rank S", color: "text-neon-gold",   border: "border-neon-gold/40",   bg: "bg-neon-gold/10" },
  X: { label: "Rank X", color: "text-neon-cyan",   border: "border-neon-cyan/40",   bg: "bg-neon-cyan/10" },
}

export const ITEM_TYPE_CONFIG: Record<ItemType, { label: string; icon: string; color: string; border: string; bg: string }> = {
  utilitario:  { label: "Utilitario",  icon: "Wrench",    color: "text-amber-400",   border: "border-amber-500/40",   bg: "bg-amber-500/10" },
  equipamento: { label: "Equipamento", icon: "Shield",    color: "text-sky-400",     border: "border-sky-500/40",     bg: "bg-sky-500/10" },
  diversos:    { label: "Diversos",    icon: "Package",   color: "text-zinc-400",    border: "border-zinc-500/40",    bg: "bg-zinc-500/10" },
}

export interface DbPlayer {
  id: number
  name: string
  coins: number
  current_hp: number
  max_hp: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  inventory: InventoryItem[]
  abilities: Ability[]
  created_at: string
  updated_at: string
}

export interface DbShopItem {
  id: number
  name: string
  description: string
  rarity: Rarity
  item_type: ItemType
  price: number
  stock: number
  created_at: string
}

export interface ShopItem {
  id: number
  name: string
  description: string
  rarity: Rarity
  item_type: ItemType
  price: number
  stock: number // -1 = unlimited
}

export function dbShopItemToShopItem(s: DbShopItem): ShopItem {
  return {
    id: s.id,
    name: s.name,
    description: s.description,
    rarity: s.rarity,
    item_type: s.item_type ?? "diversos",
    price: s.price,
    stock: s.stock,
  }
}

export interface DbScenarioLog {
  id: number
  text: string
  type: "system" | "constellation" | "scenario"
  target: string
  timestamp: string
  created_at: string
}

export interface PlayerData {
  id: number
  name: string
  coins: number
  currentHp: number
  maxHp: number
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  inventory: InventoryItem[]
  abilities: Ability[]
  coinFlash: boolean
}

export interface LogEntry {
  id: string
  text: string
  type: "system" | "constellation" | "scenario"
  target: string
  timestamp: string
}

export function dbPlayerToPlayerData(p: DbPlayer): PlayerData {
  return {
    id: p.id,
    name: p.name,
    coins: p.coins,
    currentHp: p.current_hp ?? 100,
    maxHp: p.max_hp ?? 100,
    stats: {
      strength: p.strength,
      dexterity: p.dexterity,
      constitution: p.constitution,
      intelligence: p.intelligence,
      wisdom: p.wisdom,
      charisma: p.charisma,
    },
    inventory: (p.inventory ?? []) as InventoryItem[],
    abilities: (p.abilities ?? []) as Ability[],
    coinFlash: false,
  }
}

export function dbLogToLogEntry(l: DbScenarioLog): LogEntry {
  return {
    id: String(l.id),
    text: l.text,
    type: l.type,
    target: l.target,
    timestamp: l.timestamp,
  }
}
