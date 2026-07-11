import { useState } from 'react';
import { CLASS_BY_ID, ARCHETYPE_LABELS } from '../data/classes';
import { RACE_BY_ID } from '../data/races';

/**
 * Pencil-sketch portrait in the shared art-plate frame, with a Cinzel
 * monogram fallback when the image is missing — so plates work before
 * any art has been generated and self-heal as files land.
 */
function SketchPortrait({
  src,
  alt,
  monogram,
  monogramSub,
  parchment = false
}: {
  src: string;
  alt: string;
  monogram: string;
  monogramSub: string;
  parchment?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`art-plate art-plate--portrait${parchment ? ' art-plate--parchment' : ''}`}>
      {failed ? (
        <div className="art-monogram" aria-label={alt}>
          <span className="art-monogram-letter">{monogram}</span>
          <span className="art-monogram-sub">{monogramSub}</span>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

export function ClassPortrait({
  classId,
  parchment = false
}: {
  classId: string;
  parchment?: boolean;
}) {
  const cls = CLASS_BY_ID[classId];
  return (
    <SketchPortrait
      src={`${import.meta.env.BASE_URL}classes/${classId}.webp`}
      alt={`${cls?.name ?? classId} — class portrait`}
      monogram={cls?.name[0] ?? '?'}
      monogramSub={cls ? ARCHETYPE_LABELS[cls.archetype] : ''}
      parchment={parchment}
    />
  );
}

export function RacePortrait({
  raceId,
  parchment = false
}: {
  raceId: string;
  parchment?: boolean;
}) {
  const race = RACE_BY_ID[raceId];
  return (
    <SketchPortrait
      src={`${import.meta.env.BASE_URL}races/${raceId}.webp`}
      alt={`${race?.name ?? raceId} — race portrait`}
      monogram={race?.name[0] ?? '?'}
      monogramSub={race ? race.startingCity : ''}
      parchment={parchment}
    />
  );
}
