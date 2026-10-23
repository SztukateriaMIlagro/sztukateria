import React, { useMemo } from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, W, H } from './theme';

// Night sky in the site's colours: a slow-drifting star field in three depth layers.
export const Background: React.FC<{ seed: string; w?: number; h?: number; speed?: number }> = ({ seed, w = W, h = H, speed = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stars = useMemo(
    () =>
      new Array(170).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`) * w,
        y: random(`${seed}y${i}`) * h,
        depth: 1 + Math.floor(random(`${seed}d${i}`) * 3),
        r: 0.8 + random(`${seed}r${i}`) * 1.9,
        phase: random(`${seed}p${i}`) * Math.PI * 2,
      })),
    [seed, w, h],
  );
  const t = frame / fps;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 80% 0%, ${C.night2} 0%, ${C.night} 55%, #07081a 100%)`,
      }}
    >
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0 }}>
        {stars.map((s, i) => {
          const y = (s.y - t * 6 * speed * s.depth + h * 1000) % h;
          const tw = 0.45 + 0.55 * Math.abs(Math.sin(t * 0.9 + s.phase));
          return <circle key={i} cx={s.x} cy={y} r={s.r * (s.depth / 2)} fill={C.cream} opacity={tw * (0.25 + s.depth * 0.18)} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: 'radial-gradient(90% 60% at 50% 45%, transparent 55%, rgba(4,4,15,0.65) 100%)' }} />
    </AbsoluteFill>
  );
};
