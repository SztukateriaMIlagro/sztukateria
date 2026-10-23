import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import long from './generated/long.json';
import sfx from './generated/sfx.json';
import { Background } from './Background';
import { Art, Moon } from './Art';
import { C, CX, SANS, SERIF, STAGE, goldText, ramp, smallCaps } from './theme';
import { GridItem, Option, V, Visual, continues } from './Visuals';

export const LW = 1920;
export const LH = 1080;

type Word = { text: string; start: number; end: number };
type Seg = { start: number; len: number; hold: number; part: number; a0: number; chapter: number; v: V; words: Word[] };
type Chapter = { index: number; title: string; start: number };
type LongTiming = { duration: number; mode: 'normal' | 'sleep'; title: string; thumbnail: Record<string, any>; segments: Seg[]; chapters: Chapter[] };

const data = long as unknown as Record<string, LongTiming>;
const sounds = new Set<string>(sfx as string[]);

// The vertical (1080×1920) visuals are reused inside the landscape frame: the stage is scaled and centred here.
const SCALE = 0.95;
const STAGE_CX = 960;
const STAGE_CY = 478;
const stageTransform = `translate(${STAGE_CX - CX * SCALE}px, ${STAGE_CY - (STAGE.top + STAGE.height / 2) * SCALE}px) scale(${SCALE})`;
const CAPTION_TOP = 942;

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

