export type Rarity = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "X"

export type ItemType = "utilitario" | "equipamento" | "diversos"

export interface Ability {
  id: string
  name: string
  description: string
  level: number
  cooldown: number
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  rarity: Rarity
  quantity: number
}

export interface LogEntry {
  id: number
  text: string
  type: "system" | "constellation" | "scenario"
  timestamp: string
}

export interface ShopItem {
  id: number
  name: string
  description: string
  rarity: Rarity
  item_type: ItemType
  price: number
  stock: number
}

export interface PlayerData {
  id: number
  name: string
  currentHp: number
  maxHp: number
  coins: number
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  armorClass: number
  movementSpeed: number
  abilities: Ability[]
  inventory: InventoryItem[]
  coinFlash?: boolean
}

// Database types
export interface DbPlayer {
  id: number
  name: string
  current_hp: number
  max_hp: number
  coins: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  armor_class: number
  movement_speed: number
  abilities: Ability[]
  inventory: InventoryItem[]
  created_at: string
  updated_at: string
}

export interface DbScenarioLog {
  id: number
  text: string
  type: "system" | "constellation" | "scenario"
  target: string
  timestamp: string
  created_at: string
}

export interface DbShopItem {
  id: number
  name: string
  description: string
  rarity: string
  item_type: string
  price: number
  stock: number
  created_at: string
}

// Mappers
export function dbPlayerToPlayerData(db: DbPlayer): PlayerData {
  return {
    id: db.id,
    name: db.name,
    currentHp: db.current_hp,
    maxHp: db.max_hp,
    coins: db.coins,
    stats: {
      strength: db.strength,
      dexterity: db.dexterity,
      constitution: db.constitution,
      intelligence: db.intelligence,
      wisdom: db.wisdom,
      charisma: db.charisma,
    },
    armorClass: db.armor_class ?? 10,
    movementSpeed: db.movement_speed ?? 30,
    abilities: (db.abilities as Ability[]) ?? [],
    inventory: (db.inventory as InventoryItem[]) ?? [],
    coinFlash: false,
  }
}

export function dbLogToLogEntry(db: DbScenarioLog): LogEntry {
  return {
    id: db.id,
    text: db.text,
    type: db.type,
    timestamp: db.timestamp,
  }
}

export function dbShopItemToShopItem(db: DbShopItem): ShopItem {
  return {
    id: db.id,
    name: db.name,
    description: db.description ?? "",
    rarity: db.rarity as Rarity,
    item_type: (db.item_type ?? "diversos") as ItemType,
    price: db.price,
    stock: db.stock,
  }
}

// Rarity configuration
export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bg: string; border: string }> = {
  F: { label: "F — Comum", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
  E: { label: "E — Incomum", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  D: { label: "D — Raro", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  C: { label: "C — Epico", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  B: { label: "B — Lendario", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  A: { label: "A — Mitico", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  S: { label: "S — Divino", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  X: { label: "X — ???", color: "text-neon-cyan", bg: "bg-neon-cyan/10", border: "border-neon-cyan/20" },
}

export const ITEM_TYPE_CONFIG: Record<ItemType, { label: string; color: string; bg: string; border: string }> = {
  utilitario: { label: "Utilitario", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
  equipamento: { label: "Equipamento", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  diversos: { label: "Diversos", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
}
