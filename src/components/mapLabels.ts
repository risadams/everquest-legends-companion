// A lightweight HTML overlay for the 3D views: project labelled points (zone lines,
// merchants, POIs) from 3D into screen space via the current MVP matrix and position a
// <div> at each. Shared by ZoneMap3D (wireframe) and ZoneMesh3D (solid mesh) so the same
// labels the flat atlas shows land on the right spot in 3D and track the camera.

/** a label already expressed in the component's normalised GL space (z is up) */
export interface GlLabel {
  text: string;
  x: number;
  y: number;
  z: number;
}

/**
 * Brewall/EQ map files store coordinates swapped and negated relative to the raw .s3d
 * world geometry: world = (-mapY, -mapX, mapZ). Verified by fitting every zone's map
 * bbox inside its mesh bbox. Use this to place map-file labels into mesh world space.
 */
export function mapToMeshWorld(mx: number, my: number, mz: number): [number, number, number] {
  return [-my, -mx, mz];
}

export interface LabelLayer {
  setLabels(labels: GlLabel[]): void;
  update(mvp: number[], cssW: number, cssH: number): void;
  destroy(): void;
}

/** Brewall maps embed their own attribution/credits as map points — not real POIs. */
const ANNOTATION = /\b(original|revised) map|brewall|rainsinger|everquest default|goodurden|map by\b/i;
export const isMapAnnotation = (t: string) => ANNOTATION.test(t);

/** create a label layer that owns <div>s inside `container` (which must be positioned) */
export function createLabelLayer(container: HTMLElement): LabelLayer {
  let els: HTMLDivElement[] = [];
  let labels: GlLabel[] = [];
  let widths: number[] = []; // estimated screen width per label (for declutter)

  function setLabels(next: GlLabel[]) {
    for (const e of els) e.remove();
    els = [];
    labels = next.filter((l) => l.text && !isMapAnnotation(l.text));
    widths = labels.map((l) => l.text.length * 5.9 + 6);
    for (const lab of labels) {
      const d = document.createElement('div');
      d.textContent = lab.text;
      d.style.cssText =
        'position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform;' +
        'pointer-events:none;white-space:nowrap;font:600 11px/1.1 system-ui,sans-serif;' +
        'color:#f2e8d2;text-shadow:0 0 3px #000,0 0 3px #000,0 1px 2px #000;' +
        'padding:0 2px;letter-spacing:.02em;';
      container.appendChild(d);
      els.push(d);
    }
  }

  // Project every label (column-major mat4: clip_i = Σ_j mvp[j*4+i] * v_j), then greedily
  // place them nearest-first, hiding any that would overlap one already shown — so dense
  // dungeons stay readable instead of collapsing into a wall of text.
  const H = 15;
  function update(mvp: number[], cssW: number, cssH: number) {
    const n = labels.length;
    const proj: ({ sx: number; sy: number; cw: number } | null)[] = new Array(n);
    for (let i = 0; i < n; i++) {
      const L = labels[i];
      const cw = mvp[3] * L.x + mvp[7] * L.y + mvp[11] * L.z + mvp[15];
      if (cw <= 0.0001) { proj[i] = null; continue; }
      const sx = ((mvp[0] * L.x + mvp[4] * L.y + mvp[8] * L.z + mvp[12]) / cw * 0.5 + 0.5) * cssW;
      const sy = (1 - ((mvp[1] * L.x + mvp[5] * L.y + mvp[9] * L.z + mvp[13]) / cw * 0.5 + 0.5)) * cssH;
      proj[i] = (sx < -80 || sx > cssW + 80 || sy < -40 || sy > cssH + 40) ? null : { sx, sy, cw };
    }
    const order: number[] = [];
    for (let i = 0; i < n; i++) if (proj[i]) order.push(i);
    order.sort((a, b) => proj[a]!.cw - proj[b]!.cw); // nearest first wins the spot
    const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
    for (const i of order) {
      const p = proj[i]!;
      const w = widths[i];
      const x0 = p.sx - w / 2, x1 = p.sx + w / 2, y1 = p.sy - 0.15 * H, y0 = y1 - H;
      let hit = false;
      for (const b of placed) if (!(x1 < b.x0 || x0 > b.x1 || y1 < b.y0 || y0 > b.y1)) { hit = true; break; }
      const e = els[i];
      if (hit) { e.style.display = 'none'; continue; }
      placed.push({ x0, y0, x1, y1 });
      e.style.display = '';
      e.style.transform = `translate(-50%,-115%) translate(${p.sx.toFixed(1)}px,${p.sy.toFixed(1)}px)`;
    }
    for (let i = 0; i < n; i++) if (!proj[i]) els[i].style.display = 'none';
  }

  function destroy() {
    for (const e of els) e.remove();
    els = [];
    labels = [];
    widths = [];
  }

  return { setLabels, update, destroy };
}
