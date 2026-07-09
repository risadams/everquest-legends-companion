import { useEffect, useRef, useState } from 'react';
import type { Zone } from '../data/types';

// Orbitable 3D wireframe of a zone, rendered in raw WebGL (no 3D library) from the
// lazy-loaded public/maps3d/<zone>.json produced by scripts/import-maps-3d.mjs. It draws
// the SAME line data as the flat atlas map, keeping the z the 2D view discards — so the
// vertical structure of multi-floor dungeons becomes visible while staying in sync.

interface V3 {
  label: string;
  b: number[]; // [minX,minY,minZ,maxX,maxY,maxZ]
  colors: number[][];
  paths: { c: number; pts: number[] }[]; // pts flat x,y,z,...
  points: { x: number; y: number; z: number; c: number[]; s: number; t: string }[];
}

/** brighten map colors for a dark background; near-black walls become parchment ink */
function glColor([r, g, b]: number[]): [number, number, number] {
  const mx = Math.max(r, g, b);
  if (mx < 40) return [0.72, 0.68, 0.6];
  const lift = mx < 90 ? 90 / mx : 1;
  return [Math.min(1, (r * lift) / 255), Math.min(1, (g * lift) / 255), Math.min(1, (b * lift) / 255)];
}

// ── minimal column-major mat4 helpers ────────────────────────
function perspective(fovy: number, aspect: number, near: number, far: number): number[] {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}
function lookAt(eye: number[], c: number[], up: number[]): number[] {
  const z = norm([eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]]);
  const x = norm(cross(up, z));
  const y = cross(z, x);
  return [
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
  ];
}
function mul(a: number[], b: number[]): number[] {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
  return o;
}
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (v: number[]) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};

const VERT = `attribute vec3 aPos; attribute vec3 aColor; uniform mat4 uMVP; uniform float uPt;
varying vec3 vColor; void main(){ gl_Position = uMVP * vec4(aPos,1.0); gl_PointSize = uPt; vColor = aColor; }`;
const FRAG = `precision mediump float; varying vec3 vColor; void main(){ gl_FragColor = vec4(vColor,1.0); }`;

interface GLState {
  gl: WebGLRenderingContext;
  prog: WebGLProgram;
  aPos: number;
  aColor: number;
  uMVP: WebGLUniformLocation | null;
  uPt: WebGLUniformLocation | null;
}
interface Geom {
  linePos: WebGLBuffer;
  lineCol: WebGLBuffer;
  lineCount: number;
  ptPos: WebGLBuffer | null;
  ptCol: WebGLBuffer | null;
  ptCount: number;
}

