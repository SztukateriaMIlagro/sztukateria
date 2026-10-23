"""Saves narration audio + Scribe word timings from a creative_get_flow_run_status result.

Usage: python3 scripts/save-transcripts.py <status.json> <tts_generation_id>=<name> [...]
  → public/audio/long/<name>.mp3 and content/words/long/<name>.json
The transcript is matched to its TTS take by the generation id in the transcribed audio's URL.
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
status = json.load(open(sys.argv[1]))
names = dict(a.split('=', 1) for a in sys.argv[2:])
for t in status.get('transcripts', []):
    url = t['source']['url']
    hit = [n for g, n in names.items() if g in url]
    if not hit:
        continue
    name = hit[0]
    json.dump({'words': t['words']}, open(os.path.join(ROOT, f'content/words/long/{name}.json'), 'w'))
    subprocess.run(['curl', '-sSf', '-o', os.path.join(ROOT, f'public/audio/long/{name}.mp3'), url], check=True)
    print(name, len(t['words']), 'words', t.get('spoken_duration_secs'), 's')
