"use client"

import { use, useRef, useEffect, useState } from "react"
import Link from "next/link"
import { Eye, Loader2, AlertTriangle, Swords, Shield, Heart, Brain, BookOpen, Sparkles, Coins, Package, ScrollText, Trash2, Store, Zap, ShieldHalf, Footprints } from "lucide-react"
import { usePlayerRealtime } from "@/hooks/use-player-realtime"
import { HpBar } from "@/components/hp-bar"
import { AbilitiesPanel } from "@/components/abilities-panel"
import { SkillsPanel } from "@/components/skills-panel"
import type { LogEntry } from "@/lib/types"

function StatBlock({ label, value, icon, color, glowClass }: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  glowClass: string
}) {
  const percent = Math.min((value / 100) * 100, 100)
  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={color}>{icon}</div>
        <span className={`text-xs font-bold uppercase tracking-widest ${color} ${glowClass}`}>{label}</span>
        <span className={`ml-auto text-lg font-sans font-bold tabular-nums ${color} ${glowClass}`}>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            color.includes("cyan") ? "bg-neon-cyan shadow-[0_0_8px_oklch(0.8_0.15_195_/_0.6)]" :
            color.includes("red") ? "bg-neon-red shadow-[0_0_8px_oklch(0.65_0.22_25_/_0.6)]" :
            color.includes("emerald") ? "bg-emerald-400 shadow-[0_0_8px_oklch(0.7_0.17_160_/_0.6)]" :
            color.includes("amber") ? "bg-amber-400 shadow-[0_0_8px_oklch(0.8_0.15_85_/_0.6)]" :
            color.includes("fuchsia") ? "bg-fuchsia-400 shadow-[0_0_8px_oklch(0.7_0.17_320_/_0.6)]" :
            "bg-neon-gold shadow-[0_0_8px_oklch(0.85_0.17_85_/_0.6)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function CombatPanel({ armorClass, speed, onSave }: {
  armorClass: number
  speed: number
  onSave: (armorClass: number, speed: number) => void
}) {
  const [editAC, setEditAC] = useState(String(armorClass))
  const [editSpeed, setEditSpeed] = useState(String(speed))
  const [saved, setSaved] = useState(false)

  const hasChanges = Number(editAC) !== armorClass || Number(editSpeed) !== speed

  const handleSave = () => {
    onSave(Math.max(0, parseInt(editAC) || 0), Math.max(0, parseFloat(editSpeed) || 0))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1 flex-1 bg-gradient-to-r from-neon-red/40 to-transparent rounded-full" />
        <h2 className="font-sans text-xs font-bold tracking-[0.25em] uppercase text-neon-red text-glow-red shrink-0">
          Combate
        </h2>
        <div className="h-1 flex-1 bg-gradient-to-l from-neon-red/40 to-transparent rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Armor Class */}
        <div className="glass-panel rounded-xl p-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldHalf className="h-5 w-5 text-neon-cyan" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan text-glow-cyan">CA</span>
          </div>
          <input
            type="number"
            value={editAC}
            onChange={(e) => setEditAC(e.target.value)}
            min="0"
            className="w-20 text-center bg-background/60 border border-glass-border rounded-lg px-2 py-2 text-2xl font-sans font-bold text-neon-cyan tabular-nums focus:outline-none focus:border-neon-cyan/50 text-glow-cyan"
          />
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Classe de Armadura</span>
        </div>

        {/* Speed */}
        <div className="glass-panel rounded-xl p-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-neon-gold" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-neon-gold text-glow-gold">Desloc.</span>
          </div>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={editSpeed}
              onChange={(e) => setEditSpeed(e.target.value)}
              min="0"
              step="1.5"
              className="w-20 text-center bg-background/60 border border-glass-border rounded-lg px-2 py-2 text-2xl font-sans font-bold text-neon-gold tabular-nums focus:outline-none focus:border-neon-gold/50 text-glow-gold"
            />
          </div>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Deslocamento (m)</span>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!hasChanges && !saved}
        className={`w-full mt-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
          saved
            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
            : hasChanges
            ? "bg-neon-red/15 border border-neon-red/30 text-neon-red hover:bg-neon-red/25"
            : "bg-muted/20 border border-glass-border text-muted-foreground/50 cursor-not-allowed"
        }`}
      >
        {saved ? "Salvo!" : "Salvar Alteracoes"}
      </button>
    </div>
  )
}

