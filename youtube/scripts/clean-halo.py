"""Removes the grey/white haze GPT Image sometimes leaves around or inside transparent PNGs.

Keeps gold linework (warm, saturated pixels) and fades out low-saturation pale pixels.
Usage: python3 scripts/clean-halo.py public/img/buck.png [...]
"""
import sys
import numpy as np
from PIL import Image

for path in sys.argv[1:]:
    im = np.asarray(Image.open(path).convert('RGBA')).astype(np.float32)
    rgb, a = im[..., :3], im[..., 3]
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    # gold ink has saturation ~0.4-0.7; haze is pale grey/white with saturation < 0.18
    keep = np.clip((sat - 0.12) / 0.14, 0, 1)
    im[..., 3] = a * keep
    Image.fromarray(im.astype(np.uint8)).save(path)
    print('cleaned', path)
