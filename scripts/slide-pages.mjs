// 세미나 슬라이드(PDF)를 Drive에서 받아 페이지 이미지로 만든다 (사이트 안 뷰어용).
//   assets/seminars/<driveId>.pdf           ← 원본 캐시 (git에 안 올라감)
//   public/img/seminars/<driveId>/01.webp … ← 페이지 이미지 (가로 1280px, WebP)
//   src/data/seminars.json                  ← 각 항목에 pages(페이지 수) 기록
// 사용: npm run slides:pages   (이미 받은 PDF·이미 만든 페이지는 건너뛴다. --force 로 다시 만든다)
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const force = process.argv.includes('--force');
const W = 1280, QUALITY = 72;
const file = 'src/data/seminars.json';
const seminars = JSON.parse(readFileSync(file, 'utf8'));
const cache = 'assets/seminars'; mkdirSync(cache, { recursive: true });

async function download(id, dest) {
  let res = await fetch(`https://drive.google.com/uc?id=${id}&export=download`, { redirect: 'follow' });
  let type = res.headers.get('content-type') || '';
  if (type.includes('text/html')) {
    // 큰 파일은 바이러스 검사 확인 페이지가 먼저 온다 → 폼 값으로 다시 요청
    const html = await res.text();
    const uuid = /name="uuid" value="([^"]+)"/.exec(html)?.[1];
    const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t${uuid ? `&uuid=${uuid}` : ''}`;
    res = await fetch(url, { redirect: 'follow' }); type = res.headers.get('content-type') || '';
    if (type.includes('text/html')) throw new Error('Drive가 파일 대신 HTML을 돌려줌 (공유 설정 확인): ' + id);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 5).toString() !== '%PDF-') throw new Error('PDF가 아님: ' + id);
  writeFileSync(dest, buf);
  return buf.length;
}

let total = 0, rendered = 0;
for (const s of seminars) {
  const sl = s.slides;
  if (!sl?.drive || sl.ext !== 'pdf') { delete s.pages; continue; }
  const id = sl.drive, pdf = join(cache, `${id}.pdf`), outDir = join('public/img/seminars', id);
  if (!existsSync(pdf)) { const n = await download(id, pdf); console.log(`↓ ${sl.name} (${Math.round(n / 1024)}KB)`); }
  const pages = +(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf]).toString())?.[1] ?? 0);
  if (!pages) { console.log('페이지 수를 읽지 못함', sl.name); continue; }
  const done = existsSync(outDir) ? readdirSync(outDir).filter((f) => f.endsWith('.webp')).length : 0;
  if (force || done !== pages) {
    rmSync(outDir, { recursive: true, force: true }); mkdirSync(outDir, { recursive: true });
    const tmp = mkdtempSync(join(tmpdir(), 'slides-'));
    execFileSync('pdftoppm', ['-png', '-r', '110', '-scale-to-x', String(W), '-scale-to-y', '-1', pdf, join(tmp, 'p')]);
    const pngs = readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();
    let bytes = 0;
    for (let i = 0; i < pngs.length; i++) {
      const info = await sharp(join(tmp, pngs[i])).flatten({ background: '#ffffff' }).webp({ quality: QUALITY }).toFile(join(outDir, `${String(i + 1).padStart(2, '0')}.webp`));
      bytes += info.size;
    }
    rmSync(tmp, { recursive: true, force: true });
    total += bytes; rendered++;
    console.log(`${sl.name}: ${pngs.length}p, ${Math.round(bytes / 1024)}KB`);
  }
  s.pages = pages;
}
writeFileSync(file, JSON.stringify(seminars, null, 1) + '\n');
console.log(`done: ${rendered} decks rendered this run, ${Math.round(total / 1048576)}MB new`);
