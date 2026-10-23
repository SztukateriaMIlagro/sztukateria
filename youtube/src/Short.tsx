import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import series from '../content/series-1.json';
import timings from './generated/timings.json';
import sfx from './generated/sfx.json';
import { Background } from './Background';
import { C, CAPTION_Y, CX, SANS, SERIF, STAGE } from './theme';
import { GridItem, Option, V, Visual, continues } from './Visuals';

type Word = { text: string; start: number; end: number };
type Seg = { start: number; end: number; words: Word[]; hold: number; audioEnd: number };
type Timing = { duration: number; segments: Seg[] };

const sounds = new Set<string>(sfx as string[]);
const XFADE = 7; // frames of cross-fade between unrelated shots

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('700 100px "Cormorant Garamond"'),
      document.fonts.load('600 100px "Cormorant Garamond"'),
      document.fonts.load('800 60px Inter'),
      document.fonts.load('600 60px Inter'),
      document.fonts.load('300 60px Inter'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};

// Captions: 1–3 words at a time, current word in gold.
const Captions: React.FC<{ segs: Seg[]; t: number }> = ({ segs, t }) => {
  const chunks: Word[][] = [];
  for (const s of segs) {
    let cur: Word[] = [];
    for (const w of s.words) {
      cur.push(w);
      if (cur.length === 3 || cur.reduce((n, x) => n + x.text.length + 1, 0) > 17 || /[.,?!:;…]$/.test(w.text)) {
        chunks.push(cur);
        cur = [];
      }
    }
    if (cur.length) chunks.push(cur);
  }
  const idx = chunks.findIndex((c, i) => t >= c[0].start - 0.05 && t < (chunks[i + 1]?.[0].start ?? c[c.length - 1].end + 0.4) - 0.05);
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const age = t - chunk[0].start;
  const pop = Math.min(1, Math.max(0, age / 0.12));
  return (
    <div style={{ position: 'absolute', top: CAPTION_Y, left: 70, width: 860, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 22px', transform: `scale(${0.9 + 0.1 * pop})` }}>
      {chunk.map((w, i) => {
        const active = t >= w.start - 0.03 && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 86,
              lineHeight: 1.12,
              color: active ? C.gold : C.cream,
              WebkitTextStroke: '10px rgba(8,8,24,0.92)',
              paintOrder: 'stroke fill',
              textShadow: '0 6px 24px rgba(0,0,0,0.55)',
              transform: active ? 'translateY(-4px)' : undefined,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const Short: React.FC<{ id: string }> = ({ id }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const short = (series as any).shorts.find((s: any) => s.id === id);
  const timing = (timings as Record<string, Timing>)[id];
  const t = frame / fps;
  const f = (sec: number) => Math.round(sec * fps);

  // Group consecutive segments that share one visual into shots.
  type Shot = { v: V; from: number; to: number; prev: V | null; options: Option[]; grid: GridItem[]; holdStart?: number; holdEnd?: number };
  const shots: Shot[] = [];
  let options: Option[] = [];
  let grid: GridItem[] = [];
  short.segments.forEach((seg: any, i: number) => {
    const s = timing.segments[i];
    const v: V = seg.v;
    if (v.type === 'pick') options = v.options;
    if (v.type === 'grid' && v.items) grid = v.items;
    const from = f(s.start);
    const to = i + 1 < timing.segments.length ? f(timing.segments[i + 1].start) : durationInFrames;
    const last = shots[shots.length - 1];
    if (last && JSON.stringify(last.v) === JSON.stringify(v)) {
      last.to = to;
      return;
    }
    const shot: Shot = { v, from, to, prev: last?.v ?? null, options, grid };
    if (s.hold) {
      shot.holdStart = f(s.end + 0.15) - from;
      shot.holdEnd = f(s.end + s.hold) - from;
    }
    shots.push(shot);
  });

  // Narration, split around the silent pauses of "pick" videos.
  const parts: { from: number; trim: number; len: number }[] = [];
  let cursor = 0;
  let shift = 0;
  timing.segments.forEach((s) => {
    if (s.hold) {
      const cut = s.audioEnd + 0.15;
      parts.push({ from: f(cursor + shift), trim: f(cursor), len: f(cut - cursor) });
      cursor = cut;
      shift += s.hold;
    }
  });
  parts.push({ from: f(cursor + shift), trim: f(cursor), len: durationInFrames });

  // Loop: the last shot fades out, then the opening shot fades in, so the replay starts seamlessly.
  const loopOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const loopIn = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.night, fontVariantNumeric: 'lining-nums' }}>
      <Background seed={id} />
      <Astrolabe />
      <AbsoluteFill style={{ opacity: 1 - loopOut }}>
      {shots.map((s, i) => {
        const next = shots[i + 1];
        const overlap = next && !continues(s.v, next.v) ? XFADE : 0;
        const len = s.to - s.from + overlap;
        return (
          <Sequence key={i} from={s.from} durationInFrames={Math.max(1, len)} layout="none">
            <FadeOut len={len} fade={overlap}>
              <Visual v={s.v} frame={frame - s.from + (i === 0 ? 14 : 0)} dur={len} fps={fps} prev={s.prev} options={s.options} grid={s.grid} holdStart={s.holdStart} holdEnd={s.holdEnd} />
            </FadeOut>
            {sounds.has('whoosh') && !continues(s.prev, s.v) && i > 0 ? <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.22} /> : null}
            {sounds.has('chime') && (s.v.type === 'reveal' || s.v.type === 'cta') ? <Audio src={staticFile('sfx/chime.mp3')} volume={0.28} /> : null}
          </Sequence>
        );
      })}
      </AbsoluteFill>
      {/* Loop: the last frames dissolve into the opening shot. */}
      {loopIn > 0 ? (
        <AbsoluteFill style={{ opacity: loopIn }}>
          <Background seed={id} />
          <Visual v={shots[0].v} frame={30} dur={shots[0].to} fps={fps} prev={null} options={shots[0].options} grid={shots[0].grid} />
        </AbsoluteFill>
      ) : null}
      <Captions segs={timing.segments} t={t} />
      <div style={{ position: 'absolute', top: 168, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 600, fontSize: 34, letterSpacing: '0.12em', color: C.gold, opacity: 0.75 }}>Signs &amp; Meanings</div>
      {parts.map((p, i) => (
        <Sequence key={`a${i}`} from={p.from} durationInFrames={p.len} layout="none">
          <Audio src={staticFile(`audio/${id}.mp3`)} trimBefore={p.trim} />
        </Sequence>
      ))}
      {sounds.has('bed') ? <Audio src={staticFile('sfx/bed.mp3')} volume={0.1} loop /> : null}
    </AbsoluteFill>
  );
};

// Faint rotating rings behind the stage: constant, calm motion.
const Astrolabe: React.FC = () => {
  const frame = useCurrentFrame();
  const r = 430;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
      <g transform={`translate(${CX} ${STAGE.top + STAGE.height / 2}) rotate(${frame * 0.08})`}>
        <circle r={r} fill="none" stroke={C.gold} strokeWidth="2" />
        <circle r={r - 26} fill="none" stroke={C.gold} strokeWidth="1" />
        {new Array(72).fill(0).map((_, i) => (
          <line key={i} x1={0} y1={-r} x2={0} y2={-r + (i % 6 === 0 ? 26 : 12)} stroke={C.gold} strokeWidth={i % 6 === 0 ? 2 : 1} transform={`rotate(${i * 5})`} />
        ))}
      </g>
      <g transform={`translate(${CX} ${STAGE.top + STAGE.height / 2}) rotate(${-frame * 0.05})`}>
        <ellipse rx={r - 60} ry={(r - 60) * 0.35} fill="none" stroke={C.gold} strokeWidth="1" />
        <ellipse rx={(r - 60) * 0.35} ry={r - 60} fill="none" stroke={C.gold} strokeWidth="1" />
      </g>
    </svg>
  );
};

const FadeOut: React.FC<{ len: number; fade: number; children: React.ReactNode }> = ({ len, fade, children }) => {
  const frame = useCurrentFrame();
  const o = fade ? interpolate(frame, [len - fade, len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const shortDuration = (id: string, fps: number) => Math.ceil((timings as Record<string, Timing>)[id].duration * fps);
