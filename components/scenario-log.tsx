"use client"

import { useRef, useEffect } from "react"
import { ScrollText, Trash2 } from "lucide-react"
import type { LogEntry } from "@/lib/types"

interface ScenarioLogProps {
  logs: LogEntry[]
  onClearLogs?: () => void
}

export function ScenarioLog({ logs, onClearLogs }: ScenarioLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const getLogStyle = (type: LogEntry["type"]) => {
    switch (type) {
      case "system":
        return "text-neon-gold text-glow-gold"
      case "constellation":
        return "text-neon-cyan text-glow-cyan"
      case "scenario":
        return "text-neon-red text-glow-red"
    }
  }

  const getLogPrefix = (type: LogEntry["type"]) => {
    switch (type) {
      case "system":
        return "SYSTEM"
      case "constellation":
        return "CONSTELLATION"
      case "scenario":
        return "SCENARIO"
    }
  }

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
        <ScrollText className="h-4 w-4 text-neon-cyan" />
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-neon-cyan text-glow-cyan">
          Scenario Log
        </h2>
        <div className="ml-auto flex items-center gap-3">
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-neon-red/70 hover:text-neon-red hover:bg-neon-red/10 border border-transparent hover:border-neon-red/30 transition-all cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-glow-pulse" />
            <span className="text-muted-foreground text-[10px]">LIVE</span>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 scrollbar-thin"
      >
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
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-xs">{"Awaiting scenario data..."}</p>
          </div>
        )}
      </div>
    </div>
  )
}
