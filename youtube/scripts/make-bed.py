# Synthesises a calm 60 s ambient pad (seamless loop) → public/sfx/bed.wav. No samples, no licences.
import numpy as np, wave, os
sr, dur = 44100, 60.0
t = np.arange(int(sr * dur)) / sr
# D major add9 voicing, very soft; slow per-voice swells whose periods divide 60 s so the loop is seamless.
freqs = [73.42, 110.0, 146.83, 220.0, 277.18, 329.63, 440.0]
amps = [0.30, 0.22, 0.18, 0.12, 0.08, 0.07, 0.04]
periods = [60, 30, 20, 15, 12, 10, 7.5]
sig = np.zeros_like(t)
for f, a, p in zip(freqs, amps, periods):
    swell = 0.55 + 0.45 * np.sin(2 * np.pi * t / p + f)
    detune = np.sin(2 * np.pi * t / 20) * 0.15
    sig += a * swell * (np.sin(2 * np.pi * (f + detune) * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t + 1.3))
# soft "air": noise shaped by a slow envelope, low-passed with a moving average
rng = np.random.default_rng(7)
noise = np.convolve(rng.standard_normal(len(t)), np.ones(60) / 60, mode='same')
sig += 0.05 * noise * (0.6 + 0.4 * np.sin(2 * np.pi * t / 15))
sig = sig / np.max(np.abs(sig)) * 0.6
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'sfx', 'bed.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((sig * 32767).astype(np.int16).tobytes())
print(out)
