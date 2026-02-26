"use client"

import { useState } from "react"
import { Zap, Plus, Pencil, Trash2, X, Check, Timer, TrendingUp } from "lucide-react"
import type { Ability } from "@/lib/types"

interface AbilitiesPanelProps {
  abilities: Ability[]
  onUpdate: (abilities: Ability[]) => void
  compact?: boolean
}

function AbilityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Ability
  onSave: (ability: Omit<Ability, "id"> & { id?: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [level, setLevel] = useState(initial?.level ?? 1)
  const [cooldown, setCooldown] = useState(initial?.cooldown ?? 0)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ id: initial?.id, name: name.trim(), description: description.trim(), level, cooldown })
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-3 space-y-3 border border-neon-cyan/20">
      <div className="flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-neon-cyan" />
        <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan">
          {initial ? "Editar Habilidade" : "Nova Habilidade"}
        </span>
      </div>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nome da habilidade"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-8 px-2.5 text-xs rounded bg-secondary/60 border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/40"
          autoFocus
        />
        <textarea
          placeholder="Descricao (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-2.5 py-1.5 text-xs rounded bg-secondary/60 border border-glass-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/40 resize-none"
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-neon-gold" />
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Nivel</label>
            <input
              type="number"
              min={1}
              max={99}
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
              className="w-12 h-6 text-[11px] font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Timer className="h-3 w-3 text-amber-400" />
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Recarga</label>
            <input
              type="number"
              min={0}
              max={99}
              value={cooldown}
              onChange={(e) => setCooldown(parseInt(e.target.value) || 0)}
              className="w-12 h-6 text-[11px] font-bold tabular-nums text-center rounded bg-secondary border border-glass-border text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] text-muted-foreground">rodadas</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Check className="h-3 w-3" />
          Salvar
        </button>
      </div>
    </form>
  )
}

export function AbilitiesPanel({ abilities, onUpdate, compact = false }: AbilitiesPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  function handleAdd(data: Omit<Ability, "id"> & { id?: string }) {
    const newAbility: Ability = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      level: data.level,
      cooldown: data.cooldown,
    }
    onUpdate([...abilities, newAbility])
    setShowForm(false)
  }

  function handleEdit(data: Omit<Ability, "id"> & { id?: string }) {
    if (!data.id) return
    onUpdate(
      abilities.map((a) =>
        a.id === data.id ? { ...a, name: data.name, description: data.description, level: data.level, cooldown: data.cooldown } : a
      )
    )
    setEditingId(null)
  }

  function handleDelete(id: string) {
    onUpdate(abilities.filter((a) => a.id !== id))
  }

  return (
    <div className={`glass-panel rounded-xl ${compact ? "p-3" : "p-4"} flex flex-col`}>
      <div className="flex items-center gap-2 mb-3">
        <Zap className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} text-neon-cyan`} />
        <h2 className={`font-sans ${compact ? "text-[10px]" : "text-xs"} font-bold tracking-widest uppercase text-neon-cyan text-glow-cyan`}>
          Habilidades
        </h2>
        <span className={`ml-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-cyan/15 ${compact ? "text-[9px]" : "text-[10px]"} font-mono font-bold text-neon-cyan`}>
          {abilities.length}
        </span>
        <div className="ml-auto">
          {!showForm && !editingId && (
            <button
              onClick={() => setShowForm(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded ${compact ? "text-[9px]" : "text-[10px]"} font-bold uppercase tracking-wider text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 transition-all cursor-pointer`}
            >
              <Plus className="h-3 w-3" />
              Nova
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="mb-3">
          <AbilityForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className={`space-y-2 ${compact ? "max-h-40" : "max-h-[50vh]"} overflow-y-auto scrollbar-thin`}>
        {abilities.map((ability) =>
          editingId === ability.id ? (
            <AbilityForm
              key={ability.id}
              initial={ability}
              onSave={handleEdit}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div
              key={ability.id}
              className="glass-panel rounded-lg p-3 border border-glass-border hover:border-neon-cyan/20 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-sans ${compact ? "text-[11px]" : "text-xs"} font-bold text-foreground`}>
                      {ability.name}
                    </h3>
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neon-gold/10 border border-neon-gold/20">
                      <TrendingUp className="h-2.5 w-2.5 text-neon-gold" />
                      <span className="text-[9px] font-bold tabular-nums text-neon-gold">Nv.{ability.level}</span>
                    </span>
                    {ability.cooldown > 0 && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Timer className="h-2.5 w-2.5 text-amber-400" />
                        <span className="text-[9px] font-bold tabular-nums text-amber-400">{ability.cooldown}r</span>
                      </span>
                    )}
                  </div>
                  {ability.description && (
                    <p className={`${compact ? "text-[10px]" : "text-[11px]"} text-muted-foreground mt-1 leading-relaxed`}>
                      {ability.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => setEditingId(ability.id)}
                    className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors cursor-pointer"
                  >
                    <Pencil className="h-2.5 w-2.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ability.id)}
                    className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        {abilities.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <Zap className="h-6 w-6 mb-2 opacity-30" />
            <p className="text-[11px]">Nenhuma habilidade ainda</p>
          </div>
        )}
      </div>
    </div>
  )
}
