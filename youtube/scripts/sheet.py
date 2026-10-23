# Contact sheet from out/frames/<id>/*.png → out/sheets/<id>.jpg
import glob, os, sys
from PIL import Image, ImageDraw

root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
os.makedirs(os.path.join(root, 'out', 'sheets'), exist_ok=True)
for sid in sys.argv[1:]:
    files = sorted(glob.glob(os.path.join(root, 'out', 'frames', sid, '*.png')))
    if not files:
        continue
    first = Image.open(files[0])
    w, h, cols = (216, 384, 6) if first.height > first.width else (480, 270, 4)
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (w * cols, h * rows), 'black')
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        im = Image.open(f).convert('RGB').resize((w, h))
        x, y = (i % cols) * w, (i // cols) * h
        sheet.paste(im, (x, y))
        d.text((x + 6, y + 6), os.path.basename(f)[:-4], fill=(255, 80, 80))
    sheet.save(os.path.join(root, 'out', 'sheets', f'{sid}.jpg'), quality=80)
    print(sid, len(files))
