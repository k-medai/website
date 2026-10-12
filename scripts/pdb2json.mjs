// PDB 복합체 → 히어로용 JSON 변환.
// 사용법: node scripts/pdb2json.mjs <file.pdb> <chain> <ligand residue> src/data/complexes/<id>.json
// 예:    curl -L -o 1IEP.pdb https://files.rcsb.org/download/1IEP.pdb && node scripts/pdb2json.mjs 1IEP.pdb A STI src/data/complexes/1iep.json
import { readFileSync, writeFileSync } from 'node:fs';
const [,, file, chain, ligRes, out] = process.argv;
const lines = readFileSync(file, 'utf8').split('\n');
const prot = [], lig = [];
let seenModelEnd = false;
for (const l of lines) {
  if (l.startsWith('ENDMDL')) seenModelEnd = true;
  if (seenModelEnd) break;
  const rec = l.slice(0, 6).trim();
  if (rec !== 'ATOM' && rec !== 'HETATM') continue;
  const alt = l[16]; if (alt !== ' ' && alt !== 'A') continue;
  const el = (l.slice(76, 78).trim() || l.slice(12, 14).trim().replace(/[0-9]/g, '')).toUpperCase();
  if (el === 'H' || el === 'D') continue;
  const a = { name: l.slice(12, 16).trim(), res: l.slice(17, 20).trim(), ch: l[21], num: parseInt(l.slice(22, 26)), x: +l.slice(30, 38), y: +l.slice(38, 46), z: +l.slice(46, 54), el: el.length > 1 ? el[0] + el.slice(1).toLowerCase() : el };
  if (a.ch !== chain) continue;
  if (rec === 'HETATM' && a.res === ligRes) lig.push(a);
  else if (rec === 'ATOM') prot.push(a);
}
if (!lig.length) throw new Error('no ligand atoms');
const d = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
// center on ligand centroid
const c = lig.reduce((s, a) => ({ x: s.x + a.x / lig.length, y: s.y + a.y / lig.length, z: s.z + a.z / lig.length }), { x: 0, y: 0, z: 0 });
const r3 = (v) => Math.round(v * 1000) / 1000;
const pos = (a) => [r3(a.x - c.x), r3(a.y - c.y), r3(a.z - c.z)];
const bondsOf = (atoms) => { const b = []; for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) { const lim = (atoms[i].el === 'S' || atoms[j].el === 'S' || atoms[i].el === 'Cl' || atoms[j].el === 'Cl') ? 2.1 : 1.9; if (d(atoms[i], atoms[j]) < lim) b.push([i, j]); } return b; };
// pocket: residues with any atom within 4.5 Å of ligand
const pocketRes = new Set();
for (const a of prot) if (lig.some((l) => d(a, l) < 4.5)) pocketRes.add(a.num);
const pocket = prot.filter((a) => pocketRes.has(a.num));
// pocket bonds: within residue + peptide bonds between consecutive residues (C-N)
const pb = [];
for (let i = 0; i < pocket.length; i++) for (let j = i + 1; j < pocket.length; j++) {
  const A = pocket[i], B = pocket[j];
  if (A.num === B.num || (Math.abs(A.num - B.num) === 1 && ((A.name === 'C' && B.name === 'N') || (A.name === 'N' && B.name === 'C')))) { if (d(A, B) < 1.9) pb.push([i, j]); }
}
// hydrogen bonds: ligand N/O to pocket N/O within 3.4 Å
const hb = [];
lig.forEach((l, i) => { if (l.el !== 'N' && l.el !== 'O') return; pocket.forEach((p, j) => { if ((p.el === 'N' || p.el === 'O') && d(l, p) < 3.4) hb.push([i, j, r3(d(l, p))]); }); });
// backbone CA trace split at gaps
const ca = prot.filter((a) => a.name === 'CA').sort((a, b) => a.num - b.num);
const segs = []; let cur = [];
for (let i = 0; i < ca.length; i++) { if (i && (ca[i].num - ca[i - 1].num !== 1 || d(ca[i], ca[i - 1]) > 4.3)) { if (cur.length > 2) segs.push(cur); cur = []; } cur.push(pos(ca[i])); }
if (cur.length > 2) segs.push(cur);
// residue labels for pocket (unique)
const resList = [...new Map(pocket.map((a) => [a.num, { num: a.num, res: a.res }])).values()].sort((a, b) => a.num - b.num);
// protein extent
const ext = Math.max(...prot.map((a) => d(a, c)));
const json = { pdb: file.replace(/.*\//, '').replace('.pdb', ''), ligand: { res: ligRes, atoms: lig.map((a) => [a.el, ...pos(a)]), bonds: bondsOf(lig) }, pocket: { atoms: pocket.map((a) => [a.el, ...pos(a), a.num]), bonds: pb, residues: resList }, hbonds: hb, backbone: segs, extent: r3(ext) };
writeFileSync(out, JSON.stringify(json));
console.log(out, 'lig', lig.length, 'pocket atoms', pocket.length, 'res', resList.length, 'hb', hb.length, 'ca', ca.length, 'segs', segs.length, 'extent', r3(ext), 'bytes', JSON.stringify(json).length);
console.log(' pocket residues:', resList.map((r) => r.res + r.num).join(' '));
