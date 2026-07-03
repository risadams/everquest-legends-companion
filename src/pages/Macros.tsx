import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CLASSES, CLASS_BY_ID } from '../data/classes';
import { MACRO_CATEGORIES, MACRO_CATEGORY_LABELS } from '../data/macros';
import { macrosForClasses, macroToText } from '../lib/macros';
import { useCharacters } from '../context/CharacterContext';
import type { MacroDef } from '../data/types';

function MacroCard({ macro }: { macro: MacroDef }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(macroToText(macro));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — nothing to do.
    }
  }

  const classTags =
    macro.requiresAll && macro.requiresAll.length > 0
      ? macro.requiresAll.map((c) => CLASS_BY_ID[c]?.name).join(' + ')
      : macro.forClasses.length > 0
        ? macro.forClasses.map((c) => CLASS_BY_ID[c]?.name).join(' / ')
        : 'Everyone';

  return (
    <div className="card" data-macro={macro.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
        <strong style={{ color: 'var(--gold)' }}>{macro.name}</strong>
        <button className="small" onClick={copy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <div className="chip-row" style={{ margin: '0.3rem 0' }}>
        <span className={`badge ${macro.requiresAll ? 'gold' : ''}`}>
          {macro.requiresAll ? `Combo: ${classTags}` : classTags}
        </span>
      </div>
      <pre
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0.6rem 0.8rem',
          fontSize: '0.85rem',
          overflowX: 'auto',
          margin: '0.4rem 0'
        }}
      >
        {macro.lines.join('\n')}
      </pre>
      <p className="small" style={{ margin: '0.2rem 0' }}>{macro.description}</p>
      {macro.tips && (
        <p className="small muted" style={{ margin: '0.2rem 0 0' }}>💡 {macro.tips}</p>
      )}
    </div>
  );
}

export default function Macros() {
  const { active } = useCharacters();
  const [selected, setSelected] = useState<string[]>(active?.classIds ?? []);

  function toggleClass(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length >= 3 ? prev : [...prev, id]
    );
  }

  const macros = useMemo(() => macrosForClasses(selected), [selected]);
  const comboMacros = macros.filter((m) => m.requiresAll && m.requiresAll.length > 0);

  return (
    <div>
      <h1>Macro Guide</h1>
      <p className="muted">
        Ready-to-build social macros for your class combo — including one-button cross-class
        rotations only possible with EQL’s multiclass system. Create them in-game via the Socials
        window, then drag them to your hotbar.
      </p>

      <div className="advice-callout small">
        <strong>Social syntax in 30 seconds:</strong> each social holds up to 5 lines, executed in
        order. <code>/pause 30</code> waits 3 seconds (pauses are tenths) before the next line —
        put pauses <em>between</em> casts to cover casting time. <code>%t</code> expands to your
        target’s name. <code>/cast 1-8</code> fires spell gems, <code>/doability 1-6</code> fires
        trained abilities — renumber to match your own layout, and replace names in CAPS (like{' '}
        <code>MAINPULLER</code>) with your group’s.
      </div>

      <h2>Your combo</h2>
      <p className="small muted">
        {active
          ? `Preloaded from ${active.name} — adjust freely:`
          : 'Pick up to three classes:'}
      </p>
      <div className="chip-row">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            className={selected.includes(c.id) ? 'active' : ''}
            onClick={() => toggleClass(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
      {selected.length === 0 && (
        <p className="muted small">
          No classes selected — showing only the universal macros. Pick your combo above, or{' '}
          <Link to="/character">set up your character</Link> first.
        </p>
      )}
      {comboMacros.length > 0 && (
        <p className="small">
          <span className="badge gold">
            {comboMacros.length} cross-class combo {comboMacros.length === 1 ? 'macro' : 'macros'}
          </span>{' '}
          unlocked by this combination.
        </p>
      )}

      {MACRO_CATEGORIES.map((cat) => {
        const inCat = macros.filter((m) => m.category === cat);
        if (inCat.length === 0) return null;
        return (
          <section key={cat}>
            <h3 style={{ color: 'var(--gold-dim)' }}>{MACRO_CATEGORY_LABELS[cat]}</h3>
            <div className="card-grid">
              {inCat.map((m) => (
                <MacroCard key={m.id} macro={m} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
