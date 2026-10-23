// Maps ElevenLabs Scribe word timings onto script segments and lists the available images.
// Output: src/generated/timings.json, src/generated/images.json
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const series = JSON.parse(fs.readFileSync(path.join(root, 'content/series-1.json'), 'utf8'));
const out = {};
const problems = [];

const tokens = (s) => s.split(/\s+/).filter(Boolean);
const isTag = (w) => /^\[.*\]$/.test(w.text);

for (const short of series.shorts) {
  const wordsFile = path.join(root, 'content/words', `${short.id}.json`);
  if (!fs.existsSync(wordsFile)) {
    problems.push(`${short.id}: no word timings yet`);
    continue;
  }
  const spoken = JSON.parse(fs.readFileSync(wordsFile, 'utf8')).words.filter((w) => w.type === 'word' && !isTag(w));
  const total = short.segments.reduce((n, s) => n + tokens(s.text).length, 0);
  if (total !== spoken.length) problems.push(`${short.id}: script has ${total} words, audio has ${spoken.length}`);

  let i = 0;
  let shift = 0; // seconds of silence inserted by holds so far
  const segments = short.segments.map((seg) => {
    const display = tokens(seg.text);
    const words = display.map((text) => {
      const w = spoken[Math.min(i, spoken.length - 1)];
      i++;
      return { text, start: w.start + shift, end: w.end + shift, audio: w.start };
    });
    const res = { start: words[0].start, end: words[words.length - 1].end, words, hold: seg.hold ?? 0, audioEnd: words[words.length - 1].end - shift };
    shift += seg.hold ?? 0;
    return res;
  });
  segments[0].start = 0;
  const duration = segments[segments.length - 1].end + 0.9;
  out[short.id] = { duration, segments };
}

const imgDir = path.join(root, 'public/img');
const images = fs.existsSync(imgDir) ? fs.readdirSync(imgDir).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, '')) : [];

fs.mkdirSync(path.join(root, 'src/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/generated/timings.json'), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(root, 'src/generated/images.json'), JSON.stringify(images));
const sfxDir = path.join(root, 'public/sfx');
const sfx = fs.existsSync(sfxDir) ? fs.readdirSync(sfxDir).filter((f) => f.endsWith('.mp3')).map((f) => f.replace(/\.mp3$/, '')) : [];
fs.writeFileSync(path.join(root, 'src/generated/sfx.json'), JSON.stringify(sfx));
console.log(`timings for ${Object.keys(out).length} shorts, ${images.length} images`);
for (const p of problems) console.log('WARN', p);
