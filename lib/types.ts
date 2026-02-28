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

// Atributo base para modificador de perícias
export type SkillAttribute = "FOR" | "DES" | "CON" | "INT" | "SAB" | "CAR"

export interface Skill {
  id: string
  name: string
  customName?: string // Para perícias com nome personalizável (Atuação, Conhecimento, Ofício)
  attribute: SkillAttribute
  trained: boolean
  ranks: number
  miscBonus: number
  isCustom?: boolean // Para as 3 perícias personalizadas
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
  armor_class: number
  speed: number
  inventory: InventoryItem[]
  abilities: Ability[]
  skills: Skill[]
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
  armorClass: number
  speed: number
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
  skills: Skill[]
  coinFlash: boolean
}

export interface LogEntry {
  id: string
  text: string
  type: "system" | "constellation" | "scenario"
  target: string
  timestamp: string
}

// Perícias padrão do sistema
export const DEFAULT_SKILLS: Omit<Skill, "id">[] = [
  { name: "Acrobacia", attribute: "DES", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Adestrar Animais", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Atletismo", attribute: "FOR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Atuação", customName: "", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Atuação", customName: "", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Cavalgar", attribute: "DES", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Conhecimento", customName: "", attribute: "INT", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Conhecimento", customName: "", attribute: "INT", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Cura", attribute: "SAB", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Diplomacia", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Enganação", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Furtividade", attribute: "DES", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Identificar Magia", attribute: "INT", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Iniciativa", attribute: "DES", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Intimidação", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Intuição", attribute: "SAB", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Ladinagem", attribute: "DES", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Obter Informação", attribute: "CAR", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Ofício", customName: "", attribute: "INT", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Ofício", customName: "", attribute: "INT", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Percepção", attribute: "SAB", trained: false, ranks: 0, miscBonus: 0 },
  { name: "Sobrevivência", attribute: "SAB", trained: false, ranks: 0, miscBonus: 0 },
]

export function getDefaultSkills(): Skill[] {
  return DEFAULT_SKILLS.map((s, i) => ({
    ...s,
    id: `skill-${i}`,
  }))
}

export function dbPlayerToPlayerData(p: DbPlayer): PlayerData {
  return {
    id: p.id,
    name: p.name,
    coins: p.coins,
    currentHp: p.current_hp ?? 100,
    maxHp: p.max_hp ?? 100,
    armorClass: p.armor_class ?? 10,
    speed: p.speed ?? 9,
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
    skills: (p.skills ?? getDefaultSkills()) as Skill[],
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
