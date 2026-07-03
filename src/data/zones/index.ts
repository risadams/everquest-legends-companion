import type { Zone, Continent } from '../types';
import { ANTONICA_ZONES } from './antonica';
import { FAYDWER_ZONES } from './faydwer';
import { ODUS_ZONES } from './odus';
import { PLANES_ZONES } from './planes';

export const ZONES: Zone[] = [
  ...ANTONICA_ZONES,
  ...FAYDWER_ZONES,
  ...ODUS_ZONES,
  ...PLANES_ZONES
];

export const ZONE_BY_ID: Record<string, Zone> = Object.fromEntries(
  ZONES.map((z) => [z.id, z])
);

export const CONTINENT_LABELS: Record<Continent, string> = {
  antonica: 'Antonica',
  faydwer: 'Faydwer',
  odus: 'Odus',
  planes: 'The Planes'
};

export const CONTINENTS: Continent[] = ['antonica', 'faydwer', 'odus', 'planes'];
