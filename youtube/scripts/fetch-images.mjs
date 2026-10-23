// Downloads the Higgsfield images listed in content/higgsfield-images.json into public/img/.
// Uses curl because it honours the environment's HTTPS proxy (Node's fetch does not).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const { images } = JSON.parse(fs.readFileSync(path.join(root, 'content/higgsfield-images.json'), 'utf8'));
fs.mkdirSync(path.join(root, 'public/img'), { recursive: true });
for (const [id, url] of Object.entries(images)) {
  const file = path.join(root, 'public/img', `${id}.png`);
  if (fs.existsSync(file)) continue;
  try {
    execFileSync('curl', ['-sSf', '-o', file, url]);
    console.log('ok', id);
  } catch {
    console.log('FAIL', id);
  }
}