// Captions for landscape: up to 4 words / 24 characters at a time, current word in gold.
const Captions: React.FC<{ segs: Seg[]; t: number }> = ({ segs, t }) => {
  const chunks: Word[][] = [];
  for (const s of segs) {
    let cur: Word[] = [];
    for (const w of s.words) {
      cur.push(w);
      if (cur.length === 4 || cur.reduce((n, x) => n + x.text.length + 1, 0) > 24 || /[.,?!:;…]$/.test(w.text)) {
        chunks.push(cur);
        cur = [];
      }
    }
    if (cur.length) chunks.push(cur);
  }
  const idx = chunks.findIndex((c, i) => t >= c[0].start - 0.05 && t < Math.min(chunks[i + 1]?.[0].start ?? 1e9, c[c.length - 1].end + 0.6) - 0.05);
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const pop = Math.min(1, Math.max(0, (t - chunk[0].start) / 0.12));
  return (
    <div style={{ position: 'absolute', top: CAPTION_TOP, left: 260, width: 1400, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0 18px', transform: `scale(${0.94 + 0.06 * pop})` }}>
      {chunk.map((w, i) => {
        const active = t >= w.start - 0.03 && t < w.end + 0.08;
        return (
          <span
            key={i}
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 58,
              lineHeight: 1.15,
              color: active ? C.gold : C.cream,
              WebkitTextStroke: '8px rgba(8,8,24,0.92)',
              paintOrder: 'stroke fill',
              textShadow: '0 5px 20px rgba(0,0,0,0.55)',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// Faint rotating rings behind the stage.
const Rings: React.FC<{ opacity: number; speed: number }> = ({ opacity, speed }) => {
  const frame = useCurrentFrame();
  const r = 360;
  return (
    <svg width={LW} height={LH} style={{ position: 'absolute', inset: 0, opacity }}>
      <g transform={`translate(${STAGE_CX} ${STAGE_CY}) rotate(${frame * 0.06 * speed})`}>
        <circle r={r} fill="none" stroke={C.gold} strokeWidth="2" />
        <circle r={r - 22} fill="none" stroke={C.gold} strokeWidth="1" />
        {new Array(72).fill(0).map((_, i) => (
          <line key={i} x1={0} y1={-r} x2={0} y2={-r + (i % 6 === 0 ? 22 : 10)} stroke={C.gold} strokeWidth={i % 6 === 0 ? 2 : 1} transform={`rotate(${i * 5})`} />
        ))}
      </g>
      <g transform={`translate(${STAGE_CX} ${STAGE_CY}) rotate(${-frame * 0.04 * speed})`}>
        <ellipse rx={r - 50} ry={(r - 50) * 0.35} fill="none" stroke={C.gold} strokeWidth="1" />
        <ellipse rx={(r - 50) * 0.35} ry={r - 50} fill="none" stroke={C.gold} strokeWidth="1" />
      </g>
    </svg>
  );
};

// Thin engraved frame with corner stars, so the wide frame never looks empty.
const Frame: React.FC<{ opacity: number }> = ({ opacity }) => {
  const m = 34;
  const corner = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="5" fill={C.gold} />
      <circle r="12" fill="none" stroke={C.gold} strokeWidth="1" />
    </g>
  );
  return (
    <svg width={LW} height={LH} style={{ position: 'absolute', inset: 0, opacity }}>
      <rect x={m} y={m} width={LW - 2 * m} height={LH - 2 * m} fill="none" stroke={C.gold} strokeWidth="1.5" />
      <rect x={m + 8} y={m + 8} width={LW - 2 * m - 16} height={LH - 2 * m - 16} fill="none" stroke={C.gold} strokeWidth="0.75" />
      {corner(m, m)}
      {corner(LW - m, m)}
      {corner(m, LH - m)}
      {corner(LW - m, LH - m)}
    </svg>
  );
};

// End screen: leaves the middle free for YouTube's end-screen video tiles.
const EndScreen: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: ramp(frame, 0, 15) }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, ...goldText }}>Thank you for watching</div>
      <div style={{ ...smallCaps, fontSize: 30, marginTop: 18 }}>More stories on Signs &amp; Meanings</div>
    </div>
    <div style={{ position: 'absolute', left: STAGE_CX - 150, top: 640, opacity: ramp(frame, 8, 20) }}>
      <Moon phase="full" size={300} />
    </div>
    <div style={{ position: 'absolute', bottom: 90, width: '100%', textAlign: 'center', ...smallCaps, fontSize: 24, opacity: 0.7 * ramp(frame, 20, 20) }}>thesignsandmeanings.com</div>
  </AbsoluteFill>
);

const FadeOut: React.FC<{ len: number; fade: number; children: React.ReactNode }> = ({ len, fade, children }) => {
  const frame = useCurrentFrame();
  const o = fade ? interpolate(frame, [len - fade, len], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Long: React.FC<{ id: string }> = ({ id }) => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const L = data[id];
  const sleep = L.mode === 'sleep';
  const t = frame / fps;
  const f = (sec: number) => Math.round(sec * fps);
  const XFADE = sleep ? 45 : 8;

  type Shot = { v: V; from: number; to: number; prev: V | null; options: Option[]; grid: GridItem[] };
  const shots: Shot[] = [];
  let options: Option[] = [];
  let grid: GridItem[] = [];
  L.segments.forEach((s, i) => {
    const v = s.v;
    if (v.type === 'pick') options = v.options;
    if (v.type === 'grid' && v.items) grid = v.items;
    const from = i === 0 ? 0 : f(s.start);
    const to = i + 1 < L.segments.length ? f(L.segments[i + 1].start) : durationInFrames;
    const last = shots[shots.length - 1];
    if (last && JSON.stringify(last.v) === JSON.stringify(v)) {
      last.to = to;
      return;
    }
    shots.push({ v, from, to, prev: last?.v ?? null, options, grid });
  });

  const chapter = [...L.chapters].reverse().find((c) => t >= c.start) ?? L.chapters[0];
  const speechEnd = L.segments[L.segments.length - 1].start + L.segments[L.segments.length - 1].len;
  // Sleep: after the last words, everything slowly dims to a dark, quiet sky.
  const dim = sleep ? interpolate(t, [speechEnd + 5, speechEnd + 45], [0, 0.88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  const musicFade = sleep ? interpolate(frame, [durationInFrames - f(25), durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const onOutro = shots.find((s) => frame >= s.from && frame < s.to)?.v.type === 'outro';

  return (
    <AbsoluteFill style={{ backgroundColor: C.night, fontVariantNumeric: 'lining-nums' }}>
      <Background seed={id} w={LW} h={LH} speed={sleep ? 0.35 : 1} />
      <Rings opacity={sleep ? 0.07 : 0.13} speed={sleep ? 0.5 : 1} />
      <Frame opacity={sleep ? 0.12 : 0.22} />
      <AbsoluteFill style={{ opacity: 1 - dim }}>
        {shots.map((s, i) => {
          const next = shots[i + 1];
          const overlap = next && !continues(s.v, next.v) ? XFADE : 0;
          const len = s.to - s.from + overlap;
          return (
            <Sequence key={i} from={s.from} durationInFrames={Math.max(1, len)} layout="none">
              <FadeOut len={len} fade={overlap}>
                {s.v.type === 'outro' ? (
                  <EndScreen frame={frame - s.from} />
                ) : (
                  <AbsoluteFill>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: stageTransform }}>
                      <Visual v={s.v} frame={frame - s.from + (i === 0 ? 14 : 0)} dur={len} fps={fps} prev={s.prev} options={s.options} grid={s.grid} />
                    </div>
                  </AbsoluteFill>
                )}
              </FadeOut>
              {!sleep && sounds.has('whoosh') && s.v.type === 'chapter' ? <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.2} /> : null}
              {!sleep && sounds.has('chime') && s.v.type === 'cta' ? <Audio src={staticFile('sfx/chime.mp3')} volume={0.25} /> : null}
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {!sleep ? <Captions segs={L.segments} t={t} /> : null}
      {!onOutro ? (
        <>
          <div style={{ position: 'absolute', top: 64, left: 84, ...smallCaps, fontSize: 22, letterSpacing: '0.3em', opacity: (sleep ? 0.35 : 0.65) * (1 - dim) }}>{chapter.title}</div>
          <div style={{ position: 'absolute', top: 58, right: 84, fontFamily: SERIF, fontWeight: 600, fontSize: 30, letterSpacing: '0.12em', color: C.gold, opacity: (sleep ? 0.4 : 0.75) * (1 - dim) }}>Signs &amp; Meanings</div>
        </>
      ) : null}
      {!sleep ? <Progress t={t} total={durationInFrames / fps} chapters={L.chapters} /> : null}
      {L.segments.map((s, i) => (
        <Sequence key={`a${i}`} from={f(s.start)} durationInFrames={Math.max(1, f(s.len))} layout="none">
          <Audio src={staticFile(`audio/long/${id}.p${s.part}.mp3`)} trimBefore={f(s.a0)} />
        </Sequence>
      ))}
      {sounds.has('bed') ? <Audio src={staticFile('sfx/bed.mp3')} volume={(sleep ? 0.2 : 0.07) * musicFade} loop /> : null}
    </AbsoluteFill>
  );
};

const Progress: React.FC<{ t: number; total: number; chapters: Chapter[] }> = ({ t, total, chapters }) => (
  <div style={{ position: 'absolute', left: 84, right: 84, bottom: 44, height: 3, background: 'rgba(226,184,102,0.18)' }}>
    <div style={{ width: `${(100 * t) / total}%`, height: '100%', background: C.gold }} />
    {chapters.slice(1).map((c) => (
      <div key={c.index} style={{ position: 'absolute', left: `${(100 * c.start) / total}%`, top: -4, width: 2, height: 11, background: t >= c.start ? C.gold : 'rgba(226,184,102,0.5)' }} />
    ))}
  </div>
);

export const longDuration = (id: string, fps: number) => Math.ceil(data[id].duration * fps);
export const longIds = Object.keys(data);

// YouTube thumbnail, 1280×720: big gold text on the left, the engraving on the right.
export const Thumb: React.FC<{ id: string }> = ({ id }) => {
  useFonts();
  const th = data[id].thumbnail as { big: string; line: string; img?: string; moon?: boolean };
  const big = th.big;
  const size = Math.min(230, Math.floor(740 / (big.length * (/[A-Z]{2,}/.test(big) ? 0.62 : big.includes('·') ? 0.42 : 0.5))));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 120% at 75% 40%, ${C.night2} 0%, ${C.night} 55%, #07081a 100%)`, fontVariantNumeric: 'lining-nums' }}>
      <Background seed={`thumb-${id}`} w={1280} h={720} />
      <div style={{ position: 'absolute', right: 40, top: 40, width: 600, height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {th.moon ? (
          <div style={{ position: 'absolute', top: 10, right: 30 }}>
            <Moon phase="full" size={420} />
          </div>
        ) : null}
        {th.img ? (
          <div style={{ position: 'relative', top: th.moon ? 90 : 0 }}>
            <Art id={th.img} size={th.moon ? 420 : 580} />
          </div>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: 70, top: 0, bottom: 0, width: 720, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: size, lineHeight: 0.95, whiteSpace: 'nowrap', ...goldText, filter: 'drop-shadow(0 6px 30px rgba(0,0,0,0.7)) drop-shadow(0 0 30px rgba(226,184,102,0.45))' }}>{big}</div>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.08, color: C.cream, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>{th.line}</div>
      </div>
      <div style={{ position: 'absolute', left: 72, bottom: 40, fontFamily: SERIF, fontWeight: 600, fontSize: 30, letterSpacing: '0.12em', color: C.gold, opacity: 0.85 }}>Signs &amp; Meanings</div>
    </AbsoluteFill>
  );
};
