"use client"

import { useState } from "react"
import { Send, Terminal, ChevronDown } from "lucide-react"
import type { PlayerData } from "@/lib/types"

interface ConstellationTerminalProps {
  players: PlayerData[]
  onSendMessage: (message: string, target: string, type: "system" | "constellation" | "scenario") => void
}

const MESSAGE_TYPES = [
  { value: "system" as const, label: "System Message", color: "text-neon-gold", glowClass: "text-glow-gold" },
  { value: "constellation" as const, label: "Constellation Message", color: "text-neon-cyan", glowClass: "text-glow-cyan" },
  { value: "scenario" as const, label: "Scenario Update", color: "text-neon-red", glowClass: "text-glow-red" },
]

export function ConstellationTerminal({ players, onSendMessage }: ConstellationTerminalProps) {
  const [message, setMessage] = useState("")
  const [target, setTarget] = useState("all")
  const [messageType, setMessageType] = useState<"system" | "constellation" | "scenario">("system")
  const [showTargetDropdown, setShowTargetDropdown] = useState(false)

  const targets = [
    { value: "all", label: "All Players" },
    ...players.map((p) => ({ value: String(p.id), label: p.name })),
  ]

  const currentType = MESSAGE_TYPES.find((t) => t.value === messageType)!

  const handleSend = () => {
    if (!message.trim()) return
    onSendMessage(message.trim(), target, messageType)
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="glass-panel rounded-xl flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
        <Terminal className="h-4 w-4 text-neon-gold" />
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-neon-gold text-glow-gold">
          Constellation Terminal
        </h2>
      </div>

      <div className="p-4 space-y-3">
        {/* Message Type Toggle */}
        <div className="flex gap-1 p-0.5 rounded-lg bg-secondary/50">
          {MESSAGE_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setMessageType(type.value)}
              className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                messageType === type.value
                  ? `${type.color} bg-secondary ${type.glowClass}`
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {type.value === "system" ? "System" : type.value === "constellation" ? "Const." : "Scenario"}
            </button>
          ))}
        </div>

        {/* Target Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTargetDropdown(!showTargetDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-input border border-glass-border text-xs text-foreground hover:border-neon-cyan/40 transition-colors cursor-pointer"
          >
            <span>{targets.find((t) => t.value === target)?.label}</span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showTargetDropdown ? "rotate-180" : ""}`} />
          </button>
          {showTargetDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-popover border border-glass-border shadow-xl overflow-hidden">
              {targets.map((t) => (
                <button
                  key={t.value}
                  onClick={() => {
                    setTarget(t.value)
                    setShowTargetDropdown(false)
                  }}
                  className={`w-full px-3 py-2 text-xs text-left hover:bg-secondary transition-colors cursor-pointer ${
                    target === t.value ? "text-neon-cyan bg-secondary" : "text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter ${currentType.label.toLowerCase()}...`}
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-input border border-glass-border text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_10px_oklch(0.8_0.15_195_/_0.15)] transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-sans text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            messageType === "system"
              ? "bg-neon-gold/20 border border-neon-gold/40 text-neon-gold hover:bg-neon-gold/30 hover:shadow-[0_0_15px_oklch(0.85_0.17_85_/_0.25)]"
              : messageType === "constellation"
              ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/30 hover:shadow-[0_0_15px_oklch(0.8_0.15_195_/_0.25)]"
              : "bg-neon-red/20 border border-neon-red/40 text-neon-red hover:bg-neon-red/30 hover:shadow-[0_0_15px_oklch(0.65_0.22_25_/_0.25)]"
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          Transmit
        </button>
      </div>
    </div>
  )
}
