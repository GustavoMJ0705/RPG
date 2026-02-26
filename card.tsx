"use client"

import { useState } from "react"
import { Store, Plus, Trash2, ChevronDown, Coins, Package, Pencil } from "lucide-react"
import type { ShopItem, Rarity } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const RARITIES: Rarity[] = ["F", "E", "D", "C", "B", "A", "S", "X"]

interface ShopManagerProps {
  items: ShopItem[]
  onAddItem: (item: { name: string; description: string; rarity: string; price: number; stock: number }) => void
  onRemoveItem: (itemId: number) => void
  onUpdateItem: (itemId: number, updates: Partial<{ name: string; description: string; rarity: string; price: number; stock: number }>) => void
}

export function ShopManager({ items, onAddItem, onRemoveItem, onUpdateItem }: ShopManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newRarity, setNewRarity] = useState<Rarity>("F")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("-1")
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [rarityOpen, setRarityOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState("")
  const [editStock, setEditStock] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const handleAdd = () => {
    if (!newName.trim() || !newPrice) return
    onAddItem({
      name: newName.trim(),
      description: newDescription.trim(),
      rarity: newRarity,
      price: Math.max(0, parseInt(newPrice) || 0),
      stock: parseInt(newStock) ?? -1,
    })
    setNewName("")
    setNewDescription("")
    setNewRarity("F")
    setNewPrice("")
    setNewStock("-1")
    setShowAddForm(false)
  }

  const handleStartEdit = (item: ShopItem) => {
    setEditingItem(item.id)
    setEditPrice(String(item.price))
    setEditStock(String(item.stock))
    setEditDescription(item.description ?? "")
  }

  const handleSaveEdit = (item: ShopItem) => {
    const price = Math.max(0, parseInt(editPrice) || 0)
    const stock = parseInt(editStock) ?? -1
    const description = editDescription.trim()
    if (price !== item.price || stock !== item.stock || description !== item.description) {
      onUpdateItem(item.id, { price, stock, description })
    }
    setEditingItem(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold hover:bg-neon-gold/15 border border-neon-gold/30 transition-all cursor-pointer">
          <Store className="h-4 w-4 text-neon-gold" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-neon-gold text-glow-gold">
            Loja
          </span>
          {items.length > 0 && (
            <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-gold/20 text-[9px] font-mono font-bold text-neon-gold">
              {items.length}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl max-h-[85vh] p-0 bg-background/95 backdrop-blur-xl border-neon-gold/30 shadow-[0_0_40px_oklch(0.85_0.17_85_/_0.1)] overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center">
                <Store className="h-4 w-4 text-neon-gold" />
              </div>
              <div>
                <DialogTitle className="font-mono text-sm font-bold tracking-wider uppercase text-neon-gold text-glow-gold">
                  Gerenciar Loja
                </DialogTitle>
                <DialogDescription className="sr-only">Adicione, edite ou remova itens da loja</DialogDescription>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {items.length} {items.length === 1 ? "item cadastrado" : "itens cadastrados"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold tracking-wider uppercase text-neon-cyan hover:bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar Item
            </button>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px bg-neon-gold/15 mx-5" />

        {/* Add Form */}
        {showAddForm && (
          <div className="mx-5 px-4 py-3 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 space-y-2">
            <input
              type="text"
              placeholder="Nome do item..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
            />
            <textarea
              placeholder="Descricao do item..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50 resize-none"
            />
            {/* Custom rarity selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRarityOpen(!rarityOpen)}
                className={`w-full flex items-center justify-between bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-neon-gold/30 transition-colors ${RARITY_CONFIG[newRarity].color}`}
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
              <div className="flex-1 relative">
                <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-neon-gold" />
                <input
                  type="number"
                  placeholder="Preco"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-background/60 border border-glass-border rounded-lg pl-7 pr-3 py-2 text-xs text-neon-gold font-mono placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
                />
              </div>
              <div className="flex-1 relative">
                <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Estoque (-1 = ilimitado)"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full bg-background/60 border border-glass-border rounded-lg pl-7 pr-3 py-2 text-xs text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={!newName.trim() || !newPrice}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
        <div className="overflow-y-auto px-5 pb-5 space-y-2 max-h-[55vh] scrollbar-thin">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Store className="h-10 w-10 mb-3 opacity-30" />
              <span className="text-xs font-mono">Loja vazia</span>
              <span className="text-[10px] font-mono mt-1 opacity-60">Adicione itens para os jogadores comprarem</span>
            </div>
          ) : (
            items.map((item) => {
              const cfg = RARITY_CONFIG[item.rarity]
              const isExpanded = expandedItem === item.id
              const isEditing = editingItem === item.id
              return (
                <div
                  key={item.id}
                  className={`rounded-lg border ${cfg.border} ${cfg.bg} transition-all`}
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${cfg.color} truncate`}>{item.name}</span>
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${cfg.color} opacity-70`}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] font-mono text-neon-gold">
                          <Coins className="h-2.5 w-2.5" />
                          {item.price}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {item.stock < 0 ? "Ilimitado" : `Estoque: ${item.stock}`}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id) }}
                      className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-glass-border/50 pt-2 space-y-2">
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                      {isEditing ? (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <label className="text-[9px] font-mono uppercase text-muted-foreground">Descricao</label>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={3}
                              placeholder="Descricao do item..."
                              className="w-full bg-background/60 border border-glass-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-neon-gold/50 resize-none leading-relaxed"
                            />
                          </div>
                          <div className="flex gap-2 items-end">
                            <div className="flex-1">
                              <label className="text-[9px] font-mono uppercase text-muted-foreground">Preco</label>
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                min="0"
                                className="w-full bg-background/60 border border-glass-border rounded px-2 py-1.5 text-xs text-neon-gold font-mono focus:outline-none focus:border-neon-gold/50"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[9px] font-mono uppercase text-muted-foreground">Estoque</label>
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-full bg-background/60 border border-glass-border rounded px-2 py-1.5 text-xs text-foreground font-mono focus:outline-none focus:border-neon-gold/50"
                              />
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setEditingItem(null)}
                                className="px-2.5 py-1.5 rounded text-[10px] font-bold uppercase bg-muted/30 border border-glass-border text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer"
                              >
                                X
                              </button>
                              <button
                                onClick={() => handleSaveEdit(item)}
                                className="px-3 py-1.5 rounded text-[10px] font-bold uppercase bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25 transition-all cursor-pointer"
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartEdit(item) }}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-neon-gold transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar item
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
