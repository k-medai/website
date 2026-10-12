// 사진 일괄 처리 (원본은 assets/ 아래에 두고, 결과만 public/img/ 에 저장. assets/는 git에 올라가지 않음)
//   assets/people/<slug>.jpg            → public/img/people/<slug>.jpg          (4:5, 720×900, 얼굴 중심 크롭)
//   assets/conferences/<slug>/*.jpg     → public/img/conferences/<slug>/NN.jpg  (긴 변 1600px)
//   assets/lablife/<slug>/*.jpg         → public/img/lablife/<slug>/NN.jpg      (긴 변 1600px)
// 사용법: npm run photos
import sharp from 'sharp';
import { mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, parse } from 'node:path';
const isImg = (f) => /\.(jpe?g|png|webp|heic|tiff?)$/i.test(f) && !f.startsWith('.');

if (existsSync('assets/people')) {
  mkdirSync('public/img/people', { recursive: true });
  for (const f of readdirSync('assets/people').filter(isImg)) {
    const slug = parse(f).name;
    const info = await sharp(join('assets/people', f)).rotate().resize(720, 900, { fit: 'cover', position: sharp.strategy.attention }).jpeg({ quality: 84, mozjpeg: true }).toFile(join('public/img/people', `${slug}.jpg`));
    console.log(`people/${f} → public/img/people/${slug}.jpg (${Math.round(info.size / 1024)}KB)`);
  }
}
for (const group of ['conferences', 'lablife']) {
  const src = join('assets', group);
  if (!existsSync(src)) continue;
  for (const slug of readdirSync(src)) {
    const dir = join(src, slug);
    if (!statSync(dir).isDirectory()) continue;
    const out = join('public/img', group, slug);
    mkdirSync(out, { recursive: true });
    const files = readdirSync(dir).filter(isImg).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
    for (const [i, f] of files.entries()) {
      const name = `${String(i + 1).padStart(2, '0')}.jpg`;
      const info = await sharp(join(dir, f)).rotate().resize(1600, 1600, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(out, name));
      console.log(`${group}/${slug}/${f} → ${out}/${name} (${Math.round(info.size / 1024)}KB)`);
    }
  }
}
console.log('done');
