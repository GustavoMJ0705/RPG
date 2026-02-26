"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  Store, ArrowLeft, Coins, ShoppingCart, AlertCircle, Loader2, AlertTriangle,
} from "lucide-react"
import type { ShopItem } from "@/lib/types"
import { usePlayerRealtime } from "@/hooks/use-player-realtime"
import { useShopFilters } from "@/hooks/use-shop-filters"
import { ShopFilterBar } from "@/components/shop-filter-bar"
import { ShopItemCard } from "@/components/shop-item-card"

export default function PlayerLojaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const playerId = parseInt(id, 10)
  const { player, shopItems, loading, notFound, buyShopItem } = usePlayerRealtime(playerId)

  const availableItems = shopItems.filter((i) => i.stock !== 0)
  const filters = useShopFilters(availableItems)

  const [buying, setBuying] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ id: number; msg: string; type: "success" | "error" } | null>(null)

  const handleBuy = async (item: ShopItem) => {
    setBuying(item.id)
    setFeedback(null)
    const result = await buyShopItem(item)
    if (result.success) {
      setFeedback({ id: item.id, msg: "Compra realizada!", type: "success" })
    } else {
      setFeedback({ id: item.id, msg: result.error ?? "Erro na compra", type: "error" })
    }
    setBuying(null)
    setTimeout(() => setFeedback(null), 2500)
  }

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
                href={`/player/${id}`}
                className="h-9 w-9 rounded-lg bg-muted/30 border border-glass-border flex items-center justify-center hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div className="h-9 w-9 rounded-lg bg-neon-gold/10 border border-neon-gold/30 flex items-center justify-center">
                <Store className="h-5 w-5 text-neon-gold" />
              </div>
              <div>
                <h1 className="font-sans text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-neon-gold text-glow-gold">
                  Loja
                </h1>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
                  {availableItems.length} {availableItems.length === 1 ? "item disponivel" : "itens disponiveis"}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold transition-all ${player.coinFlash ? "animate-coin-flash" : ""}`}>
              <Coins className="h-4 w-4 text-neon-gold" />
              <span className="font-sans text-sm font-bold tabular-nums text-neon-gold text-glow-gold">
                {player.coins}
              </span>
              <span className="text-[10px] text-neon-gold/60 uppercase tracking-wider hidden sm:inline">coins</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin">
          <div className="max-w-6xl mx-auto space-y-4">
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
                  {availableItems.length === 0 ? "Loja vazia" : "Nenhum item encontrado"}
                </span>
                <span className="text-xs font-mono mt-1 opacity-60">
                  {availableItems.length === 0
                    ? "Nenhum item disponivel no momento"
                    : "Tente ajustar os filtros"}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filters.filtered.map((item) => {
                  const canAfford = player.coins >= item.price
                  const isBuying = buying === item.id
                  const itemFeedback = feedback?.id === item.id ? feedback : null

                  return (
                    <div key={item.id} className="flex flex-col gap-1">
                      <ShopItemCard item={item}>
                        <button
                          onClick={() => handleBuy(item)}
                          disabled={!canAfford || isBuying}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer disabled:cursor-not-allowed ${
                            canAfford
                              ? "bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25"
                              : "bg-muted/20 border border-glass-border text-muted-foreground opacity-50"
                          }`}
                        >
                          <ShoppingCart className="h-3 w-3" />
                          {isBuying ? "..." : "Comprar"}
                        </button>
                      </ShopItemCard>
                      {itemFeedback && (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold ${
                          itemFeedback.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-neon-red/10 border border-neon-red/30 text-neon-red"
                        }`}>
                          {itemFeedback.type === "error" && <AlertCircle className="h-3 w-3" />}
                          {itemFeedback.msg}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