function PlayerLog({ logs, onClearLogs }: { logs: LogEntry[]; onClearLogs?: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogStyle = (type: LogEntry["type"]) => {
    switch (type) {
      case "system": return "text-neon-gold text-glow-gold"
      case "constellation": return "text-neon-cyan text-glow-cyan"
      case "scenario": return "text-neon-red text-glow-red"
    }
  }

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "system": return "SYSTEM"
      case "constellation": return "CONSTELLATION"
      case "scenario": return "SCENARIO"
    }
  }

  return (
    <div className="glass-panel rounded-xl flex flex-col h-[60vh] lg:h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
        <ScrollText className="h-4 w-4 text-neon-cyan" />
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-neon-cyan text-glow-cyan">
          Scenario Feed
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-neon-red/70 hover:text-neon-red hover:bg-neon-red/10 border border-transparent hover:border-neon-red/30 transition-all cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Limpar
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-glow-pulse" />
            <span className="text-muted-foreground text-[10px]">LIVE</span>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin">
        {logs.map((log) => (
          <div key={log.id} className="animate-float-in">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground text-[10px] font-mono shrink-0 pt-0.5 tabular-nums">
                {log.timestamp}
              </span>
              <div className="min-w-0">
                <span className={`text-[10px] tracking-wider font-bold ${getLogStyle(log.type)}`}>
                  [{getLogPrefix(log.type)}]
                </span>
                <p className={`text-xs leading-relaxed mt-0.5 ${getLogStyle(log.type)} opacity-90`}>
                  {log.text}
                </p>
              </div>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground text-xs">{"Awaiting scenario data..."}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const playerId = parseInt(id, 10)
  const { player, logs, loading, notFound, updateHp, updateAbilities, updateInventory, updateCombatStats, updateSkills, clearLocalLogs } = usePlayerRealtime(playerId)
  const [activeTab, setActiveTab] = useState<"stats" | "combat" | "abilities">("stats")

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-neon-cyan animate-spin" />
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-neon-cyan text-glow-cyan">
            Connecting to Star Stream...
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
          <p className="text-muted-foreground text-xs">
            {"No incarnation with this ID exists in the Star Stream."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:h-screen bg-background relative overflow-y-auto lg:overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.2_0.05_220_/_0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,oklch(0.15_0.04_85_/_0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22g%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M60%200H0v60%22%20fill%3D%22none%22%20stroke%3D%22rgba(100%2C180%2C255%2C0.03)%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20fill%3D%22url(%23g)%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3C%2Fsvg%3E')] opacity-50" />
      </div>

      <div className="relative z-10 min-h-full lg:h-full flex flex-col">
        {/* Header */}
        <header className="border-b border-glass-border glass-panel">
          <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-neon-cyan" />
              </div>
              <div>
                <h1 className="font-sans text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-foreground">
                  {player.name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <Heart className={`h-3 w-3 ${player.maxHp > 0 && (player.currentHp / player.maxHp) > 0.6 ? "text-emerald-400" : (player.currentHp / player.maxHp) > 0.3 ? "text-amber-400" : "text-neon-red"}`} />
                  <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        player.maxHp > 0 && (player.currentHp / player.maxHp) > 0.6
                          ? "bg-emerald-400 shadow-[0_0_6px_oklch(0.7_0.17_160_/_0.5)]"
                          : (player.currentHp / player.maxHp) > 0.3
                          ? "bg-amber-400 shadow-[0_0_6px_oklch(0.8_0.15_85_/_0.5)]"
                          : "bg-neon-red shadow-[0_0_6px_oklch(0.65_0.22_25_/_0.5)]"
                      }`}
                      style={{ width: `${player.maxHp > 0 ? Math.min((player.currentHp / player.maxHp) * 100, 100) : 0}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold tabular-nums ${
                    player.maxHp > 0 && (player.currentHp / player.maxHp) > 0.6 ? "text-emerald-400" : (player.currentHp / player.maxHp) > 0.3 ? "text-amber-400" : "text-neon-red"
                  }`}>
                    {player.currentHp}/{player.maxHp}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/player/${id}/loja`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold hover:bg-neon-gold/15 border border-neon-gold/30 transition-all"
              >
                <Store className="h-4 w-4 text-neon-gold" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-neon-gold text-glow-gold">
                  Loja
                </span>
              </Link>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold transition-all ${player.coinFlash ? "animate-coin-flash" : ""}`}>
                <Coins className="h-4 w-4 text-neon-gold" />
                <span className="font-sans text-sm font-bold tabular-nums text-neon-gold text-glow-gold">
                  {player.coins}
                </span>
                <span className="text-[10px] text-neon-gold/60 uppercase tracking-wider">coins</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 lg:flex-1 lg:min-h-0 lg:overflow-hidden">
          {/* Left: HP + Tabs (Stats/Abilities) + Inventory */}
          <div className="lg:w-[380px] shrink-0 flex flex-col gap-4 lg:overflow-y-auto scrollbar-thin">
            {/* HP Bar - editable */}
            <HpBar
              currentHp={player.currentHp}
              maxHp={player.maxHp}
              onUpdate={(current, max) => updateHp(current, max)}
            />

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 glass-panel rounded-lg">
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "stats"
                    ? "bg-neon-gold/15 text-neon-gold border border-neon-gold/30 text-glow-gold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <Swords className="h-3 w-3" />
                Atributos
              </button>
              <button
                onClick={() => setActiveTab("combat")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "combat"
                    ? "bg-neon-red/15 text-neon-red border border-neon-red/30 text-glow-red"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <ShieldHalf className="h-3 w-3" />
                Combate
              </button>
              <button
                onClick={() => setActiveTab("abilities")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "abilities"
                    ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 text-glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <Zap className="h-3 w-3" />
                Habilidades
                {player.abilities.length > 0 && (
                  <span className="flex items-center justify-center h-3.5 min-w-3.5 px-0.5 rounded-full bg-neon-cyan/20 text-[8px] font-mono font-bold text-neon-cyan">
                    {player.abilities.length}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "stats" && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 flex-1 bg-gradient-to-r from-neon-gold/40 to-transparent rounded-full" />
                  <h2 className="font-sans text-xs font-bold tracking-[0.25em] uppercase text-neon-gold text-glow-gold shrink-0">
                    Atributos
                  </h2>
                  <div className="h-1 flex-1 bg-gradient-to-l from-neon-gold/40 to-transparent rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <StatBlock
                    label="Forca"
                    value={player.stats.strength}
                    icon={<Swords className="h-4 w-4" />}
                    color="text-neon-red"
                    glowClass="text-glow-red"
                  />
                  <StatBlock
                    label="Destreza"
                    value={player.stats.dexterity}
                    icon={<Shield className="h-4 w-4" />}
                    color="text-neon-cyan"
                    glowClass="text-glow-cyan"
                  />
                  <StatBlock
                    label="Constituicao"
                    value={player.stats.constitution}
                    icon={<Heart className="h-4 w-4" />}
                    color="text-emerald-400"
                    glowClass=""
                  />
                  <StatBlock
                    label="Inteligencia"
                    value={player.stats.intelligence}
                    icon={<Brain className="h-4 w-4" />}
                    color="text-neon-gold"
                    glowClass="text-glow-gold"
                  />
                  <StatBlock
                    label="Sabedoria"
                    value={player.stats.wisdom}
                    icon={<BookOpen className="h-4 w-4" />}
                    color="text-amber-400"
                    glowClass=""
                  />
                  <StatBlock
                    label="Carisma"
                    value={player.stats.charisma}
                    icon={<Sparkles className="h-4 w-4" />}
                    color="text-fuchsia-400"
                    glowClass=""
                  />
                </div>
              </div>
            )}

            {activeTab === "combat" && (
              <CombatPanel
                armorClass={player.armorClass}
                speed={player.speed}
                onSave={(ac, spd) => updateCombatStats(ac, spd)}
              />
            )}

            {activeTab === "abilities" && (
              <AbilitiesPanel
                abilities={player.abilities}
                onUpdate={(abs) => updateAbilities(abs)}
              />
            )}

            {/* Inventory Link */}
            <Link
              href={`/player/${id}/inventario`}
              className="flex items-center justify-between px-4 py-3 rounded-xl glass-panel border border-neon-cyan/30 hover:bg-neon-cyan/5 hover:border-neon-cyan/50 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-neon-cyan" />
                <span className="font-mono text-sm font-bold tracking-wider uppercase text-neon-cyan text-glow-cyan">
                  Inventario
                </span>
                {player.inventory.length > 0 && (
                  <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-cyan/20 text-[9px] font-mono font-bold text-neon-cyan">
                    {player.inventory.length}
                  </span>
                )}
              </div>
              <span className="text-muted-foreground text-xs group-hover:text-neon-cyan transition-colors">{'Abrir >'}</span>
            </Link>
          </div>

          {/* Center: Scenario Feed */}
          <div className="min-h-[400px] lg:min-h-0 flex-1 overflow-hidden">
            <PlayerLog logs={logs} onClearLogs={clearLocalLogs} />
          </div>

          {/* Right: Skills Panel */}
          <div className="lg:w-[420px] shrink-0 min-h-[400px] lg:min-h-0 lg:max-h-full overflow-hidden">
            <SkillsPanel
              skills={player.skills}
              stats={player.stats}
              onUpdate={(skills) => updateSkills(skills)}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
