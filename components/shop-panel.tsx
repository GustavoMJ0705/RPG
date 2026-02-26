"use client"

import { useState } from "react"
import { Store, Coins, ShoppingCart, ChevronDown, AlertCircle, Package } from "lucide-react"
import type { ShopItem } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ShopPanelProps {
  items: ShopItem[]
  playerCoins: number
  onBuy: (item: ShopItem) => Promise<{ success: boolean; error?: string }>
}

export function ShopPanel({ items, playerCoins, onBuy }: ShopPanelProps) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const [buying, setBuying] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ id: number; msg: string; type: "success" | "error" } | null>(null)

  const handleBuy = async (item: ShopItem) => {
    setBuying(item.id)
    setFeedback(null)
    const result = await onBuy(item)
    if (result.success) {
      setFeedback({ id: item.id, msg: "Compra realizada!", type: "success" })
    } else {
      setFeedback({ id: item.id, msg: result.error ?? "Erro na compra", type: "error" })
    }
    setBuying(null)
    setTimeout(() => setFeedback(null), 2500)
  }

  const availableItems = items.filter((i) => i.stock !== 0)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold hover:bg-neon-gold/15 border border-neon-gold/30 transition-all cursor-pointer">
          <Store className="h-4 w-4 text-neon-gold" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-neon-gold text-glow-gold">
            Loja
          </span>
          {availableItems.length > 0 && (
            <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-gold/20 text-[9px] font-mono font-bold text-neon-gold">
              {availableItems.length}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg max-h-[85vh] p-0 bg-background/95 backdrop-blur-xl border-neon-gold/30 shadow-[0_0_40px_oklch(0.85_0.17_85_/_0.1)] overflow-hidden"
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
                  Loja
                </DialogTitle>
                <DialogDescription className="sr-only">Compre itens usando seus coins</DialogDescription>
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {availableItems.length} {availableItems.length === 1 ? "item disponivel" : "itens disponiveis"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-gold/10 border border-neon-gold/20">
              <Coins className="h-3.5 w-3.5 text-neon-gold" />
              <span className="text-sm font-mono font-bold text-neon-gold tabular-nums">{playerCoins}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Divider */}
        <div className="h-px bg-neon-gold/15 mx-5" />

        {/* Items List */}
        <div className="overflow-y-auto px-5 pb-5 space-y-2 max-h-[60vh] scrollbar-thin">
          {availableItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Store className="h-10 w-10 mb-3 opacity-30" />
              <span className="text-xs font-mono">Loja vazia</span>
              <span className="text-[10px] font-mono mt-1 opacity-60">Nenhum item disponivel no momento</span>
            </div>
          ) : (
            availableItems.map((item) => {
              const cfg = RARITY_CONFIG[item.rarity]
              const isExpanded = expandedItem === item.id
              const canAfford = playerCoins >= item.price
              const isBuying = buying === item.id
              const itemFeedback = feedback?.id === item.id ? feedback : null

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
                        <span className={`flex items-center gap-1 text-[10px] font-mono ${canAfford ? "text-neon-gold" : "text-neon-red"}`}>
                          <Coins className="h-2.5 w-2.5" />
                          {item.price}
                        </span>
                        {item.stock > 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                            <Package className="h-2.5 w-2.5" />
                            {item.stock} restantes
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-glass-border/50 pt-2 space-y-2">
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                      )}
                      {/* Feedback */}
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
                      {/* Buy Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuy(item) }}
                        disabled={!canAfford || isBuying}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all cursor-pointer disabled:cursor-not-allowed ${
                          canAfford
                            ? "bg-neon-gold/15 border border-neon-gold/30 text-neon-gold hover:bg-neon-gold/25"
                            : "bg-muted/20 border border-glass-border text-muted-foreground opacity-50"
                        }`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {isBuying ? "Comprando..." : !canAfford ? "Coins insuficientes" : `Comprar por ${item.price}`}
                      </button>
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