export default function ZoneMap3D({ zone }: { zone: Zone }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{ variants: V3[] } | null | 'missing'>(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const cam = useRef({ az: 0.6, el: 0.9, dist: 3.2 });
  const glRef = useRef<GLState | null>(null);
  const geomRef = useRef<Geom | null>(null);
  const drawRef = useRef<() => void>(() => {});

  // fetch the zone's 3D data on demand (not precached)
  useEffect(() => {
    setData(null);
    setVariantIdx(0);
    let live = true;
    fetch(`${import.meta.env.BASE_URL}maps3d/${zone.id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => live && setData(d))
      .catch(() => live && setData('missing'));
    return () => {
      live = false;
    };
  }, [zone.id]);

  // create the WebGL context + program ONCE per mount (never on variant change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;
    const prog = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    glRef.current = {
      gl, prog,
      aPos: gl.getAttribLocation(prog, 'aPos'),
      aColor: gl.getAttribLocation(prog, 'aColor'),
      uMVP: gl.getUniformLocation(prog, 'uMVP'),
      uPt: gl.getUniformLocation(prog, 'uPt')
    };

    drawRef.current = () => {
      const S = glRef.current, G = geomRef.current;
      if (!S || !G) return;
      const { gl } = S;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      const { az, el, dist } = cam.current;
      const eye = [dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)];
      const mvp = mul(perspective(Math.PI / 4, canvas.width / canvas.height || 1, 0.01, 100), lookAt(eye, [0, 0, 0], [0, 1, 0]));
      gl.clearColor(0.055, 0.043, 0.031, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(S.prog);
      gl.uniformMatrix4fv(S.uMVP, false, new Float32Array(mvp));
      gl.uniform1f(S.uPt, 6 * dpr);
      const bind = (posB: WebGLBuffer, colB: WebGLBuffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, posB);
        gl.enableVertexAttribArray(S.aPos);
        gl.vertexAttribPointer(S.aPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colB);
        gl.enableVertexAttribArray(S.aColor);
        gl.vertexAttribPointer(S.aColor, 3, gl.FLOAT, false, 0, 0);
      };
      bind(G.linePos, G.lineCol);
      gl.drawArrays(gl.LINES, 0, G.lineCount);
      if (G.ptPos && G.ptCol) {
        bind(G.ptPos, G.ptCol);
        gl.drawArrays(gl.POINTS, 0, G.ptCount);
      }
    };

    const onResize = () => drawRef.current();
    window.addEventListener('resize', onResize);
    return () => {
      // NOTE: do not loseContext() here — under React StrictMode the effect is
      // mounted→cleaned→remounted on the SAME canvas, and a lost context cannot be
      // re-acquired, leaving a permanently blank canvas. The context is released when
      // the canvas element is garbage-collected on real unmount.
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // (re)build vertex buffers whenever the data or selected variant changes
  useEffect(() => {
    const S = glRef.current;
    if (!S || !data || data === 'missing') return;
    const { gl } = S;
    const variant = data.variants[Math.min(variantIdx, data.variants.length - 1)];

    const [minX, minY, minZ, maxX, maxY, maxZ] = variant.b;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
    const spanXY = Math.max(maxX - minX, maxY - minY, 1);
    const spanZ = Math.max(maxZ - minZ, 1);
    const zex = Math.min(6, Math.max(1, (0.35 * spanXY) / spanZ));
    const s = 2 / spanXY;
    const tx = (x: number) => (x - cx) * s;
    const ty = (z: number) => (z - cz) * zex * s; // world z -> gl up
    const tz = (y: number) => (y - cy) * s;

    const pos: number[] = [], col: number[] = [];
    for (const path of variant.paths) {
      const gc = glColor(variant.colors[path.c] ?? [180, 170, 150]);
      const pts = path.pts;
      for (let i = 0; i + 5 < pts.length; i += 3) {
        pos.push(tx(pts[i]), ty(pts[i + 2]), tz(pts[i + 1]), tx(pts[i + 3]), ty(pts[i + 5]), tz(pts[i + 4]));
        col.push(...gc, ...gc);
      }
    }
    const ppos: number[] = [], pcol: number[] = [];
    for (const p of variant.points) {
      ppos.push(tx(p.x), ty(p.z), tz(p.y));
      pcol.push(...glColor(p.c));
    }

    const buf = (arr: number[]) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
      return b;
    };
    // release previous variant's buffers
    const old = geomRef.current;
    if (old) {
      gl.deleteBuffer(old.linePos); gl.deleteBuffer(old.lineCol);
      if (old.ptPos) gl.deleteBuffer(old.ptPos);
      if (old.ptCol) gl.deleteBuffer(old.ptCol);
    }
    geomRef.current = {
      linePos: buf(pos), lineCol: buf(col), lineCount: pos.length / 3,
      ptPos: ppos.length ? buf(ppos) : null,
      ptCol: ppos.length ? buf(pcol) : null,
      ptCount: ppos.length / 3
    };
    // reset camera to a pleasant default when the variant/zone changes
    cam.current = { az: 0.6, el: 0.9, dist: 3.2 };
    drawRef.current();
  }, [data, variantIdx]);

  // ── mouse / touch orbit + zoom ─────────────────────────────
  const drag = useRef<{ x: number; y: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    drag.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    cam.current.az -= dx * 0.008;
    cam.current.el = Math.max(-1.4, Math.min(1.4, cam.current.el - dy * 0.008));
    drawRef.current();
  }
  function onPointerUp() {
    drag.current = null;
  }
  function onWheel(e: React.WheelEvent) {
    cam.current.dist = Math.max(1.2, Math.min(8, cam.current.dist * (1 + Math.sign(e.deltaY) * 0.1)));
    drawRef.current();
  }

  const variants = data && data !== 'missing' ? data.variants : [];

  return (
    <div>
      {variants.length > 1 && (
        <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
          {variants.map((v, i) => (
            <button key={i} className={i === variantIdx ? 'active' : ''} onClick={() => setVariantIdx(i)}>
              {v.label}
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          background: '#0e0b08',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        {data === 'missing' && (
          <p className="muted small" style={{ padding: '1rem' }}>No 3D data for this zone yet.</p>
        )}
        {data === null && (
          <p className="muted small" style={{ padding: '1rem' }}>Loading 3D map…</p>
        )}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        />
      </div>
      <p className="small muted" style={{ marginTop: '0.3rem' }}>
        Drag to orbit · scroll to zoom · elevation is exaggerated so floors read clearly. Labels stay
        on the 2D map.
      </p>
    </div>
  );
}
