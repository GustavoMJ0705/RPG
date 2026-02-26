"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, X } from "lucide-react"
import type { InventoryItem } from "@/lib/types"
import { RARITY_CONFIG } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface InventoryItemCardProps {
  item: InventoryItem
  onQuantityChange?: (id: string, delta: number) => void
  onRemove?: (id: string) => void
}

export function InventoryItemCard({ item, onQuantityChange, onRemove }: InventoryItemCardProps) {
  const [open, setOpen] = useState(false)
  const cfg = RARITY_CONFIG[item.rarity]

  return (
    <>
      <div
        className={`group rounded-lg border ${cfg.border} ${cfg.bg} transition-all hover:brightness-110`}
      >
        <div className="p-3 flex flex-col gap-2">
          {/* Top row: name + rarity (clickable) */}
          <div
            className="flex items-start gap-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 bg-background/40 border border-glass-border`}>
              <span className={`text-[10px] font-mono font-bold ${cfg.color}`}>{item.rarity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`text-xs font-bold ${cfg.color} truncate block`}>
                {item.name}
              </span>
              <span className={`text-[9px] font-mono uppercase tracking-wider ${cfg.color} opacity-70`}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Description (clickable) */}
          {item.description && (
            <p
              className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2 cursor-pointer"
              onClick={() => setOpen(true)}
            >
              {item.description}
            </p>
          )}

          {/* Bottom row: quantity controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {onQuantityChange && (
                <button
                  onClick={() => onQuantityChange(item.id, -1)}
                  className="h-6 w-6 flex items-center justify-center rounded text-[10px] font-bold text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer border border-glass-border"
                >
                  <Minus className="h-3 w-3" />
                </button>
              )}
              <span className="text-xs font-mono font-bold text-foreground min-w-[20px] text-center tabular-nums">
                {item.quantity}x
              </span>
              {onQuantityChange && (
                <button
                  onClick={() => onQuantityChange(item.id, 1)}
                  className="h-6 w-6 flex items-center justify-center rounded text-[10px] font-bold text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors cursor-pointer border border-glass-border"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer border border-glass-border"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={`sm:max-w-md p-0 bg-background/95 backdrop-blur-xl border ${cfg.border} shadow-[0_0_40px_oklch(0.85_0.17_85_/_0.08)] overflow-hidden`}
        >
          <DialogHeader className="px-5 pt-5 pb-0">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                <span className={`text-sm font-mono font-bold ${cfg.color}`}>{item.rarity}</span>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className={`font-mono text-sm font-bold tracking-wider ${cfg.color}`}>
                  {item.name}
                </DialogTitle>
                <DialogDescription className="sr-only">Detalhes do item {item.name}</DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${cfg.color} opacity-80`}>
                    {cfg.label}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50">|</span>
                  <span className="text-[10px] font-mono text-foreground">
                    {item.quantity}x
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          <div className="h-px bg-glass-border mx-5 mt-3" />

          <div className="px-5 pb-5 pt-3 space-y-4">
            {/* Full description */}
            {item.description ? (
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Descricao</span>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic">Sem descricao</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
