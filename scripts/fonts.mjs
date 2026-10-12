// 한글 웹폰트 서브셋 생성: Noto Sans KR 가변 폰트에서 사이트에 쓰인 글자 + KS X 1001 완성형 2,350자 + 기호를 추려
// public/fonts/noto-sans-kr/NotoSansKR-subset.woff2 하나로 만든다 (조각 폰트가 따로따로 늦게 로딩되며 한글이 섞여 보이는 문제 방지).
// 사용법: npm run fonts   (원본 TTF: assets/fonts/NotoSansKR[wght].ttf — https://github.com/google/fonts/tree/main/ofl/notosanskr)
import subsetFont from 'subset-font';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const src = ['assets/fonts/NotoSansKR[wght].ttf', process.env.NOTO_TTF].filter(Boolean).find((p) => existsSync(p));
if (!src) { console.error('원본 TTF가 없습니다: assets/fonts/NotoSansKR[wght].ttf'); process.exit(1); }
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|json|md)$/.test(f) ? [p] : []; });
let text = ['src', 'README.md'].filter(existsSync).flatMap((p) => (statSync(p).isDirectory() ? walk(p) : [p])).map((p) => readFileSync(p, 'utf8')).join('');
// KS X 1001 2,350 common syllables: derive from the standard table (EUC-KR rows B0–C8)
const ks = []; const dec = new TextDecoder('euc-kr');
for (let hi = 0xb0; hi <= 0xc8; hi++) for (let lo = 0xa1; lo <= 0xfe; lo++) { const ch = dec.decode(new Uint8Array([hi, lo])); if (ch && ch !== '�') ks.push(ch); }
const extra = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~·–—‘’“”…‹›«»→←↑↓↗↘↔•※℃％＆（）：；！？、。「」『』〈〉《》【】ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ';
const chars = [...new Set([...text, ...ks, ...extra])].filter((c) => c.codePointAt(0) > 31);
const buf = readFileSync(src);
const woff2 = await subsetFont(buf, chars.join(''), { targetFormat: 'woff2', preserveNameIds: [] });
const out = 'public/fonts/noto-sans-kr/NotoSansKR-subset.woff2';
writeFileSync(out, woff2);
console.log(`${out}: ${chars.length} chars → ${Math.round(woff2.length / 1024)}KB (from ${Math.round(buf.length / 1048576)}MB TTF)`);
