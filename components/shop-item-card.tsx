"use client"

import { useState } from "react"
import { Coins, Package, Wrench, Shield, Archive, Infinity, X } from "lucide-react"
import type { ShopItem } from "@/lib/types"
import { RARITY_CONFIG, ITEM_TYPE_CONFIG } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const TYPE_ICONS = {
  utilitario: Wrench,
  equipamento: Shield,
  diversos: Archive,
} as const

interface ShopItemCardProps {
  item: ShopItem
  children?: React.ReactNode
}

export function ShopItemCard({ item, children }: ShopItemCardProps) {
  const [open, setOpen] = useState(false)
  const rarityCfg = RARITY_CONFIG[item.rarity]
  const typeCfg = ITEM_TYPE_CONFIG[item.item_type]
  const TypeIcon = TYPE_ICONS[item.item_type]

  return (
    <>
      <div
        className={`group rounded-lg border ${rarityCfg.border} ${rarityCfg.bg} transition-all hover:brightness-110`}
      >
        <div className="p-3 flex flex-col gap-2">
          {/* Top row: name + badges (clickable) */}
          <div
            className="flex items-start gap-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="h-8 w-8 rounded-md flex items-center justify-center shrink-0 bg-background/40 border border-glass-border">
              <TypeIcon className={`h-4 w-4 ${typeCfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-bold ${rarityCfg.color} truncate`}>
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[9px] font-mono uppercase tracking-wider ${rarityCfg.color} opacity-70`}>
                  {rarityCfg.label}
                </span>
                <span className="text-[8px] text-muted-foreground/50">|</span>
                <span className={`text-[9px] font-mono uppercase tracking-wider ${typeCfg.color} opacity-70`}>
                  {typeCfg.label}
                </span>
              </div>
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

          {/* Bottom row: price + stock + actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-neon-gold">
                <Coins className="h-3 w-3" />
                {item.price}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                {item.stock < 0 ? (
                  <>
                    <Infinity className="h-3 w-3" />
                    <span>Ilimitado</span>
                  </>
                ) : (
                  <>
                    <Package className="h-3 w-3" />
                    <span>{item.stock}</span>
                  </>
                )}
              </span>
            </div>
            {children}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={`sm:max-w-md p-0 bg-background/95 backdrop-blur-xl border ${rarityCfg.border} shadow-[0_0_40px_oklch(0.85_0.17_85_/_0.08)] overflow-hidden`}
        >
          <DialogHeader className="px-5 pt-5 pb-0">
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${rarityCfg.bg} border ${rarityCfg.border}`}>
                <TypeIcon className={`h-5 w-5 ${typeCfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className={`font-mono text-sm font-bold tracking-wider ${rarityCfg.color}`}>
                  {item.name}
                </DialogTitle>
                <DialogDescription className="sr-only">Detalhes do item {item.name}</DialogDescription>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${rarityCfg.color} opacity-80`}>
                    {rarityCfg.label}
                  </span>
                  <span className="text-[8px] text-muted-foreground/50">|</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${typeCfg.color} opacity-80`}>
                    {typeCfg.label}
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

            {/* Stats row */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-neon-gold" />
                <span className="text-sm font-mono font-bold text-neon-gold">{item.price}</span>
                <span className="text-[9px] text-neon-gold/60 uppercase">coins</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.stock < 0 ? (
                  <>
                    <Infinity className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">Ilimitado</span>
                  </>
                ) : (
                  <>
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-mono text-muted-foreground">{item.stock} restantes</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
