import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { QuestType } from '../data/types';
import { QUESTS, QUEST_TYPE_LABELS } from '../data/quests';
import { ZONE_BY_ID } from '../data/zones';
import { CLASS_BY_ID } from '../data/classes';
import { useCharacters } from '../context/CharacterContext';
import { questAvailable } from '../lib/advisor';

const TYPE_FILTERS: Array<{ id: QuestType | 'all'; label: string }> = [
  { id: 'all', label: 'All quests' },
  { id: 'turn-in', label: 'Repeatable turn-ins' },
  { id: 'item', label: 'Iconic items' },
  { id: 'class', label: 'Class quests' }
];

export default function Quests() {
  const [type, setType] = useState<QuestType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [forMe, setForMe] = useState(false);
  const { active } = useCharacters();

  const quests = useMemo(() => {
    const q = search.trim().toLowerCase();
    return QUESTS.filter((quest) => {
      if (type !== 'all' && quest.type !== type) return false;
      if (
        q &&
        !quest.name.toLowerCase().includes(q) &&
        !quest.reward.toLowerCase().includes(q) &&
        !(ZONE_BY_ID[quest.startZoneId]?.name.toLowerCase().includes(q) ?? false)
      )
        return false;
      if (forMe && active && !questAvailable(quest, active)) return false;
      return true;
    }).sort((a, b) => a.levelMin - b.levelMin || a.name.localeCompare(b.name));
  }, [type, search, forMe, active]);

  return (
    <div>
      <h1>Quest Guide</h1>
      <p className="muted">
        The classic-era quests that matter: repeatable turn-ins that supercharge leveling, and the
        iconic items every adventurer chases.
      </p>
      <div className="filter-bar">
        {TYPE_FILTERS.map((t) => (
          <button key={t.id} className={t.id === type ? 'active' : ''} onClick={() => setType(t.id)}>
            {t.label}
          </button>
        ))}
        <input
          placeholder="Search quests, rewards, zones…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: '14rem' }}
        />
        {active && (
          <button className={forMe ? 'active' : ''} onClick={() => setForMe(!forMe)}>
            Doable by {active.name}
          </button>
        )}
      </div>

      {quests.map((quest) => {
        const zone = ZONE_BY_ID[quest.startZoneId];
        const doable = active ? questAvailable(quest, active) : null;
        const inLevel =
          active && active.level >= quest.levelMin - 1 && active.level <= quest.levelMax;
        return (
          <div className="card" key={quest.id} style={{ marginBottom: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <strong style={{ color: 'var(--gold)', fontSize: '1.05rem' }}>{quest.name}</strong>
              <span className="chip-row" style={{ margin: 0 }}>
                <span className="badge">{QUEST_TYPE_LABELS[quest.type]}</span>
                <span className="badge gold">Levels {quest.levelMin}–{quest.levelMax}</span>
                {quest.repeatable && <span className="badge blue">Repeatable</span>}
                {active && doable && inLevel && <span className="badge good">For you, now</span>}
                {active && doable === false && (
                  <span className="badge danger">Not for {active.name}</span>
                )}
              </span>
            </div>
            <div className="small muted" style={{ margin: '0.3rem 0' }}>
              {zone && (
                <>
                  Starts: <Link to={`/atlas/${zone.id}`}>{zone.name}</Link> · {quest.giver}
                </>
              )}
              {quest.forClasses.length > 0 && (
                <> · For: {quest.forClasses.map((c) => CLASS_BY_ID[c]?.name ?? c).join(', ')}</>
              )}
            </div>
            <p className="small" style={{ margin: '0.3rem 0' }}>{quest.summary}</p>
            <p className="small" style={{ margin: 0 }}>
              <span className="muted">Reward:</span> <strong>{quest.reward}</strong>
            </p>
          </div>
        );
      })}
      {quests.length === 0 && <p className="muted">Nothing matches those filters.</p>}
    </div>
  );
}
