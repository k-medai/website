/**
 * 빌드 시 public/img/<dir>/ 폴더의 사진을 이름순으로 모아 경로 배열로 돌려준다.
 * 폴더에 사진만 넣으면 페이지에 자동으로 나타난다 (JSON 수정 불필요).
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function photosIn(dir: string): string[] {
  const abs = join(process.cwd(), 'public', 'img', dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .map((f) => `/img/${dir}/${f}`);
}

/**
 * 사진 파일의 실제 픽셀 크기 (JPEG·PNG 헤더만 읽음). 레이아웃이 사진을 내려받기 전후로 흔들리지 않도록
 * <img width height> 에 실제 비율을 넣기 위한 것. 모르는 형식이면 undefined.
 */
import { openSync, readSync, closeSync } from 'node:fs';
export function photoSize(src: string): { width: number; height: number } | undefined {
  const abs = join(process.cwd(), 'public', src.replace(/^\//, ''));
  if (!existsSync(abs)) return undefined;
  const fd = openSync(abs, 'r');
  try {
    const head = Buffer.alloc(32); readSync(fd, head, 0, 32, 0);
    if (head.toString('ascii', 1, 4) === 'PNG') return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
    if (head[0] !== 0xff || head[1] !== 0xd8) return undefined; // JPEG 아님
    let pos = 2; const buf = Buffer.alloc(9);
    for (let i = 0; i < 400; i++) { // SOFn 마커(0xC0~0xCF, C4·C8·CC 제외)에서 높이·너비를 읽는다
      if (readSync(fd, buf, 0, 9, pos) < 4 || buf[0] !== 0xff) return undefined;
      const marker = buf[1]; const len = buf.readUInt16BE(2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { height: buf.readUInt16BE(5), width: buf.readUInt16BE(7) };
      pos += 2 + len;
    }
    return undefined;
  } finally { closeSync(fd); }
}
