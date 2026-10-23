// Downloads the Higgsfield images listed in content/higgsfield-images.json into public/img/.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const { images } = JSON.parse(fs.readFileSync(path.join(root, 'content/higgsfield-images.json'), 'utf8'));
fs.mkdirSync(path.join(root, 'public/img'), { recursive: true });
for (const [id, url] of Object.entries(images)) {
  const file = path.join(root, 'public/img', `${id}.png`);
  if (fs.existsSync(file)) continue;
  const res = await fetch(url);
  if (!res.ok) {
    console.log('FAIL', id, res.status);
    continue;
  }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('ok', id);
}
