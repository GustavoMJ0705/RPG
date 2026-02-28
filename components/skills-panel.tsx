"use client"

import { useState } from "react"
import { ScrollText, Plus, Trash2, Check } from "lucide-react"
import type { Skill, SkillAttribute } from "@/lib/types"

interface SkillsPanelProps {
  skills: Skill[]
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  onUpdate: (skills: Skill[]) => void
}

// Calcula o modificador de atributo (D&D style)
function getAttributeModifier(value: number): number {
  return Math.floor((value - 10) / 2)
}

// Retorna o valor do atributo baseado na sigla
function getStatValue(
  attr: SkillAttribute,
  stats: SkillsPanelProps["stats"]
): number {
  switch (attr) {
    case "FOR":
      return stats.strength
    case "DES":
      return stats.dexterity
    case "CON":
      return stats.constitution
    case "INT":
      return stats.intelligence
    case "SAB":
      return stats.wisdom
    case "CAR":
      return stats.charisma
    default:
      return 10
  }
}

// Cor do atributo
function getAttributeColor(attr: SkillAttribute): string {
  switch (attr) {
    case "FOR":
      return "text-neon-red"
    case "DES":
      return "text-neon-cyan"
    case "CON":
      return "text-emerald-400"
    case "INT":
      return "text-neon-gold"
    case "SAB":
      return "text-amber-400"
    case "CAR":
      return "text-fuchsia-400"
    default:
      return "text-foreground"
  }
}

