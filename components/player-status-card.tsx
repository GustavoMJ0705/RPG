"use client"

import { useState } from "react"
import Link from "next/link"
import { Swords, Shield, Heart, Brain, BookOpen, Sparkles, Package, X, Coins, Minus, Plus, Zap, ShieldHalf, Footprints } from "lucide-react"
import { HpBar } from "@/components/hp-bar"
import { AbilitiesPanel } from "@/components/abilities-panel"
import type { PlayerData, InventoryItem, Ability } from "@/lib/types"

const STAT_CONFIG = [
  { key: "strength", dbKey: "strength", label: "FOR", icon: Swords, color: "text-neon-red", barClass: "bg-neon-red shadow-[0_0_6px_oklch(0.65_0.22_25_/_0.5)]" },
  { key: "dexterity", dbKey: "dexterity", label: "DES", icon: Shield, color: "text-neon-cyan", barClass: "bg-neon-cyan shadow-[0_0_6px_oklch(0.8_0.15_195_/_0.5)]" },
  { key: "constitution", dbKey: "constitution", label: "CON", icon: Heart, color: "text-emerald-400", barClass: "bg-emerald-400 shadow-[0_0_6px_oklch(0.7_0.17_160_/_0.5)]" },
  { key: "intelligence", dbKey: "intelligence", label: "INT", icon: Brain, color: "text-neon-gold", barClass: "bg-neon-gold shadow-[0_0_6px_oklch(0.85_0.17_85_/_0.5)]" },
  { key: "wisdom", dbKey: "wisdom", label: "SAB", icon: BookOpen, color: "text-amber-400", barClass: "bg-amber-400 shadow-[0_0_6px_oklch(0.8_0.15_85_/_0.5)]" },
  { key: "charisma", dbKey: "charisma", label: "CAR", icon: Sparkles, color: "text-fuchsia-400", barClass: "bg-fuchsia-400 shadow-[0_0_6px_oklch(0.7_0.17_320_/_0.5)]" },
] as const

type StatKey = typeof STAT_CONFIG[number]["key"]

interface PlayerStatusCardProps {
  player: PlayerData
  onUpdateStat?: (playerId: number, stat: string, value: number) => void
  onUpdateHp?: (playerId: number, currentHp: number, maxHp: number) => void
  onUpdateAbilities?: (playerId: number, abilities: Ability[]) => void
  onUpdateInventory?: (playerId: number, items: InventoryItem[]) => void
}

function StatBar({
  label,
  value,
  icon: Icon,
  color,
  barClass,
  onIncrement,
  onDecrement,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  barClass: string
  onIncrement?: () => void
  onDecrement?: () => void
}) {
  const percent = Math.min((value / 100) * 100, 100)

  return (
    <div className="flex items-center gap-2">
      <div className={`shrink-0 ${color}`}>
        <Icon className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
          <div className="flex items-center gap-1">
            {onDecrement && (
              <button
                onClick={onDecrement}
                className="h-4 w-4 rounded flex items-center justify-center bg-secondary/80 hover:bg-neon-red/20 hover:text-neon-red text-muted-foreground transition-colors cursor-pointer"
              >
                <Minus className="h-2.5 w-2.5" />
              </button>
            )}
            <span className={`text-[10px] font-bold tabular-nums min-w-[20px] text-center ${color}`}>{value}</span>
            {onIncrement && (
              <button
                onClick={onIncrement}
                className="h-4 w-4 rounded flex items-center justify-center bg-secondary/80 hover:bg-neon-cyan/20 hover:text-neon-cyan text-muted-foreground transition-colors cursor-pointer"
              >
                <Plus className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
        <div className="h-1 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barClass}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export function PlayerStatusCard({ player, onUpdateStat, onUpdateHp, onUpdateAbilities, onUpdateInventory }: PlayerStatusCardProps) {
  const [showAbilities, setShowAbilities] = useState(false)

  return (
    <>
      <div
        className={`glass-panel rounded-xl p-3 transition-all duration-300 ${
          player.coinFlash ? "animate-coin-flash" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
              <span className="text-neon-cyan font-sans text-[10px] font-bold">
                P{player.id}
              </span>
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold text-foreground tracking-wide">
                {player.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <Coins className="h-2.5 w-2.5 text-neon-gold" />
                <span className="text-neon-gold text-[10px] font-bold tabular-nums text-glow-gold">
                  {player.coins}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowAbilities(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] uppercase tracking-wider font-bold hover:bg-neon-cyan/20 hover:border-neon-cyan/40 transition-all cursor-pointer"
            >
              <Zap className="h-3 w-3" />
              <span className="hidden xl:inline">Hab.</span>
              {player.abilities.length > 0 && (
                <span className="flex items-center justify-center h-3.5 min-w-3.5 px-0.5 rounded-full bg-neon-cyan/20 text-[8px] font-mono font-bold">
                  {player.abilities.length}
                </span>
              )}
            </button>
            <Link
              href={`/player/${player.id}/inventario`}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] uppercase tracking-wider font-bold hover:bg-neon-cyan/20 hover:border-neon-cyan/40 transition-all cursor-pointer"
            >
              <Package className="h-3 w-3" />
              <span className="hidden xl:inline">Inv.</span>
              {player.inventory.length > 0 && (
                <span className="flex items-center justify-center h-3.5 min-w-3.5 px-0.5 rounded-full bg-neon-cyan/20 text-[8px] font-mono font-bold">
                  {player.inventory.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* CA + Speed row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-neon-cyan/5 border border-neon-cyan/20">
            <ShieldHalf className="h-3 w-3 text-neon-cyan" />
            <span className="text-[9px] text-muted-foreground uppercase">CA</span>
            <span className="text-[11px] font-bold tabular-nums text-neon-cyan ml-auto">{player.armorClass}</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-neon-gold/5 border border-neon-gold/20">
            <Footprints className="h-3 w-3 text-neon-gold" />
            <span className="text-[9px] text-muted-foreground uppercase">Desloc.</span>
            <span className="text-[11px] font-bold tabular-nums text-neon-gold ml-auto">{player.speed}m</span>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mb-2">
          <HpBar
            currentHp={player.currentHp}
            maxHp={player.maxHp}
            onUpdate={onUpdateHp ? (current, max) => onUpdateHp(player.id, current, max) : undefined}
            compact
          />
        </div>

        <div className="space-y-2">
          {STAT_CONFIG.map((stat) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              value={player.stats[stat.key as StatKey]}
              icon={stat.icon}
              color={stat.color}
              barClass={stat.barClass}
              onIncrement={onUpdateStat ? () => onUpdateStat(player.id, stat.dbKey, player.stats[stat.key as StatKey] + 1) : undefined}
              onDecrement={onUpdateStat ? () => onUpdateStat(player.id, stat.dbKey, player.stats[stat.key as StatKey] - 1) : undefined}
            />
          ))}
        </div>
      </div>

      {showAbilities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 animate-float-in relative">
            <button
              onClick={() => setShowAbilities(false)}
              className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full glass-panel border border-glass-border hover:bg-secondary transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <AbilitiesPanel
              abilities={player.abilities}
              onUpdate={(abs) => onUpdateAbilities?.(player.id, abs)}
              compact
            />
          </div>
        </div>
      )}
    </>
  )
}
