import { useState } from 'react';
import { CLASS_BY_ID, ARCHETYPE_LABELS } from '../data/classes';

/**
 * Pencil-sketch portrait for a class, in the shared art-plate frame.
 * Falls back to a Cinzel monogram when the image is missing, so the
 * component works before any art has been generated.
 */
export function ClassPortrait({
  classId,
  parchment = false
}: {
  classId: string;
  parchment?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const cls = CLASS_BY_ID[classId];

  return (
    <div className={`art-plate art-plate--portrait${parchment ? ' art-plate--parchment' : ''}`}>
      {failed || !cls ? (
        <div className="art-monogram" aria-label={cls?.name ?? classId}>
          <span className="art-monogram-letter">{cls?.name[0] ?? '?'}</span>
          <span className="art-monogram-sub">
            {cls ? ARCHETYPE_LABELS[cls.archetype] : ''}
          </span>
        </div>
      ) : (
        <img
          src={`${import.meta.env.BASE_URL}classes/${classId}.webp`}
          alt={`${cls.name} — class portrait`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
