// Prints the TTS prompt for each chapter of a long-form script, with pronunciation fixes that keep the word count.
import fs from 'node:fs';
const file = process.argv[2];
const L = JSON.parse(fs.readFileSync(file, 'utf8'));
const say = { 'sì,': '"suh",', 'sǐ.': '"suh".', 'bā.': '"bah".', 'fā,': '"fah",', 'liù,': '"lyoh",' };
const tag = L.voiceTag ?? '[curious]';
L.chapters.forEach((c, i) => {
  const words = c.segments.map((s) => s.text).join(' ').split(/\s+/).map((w) => say[w] ?? w);
  const last = i === L.chapters.length - 1 && !L.voiceTag;
  console.log(`=== ${i} ${c.title} (${words.join(' ').length} chars)`);
  console.log(`${tag} ${last ? '[warmly] ' : ''}${words.join(' ')}`);
});
