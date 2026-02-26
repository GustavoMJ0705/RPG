"use client"

import { useState } from "react"
import { Heart, Minus, Plus, Check, X } from "lucide-react"

interface HpBarProps {
  currentHp: number
  maxHp: number
  onUpdate?: (currentHp: number, maxHp: number) => void
  compact?: boolean
}

export function HpBar({ currentHp, maxHp, onUpdate, compact = false }: HpBarProps) {
  const [editing, setEditing] = useState(false)
  const [editCurrent, setEditCurrent] = useState(currentHp)
  const [editMax, setEditMax] = useState(maxHp)

  const percent = maxHp > 0 ? Math.min((currentHp / maxHp) * 100, 100) : 0

  const hpColor =
    percent > 60 ? "bg-emerald-400 shadow-[0_0_10px_oklch(0.7_0.17_160_/_0.6)]" :
    percent > 30 ? "bg-amber-400 shadow-[0_0_10px_oklch(0.8_0.15_85_/_0.6)]" :
    "bg-neon-red shadow-[0_0_10px_oklch(0.65_0.22_25_/_0.6)]"

  const textColor =
    percent > 60 ? "text-emerald-400" :
    percent > 30 ? "text-amber-400" :
    "text-neon-red"

  function startEdit() {
    if (!onUpdate) return
    setEditCurrent(currentHp)
    setEditMax(maxHp)
    setEditing(true)
  }

  function confirmEdit() {
    const clampedMax = Math.max(1, editMax)
    const clampedCurrent = Math.max(0, Math.min(editCurrent, clampedMax))
    onUpdate?.(clampedCurrent, clampedMax)
    setEditing(false)
  }

  function cancelEdit() {
    setEditing(false)
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Heart className={`h-3 w-3 shrink-0 ${textColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">HP</span>
            {editing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={editCurrent}
                  onChange={(e) => setEditCurrent(parseInt(e.target.value) || 0)}
                  className="w-10 h-4 text-[10px] font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                />
                <span className="text-[10px] text-muted-foreground">/</span>
                <input
                  type="number"
                  value={editMax}
                  onChange={(e) => setEditMax(parseInt(e.target.value) || 1)}
                  className="w-10 h-4 text-[10px] font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                />
                <button onClick={confirmEdit} className="h-4 w-4 rounded flex items-center justify-center bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors cursor-pointer">
                  <Check className="h-2.5 w-2.5" />
                </button>
                <button onClick={cancelEdit} className="h-4 w-4 rounded flex items-center justify-center bg-neon-red/20 text-neon-red hover:bg-neon-red/30 transition-colors cursor-pointer">
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {onUpdate && (
                  <button
                    onClick={() => onUpdate(Math.max(0, currentHp - 1), maxHp)}
                    className="h-4 w-4 rounded flex items-center justify-center bg-secondary/80 hover:bg-neon-red/20 hover:text-neon-red text-muted-foreground transition-colors cursor-pointer"
                  >
                    <Minus className="h-2.5 w-2.5" />
                  </button>
                )}
                <button
                  onClick={onUpdate ? startEdit : undefined}
                  className={`text-[10px] font-bold tabular-nums min-w-[40px] text-center ${textColor} ${onUpdate ? "cursor-pointer hover:underline" : ""}`}
                >
                  {currentHp}/{maxHp}
                </button>
                {onUpdate && (
                  <button
                    onClick={() => onUpdate(Math.min(currentHp + 1, maxHp), maxHp)}
                    className="h-4 w-4 rounded flex items-center justify-center bg-secondary/80 hover:bg-emerald-500/20 hover:text-emerald-400 text-muted-foreground transition-colors cursor-pointer"
                  >
                    <Plus className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Full-size version for player page
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Heart className={`h-4 w-4 ${textColor}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${textColor}`}>Vida</span>
        <div className="ml-auto flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={editCurrent}
                onChange={(e) => setEditCurrent(parseInt(e.target.value) || 0)}
                className="w-14 h-6 text-xs font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                autoFocus
              />
              <span className="text-xs text-muted-foreground">/</span>
              <input
                type="number"
                value={editMax}
                onChange={(e) => setEditMax(parseInt(e.target.value) || 1)}
                className="w-14 h-6 text-xs font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
              />
              <button onClick={confirmEdit} className="h-6 w-6 rounded flex items-center justify-center bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors cursor-pointer">
                <Check className="h-3 w-3" />
              </button>
              <button onClick={cancelEdit} className="h-6 w-6 rounded flex items-center justify-center bg-neon-red/20 text-neon-red hover:bg-neon-red/30 transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <>
              {onUpdate && (
                <button
                  onClick={() => onUpdate(Math.max(0, currentHp - 1), maxHp)}
                  className="h-6 w-6 rounded flex items-center justify-center bg-secondary/80 hover:bg-neon-red/20 hover:text-neon-red text-muted-foreground transition-colors cursor-pointer"
                >
                  <Minus className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={onUpdate ? startEdit : undefined}
                className={`text-lg font-sans font-bold tabular-nums ${textColor} ${onUpdate ? "cursor-pointer hover:underline" : ""}`}
              >
                {currentHp}/{maxHp}
              </button>
              {onUpdate && (
                <button
                  onClick={() => onUpdate(Math.min(currentHp + 1, maxHp), maxHp)}
                  className="h-6 w-6 rounded flex items-center justify-center bg-secondary/80 hover:bg-emerald-500/20 hover:text-emerald-400 text-muted-foreground transition-colors cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${hpColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
