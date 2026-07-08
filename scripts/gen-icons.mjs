// Generates public/icon-192.png and public/icon-512.png without any dependencies.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

function png(size, pixelFn) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  let o = 0;
  for (let y = 0; y < size; y++) {
    raw[o++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y, size);
      raw[o++] = r; raw[o++] = g; raw[o++] = b; raw[o++] = a;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Compass rose on deep ink — matches the BrandMark and the atlas maps.
const BG = [0x14, 0x10, 0x0b, 255];
const GOLD = [0xe0, 0xb2, 0x5e, 255];
const GOLD_DIM = [0xa9, 0x85, 0x3f, 255];

function icon(x, y, size) {
  const c = size / 2;
  const dx = x - c;
  const dy = y - c;
  const r = Math.hypot(dx, dy);
  const th = Math.atan2(dy, dx);
  const R = size * 0.38;
  // four cardinal spikes, four smaller intercardinal spikes
  const cardinal = R * (0.14 + 0.86 * Math.pow(Math.abs(Math.cos(2 * th)), 5));
  const diagonal = 0.66 * R * (0.2 + 0.8 * Math.pow(Math.abs(Math.sin(2 * th)), 5));
  if (r < size * 0.04) return BG; // hub
  if (r < cardinal) return GOLD;
  if (r < diagonal) return GOLD_DIM;
  const ringOuter = size * 0.46;
  if (r > ringOuter - size * 0.028 && r < ringOuter) return GOLD_DIM;
  return BG;
}

mkdirSync(join(root, 'public'), { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(join(root, 'public', `icon-${size}.png`), png(size, icon));
  console.log(`wrote public/icon-${size}.png`);
}
