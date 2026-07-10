import { useEffect, useRef, useState } from 'react';
import type { Zone } from '../data/types';

// True 3D zone render from the actual game geometry: scripts/import-zone-mesh.mjs parses
// the zone's .s3d → WLD 0x36 meshes into public/zonemesh/<zone>.json (positions + indices),
// and this renders it as a flat-lit solid in raw WebGL (no 3D library). Lazy-loaded.

interface MeshVariant {
  label: string;
  b: number[]; // [minx,miny,minz,maxx,maxy,maxz]
  pos: number[];
  idx: number[];
  pal?: number[][]; // unique [r,g,b] 0-255 material colours
  ci?: number[];    // per-vertex palette index into pal
}

// ── column-major mat4 helpers ────────────────────────────────
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (v: number[]) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
function perspective(fovy: number, aspect: number, near: number, far: number): number[] {
  const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
  return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
}
function lookAt(eye: number[], c: number[], up: number[]): number[] {
  const z = norm([eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]]);
  const x = norm(cross(up, z)), y = cross(z, x);
  return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
}
function mul(a: number[], b: number[]): number[] {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k];
  return o;
}

const VERT = `attribute vec3 aPos; attribute vec3 aNormal; attribute vec3 aColor;
uniform mat4 uMVP; varying vec3 vN; varying vec3 vCol;
void main(){ gl_Position = uMVP * vec4(aPos,1.0); vN = aNormal; vCol = aColor; }`;
const FRAG = `precision mediump float; varying vec3 vN; varying vec3 vCol; uniform vec3 uLight;
void main(){
  vec3 n = normalize(vN);
  // two-sided lighting: zone meshes aren't consistently wound, so light either face
  float up = abs(n.y) * 0.5 + 0.5;                   // hemispheric sky light
  float d = abs(dot(n, normalize(uLight)));          // key light
  float l = min(0.55 + 0.35 * up + 0.35 * d, 1.4);
  gl_FragColor = vec4(vCol * l, 1.0);
}`;

interface GLState { gl: WebGLRenderingContext; prog: WebGLProgram; aPos: number; aNormal: number; aColor: number; uMVP: WebGLUniformLocation | null; uLight: WebGLUniformLocation | null; }
interface Geom { posB: WebGLBuffer; normB: WebGLBuffer; colB: WebGLBuffer; idxB: WebGLBuffer; count: number; }

/** normalize world coords to a unit cube at origin (z up), + smooth per-vertex normals */
function buildGeom(v: MeshVariant) {
  const [minx, miny, minz, maxx, maxy, maxz] = v.b;
  const cx = (minx + maxx) / 2, cy = (miny + maxy) / 2, cz = (minz + maxz) / 2;
  const s = 2 / Math.max(maxx - minx, maxy - miny, maxz - minz, 1);
  const n = v.pos.length / 3;
  const P = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    P[i * 3] = (v.pos[i * 3] - cx) * s;         // x
    P[i * 3 + 1] = (v.pos[i * 3 + 2] - cz) * s; // world z -> gl up
    P[i * 3 + 2] = (v.pos[i * 3 + 1] - cy) * s; // world y -> gl z
  }
  const N = new Float32Array(n * 3);
  const idx = v.idx;
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
    const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const j of [a, b, c]) { N[j] += nx; N[j + 1] += ny; N[j + 2] += nz; }
  }
  for (let i = 0; i < n; i++) {
    const l = Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) || 1;
    N[i * 3] /= l; N[i * 3 + 1] /= l; N[i * 3 + 2] /= l;
  }
  // per-vertex colour from the palette index (material average) 0-255 -> 0-1
  const C = new Float32Array(n * 3);
  if (v.pal && v.ci && v.ci.length === n) {
    for (let i = 0; i < n; i++) {
      const p = v.pal[v.ci[i]] ?? [184, 164, 128];
      C[i * 3] = p[0] / 255; C[i * 3 + 1] = p[1] / 255; C[i * 3 + 2] = p[2] / 255;
    }
  } else {
    for (let i = 0; i < n; i++) { C[i * 3] = 0.72; C[i * 3 + 1] = 0.64; C[i * 3 + 2] = 0.5; }
  }
  return { P, N, C, idx: new Uint32Array(idx) };
}

