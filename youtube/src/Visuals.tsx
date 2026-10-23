import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { Art, Clock, Moon, hasArt, toHands } from './Art';
import { C, CX, SERIF, SANS, STAGE, ease, goldText, ramp, smallCaps } from './theme';

export type V = Record<string, any> & { type: string };
export type Option = { img?: string; moon?: string; big?: string; label?: string };
export type GridItem = { a: string; b: string; img?: string };

export type VisualProps = {
  v: V;
  frame: number; // frame inside this shot
  dur: number; // shot length in frames
  fps: number;
  prev: V | null; // previous shot's visual (for continuity)
  options: Option[]; // options from the latest "pick"
  grid: GridItem[]; // items from the latest "grid"
  holdStart?: number; // pick: frame where the silent pause starts
  holdEnd?: number;
};

const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: 'absolute',
      left: STAGE.left,
      top: STAGE.top,
      width: 1080 - STAGE.left - STAGE.right,
      height: STAGE.height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 34,
      ...style,
    }}
  >
    {children}
  </div>
);

// Shared entrance: fade, slight scale, de-blur. Skipped when the shot continues the previous one.
const enter = (frame: number, skip: boolean): React.CSSProperties => {
  if (skip) return {};
  const p = ramp(frame, 0, 10);
  return { opacity: p, transform: `scale(${0.93 + 0.07 * p})`, filter: `blur(${(1 - p) * 10}px)` };
};

// Slow camera drift so nothing ever sits still.
const drift = (frame: number, dur: number, move: string | undefined) => {
  const p = interpolate(frame, [0, Math.max(dur, 1)], [0, 1], { extrapolateRight: 'clamp' });
  switch (move) {
    case 'out':
      return `scale(${1.12 - 0.12 * p})`;
    case 'left':
      return `translateX(${40 - 80 * p}px) scale(1.05)`;
    case 'right':
      return `translateX(${-40 + 80 * p}px) scale(1.05)`;
    default:
      return `scale(${1 + 0.07 * p})`;
  }
};

const Sub: React.FC<{ text?: string; frame: number; delay?: number; size?: number }> = ({ text, frame, delay = 8, size = 34 }) =>
  text ? (
    <div style={{ ...smallCaps, fontSize: size, opacity: ramp(frame, delay, 10), textAlign: 'center' }}>{text}</div>
  ) : null;

// Font size that fits the stage width: capitals are wider than digits and lower case.
const fit = (s: string, max: number, width = 820) => {
  const longest = s.split(' ').reduce((m, w) => Math.max(m, w.length), 0) || s.length;
  const k = /[A-Z]{2,}/.test(s) ? 0.72 : s.includes('·') ? 0.47 : 0.56;
  const line = s.includes('·') || s.length <= 12 ? s.length : longest;
  return Math.min(max, Math.floor(width / (line * k)));
};
const bigSize = (s: string) => fit(s, 560);

const Title: React.FC<VisualProps> = ({ v, frame, dur }) => (
  <Stage>
    <div style={{ transform: drift(frame, dur, v.move), ...enter(frame, false), textAlign: 'center' }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: bigSize(v.big), lineHeight: 0.95, letterSpacing: v.big.length > 6 ? '0.04em' : 0, whiteSpace: v.big.includes('·') ? 'nowrap' : undefined, ...goldText }}>{v.big}</div>
    </div>
    <Sub text={v.sub} frame={frame} />
  </Stage>
);

