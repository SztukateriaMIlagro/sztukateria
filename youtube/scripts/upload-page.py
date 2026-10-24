"""Builds content/upload-plan.html (the publishing calendar as a page with copy buttons) from
content/UPLOAD.md (Shorts) and content/UPLOAD-LONG.md (long videos). Times are converted to Polish time.

Usage: python3 scripts/upload-page.py
"""
import json
import os
import re
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ET = ZoneInfo('America/New_York')
PL = ZoneInfo('Europe/Warsaw')
DAYS = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'nd']


def to_pl(date, hhmm):
    h, m = map(int, hhmm.split(':'))
    y, mo, d = map(int, date.split('-'))
    return datetime(y, mo, d, h, m, tzinfo=ET).astimezone(PL)


def block(text, label):
    m = re.search(rf'\*\*{label}:\*\*\n```\n(.*?)\n```', text, re.S)
    return m.group(1) if m else ''


def field(text, label):
    m = re.search(rf'\*\*{label}:\*\* (.*)', text)
    return m.group(1).strip() if m else ''


items = []

# Shorts
md = open(os.path.join(ROOT, 'content/UPLOAD.md')).read()
day = None
when_et = None
for part in re.split(r'\n(?=## |\*[^*]|### )', md):
    if part.startswith('## Day'):
        day = re.search(r'(\d{4}-\d{2}-\d{2})', part).group(1)
    elif part.startswith('*'):
        m = re.match(r'\*(?:Publish (\d{4}-\d{2}-\d{2}), )?(\d{1,2}:\d{2}) ET', part)
        if m:
            if m.group(1):
                day = m.group(1)
            when_et = m.group(2)
    elif part.startswith('### ') and day and when_et:
        vid = part.split()[1]
        items.append({
            'kind': 'short',
            'id': vid,
            'file': f'out/{vid}.mp4',
            'length': re.search(r'· (\d+ s)', part).group(1),
            'when': to_pl(day, when_et).isoformat(),
            'et': f'{day} {when_et} ET',
            'title': field(part, 'Title'),
            'description': block(part, 'Description'),
            'pinned': field(part, 'Pinned comment'),
        })
        when_et = None
cheat = re.findall(r'^- \*\*(\d+)\*\* — (.*)$', md, re.M)

# Long videos
md = open(os.path.join(ROOT, 'content/UPLOAD-LONG.md')).read()
for part in md.split('\n## ')[1:]:
    head = part.splitlines()[0]
    vid = head.split()[0]
    m = re.search(r'(\d{4}-\d{2}-\d{2}), (\d{1,2}:\d{2}) ET', head)
    meta = re.search(r'\*\*Playlist:\*\* (.*?) · \*\*Related Short:\*\* (\S+)', part)
    items.append({
        'kind': 'long',
        'id': vid,
        'file': f'out/{vid}.mp4',
        'thumb': f'out/{vid}.thumb.jpg',
        'length': re.search(r'· (\d+:\d{2}) ·', head).group(1),
        'when': to_pl(m.group(1), m.group(2)).isoformat(),
        'et': f'{m.group(1)} {m.group(2)} ET',
        'title': field(part, 'Title'),
        'description': block(part, 'Description'),
        'tags': field(part, 'Tags'),
        'pinned': field(part, 'Pinned comment'),
        'playlist': meta.group(1) if meta else '',
        'related': meta.group(2) if meta else '',
    })

items.sort(key=lambda x: x['when'])
for it in items:
    t = datetime.fromisoformat(it['when'])
    it['day'] = t.strftime('%Y-%m-%d')
    it['dayLabel'] = f"{DAYS[t.weekday()]} {t.day}.{t.month:02d}"
    it['time'] = t.strftime('%H:%M')

data = json.dumps({'items': items, 'cheat': cheat}, ensure_ascii=False).replace('</', '<\\/')
tpl = open(os.path.join(ROOT, 'scripts/upload-page.template.html')).read()
open(os.path.join(ROOT, 'content/upload-plan.html'), 'w').write(tpl.replace('__DATA__', data))
print('content/upload-plan.html', len(items), 'videos')
