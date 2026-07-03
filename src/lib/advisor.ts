import type { CharacterProfile, Role, Zone } from '../data/types';
import { ZONES, ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { RACE_BY_ID } from '../data/races';
import { bandForLevel } from '../data/progression';

// ── Zone graph ──────────────────────────────────────────────

/** Undirected adjacency: a connection listed on either side counts both ways. */
export function buildAdjacency(zones: Zone[] = ZONES): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  for (const z of zones) adj.set(z.id, new Set());
  for (const z of zones) {
    for (const c of z.connections) {
      if (!adj.has(c)) continue;
      adj.get(z.id)!.add(c);
      adj.get(c)!.add(z.id);
    }
  }
  return adj;
}

/** BFS hop-distance from a starting zone to every reachable zone. */
export function zoneDistances(
  fromZoneId: string,
  adj: Map<string, Set<string>> = buildAdjacency()
): Map<string, number> {
  const dist = new Map<string, number>();
  if (!adj.has(fromZoneId)) return dist;
  dist.set(fromZoneId, 0);
  const queue = [fromZoneId];
  while (queue.length) {
    const cur = queue.shift()!;
    const d = dist.get(cur)!;
    for (const next of adj.get(cur) ?? []) {
      if (!dist.has(next)) {
        dist.set(next, d + 1);
        queue.push(next);
      }
    }
  }
  return dist;
}

// ── Role coverage ───────────────────────────────────────────

export interface RoleCoverage {
  covered: Role[];
  hasTank: boolean;
  hasHealer: boolean;
  hasCC: boolean;
  hasDps: boolean;
  hasPull: boolean;
  advice: string[];
}

export function roleCoverage(classIds: string[]): RoleCoverage {
  const covered = new Set<Role>();
  for (const id of classIds) {
    const cls = CLASS_BY_ID[id];
    if (cls) for (const r of cls.roles) covered.add(r);
  }
  const hasTank = covered.has('tank');
  const hasHealer = covered.has('healer');
  const hasCC = covered.has('cc');
  const hasDps = covered.has('melee-dps') || covered.has('caster-dps') || covered.has('pet');
  const hasPull = covered.has('pull');

  const advice: string[] = [];
  if (hasTank && hasHealer)
    advice.push(
      'You can tank and heal yourself — dungeons and tough camps are open to you, even solo.'
    );
  if (!hasTank)
    advice.push(
      'No tank class: avoid toe-to-toe fights with hard hitters. Favor kiting, pets, or open outdoor zones where you can control range — or group with a tank.'
    );
  if (!hasHealer)
    advice.push(
      'No healer class: your downtime will be high and mistakes unforgiving. Carry bandages and food, fight below your level in dungeons, or bump difficulty only outdoors.'
    );
  if (!hasDps)
    advice.push(
      'Low damage output: kills will be slow. Consider a DPS class for your remaining slot, or embrace long, safe fights.'
    );
  if (hasCC)
    advice.push('You have crowd control — multi-mob camps and dungeon crawls are far safer for you than for most.');
  if (hasPull)
    advice.push('You can split camps (pulling tools) — take camps others skip by breaking them one mob at a time.');
  if (covered.has('pet'))
    advice.push('Pet classes give you a second body: let the pet take the first hits when no tank is present.');
  return { covered: [...covered], hasTank, hasHealer, hasCC, hasDps, hasPull, advice };
}

// ── Zone fit & recommendations ──────────────────────────────

export type Fit = 'perfect' | 'good' | 'risky' | 'trivial' | 'deadly';

export function levelFit(zone: Zone, level: number): Fit {
  if (zone.type === 'city') return level <= zone.levelMax ? 'good' : 'trivial';
  if (level < zone.levelMin - 3) return 'deadly';
  if (level < zone.levelMin) return 'risky';
  if (level > zone.levelMax + 5) return 'trivial';
  if (level > zone.levelMax) return 'good';
  const mid = (zone.levelMin + zone.levelMax) / 2;
  const span = Math.max(1, (zone.levelMax - zone.levelMin) / 2);
  return Math.abs(level - mid) / span <= 0.75 ? 'perfect' : 'good';
}

export interface ZoneRecommendation {
  zone: Zone;
  score: number;
  fit: Fit;
  hops: number | null;
  reasons: string[];
  warnings: string[];
}

