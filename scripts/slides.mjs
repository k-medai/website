// 세미나 슬라이드 썸네일 생성: src/data/seminars.json 의 각 항목에 대해
//   - slides.drive (Google Drive 파일 ID) → Drive 썸네일을 받아 public/img/seminars/<id>.jpg
//   - slides.file  (예: /files/seminars/2026-10-02-topic.pdf, public/ 아래 PDF) → pdftoppm 으로 1쪽 렌더링
// 썸네일 경로를 thumb 필드에 채워 넣는다. 사용법: npm run slides
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
const file = 'src/data/seminars.json';
const sem = JSON.parse(readFileSync(file, 'utf8'));
mkdirSync('public/img/seminars', { recursive: true });
let changed = 0;
for (const s of sem) {
  if (!s.slides) continue;
  if (s.slides.drive) {
    const out = `public/img/seminars/${s.slides.drive}.jpg`;
    if (!existsSync(out)) {
      const res = await fetch(`https://drive.google.com/thumbnail?id=${s.slides.drive}&sz=w1200`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) { await sharp(Buffer.from(await res.arrayBuffer())).resize(640, 360, { fit: 'cover', position: 'top' }).jpeg({ quality: 80, mozjpeg: true }).toFile(out); console.log('drive thumb →', out); }
      else { console.log('썸네일 실패 (공유 설정 확인):', s.slides.drive, res.status); continue; }
    }
    if (s.thumb !== `/img/seminars/${s.slides.drive}.jpg`) { s.thumb = `/img/seminars/${s.slides.drive}.jpg`; changed++; }
  } else if (s.slides.file && /\.pdf$/i.test(s.slides.file)) {
    const pdf = `public${s.slides.file}`; const base = s.slides.file.split('/').pop().replace(/\.pdf$/i, '');
    const out = `public/img/seminars/${base}.jpg`;
    if (!existsSync(out) && existsSync(pdf)) {
      try { execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '60', '-png', '-singlefile', pdf, `public/img/seminars/${base}`]); await sharp(`public/img/seminars/${base}.png`).resize(640, 360, { fit: 'cover', position: 'top' }).jpeg({ quality: 80, mozjpeg: true }).toFile(out); console.log('pdf thumb →', out); }
      catch (e) { console.log('pdftoppm 실패 (poppler-utils 필요):', e.message.slice(0, 80)); continue; }
    }
    if (existsSync(out) && s.thumb !== `/img/seminars/${base}.jpg`) { s.thumb = `/img/seminars/${base}.jpg`; changed++; }
  }
}
writeFileSync(file, JSON.stringify(sem, null, 1) + '\n');
console.log('updated entries:', changed);