function SkillRow({
  skill,
  stats,
  onChange,
  onDelete,
}: {
  skill: Skill
  stats: SkillsPanelProps["stats"]
  onChange: (updated: Skill) => void
  onDelete?: () => void
}) {
  const attrValue = getStatValue(skill.attribute, stats)
  const attrMod = getAttributeModifier(attrValue)
  const total = skill.ranks + attrMod + skill.miscBonus

  const hasCustomName = skill.name === "Atuação" || skill.name === "Conhecimento" || skill.name === "Ofício"

  return (
    <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-secondary/30 transition-colors group">
      {/* Checkbox treinado */}
      <button
        onClick={() => onChange({ ...skill, trained: !skill.trained })}
        className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all ${
          skill.trained
            ? "bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan"
            : "border-glass-border hover:border-neon-cyan/30"
        }`}
      >
        {skill.trained && <Check className="h-2.5 w-2.5" />}
      </button>

      {/* Nome da perícia */}
      <div className="flex-1 min-w-0">
        {hasCustomName ? (
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-foreground shrink-0">{skill.name}</span>
            <span className="text-[11px] text-muted-foreground">(</span>
            <input
              type="text"
              value={skill.customName ?? ""}
              onChange={(e) => onChange({ ...skill, customName: e.target.value })}
              placeholder="..."
              className="flex-1 min-w-0 bg-transparent text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-b border-transparent focus:border-neon-cyan/30"
            />
            <span className="text-[11px] text-muted-foreground">)</span>
          </div>
        ) : skill.isCustom ? (
          <input
            type="text"
            value={skill.name}
            onChange={(e) => onChange({ ...skill, name: e.target.value })}
            placeholder="Perícia personalizada..."
            className="w-full bg-transparent text-[11px] font-medium text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-b border-transparent focus:border-neon-cyan/30"
          />
        ) : (
          <span className="text-[11px] font-medium text-foreground truncate block">{skill.name}</span>
        )}
      </div>

      {/* Total */}
      <div className="w-8 text-center">
        <span className={`text-sm font-bold tabular-nums ${total >= 0 ? "text-neon-cyan" : "text-neon-red"}`}>
          {total >= 0 ? `+${total}` : total}
        </span>
      </div>

      <span className="text-[10px] text-muted-foreground">=</span>

      {/* Graduações */}
      <input
        type="number"
        min={0}
        max={99}
        value={skill.ranks}
        onChange={(e) => onChange({ ...skill, ranks: Math.max(0, parseInt(e.target.value) || 0) })}
        className="w-8 h-6 text-[11px] font-bold tabular-nums text-center rounded bg-secondary/60 border border-glass-border text-foreground focus:outline-none focus:border-neon-cyan/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <span className="text-[10px] text-muted-foreground">+</span>

      {/* Mod. Habilidade */}
      <div className="w-8 text-center">
        <span className={`text-[11px] font-bold tabular-nums ${getAttributeColor(skill.attribute)}`}>
          {attrMod >= 0 ? `+${attrMod}` : attrMod}
        </span>
      </div>

      <span className="text-[10px] text-muted-foreground">+</span>

      {/* Outros */}
      <input
        type="number"
        min={-99}
        max={99}
        value={skill.miscBonus}
        onChange={(e) => onChange({ ...skill, miscBonus: parseInt(e.target.value) || 0 })}
        className="w-8 h-6 text-[11px] font-bold tabular-nums text-center rounded bg-secondary/60 border border-glass-border text-foreground focus:outline-none focus:border-neon-cyan/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      {/* Atributo Badge */}
      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${getAttributeColor(skill.attribute)} bg-secondary/50 shrink-0`}>
        {skill.attribute}
      </span>

      {/* Delete button for custom skills */}
      {skill.isCustom && onDelete && (
        <button
          onClick={onDelete}
          className="h-5 w-5 rounded flex items-center justify-center text-muted-foreground hover:text-neon-red hover:bg-neon-red/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export function SkillsPanel({ skills, stats, onUpdate }: SkillsPanelProps) {
  const [hasChanges, setHasChanges] = useState(false)

  // Separa perícias padrão das customizadas
  const standardSkills = skills.filter((s) => !s.isCustom)
  const customSkills = skills.filter((s) => s.isCustom)
  const canAddCustom = customSkills.length < 3

  function handleSkillChange(updatedSkill: Skill) {
    const newSkills = skills.map((s) => (s.id === updatedSkill.id ? updatedSkill : s))
    onUpdate(newSkills)
    setHasChanges(true)
    // Auto-save after a short delay
    setTimeout(() => setHasChanges(false), 1500)
  }

  function handleAddCustomSkill() {
    if (!canAddCustom) return
    const newSkill: Skill = {
      id: `custom-${Date.now()}`,
      name: "",
      attribute: "INT",
      trained: false,
      ranks: 0,
      miscBonus: 0,
      isCustom: true,
    }
    onUpdate([...skills, newSkill])
  }

  function handleDeleteCustomSkill(id: string) {
    onUpdate(skills.filter((s) => s.id !== id))
  }

  function handleAttributeChange(skillId: string, attr: SkillAttribute) {
    const newSkills = skills.map((s) => (s.id === skillId ? { ...s, attribute: attr } : s))
    onUpdate(newSkills)
  }

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border shrink-0">
        <ScrollText className="h-4 w-4 text-neon-cyan" />
        <h2 className="font-sans text-xs font-bold tracking-widest uppercase text-neon-cyan text-glow-cyan">
          Pericias
        </h2>
        <span className="ml-1 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-neon-cyan/15 text-[10px] font-mono font-bold text-neon-cyan">
          {skills.filter((s) => s.trained).length}
        </span>
      </div>

      {/* Column Headers */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-glass-border bg-secondary/20 text-[9px] uppercase tracking-wider text-muted-foreground shrink-0">
        <div className="w-4" /> {/* Checkbox space */}
        <div className="flex-1">Pericia</div>
        <div className="w-8 text-center">Total</div>
        <div className="w-3" />
        <div className="w-8 text-center">Grad.</div>
        <div className="w-3" />
        <div className="w-8 text-center">Mod.</div>
        <div className="w-3" />
        <div className="w-8 text-center">Outros</div>
        <div className="w-8 text-center">Atr.</div>
        <div className="w-5" /> {/* Delete button space */}
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1">
        {/* Standard Skills */}
        {standardSkills.map((skill) => (
          <SkillRow
            key={skill.id}
            skill={skill}
            stats={stats}
            onChange={handleSkillChange}
          />
        ))}

        {/* Divider */}
        {(customSkills.length > 0 || canAddCustom) && (
          <div className="flex items-center gap-2 my-2 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-glass-border to-transparent" />
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Personalizadas</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-glass-border to-transparent" />
          </div>
        )}

        {/* Custom Skills */}
        {customSkills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-1">
            <div className="flex-1">
              <SkillRow
                skill={skill}
                stats={stats}
                onChange={handleSkillChange}
                onDelete={() => handleDeleteCustomSkill(skill.id)}
              />
            </div>
            {/* Attribute selector for custom skills */}
            <select
              value={skill.attribute}
              onChange={(e) => handleAttributeChange(skill.id, e.target.value as SkillAttribute)}
              className="h-6 text-[9px] font-bold uppercase bg-secondary/60 border border-glass-border rounded text-foreground cursor-pointer focus:outline-none focus:border-neon-cyan/40"
            >
              <option value="FOR">FOR</option>
              <option value="DES">DES</option>
              <option value="CON">CON</option>
              <option value="INT">INT</option>
              <option value="SAB">SAB</option>
              <option value="CAR">CAR</option>
            </select>
          </div>
        ))}

        {/* Add Custom Skill Button */}
        {canAddCustom && (
          <button
            onClick={handleAddCustomSkill}
            className="w-full flex items-center justify-center gap-1.5 py-2 mt-2 rounded-lg border border-dashed border-glass-border hover:border-neon-cyan/30 hover:bg-neon-cyan/5 text-muted-foreground hover:text-neon-cyan transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Adicionar Pericia ({3 - customSkills.length} restantes)
            </span>
          </button>
        )}
      </div>

      {/* Footer with save indicator */}
      {hasChanges && (
        <div className="px-4 py-2 border-t border-glass-border bg-emerald-500/5 shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400">
            <Check className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Salvo automaticamente</span>
          </div>
        </div>
      )}
    </div>
  )
}
