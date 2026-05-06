import type { Mercenary } from '../types'
import { getEquipped, getSetBonuses } from '../data/equipment'

/** Sum powerBonus (+ classBonus) from all equipped items */
const eqPow = (m: Mercenary): number =>
  getEquipped(m.equipment).reduce((s, e) =>
    s + e.powerBonus + (e.classBonus?.[m.class] ?? 0), 0)

const eqAtk  = (m: Mercenary): number => getEquipped(m.equipment).reduce((s, e) => s + e.atkBonus,  0)
const eqTrap = (m: Mercenary): number => getEquipped(m.equipment).reduce((s, e) => s + e.trapBonus, 0)
const eqSurv = (m: Mercenary): number => {
  const equipped = getEquipped(m.equipment)
  let surv = equipped.reduce((s, e) => s + e.survBonus, 0)
  // survival_bonus passives from items
  for (const e of equipped) {
    if (e.passive?.type === 'survival_bonus') surv += e.passive.value
  }
  // survival_bonus from set bonuses
  for (const { bonus } of getSetBonuses(equipped)) {
    for (const eff of bonus.effects) {
      if (eff.type === 'survival_bonus') surv += eff.value
    }
  }
  return surv
}

export const effPower = (m: Mercenary): number => {
  if (m.age >= 55) return 0
  const favMod = 1 + (m.favorability - 50) / 500
  let base = m.power + eqPow(m)
  if (m.age >= 38) {
    const agePenalty = Math.min(0.50, (m.age - 37) * 0.03)
    base = Math.round(base * (1 - agePenalty))
  }
  const moraleMod = 0.8 + 0.2 * ((m.morale ?? 70) / 100)
  return Math.round(base * (0.4 + 0.6 * m.condition / 100) * favMod * moraleMod)
}

export const combatPower = (m: Mercenary): number =>
  Math.round((m.stats.공격력 + eqAtk(m)) * (0.4 + 0.6 * m.condition / 100))

export const canTrap = (m: Mercenary): boolean =>
  m.class === '도적' || m.class === '궁수'

export const trapPower = (m: Mercenary): number =>
  m.trap_disarm + eqTrap(m)

export const survBonus = (m: Mercenary): number => eqSurv(m)

export { eqPow, eqAtk, eqTrap, eqSurv }
