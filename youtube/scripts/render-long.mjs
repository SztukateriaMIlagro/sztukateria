// Long-form videos (16:9).
//   node scripts/render-long.mjs stills <id...>  → out/frames/<id>/*.png (every chapter start + 1 s, and every 20 s)
//   node scripts/render-long.mjs thumbs <id...>  → out/<id>.thumb.jpg (1280×720)
//   node scripts/render-long.mjs video <id...>   → out/<id>.mp4
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const [mode, ...ids] = process.argv.slice(2);
const browserExecutable = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const long = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/long.json'), 'utf8'));
const list = ids[0] === 'all' ? Object.keys(long) : ids;
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });

for (const id of list) {
  if (mode === 'thumbs') {
    const composition = await selectComposition({ serveUrl, id: `thumb-${id}`, inputProps: { id }, browserExecutable });
    const png = path.join(root, 'out', `${id}.thumb.png`);
    await renderStill({ composition, serveUrl, frame: 0, output: png, inputProps: { id }, browserExecutable });
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, '-q:v', '2', path.join(root, 'out', `${id}.thumb.jpg`)]);
    fs.unlinkSync(png);
    console.log('thumb', id);
    continue;
  }
  const composition = await selectComposition({ serveUrl, id, inputProps: { id }, browserExecutable });
  if (mode === 'video') {
    const raw = path.join(root, 'out', `${id}.raw.mp4`);
    const outputLocation = path.join(root, 'out', `${id}.mp4`);
    const started = Date.now();
    let last = 0;
    await renderMedia({
      composition, serveUrl, codec: 'h264', crf: 21, audioBitrate: '320k', outputLocation: raw, inputProps: { id }, browserExecutable, concurrency: 4,
      onProgress: ({ progress }) => {
        if (progress - last >= 0.05) {
          last = progress;
          console.log(id, `${Math.round(progress * 100)}%`, `${Math.round((Date.now() - started) / 1000)}s`);
        }
      },
    });
    // Sleep stories stay quieter than the narrated videos.
    const target = long[id].mode === 'sleep' ? '-18' : '-14';
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, '-c:v', 'copy', '-af', `loudnorm=I=${target}:TP=-1.5:LRA=11`, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', outputLocation]);
    fs.unlinkSync(raw);
    // GitHub refuses files over 100 MB: re-encode big (mostly still) videos; at CRF 30 the difference is not visible.
    if (fs.statSync(outputLocation).size > 95e6) {
      const small = outputLocation.replace(/\.mp4$/, '.small.mp4');
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', outputLocation, '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-tune', 'stillimage', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', small]);
      fs.renameSync(small, outputLocation);
    }
    console.log('video', outputLocation);
    continue;
  }
  const fps = composition.fps;
  const frames = new Set();
  for (const c of long[id].chapters) frames.add(Math.round((c.start + 1) * fps));
  for (const s of long[id].segments) frames.add(Math.round((s.start + 1.2) * fps));
  const sorted = [...frames].sort((a, b) => a - b).filter((f) => f < composition.durationInFrames);
  const dir = path.join(root, 'out', 'frames', id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const frame of sorted) {
    await renderStill({ composition, serveUrl, frame, output: path.join(dir, `${String(frame).padStart(6, '0')}.png`), inputProps: { id }, browserExecutable, scale: 0.25 });
  }
  console.log('stills', id, sorted.length);
}