export function recommendZones(
  character: CharacterProfile,
  limit = 8
): ZoneRecommendation[] {
  const race = RACE_BY_ID[character.raceId];
  const coverage = roleCoverage(character.classIds);
  const dist = race ? zoneDistances(race.startingZoneId) : new Map<string, number>();

  const recs: ZoneRecommendation[] = [];
  for (const zone of ZONES) {
    if (zone.type === 'city' || zone.excludeFromAdvisor) continue;
    const fit = levelFit(zone, character.level);
    if (fit === 'deadly' || fit === 'trivial') continue;

    const reasons: string[] = [];
    const warnings: string[] = [];
    let score = 0;

    // Level fit is the dominant factor.
    if (fit === 'perfect') {
      score += 100;
      reasons.push(`Squarely in your level range (${zone.levelMin}-${zone.levelMax})`);
    } else if (fit === 'good') {
      score += 70;
      reasons.push(`Workable at level ${character.level} (zone is ${zone.levelMin}-${zone.levelMax})`);
    } else {
      score += 35;
      warnings.push('Slightly above your level — hunt the edges, not the heart');
    }

    // Proximity to home turf.
    const hops = dist.get(zone.id) ?? null;
    if (hops !== null) {
      const proximity = Math.max(0, 24 - hops * 4);
      score += proximity;
      if (hops <= 2) reasons.push('Close to your home city');
      else if (hops > 8) {
        score -= 6;
        warnings.push('Far from your home turf — plan a long trip or catch a port');
      }
    } else if (zone.continent !== 'planes') {
      warnings.push('No walking route from your home — requires a boat or teleport');
    }

    // Durability gate for dungeons.
    if (zone.type === 'dungeon' || zone.type === 'plane') {
      if (coverage.hasTank && coverage.hasHealer) {
        score += 12;
        reasons.push('Dungeon-ready build: you cover tank and healer');
      } else if (!coverage.hasTank && !coverage.hasHealer) {
        score -= 30;
        warnings.push('Dungeon with no tank or healer in your build — bring a group');
      } else {
        score -= 10;
        warnings.push(
          coverage.hasTank
            ? 'No healer: dungeon downtime will be brutal'
            : 'No tank: dungeon mobs will chew through you'
        );
      }
      if (coverage.hasCC) score += 8;
      if (coverage.hasPull) score += 6;
    } else if (!coverage.hasTank) {
      // Outdoors favors kiters and pet users.
      score += 6;
    }

    // Alignment friction: hunting next to hostile cities.
    if (race) {
      for (const cid of zone.connections) {
        const c = ZONE_BY_ID[cid];
        if (!c || c.type !== 'city' || !c.cityAlignment) continue;
        const hostile =
          (race.alignment === 'evil' && c.cityAlignment === 'good') ||
          (race.alignment === 'good' && c.cityAlignment === 'evil');
        if (hostile) {
          score -= 8;
          warnings.push(`${c.name} guards nearby will attack you on sight`);
        }
      }
      if (
        race.alignment === 'evil' &&
        zone.continent === 'faydwer'
      ) {
        score -= 8;
        warnings.push('Faydwer is thick with good-aligned cities — travel and sell carefully');
      }
      if (race.id === 'iksar' && zone.continent !== 'planes') {
        // Iksar are broadly hated; nudge toward wilderness.
        if (zone.type === 'outdoor') score += 3;
      }
    }

    recs.push({ zone, score, fit, hops, reasons, warnings });
  }

  recs.sort((a, b) => b.score - a.score);
  return recs.slice(0, limit);
}

// ── Milestones & summary ────────────────────────────────────

export function nextMilestones(character: CharacterProfile): string[] {
  const out: string[] = [];
  if (character.classIds.length < 3) {
    out.push(
      character.level >= 10
        ? 'You can unlock your third class NOW — visit your trainer (level 10 unlock).'
        : `Third class unlocks at level 10 (${10 - character.level} levels away). Scout the combo explorer early.`
    );
  }
  if (character.level < 46) {
    out.push(`Planar access (Fear, Hate, Sky) opens at level 46 — ${46 - character.level} levels away.`);
  } else {
    out.push('The Planes are open to you. Join an 8-player raid for your first break-in.');
  }
  const band = bandForLevel(character.level);
  out.push(...band.milestones);
  return out;
}
