"use client"

import { useState } from "react"
import { Package, Plus, Trash2, ChevronDown } from "lucide-react"
import type { InventoryItem, Rarity } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"

const RARITIES: Rarity[] = ["F", "E", "D", "C", "B", "A", "S", "X"]

interface InventoryPanelProps {
  items: InventoryItem[]
  onUpdateInventory: (items: InventoryItem[]) => void
  compact?: boolean
}

export function InventoryPanel({ items, onUpdateInventory, compact = false }: InventoryPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newRarity, setNewRarity] = useState<Rarity>("F")
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [rarityOpen, setRarityOpen] = useState(false)

  const handleAdd = () => {
    if (!newName.trim()) return
    const item: InventoryItem = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      description: newDescription.trim(),
      rarity: newRarity,
      quantity: 1,
    }
    onUpdateInventory([...items, item])
    setNewName("")
    setNewDescription("")
    setNewRarity("F")
    setShowAddForm(false)
  }

  const handleRemove = (id: string) => {
    onUpdateInventory(items.filter((i) => i.id !== id))
  }

  const handleQuantity = (id: string, delta: number) => {
    onUpdateInventory(
      items
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  return (
    <div className={`glass-panel rounded-xl flex flex-col ${compact ? "max-h-[350px]" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-neon-gold" />
          <h2 className="font-mono text-sm font-bold tracking-wider uppercase text-neon-gold">
            Inventario
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-neon-cyan hover:bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all cursor-pointer"
        >
          <Plus className="h-3 w-3" />
          Item
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="px-4 py-3 border-b border-glass-border space-y-2">
          <input
            type="text"
            placeholder="Nome do item..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50"
          />
          <textarea
            placeholder="Descricao do item..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
            className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 resize-none"
          />
          {/* Custom rarity selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRarityOpen(!rarityOpen)}
              className={`w-full flex items-center justify-between bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-neon-cyan/30 transition-colors ${RARITY_CONFIG[newRarity].color}`}
            >
              <span className="font-bold tracking-wider">{RARITY_CONFIG[newRarity].label}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${rarityOpen ? "rotate-180" : ""}`} />
            </button>
            {rarityOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-popover border border-glass-border shadow-xl overflow-hidden">
                {RARITIES.map((r) => {
                  const cfg = RARITY_CONFIG[r]
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setNewRarity(r)
                        setRarityOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider hover:bg-accent/50 transition-colors cursor-pointer ${cfg.color} ${newRarity === r ? cfg.bg : ""}`}
                    >
                      {cfg.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Adicionar
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-muted/30 border border-glass-border text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Package className="h-8 w-8 mb-2 opacity-40" />
            <span className="text-xs font-mono">Inventario vazio</span>
          </div>
        ) : (
          items.map((item) => {
            const cfg = RARITY_CONFIG[item.rarity]
            const isExpanded = expandedItem === item.id
            return (
              <div
                key={item.id}
                className={`rounded-lg border ${cfg.border} ${cfg.bg} transition-all`}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${cfg.color} truncate`}>{item.name}</span>
                      <span className={`text-[9px] font-mono uppercase tracking-wider ${cfg.color} opacity-70`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleQuantity(item.id, -1)}
                      className="h-5 w-5 flex items-center justify-center rounded text-[10px] font-bold text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-foreground w-5 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity(item.id, 1)}
                      className="h-5 w-5 flex items-center justify-center rounded text-[10px] font-bold text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(item.id) }}
                    className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                </div>
                {isExpanded && item.description && (
                  <div className="px-3 pb-2 border-t border-glass-border/50 pt-2">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