const Seq: React.FC<VisualProps> = ({ v, frame, fps }) => {
  const items: string[] = v.items;
  const strike: number[] = v.strike ?? [];
  const short = items.every((s) => s.length <= 3);
  const step = v.stagger ? Math.round(fps * 0.32) : 3;
  const strikeAt = Math.round(fps * 0.6);
  return (
    <Stage>
      <div style={{ display: 'flex', flexDirection: short ? 'row' : 'column', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: short ? 30 : 10, maxWidth: short && items.length <= 6 ? 720 : 860 }}>
        {items.map((it, i) => {
          const p = ramp(frame, i * step, 9);
          const s = strike.includes(i) ? ramp(frame, strikeAt + i * 2, 10) : 0;
          return (
            <div key={i} style={{ position: 'relative', opacity: p * (1 - 0.65 * s), transform: `translateY(${(1 - p) * 30}px)` }}>
              {short ? (
                <div style={{ width: items.length > 6 ? 150 : 210, height: items.length > 6 ? 150 : 210, borderRadius: 999, border: `4px solid ${s > 0 ? '#d77a6a' : C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: items.length > 6 ? 80 : 110, color: C.goldSoft, background: 'rgba(226,184,102,0.07)' }}>{it}</div>
              ) : (
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: items.length > 5 ? 96 : 130, lineHeight: 1.05, ...goldText }}>{it}</div>
              )}
              {s > 0 ? <div style={{ position: 'absolute', left: -8, top: '50%', height: 6, width: `calc(${s * 100}% + 16px)`, background: '#d77a6a', transform: 'rotate(-18deg)', borderRadius: 3 }} /> : null}
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const Side: React.FC<{ s: { big?: string; img?: string; sub?: string }; frame: number; from: number }> = ({ s, frame, from }) => {
  const p = ramp(frame, 2, 12);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: 410, opacity: p, transform: `translateX(${(1 - p) * from}px)` }}>
      {s.img ? <Art id={s.img} size={400} draw={ramp(frame, 0, 24)} /> : null}
      {s.big ? <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: fit(s.big, 300, 380), lineHeight: 1, ...goldText }}>{s.big}</div> : null}
      {s.sub ? <div style={{ ...smallCaps, fontSize: 34, textAlign: 'center' }}>{s.sub}</div> : null}
    </div>
  );
};

const Compare: React.FC<VisualProps> = ({ v, frame }) => (
  <Stage>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Side s={v.a} frame={frame} from={-90} />
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: v.op === 'vs' ? 70 : 110, color: C.gold, opacity: ramp(frame, 10, 10), fontStyle: v.op === 'vs' ? 'italic' : 'normal' }}>{v.op}</div>
      <Side s={v.b} frame={Math.max(0, frame - 6)} from={90} />
    </div>
  </Stage>
);

const ClockV: React.FC<VisualProps> = ({ v, frame, dur, prev }) => {
  const to = toHands(v.time);
  const cont = prev?.type === 'clock';
  const from = cont ? toHands(prev!.time) : { hour: to.hour - 60, minute: to.minute - 360 };
  const p = ramp(frame, cont ? 0 : 4, 22);
  const hour = from.hour + (to.hour - from.hour) * p;
  const minute = from.minute + (to.minute - from.minute) * p;
  return (
    <Stage>
      <div style={{ transform: drift(frame, dur, v.move), ...enter(frame, cont) }}>
        <Clock hour={hour} minute={minute} size={780} draw={cont ? 1 : ramp(frame, 0, 18)} />
      </div>
      <Sub text={v.label} frame={frame} />
    </Stage>
  );
};

const Digital: React.FC<VisualProps> = ({ v, frame, dur, fps }) => {
  const blink = Math.floor(frame / (fps / 2)) % 2 === 0;
  const [a, b] = v.time.split(':');
  return (
    <Stage>
      <div style={{ transform: drift(frame, dur, v.move), ...enter(frame, false) }}>
        <div style={{ width: 800, height: 330, borderRadius: 40, border: `4px solid ${C.gold}`, background: 'linear-gradient(180deg, #11122e, #0a0b22)', boxShadow: `0 0 60px rgba(226,184,102,0.25), inset 0 0 50px rgba(226,184,102,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: SANS, fontWeight: 300, fontSize: 210, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', color: C.goldSoft, textShadow: `0 0 30px ${C.gold}` }}>
            {a}
            <span style={{ opacity: blink ? 1 : 0.25 }}>:</span>
            {b}
          </div>
        </div>
      </div>
      <Sub text={v.label} frame={frame} />
    </Stage>
  );
};

const DateV: React.FC<VisualProps> = ({ v, frame, dur }) => {
  const p = ramp(frame, 0, 18);
  return (
    <Stage>
      <div style={{ transform: drift(frame, dur, v.move), clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`, textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: fit(v.big, 210, 780), letterSpacing: '0.05em', whiteSpace: 'nowrap', ...goldText }}>{v.big}</div>
      </div>
      <div style={{ width: 520 * p, height: 2, background: C.gold, opacity: 0.7 }} />
      <Sub text={v.sub} frame={frame} delay={12} size={40} />
    </Stage>
  );
};

const ImageV: React.FC<VisualProps> = ({ v, frame, dur, prev }) => {
  const cont = prev?.type === 'image' && prev.img === v.img;
  return (
    <Stage>
      <div style={{ position: 'relative', transform: drift(frame, dur, v.move), ...enter(frame, cont) }}>
        <Art id={v.img} size={780} draw={cont ? 1 : ramp(frame, 0, 26)} />
        {v.overlay ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: v.overlayInk === 'dark' ? 120 : v.overlay.length > 4 ? 150 : 220, opacity: ramp(frame, 14, 10), ...(v.overlayInk === 'dark' ? { color: C.night, textShadow: '0 0 18px rgba(255,255,255,0.4)' } : goldText) }}>{v.overlay}</div>
        ) : null}
      </div>
      <Sub text={v.label} frame={frame} delay={cont ? 0 : 12} />
    </Stage>
  );
};

const Sum: React.FC<VisualProps> = ({ v, frame, dur }) => {
  const digits: string[] = v.digits;
  const totalAt = Math.round(dur * 0.55);
  const step = Math.max(4, Math.round((totalAt - 6) / digits.length));
  const t = ramp(frame, totalAt, 10);
  return (
    <Stage>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {digits.map((d, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 110, color: C.gold, opacity: ramp(frame, i * step, 6) }}>+</span> : null}
            <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: digits.length > 3 ? 190 : 230, opacity: ramp(frame, i * step, 8) * (1 - 0.45 * t), ...goldText }}>{d}</span>
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, opacity: t, transform: `scale(${0.8 + 0.2 * t})` }}>
        <span style={{ fontFamily: SANS, fontWeight: 300, fontSize: 150, color: C.gold }}>=</span>
        <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: v.total.length > 3 ? 190 : 340, lineHeight: 1, ...goldText }}>{v.total}</span>
      </div>
    </Stage>
  );
};

const OptionArt: React.FC<{ o: Option; size: number; draw?: number }> = ({ o, size, draw = 1 }) => {
  if (o.moon) return <Moon phase={o.moon} size={size * 0.85} draw={draw} />;
  if (o.img) return <Art id={o.img} size={size} draw={draw} />;
  return (
    <div style={{ width: size, height: size * 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 300, fontSize: size * 0.3, color: C.goldSoft, textShadow: `0 0 24px ${C.gold}`, opacity: draw }}>
      {o.big}
    </div>
  );
};

const optionName = (o: Option, i: number) => o.label ?? (o.img ? o.big : undefined) ?? String(i + 1);

const Pick: React.FC<VisualProps> = ({ v, frame, fps, holdStart = 1e9, holdEnd = 1e9 }) => {
  const options: Option[] = v.options;
  const inHold = frame >= holdStart && frame < holdEnd;
  const left = Math.ceil((holdEnd - frame) / fps);
  const pulse = 0.6 + 0.4 * Math.abs(Math.sin((frame / fps) * Math.PI * 1.5));
  return (
    <Stage style={{ gap: 50 }}>
      <div style={{ ...smallCaps, fontSize: 46, letterSpacing: '0.32em', opacity: ramp(frame, 0, 8) * (inHold ? pulse : 1) }}>{inHold ? 'Pause now' : 'Pick one'}</div>
      <div style={{ display: 'flex', gap: 26, justifyContent: 'center' }}>
        {options.map((o, i) => {
          const p = ramp(frame, 4 + i * 5, 12);
          return (
            <div key={i} style={{ width: 262, height: 470, borderRadius: 26, border: `2.5px solid ${C.gold}`, background: 'rgba(226,184,102,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '30px 0 26px', opacity: p, transform: `translateY(${(1 - p) * 60}px)`, boxShadow: '0 0 40px rgba(226,184,102,0.12)' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <OptionArt o={o} size={o.big && !o.img ? 250 : 230} draw={ramp(frame, 4 + i * 5, 20)} />
              </div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 78, ...goldText }}>{optionName(o, i)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {inHold ? (
          <div style={{ width: 120, height: 120, borderRadius: 60, border: `4px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 76, color: C.goldSoft }}>{left}</div>
        ) : null}
      </div>
    </Stage>
  );
};

const Reveal: React.FC<VisualProps> = ({ v, frame, prev, options }) => {
  const cont = prev?.type === 'reveal' && prev.index === v.index;
  const o = options[v.index] ?? {};
  const p = cont ? 1 : ramp(frame, 0, 12);
  const w = cont ? 1 : ramp(frame, 8, 12);
  return (
    <Stage style={{ justifyContent: 'flex-start', paddingTop: 10, gap: 26 }}>
      <div style={{ display: 'flex', gap: 30 }}>
        {options.map((x, i) => (
          <div key={i} style={{ opacity: i === v.index ? 1 : 0.28, transform: `scale(${i === v.index ? 1 : 0.85})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <OptionArt o={x} size={120} />
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: i === v.index ? C.gold : C.muted }}>{optionName(x, i)}</div>
          </div>
        ))}
      </div>
      <div style={{ opacity: p, transform: `scale(${0.9 + 0.1 * p})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <OptionArt o={o} size={o.big && !o.img ? 560 : 520} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 118, lineHeight: 1, opacity: w, textAlign: 'center', ...goldText }}>{v.word}</div>
      </div>
    </Stage>
  );
};

const Grid: React.FC<VisualProps> = ({ v, frame, prev, grid }) => {
  const items: GridItem[] = v.items ?? grid;
  const cols: number = v.cols ?? 3;
  const [a, b] = v.show as [number, number];
  const cont = prev?.type === 'grid';
  const hasImg = items.some((x) => x.img && hasArt(x.img));
  return (
    <Stage>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 270px)`, gap: 14, ...enter(frame, cont) }}>
        {items.map((it, i) => {
          const on = i >= a && i <= b;
          const done = a >= 0 && i < a;
          const appear = cont ? 1 : ramp(frame, i * 2, 8);
          const glow = on ? ramp(frame, (i - a) * 9, 8) : 0;
          const opacity = appear * (a < 0 ? 0.75 : on ? 0.35 + 0.65 * glow : done ? 0.6 : 0.22);
          return (
            <div key={i} style={{ height: hasImg ? 200 : 190, borderRadius: 20, border: `2px solid ${on ? C.gold : 'rgba(226,184,102,0.35)'}`, background: on ? `rgba(226,184,102,${0.08 + 0.1 * glow})` : 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity, transform: `scale(${1 + 0.06 * glow})`, boxShadow: on ? `0 0 ${30 * glow}px rgba(226,184,102,0.4)` : 'none' }}>
              {it.img && hasArt(it.img) ? <Art id={it.img} size={88} /> : null}
              <div style={{ ...smallCaps, fontSize: 24, color: on ? C.goldSoft : C.muted }}>{it.a}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: it.b.length > 9 ? 36 : 46, lineHeight: 1.1, color: on ? C.goldSoft : C.cream, textAlign: 'center' }}>{it.b}</div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const MoonV: React.FC<VisualProps> = ({ v, frame, dur, prev }) => {
  const cont = prev?.type === 'moon';
  return (
    <Stage>
      <div style={{ transform: drift(frame, dur, v.move), ...enter(frame, cont) }}>
        <Moon phase={v.phase} size={740} draw={cont ? 1 : ramp(frame, 0, 22)} />
      </div>
      <Sub text={v.label} frame={frame} />
    </Stage>
  );
};

const Cta: React.FC<VisualProps> = ({ v, frame, fps }) => {
  const bounce = Math.sin((frame / fps) * Math.PI * 2) * 12;
  return (
    <Stage style={{ gap: 46 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: v.text.length > 18 ? 128 : 150, lineHeight: 1.02, textAlign: 'center', maxWidth: 820, ...enter(frame, false), ...goldText }}>{v.text}</div>
      <div style={{ ...smallCaps, fontSize: 40, opacity: ramp(frame, 10, 10), display: 'flex', alignItems: 'center', gap: 18 }}>
        <span>Tell me in the comments</span>
      </div>
      <div style={{ fontSize: 110, color: C.gold, transform: `translateY(${bounce}px)`, opacity: ramp(frame, 14, 10) }}>↓</div>
    </Stage>
  );
};

// Long-form chapter card: kicker ("Number 3", "January"), big title, rule, subtitle.
const Chapter: React.FC<VisualProps> = ({ v, frame, dur }) => {
  const kicker: string = v.kicker ?? (v.n ? `Number ${v.n}` : '');
  const line = ramp(frame, 6, 16);
  return (
    <Stage style={{ gap: 30 }}>
      {kicker ? <div style={{ ...smallCaps, fontSize: 38, letterSpacing: '0.36em', opacity: ramp(frame, 0, 10) }}>{kicker}</div> : null}
      <div style={{ transform: drift(frame, dur, 'in'), ...enter(frame, false), textAlign: 'center' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: fit(v.title, 300, 860), lineHeight: 1, ...goldText }}>{v.title}</div>
      </div>
      <div style={{ width: 520 * line, height: 2, background: C.gold, opacity: 0.7 }} />
      <Sub text={v.sub} frame={frame} delay={12} size={36} />
    </Stage>
  );
};

// Sleep stories: a constellation slowly drawing itself, nothing else.
const Stars: React.FC<VisualProps> = ({ frame, fps, dur }) => {
  const pts = [
    [300, 420], [430, 330], [560, 400], [690, 300], [760, 470], [600, 560], [470, 640], [350, 600],
  ];
  const draw = ramp(frame, 0, Math.round(fps * 4));
  const p = interpolate(frame, [0, Math.max(dur, 1)], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <Stage>
      <svg width={860} height={900} viewBox="0 0 1000 1000" style={{ transform: `rotate(${p * 6 - 3}deg) scale(${1 + 0.05 * p})`, opacity: 0.9 }}>
        <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.gold} strokeWidth="2" opacity={0.45} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7 + (i % 3) * 3} fill={C.goldSoft} opacity={(0.5 + 0.5 * Math.abs(Math.sin(frame / fps + i))) * Math.min(1, draw * 2)} style={{ filter: 'drop-shadow(0 0 12px rgba(246,230,196,0.8))' }} />
        ))}
      </svg>
    </Stage>
  );
};

const MAP: Record<string, React.FC<VisualProps>> = {
  chapter: Chapter,
  stars: Stars,
  title: Title,
  seq: Seq,
  compare: Compare,
  clock: ClockV,
  digital: Digital,
  date: DateV,
  image: ImageV,
  sum: Sum,
  pick: Pick,
  reveal: Reveal,
  grid: Grid,
  moon: MoonV,
  cta: Cta,
};

export const Visual: React.FC<VisualProps> = (p) => {
  const Comp = MAP[p.v.type];
  return <AbsoluteFill>{Comp ? <Comp {...p} /> : null}</AbsoluteFill>;
};

export const continues = (prev: V | null, v: V) =>
  !!prev &&
  ((prev.type === v.type && ['grid', 'reveal', 'clock', 'moon'].includes(v.type)) || (prev.type === 'image' && v.type === 'image' && prev.img === v.img));

export { ease };
