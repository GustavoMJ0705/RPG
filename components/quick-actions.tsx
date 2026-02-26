"use client"

import { useState } from "react"
import { Coins, Zap, ChevronDown } from "lucide-react"
import type { PlayerData } from "@/lib/types"

interface QuickActionsProps {
  players: PlayerData[]
  onAwardCoins: (playerId: number, amount: number) => void
}

const COIN_ADD_AMOUNTS = [10, 50, 100, 500]
const COIN_SUB_AMOUNTS = [10, 50, 100, 500]

export function QuickActions({ players, onAwardCoins }: QuickActionsProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [flashBtn, setFlashBtn] = useState<string | null>(null)

  const currentId = selectedPlayerId ?? players[0]?.id ?? 1
  const currentPlayer = players.find((p) => p.id === currentId)

  const handleAward = (amount: number) => {
    onAwardCoins(currentId, amount)
    const key = amount > 0 ? `+${amount}` : `${amount}`
    setFlashBtn(key)
    setTimeout(() => setFlashBtn(null), 600)
  }

  return (
    <div className="glass-panel-gold rounded-xl">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-neon-gold/15">
        <Zap className="h-4 w-4 text-neon-gold" />
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-neon-gold text-glow-gold">
          Quick Actions
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {/* Player Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-input border border-neon-gold/20 text-xs text-foreground hover:border-neon-gold/40 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 rounded bg-neon-gold/15 flex items-center justify-center text-[10px] text-neon-gold font-bold">
                P{currentPlayer?.id ?? "?"}
              </span>
              {currentPlayer?.name ?? "Select..."}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-lg bg-popover border border-glass-border shadow-xl overflow-hidden">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPlayerId(p.id)
                    setShowDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-secondary transition-colors flex items-center gap-2 cursor-pointer ${
                    currentId === p.id ? "text-neon-gold bg-secondary" : "text-foreground"
                  }`}
                >
                  <span className="h-4 w-4 rounded bg-neon-gold/15 flex items-center justify-center text-[9px] text-neon-gold font-bold">
                    P{p.id}
                  </span>
                  {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coin Add Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {COIN_ADD_AMOUNTS.map((amount) => {
            const key = `+${amount}`
            return (
              <button
                key={key}
                onClick={() => handleAward(amount)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  flashBtn === key
                    ? "animate-coin-flash bg-neon-gold/30 border-neon-gold/60 text-neon-gold"
                    : "bg-neon-gold/10 border-neon-gold/25 text-neon-gold hover:bg-neon-gold/20 hover:border-neon-gold/40"
                }`}
              >
                <Coins className="h-3.5 w-3.5" />
                <span className="tabular-nums">+{amount}</span>
              </button>
            )
          })}
        </div>

        {/* Coin Subtract Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {COIN_SUB_AMOUNTS.map((amount) => {
            const key = `-${amount}`
            return (
              <button
                key={key}
                onClick={() => handleAward(-amount)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  flashBtn === key
                    ? "animate-coin-flash bg-neon-red/30 border-neon-red/60 text-neon-red"
                    : "bg-neon-red/10 border-neon-red/25 text-neon-red hover:bg-neon-red/20 hover:border-neon-red/40"
                }`}
              >
                <Coins className="h-3.5 w-3.5" />
                <span className="tabular-nums">-{amount}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
