"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Store, ArrowLeft, Plus, Trash2, Pencil, ChevronDown, Coins, Package, Loader2,
} from "lucide-react"
import type { Rarity, ItemType, ShopItem } from "@/lib/types"
import { RARITY_CONFIG, ITEM_TYPE_CONFIG } from "@/lib/types"
import { useRpgRealtime } from "@/hooks/use-rpg-realtime"
import { useShopFilters } from "@/hooks/use-shop-filters"
import { ShopFilterBar } from "@/components/shop-filter-bar"
import { ShopItemCard } from "@/components/shop-item-card"

const RARITIES: Rarity[] = ["F", "E", "D", "C", "B", "A", "S", "X"]
const ITEM_TYPES: ItemType[] = ["utilitario", "equipamento", "diversos"]

function AddItemForm({ onAdd, onCancel }: {
  onAdd: (item: { name: string; description: string; rarity: string; item_type: string; price: number; stock: number }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rarity, setRarity] = useState<Rarity>("F")
  const [itemType, setItemType] = useState<ItemType>("diversos")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("-1")
  const [rarityOpen, setRarityOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !price) return
    onAdd({
      name: name.trim(),
      description: description.trim(),
      rarity,
      item_type: itemType,
      price: Math.max(0, parseInt(price) || 0),
      stock: parseInt(stock) ?? -1,
    })
  }

  return (
    <div className="rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-4 space-y-3">
      <h3 className="font-mono text-xs font-bold tracking-wider uppercase text-neon-cyan">
        Novo Item
      </h3>
      <input
        type="text"
        placeholder="Nome do item..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
      />
      <textarea
        placeholder="Descricao do item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50 resize-none"
      />
      <div className="grid grid-cols-2 gap-3">
        {/* Rarity selector */}
        <div className="relative">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
            Raridade
          </label>
          <button
            type="button"
            onClick={() => { setRarityOpen(!rarityOpen); setTypeOpen(false) }}
            className={`w-full flex items-center justify-between bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-neon-gold/30 transition-colors ${RARITY_CONFIG[rarity].color}`}
          >
            <span className="font-bold tracking-wider">{RARITY_CONFIG[rarity].label}</span>
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
                    onClick={() => { setRarity(r); setRarityOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider hover:bg-accent/50 transition-colors cursor-pointer ${cfg.color} ${rarity === r ? cfg.bg : ""}`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Type selector */}
        <div className="relative">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
            Tipo
          </label>
          <button
            type="button"
            onClick={() => { setTypeOpen(!typeOpen); setRarityOpen(false) }}
            className={`w-full flex items-center justify-between bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-neon-gold/30 transition-colors ${ITEM_TYPE_CONFIG[itemType].color}`}
          >
            <span className="font-bold tracking-wider">{ITEM_TYPE_CONFIG[itemType].label}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${typeOpen ? "rotate-180" : ""}`} />
          </button>
          {typeOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-popover border border-glass-border shadow-xl overflow-hidden">
              {ITEM_TYPES.map((t) => {
                const cfg = ITEM_TYPE_CONFIG[t]
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => { setItemType(t); setTypeOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider hover:bg-accent/50 transition-colors cursor-pointer ${cfg.color} ${itemType === t ? cfg.bg : ""}`}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Preco</label>
          <div className="relative">
            <Coins className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neon-gold" />
            <input
              type="number"
              placeholder="0"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-background/60 border border-glass-border rounded-lg pl-8 pr-3 py-2 text-sm text-neon-gold font-mono placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
            />
          </div>
        </div>
        <div className="relative">
          <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Estoque</label>
          <div className="relative">
            <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="number"
              placeholder="-1 = ilimitado"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-background/60 border border-glass-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-neon-gold/50"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !price}
          className="flex-1 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase bg-muted/30 border border-glass-border text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

function EditOverlay({ item, onSave, onCancel }: {
  item: ShopItem
  onSave: (id: number, updates: Partial<{ name: string; description: string; rarity: string; item_type: string; price: number; stock: number }>) => void
  onCancel: () => void
}) {
  const [price, setPrice] = useState(String(item.price))
  const [stock, setStock] = useState(String(item.stock))
  const [description, setDescription] = useState(item.description ?? "")

  return (
    <div className="mt-1 space-y-2 rounded-lg border border-glass-border bg-background/60 p-2.5">
      {/* Description edit */}
      <div>
        <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Descricao</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Descricao do item..."
          className="w-full bg-background/60 border border-glass-border rounded px-2.5 py-1.5 text-[11px] text-foreground font-mono focus:outline-none focus:border-neon-gold/50 resize-none leading-relaxed"
        />
      </div>
      {/* Price + Stock row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Preco</label>
            <div className="relative">
              <Coins className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neon-gold" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="w-full bg-background/60 border border-glass-border rounded pl-6 pr-2 py-1.5 text-[11px] text-neon-gold font-mono focus:outline-none focus:border-neon-gold/50"
              />
            </div>
          </div>
          <div className="relative flex-1">
            <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">Estoque</label>
            <div className="relative">
              <Package className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-background/60 border border-glass-border rounded pl-6 pr-2 py-1.5 text-[11px] text-foreground font-mono focus:outline-none focus:border-neon-gold/50"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="flex items-center gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded text-[10px] font-bold uppercase bg-muted/30 border border-glass-border text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={() => onSave(item.id, {
            description: description.trim(),
            price: Math.max(0, parseInt(price) || 0),
            stock: parseInt(stock) ?? -1,
          })}
          className="px-3 py-1.5 rounded text-[10px] font-bold uppercase bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25 transition-all cursor-pointer"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}

export default function LojaPage() {
  const { shopItems, loading, addShopItem, removeShopItem, updateShopItem } = useRpgRealtime()
  const filters = useShopFilters(shopItems)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-neon-gold animate-spin" />
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-neon-gold text-glow-gold">
            Carregando Loja...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.05_220_/_0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.15_0.04_85_/_0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22g%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M60%200H0v60%22%20fill%3D%22none%22%20stroke%3D%22rgba(100%2C180%2C255%2C0.03)%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23g)%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-glass-border glass-panel shrink-0">
          <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="h-9 w-9 rounded-lg bg-muted/30 border border-glass-border flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="h-9 w-9 rounded-lg bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center">
                <Store className="h-5 w-5 text-neon-gold" />
              </div>
              <div>
                <h1 className="font-sans text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-neon-gold text-glow-gold">
                  Gerenciar Loja
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  {shopItems.length} {shopItems.length === 1 ? "item cadastrado" : "itens cadastrados"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase text-neon-cyan hover:bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Novo Item
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Add form */}
            {showAddForm && (
              <AddItemForm
                onAdd={(item) => {
                  addShopItem(item)
                  setShowAddForm(false)
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {/* Filter bar */}
            <ShopFilterBar
              search={filters.search}
              onSearchChange={filters.setSearch}
              selectedRarities={filters.selectedRarities}
              onToggleRarity={filters.toggleRarity}
              selectedTypes={filters.selectedTypes}
              onToggleType={filters.toggleType}
              onClearAll={filters.clearAll}
              totalItems={filters.totalItems}
              filteredCount={filters.filtered.length}
            />

            {/* Items grid */}
            {filters.filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Store className="h-12 w-12 mb-4 opacity-30" />
                <span className="text-sm font-mono">
                  {shopItems.length === 0 ? "Loja vazia" : "Nenhum item encontrado"}
                </span>
                <span className="text-xs font-mono mt-1 opacity-60">
                  {shopItems.length === 0
                    ? "Adicione itens para os jogadores comprarem"
                    : "Tente ajustar os filtros"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filters.filtered.map((item) => (
                  <div key={item.id}>
                    <ShopItemCard item={item}>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                          className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-neon-gold hover:bg-neon-gold/10 transition-colors cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeShopItem(item.id)}
                          className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </ShopItemCard>
                    {editingId === item.id && (
                      <EditOverlay
                        item={item}
                        onSave={(id, updates) => {
                          updateShopItem(id, updates)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
