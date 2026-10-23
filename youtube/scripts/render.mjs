// Usage:
//   node scripts/render.mjs stills <id...>   → out/sheets/<id>.jpg (contact sheet: a frame every ~2 s + every shot start)
//   node scripts/render.mjs video <id...|all> → out/<id>.mp4
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [mode, ...ids] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const timings = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/timings.json'), 'utf8'));
const list = ids[0] === 'all' ? Object.keys(timings) : ids;

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });

for (const id of list) {
  const composition = await selectComposition({ serveUrl, id, inputProps: { id }, browserExecutable });
  if (mode === 'video') {
    const raw = path.join(root, 'out', `${id}.raw.mp4`);
    const outputLocation = path.join(root, 'out', `${id}.mp4`);
    await renderMedia({ composition, serveUrl, codec: 'h264', crf: 20, audioBitrate: '320k', outputLocation: raw, inputProps: { id }, browserExecutable, concurrency: 4 });
    // Master to the Shorts loudness norm (-14 LUFS, -1.5 dBTP); video stream is copied untouched.
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', outputLocation]);
    fs.unlinkSync(raw);
    console.log('video', outputLocation);
    continue;
  }
  // Stills: shot starts + 0.6 s, plus a frame every 2 s.
  const fps = composition.fps;
  const frames = new Set();
  for (const s of timings[id].segments) frames.add(Math.min(composition.durationInFrames - 1, Math.round((s.start + 0.6) * fps)));
  for (let f = 0; f < composition.durationInFrames; f += 2 * fps) frames.add(f + 10);
  const sorted = [...frames].sort((a, b) => a - b).filter((f) => f < composition.durationInFrames);
  const dir = path.join(root, 'out', 'frames', id);
  fs.mkdirSync(dir, { recursive: true });
  for (const frame of sorted) {
    await renderStill({ composition, serveUrl, frame, output: path.join(dir, `${String(frame).padStart(5, '0')}.png`), inputProps: { id }, browserExecutable, scale: 0.4 });
  }
  console.log('stills', id, sorted.length);
}
