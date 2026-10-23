"""Builds the timeline of each long-form video from its script and the narration parts.

Narration for a long video is generated in a few parts (content/long/<id>.json "parts" = chapter ranges).
For every part we have public/audio/long/<id>.pN.mp3 and the Scribe word timings in content/words/long/<id>.pN.json.

Each script segment gets an audio window [a0, a1) inside its part (cut halfway between sentences), and is placed
on the timeline one after another, with its "hold" (seconds of silence) added after it. Script words are aligned to
the spoken words with difflib, so a few mismatches (numbers read aloud, pronunciation fixes) don't shift the rest.

Output: src/generated/long.json  {id: {duration, mode, segments: [{start, len, hold, part, a0, chapter, words}], chapters: [{title, start}]}}
Usage: python3 scripts/build-long.py
"""
import difflib
import glob
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHAPTER_GAP = 0.6  # extra seconds before each new chapter (normal videos)


def norm(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def align(script, spoken):
    """For each script token, the (start, end) of the matching spoken word, interpolated where unmatched."""
    sm = difflib.SequenceMatcher(None, [norm(t) for t in script], [norm(w['text']) for w in spoken], autojunk=False)
    times = [None] * len(script)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                w = spoken[j1 + k]
                times[i1 + k] = (w['start'], w['end'])
        elif tag == 'replace' and j2 > j1:
            # spread the script tokens over the replaced spoken span
            s, e = spoken[j1]['start'], spoken[j2 - 1]['end']
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
    # fill gaps (script words with no spoken counterpart) from neighbours
    for i in range(len(times)):
        if times[i] is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), prev)
            times[i] = (prev, max(prev, nxt))
    return times


out = {}
for f in sorted(glob.glob(os.path.join(ROOT, 'content/long/*.json'))):
    L = json.load(open(f))
    vid = L['id']
    mode = L.get('mode', 'normal')
    segs, chapters = [], []
    t = 0.0
    ok = True
    for p, (c0, c1) in enumerate(L['parts'], start=1):
        audio = os.path.join(ROOT, f'public/audio/long/{vid}.p{p}.mp3')
        words = os.path.join(ROOT, f'content/words/long/{vid}.p{p}.json')
        if not (os.path.exists(audio) and os.path.exists(words)):
            print(f'WARN {vid}: part {p} missing')
            ok = False
            break
        spoken = [w for w in json.load(open(words))['words'] if w.get('type', 'word') == 'word' and not re.match(r'^\[.*\]$', w['text'])]
        plen = duration(audio)
        chs = L['chapters'][c0:c1]
        flat = [(ci, s) for ci, c in enumerate(chs, start=c0) for s in c['segments']]
        tokens = [tok for _, s in flat for tok in s['text'].split()]
        times = align(tokens, spoken)
        ratio = difflib.SequenceMatcher(None, [norm(x) for x in tokens], [norm(w['text']) for w in spoken], autojunk=False).ratio()
        if ratio < 0.97:
            print(f'WARN {vid} part {p}: script/audio match {ratio:.2f} ({len(tokens)} vs {len(spoken)} words)')
        # per-segment word timings
        k = 0
        local = []
        for ci, s in flat:
            n = len(s['text'].split())
            ws = [{'text': tok, 's': times[k + j][0], 'e': times[k + j][1]} for j, tok in enumerate(s['text'].split())]
            local.append((ci, s, ws))
            k += n
        for idx, (ci, s, ws) in enumerate(local):
            first = ws[0]['s']
            if idx == 0:
                a0 = 0.0
            else:
                prev_end = local[idx - 1][2][-1]['e']
                a0 = (prev_end + first) / 2
            if idx + 1 < len(local):
                nxt_first = local[idx + 1][2][0]['s']
                a1 = (ws[-1]['e'] + nxt_first) / 2
            else:
                a1 = plen
            new_chapter = not chapters or chapters[-1]['index'] != ci
            if new_chapter:
                if chapters and mode == 'normal':
                    t += CHAPTER_GAP
                chapters.append({'index': ci, 'title': L['chapters'][ci]['title'], 'start': round(t, 3)})
            hold = s.get('hold', 0)
            seg_len = max(0.4, a1 - a0)
            segs.append({
                'start': round(t, 3),
                'len': round(seg_len, 3),
                'hold': hold,
                'part': p,
                'a0': round(a0, 3),
                'chapter': ci,
                'v': s['v'],
                'words': [{'text': w['text'], 'start': round(t + w['s'] - a0, 3), 'end': round(t + w['e'] - a0, 3)} for w in ws],
            })
            t += seg_len + hold
    if not ok:
        continue
    out[vid] = {'duration': round(t + 0.5, 3), 'mode': mode, 'title': L['title'], 'thumbnail': L.get('thumbnail', {}), 'segments': segs, 'chapters': chapters}
    print(f'{vid}: {t / 60:.1f} min, {len(segs)} segments, {len(chapters)} chapters')

os.makedirs(os.path.join(ROOT, 'src/generated'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'src/generated/long.json'), 'w'))
