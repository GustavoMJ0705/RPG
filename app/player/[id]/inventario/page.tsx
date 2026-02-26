"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertTriangle, Package, Plus, ChevronDown, Coins } from "lucide-react"
import { usePlayerRealtime } from "@/hooks/use-player-realtime"
import { useInventoryFilters } from "@/hooks/use-inventory-filters"
import { InventoryFilterBar } from "@/components/inventory-filter-bar"
import { InventoryItemCard } from "@/components/inventory-item-card"
import type { InventoryItem, Rarity } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"

const RARITIES: Rarity[] = ["F", "E", "D", "C", "B", "A", "S", "X"]

function AddItemForm({ onAdd, onCancel }: { onAdd: (item: InventoryItem) => void; onCancel: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rarity, setRarity] = useState<Rarity>("F")
  const [rarityOpen, setRarityOpen] = useState(false)

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      rarity,
      quantity: 1,
    })
    setName("")
    setDescription("")
    setRarity("F")
  }

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <input
        type="text"
        placeholder="Nome do item..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50"
      />
      <textarea
        placeholder="Descricao do item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 resize-none"
      />
      {/* Rarity selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setRarityOpen(!rarityOpen)}
          className={`w-full flex items-center justify-between bg-background/60 border border-glass-border rounded-lg px-3 py-2 text-xs cursor-pointer hover:border-neon-cyan/30 transition-colors ${RARITY_CONFIG[rarity].color}`}
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
      <div className="flex gap-2">
        <button
          onClick={handleAdd}
          disabled={!name.trim()}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Adicionar
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase bg-muted/30 border border-glass-border text-muted-foreground hover:bg-muted/50 transition-all cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default function InventarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const playerId = parseInt(id, 10)
  const { player, loading, notFound, updateInventory } = usePlayerRealtime(playerId)
  const [showAddForm, setShowAddForm] = useState(false)

  const items = player?.inventory ?? []
  const {
    search,
    setSearch,
    selectedRarities,
    toggleRarity,
    clearAll,
    filtered,
    totalItems,
  } = useInventoryFilters(items)

  const handleQuantityChange = (itemId: string, delta: number) => {
    const updated = items
      .map((i) => (i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
      .filter((i) => i.quantity > 0)
    updateInventory(updated)
  }

  const handleRemove = (itemId: string) => {
    updateInventory(items.filter((i) => i.id !== itemId))
  }

  const handleAddItem = (item: InventoryItem) => {
    updateInventory([...items, item])
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-neon-cyan text-glow-cyan">
            Carregando inventario...
          </p>
        </div>
      </div>
    )
  }

  if (notFound || !player) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-neon-red" />
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-neon-red text-glow-red">
            Player Not Found
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.05_220_/_0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.15_0.04_85_/_0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22g%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M60%200H0v60%22%20fill%3D%22none%22%20stroke%3D%22rgba(100%2C180%2C255%2C0.03)%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23g)%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-glass-border glass-panel">
          <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/player/${id}`}
                className="h-9 w-9 rounded-lg bg-secondary/50 border border-glass-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </Link>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-neon-cyan" />
                <div>
                  <h1 className="font-sans text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-foreground">
                    Inventario
                  </h1>
                  <p className="text-[10px] text-muted-foreground tracking-wider">{player.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase text-neon-cyan hover:bg-neon-cyan/10 border border-neon-cyan/30 hover:border-neon-cyan/50 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Item
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-gold/10 border border-neon-gold/20">
                <Coins className="h-3.5 w-3.5 text-neon-gold" />
                <span className="text-sm font-mono font-bold text-neon-gold tabular-nums">{player.coins}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-4 lg:p-6 space-y-4">
          {/* Add Form */}
          {showAddForm && (
            <AddItemForm
              onAdd={handleAddItem}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Filters */}
          <div className="glass-panel rounded-xl p-4">
            <InventoryFilterBar
              search={search}
              onSearchChange={setSearch}
              selectedRarities={selectedRarities}
              onToggleRarity={toggleRarity}
              onClearAll={clearAll}
              totalItems={totalItems}
              filteredCount={filtered.length}
            />
          </div>

          {/* Items Grid */}
          {filtered.length === 0 ? (
            <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mb-3 opacity-30" />
              <span className="text-sm font-mono">
                {totalItems === 0 ? "Inventario vazio" : "Nenhum item encontrado"}
              </span>
              {totalItems === 0 && (
                <span className="text-xs font-mono mt-1 opacity-60">Compre itens na loja ou adicione manualmente</span>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
