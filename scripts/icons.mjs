// 사이트 아이콘 생성: 연구실 로고(public/img/logo.png, 투명 배경)로
//   public/favicon.ico (16·32·48, PNG 엔트리) · public/img/icon-192.png · icon-512.png (투명) · apple-touch-icon.png (180, 흰 배경)
// 실행: node scripts/icons.mjs   (로고 파일을 바꾼 뒤 다시 실행)
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const pub = fileURLToPath(new URL('../public/', import.meta.url));
const base = sharp(`${pub}img/logo.png`).trim();
const clear = { r: 0, g: 0, b: 0, alpha: 0 }, white = { r: 255, g: 255, b: 255, alpha: 1 };
const fit = async (size, ratio, bg) => { // 정사각 캔버스 가운데에 로고를 캔버스의 ratio 크기로
  const inner = Math.round(size * ratio);
  const l = await base.clone().resize({ width: inner, height: inner, fit: 'contain', background: clear, kernel: 'lanczos3' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg } }).composite([{ input: l, gravity: 'centre' }]).png({ compressionLevel: 9 }).toBuffer();
};
const entries = []; for (const s of [16, 32, 48]) entries.push([s, await fit(s, 1, clear)]); // 작은 아이콘은 여백 없이
const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(entries.length, 4);
let off = 6 + 16 * entries.length; const dirs = [], blobs = [];
for (const [s, buf] of entries) { const d = Buffer.alloc(16); d.writeUInt8(s, 0); d.writeUInt8(s, 1); d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6); d.writeUInt32LE(buf.length, 8); d.writeUInt32LE(off, 12); off += buf.length; dirs.push(d); blobs.push(buf); }
writeFileSync(`${pub}favicon.ico`, Buffer.concat([head, ...dirs, ...blobs]));
writeFileSync(`${pub}img/icon-192.png`, await fit(192, 0.92, clear));
writeFileSync(`${pub}img/icon-512.png`, await fit(512, 0.92, clear));
writeFileSync(`${pub}img/apple-touch-icon.png`, await fit(180, 0.8, white)); // iOS는 투명 배경을 검게 칠하므로 흰 배경
console.log('favicon.ico, img/icon-192.png, img/icon-512.png, img/apple-touch-icon.png 생성');
