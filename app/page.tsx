"use client"

import Link from "next/link"
import { Eye, Radio, Loader2, Store } from "lucide-react"
import { ConstellationTerminal } from "@/components/constellation-terminal"
import { ScenarioLog } from "@/components/scenario-log"
import { PlayerStatusCard } from "@/components/player-status-card"
import { QuickActions } from "@/components/quick-actions"
import { useRpgRealtime } from "@/hooks/use-rpg-realtime"

export default function DashboardPage() {
  const { players, logs, shopItems, loading, sendMessage, awardCoins, clearLogs, updatePlayerStat, updatePlayerHp, updatePlayerAbilities, updatePlayerInventory } = useRpgRealtime()

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
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
              <div className="h-9 w-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-neon-cyan" />
              </div>
              <div>
                <h1 className="font-sans text-sm lg:text-base font-bold tracking-[0.2em] uppercase text-foreground">
                  Omniscient Reader
                </h1>
                <p className="text-[10px] text-neon-cyan tracking-[0.3em] uppercase text-glow-cyan">
                  Dokkaebi System v3.14
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel">
                <Radio className="h-3 w-3 text-neon-red animate-glow-pulse" />
                <span className="text-[10px] text-neon-red font-bold tracking-wider uppercase">
                  Scenario Active
                </span>
              </div>
              <Link
                href="/loja"
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass-panel-gold hover:bg-neon-gold/15 border border-neon-gold/30 transition-all"
              >
                <Store className="h-4 w-4 text-neon-gold" />
                <span className="font-mono text-xs font-bold tracking-wider uppercase text-neon-gold text-glow-gold">
                  Loja
                </span>
                {shopItems.length > 0 && (
                  <span className="flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-gold/20 text-[9px] font-mono font-bold text-neon-gold">
                    {shopItems.length}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel-gold">
                <span className="text-[10px] text-neon-gold font-bold tracking-wider uppercase">
                  GM: Dokkaebi
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <main className="p-3 lg:p-4 flex flex-col xl:flex-row gap-3 lg:gap-4 h-[calc(100vh-57px)]">
          {/* Left Column: Terminal + Quick Actions */}
          <aside className="xl:w-72 2xl:w-80 shrink-0 flex flex-col gap-3 lg:gap-4 xl:overflow-y-auto scrollbar-thin">
            <ConstellationTerminal players={players} onSendMessage={sendMessage} />
            <div className="pt-4">
              <QuickActions players={players} onAwardCoins={awardCoins} />
            </div>
          </aside>

          {/* Center: Scenario Log */}
          <section className="flex-1 min-h-[300px] xl:min-h-0 overflow-hidden">
            <ScenarioLog logs={logs} onClearLogs={clearLogs} />
          </section>

          {/* Right Column: Player Status Grid */}
          <aside className="xl:w-[520px] 2xl:w-[580px] shrink-0 xl:overflow-y-auto scrollbar-thin">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 flex-1 bg-gradient-to-r from-neon-cyan/40 to-transparent rounded-full" />
              <h2 className="font-sans text-xs font-bold tracking-[0.25em] uppercase text-neon-cyan text-glow-cyan shrink-0">
                Player Status Grid
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-l from-neon-cyan/40 to-transparent rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3">
              {players.map((player) => (
                <PlayerStatusCard key={player.id} player={player} onUpdateStat={updatePlayerStat} onUpdateHp={updatePlayerHp} onUpdateAbilities={updatePlayerAbilities} onUpdateInventory={updatePlayerInventory} />
              ))}
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