export default function ZoneMesh3D({ zone }: { zone: Zone }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<{ variants: MeshVariant[] } | null | 'missing'>(null);
  const [variantIdx, setVariantIdx] = useState(0);
  const cam = useRef({ az: 0.7, el: 0.5, dist: 3.0 });
  const glRef = useRef<GLState | null>(null);
  const geomRef = useRef<Geom | null>(null);
  const uintExtRef = useRef<boolean>(false);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    setData(null); setVariantIdx(0);
    let live = true;
    fetch(`${import.meta.env.BASE_URL}zonemesh/${zone.id}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => live && setData(d))
      .catch(() => live && setData('missing'));
    return () => { live = false; };
  }, [zone.id]);

  // GL context + program once per mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return;
    uintExtRef.current = !!gl.getExtension('OES_element_index_uint');
    const prog = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]] as const) {
      const sh = gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); gl.attachShader(prog, sh);
    }
    gl.linkProgram(prog);
    gl.enable(gl.DEPTH_TEST);
    glRef.current = {
      gl, prog,
      aPos: gl.getAttribLocation(prog, 'aPos'),
      aNormal: gl.getAttribLocation(prog, 'aNormal'),
      aColor: gl.getAttribLocation(prog, 'aColor'),
      uMVP: gl.getUniformLocation(prog, 'uMVP'),
      uLight: gl.getUniformLocation(prog, 'uLight')
    };
    drawRef.current = () => {
      const S = glRef.current, G = geomRef.current;
      if (!S || !G) return;
      const { gl } = S;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      gl.viewport(0, 0, canvas.width, canvas.height);
      const { az, el, dist } = cam.current;
      const eye = [dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az)];
      const mvp = mul(perspective(Math.PI / 4, canvas.width / canvas.height || 1, 0.01, 100), lookAt(eye, [0, 0, 0], [0, 1, 0]));
      gl.clearColor(0.055, 0.043, 0.031, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(S.prog);
      gl.uniformMatrix4fv(S.uMVP, false, new Float32Array(mvp));
      gl.uniform3f(S.uLight, 0.4, 0.8, 0.3);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.posB);
      gl.enableVertexAttribArray(S.aPos); gl.vertexAttribPointer(S.aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.normB);
      gl.enableVertexAttribArray(S.aNormal); gl.vertexAttribPointer(S.aNormal, 3, gl.FLOAT, false, 0, 0);
      if (S.aColor >= 0) { gl.bindBuffer(gl.ARRAY_BUFFER, G.colB);
        gl.enableVertexAttribArray(S.aColor); gl.vertexAttribPointer(S.aColor, 3, gl.FLOAT, false, 0, 0); }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, G.idxB);
      gl.drawElements(gl.TRIANGLES, G.count, uintExtRef.current ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT, 0);
    };
    const onResize = () => drawRef.current();
    window.addEventListener('resize', onResize);
    return () => {
      // do not loseContext() — StrictMode remounts on the same canvas and a lost
      // context can't be re-acquired (permanently blank). Freed on real unmount via GC.
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // (re)build geometry buffers on data/variant change
  useEffect(() => {
    const S = glRef.current;
    if (!S || !data || data === 'missing') return;
    const { gl } = S;
    const variant = data.variants[Math.min(variantIdx, data.variants.length - 1)];
    const { P, N, C, idx } = buildGeom(variant);
    const old = geomRef.current;
    if (old) { gl.deleteBuffer(old.posB); gl.deleteBuffer(old.normB); gl.deleteBuffer(old.colB); gl.deleteBuffer(old.idxB); }
    const arr = (target: number, src: ArrayBufferView) => {
      const b = gl.createBuffer()!; gl.bindBuffer(target, b); gl.bufferData(target, src, gl.STATIC_DRAW); return b;
    };
    // fall back to 16-bit indices if the uint index extension is unavailable
    let indices: ArrayBufferView = idx, count = idx.length;
    if (!uintExtRef.current && P.length / 3 > 65535) {
      // too many verts for 16-bit; cap by drawing what fits (rare; keeps it from crashing)
      count = Math.min(count, 65535);
      indices = new Uint16Array(idx.subarray(0, count));
    } else if (!uintExtRef.current) {
      indices = new Uint16Array(idx);
    }
    geomRef.current = {
      posB: arr(gl.ARRAY_BUFFER, P),
      normB: arr(gl.ARRAY_BUFFER, N),
      colB: arr(gl.ARRAY_BUFFER, C),
      idxB: arr(gl.ELEMENT_ARRAY_BUFFER, indices),
      count
    };
    cam.current = { az: 0.7, el: 0.5, dist: 3.0 };
    drawRef.current();
  }, [data, variantIdx]);

  const drag = useRef<{ x: number; y: number } | null>(null);
  function onPointerDown(e: React.PointerEvent) { drag.current = { x: e.clientX, y: e.clientY }; (e.target as Element).setPointerCapture?.(e.pointerId); }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    cam.current.az -= dx * 0.008;
    cam.current.el = Math.max(-1.4, Math.min(1.4, cam.current.el - dy * 0.008));
    drawRef.current();
  }
  function onPointerUp() { drag.current = null; }
  function onWheel(e: React.WheelEvent) { cam.current.dist = Math.max(1.2, Math.min(8, cam.current.dist * (1 + Math.sign(e.deltaY) * 0.1))); drawRef.current(); }

  const variants = data && data !== 'missing' ? data.variants : [];
  return (
    <div>
      {variants.length > 1 && (
        <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
          {variants.map((v, i) => (
            <button key={i} className={i === variantIdx ? 'active' : ''} onClick={() => setVariantIdx(i)}>{v.label}</button>
          ))}
        </div>
      )}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#0e0b08', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        {data === 'missing' && <p className="muted small" style={{ padding: '1rem' }}>No parsed geometry for this zone yet.</p>}
        {data === null && <p className="muted small" style={{ padding: '1rem' }}>Loading zone geometry…</p>}
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'none' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onWheel={onWheel}
        />
      </div>
      <p className="small muted" style={{ marginTop: '0.3rem' }}>
        Actual zone geometry parsed from the game’s .s3d files, tinted by each surface’s real
        texture colour · drag to orbit · scroll to zoom.
      </p>
    </div>
  );
}
