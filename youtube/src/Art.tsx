import React from 'react';
import { Img, staticFile } from 'remotion';
import images from './generated/images.json';
import { Icon, hasIcon } from './Icons';
import { C, SERIF } from './theme';

const available = new Set<string>(images as string[]);
export const hasArt = (id: string) => available.has(id) || hasIcon(id);

// An object on screen: the AI engraving if it has been downloaded, else the coded line art,
// else a constellation medallion with the object's name.
export const Art: React.FC<{ id: string; size: number; draw?: number }> = ({ id, size, draw = 1 }) => {
  if (available.has(id)) {
    return (
      <Img
        src={staticFile(`img/${id}.png`)}
        style={{ width: size, height: size, objectFit: 'contain', opacity: Math.min(1, draw * 1.5), filter: 'drop-shadow(0 0 22px rgba(226,184,102,0.28))' }}
      />
    );
  }
  if (hasIcon(id)) return <Icon id={id} draw={draw} size={size} />;
  const name = id.replace(/^z-/, '').replace(/-/g, ' ');
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{ overflow: 'visible' }}>
      <circle cx="200" cy="200" r="170" fill="none" stroke={C.gold} strokeWidth="3" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      <circle cx="200" cy="200" r="150" fill="none" stroke={C.gold} strokeWidth="1.5" opacity={0.5 * draw} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <circle key={i} cx={200 + 150 * Math.cos((i * Math.PI) / 4)} cy={200 + 150 * Math.sin((i * Math.PI) / 4)} r="4" fill={C.gold} opacity={draw} />
      ))}
      <text x="200" y="215" textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={name.length > 7 ? 54 : 70} fill={C.goldSoft} opacity={draw} style={{ textTransform: 'capitalize' }}>
        {name}
      </text>
    </svg>
  );
};

// Moon phase drawn in code: lit part in warm gold, dark part as faint outline, stippled craters.
export const Moon: React.FC<{ phase: string; size: number; draw?: number }> = ({ phase, size, draw = 1 }) => {
  const r = 170;
  const lit: Record<string, string> = {
    new: '',
    crescent: `M200 30 A170 170 0 0 1 200 370 A110 170 0 0 0 200 30 Z`,
    quarter: `M200 30 A170 170 0 0 1 200 370 Z`,
    gibbous: `M200 30 A170 170 0 0 1 200 370 A90 170 0 0 1 200 30 Z`,
    full: `M200 30 A170 170 0 1 1 199.9 30 Z`,
  };
  const craters = [
    [150, 140, 22],
    [240, 110, 14],
    [260, 230, 30],
    [170, 260, 18],
    [215, 175, 10],
    [120, 210, 12],
  ];
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{ overflow: 'visible', filter: phase === 'new' ? undefined : 'drop-shadow(0 0 50px rgba(246,230,196,0.35))' }}>
      <defs>
        <radialGradient id="moonlit" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor={C.cream} />
          <stop offset="60%" stopColor={C.goldSoft} />
          <stop offset="100%" stopColor={C.gold} />
        </radialGradient>
        <clipPath id="litclip">
          <path d={lit[phase] || 'M0 0'} />
        </clipPath>
      </defs>
      <circle cx="200" cy="200" r={r} fill="#15173a" stroke={C.gold} strokeWidth="2.5" opacity={0.9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
      {lit[phase] ? <path d={lit[phase]} fill="url(#moonlit)" opacity={draw} /> : null}
      <g clipPath="url(#litclip)" opacity={0.35 * draw}>
        {craters.map(([x, y, cr], i) => (
          <circle key={i} cx={x} cy={y} r={cr} fill="none" stroke={C.goldStrong} strokeWidth="2" strokeDasharray="2 4" />
        ))}
      </g>
      {phase === 'new' ? <circle cx="200" cy="200" r={r + 8} fill="none" stroke={C.goldSoft} strokeWidth="1.5" opacity={0.5 * draw} /> : null}
    </svg>
  );
};

const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

export const toHands = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return { hour: ((h % 12) + m / 60) * 30, minute: m * 6 };
};

// Antique clock face with Roman numerals; hand angles in degrees.
export const Clock: React.FC<{ hour: number; minute: number; size: number; draw?: number }> = ({ hour, minute, size, draw = 1 }) => (
  <svg viewBox="0 0 400 400" width={size} height={size} style={{ overflow: 'visible', filter: 'drop-shadow(0 0 24px rgba(226,184,102,0.3))' }}>
    <circle cx="200" cy="200" r="185" fill="#13153a" stroke={C.gold} strokeWidth="5" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    <circle cx="200" cy="200" r="168" fill="none" stroke={C.gold} strokeWidth="1.5" opacity={0.6 * draw} />
    {new Array(60).fill(0).map((_, i) => {
      const a = (i * 6 * Math.PI) / 180;
      const long = i % 5 === 0;
      return (
        <line key={i} x1={200 + Math.sin(a) * 168} y1={200 - Math.cos(a) * 168} x2={200 + Math.sin(a) * (long ? 150 : 160)} y2={200 - Math.cos(a) * (long ? 150 : 160)} stroke={C.gold} strokeWidth={long ? 3 : 1.5} opacity={draw} />
      );
    })}
    {ROMAN.map((n, i) => {
      const a = (i * 30 * Math.PI) / 180;
      return (
        <text key={n} x={200 + Math.sin(a) * 122} y={200 - Math.cos(a) * 122 + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize="30" fill={C.goldSoft} opacity={draw}>
          {n}
        </text>
      );
    })}
    <g transform={`rotate(${hour} 200 200)`} opacity={draw}>
      <path d="M200 215 L193 200 L200 105 L207 200 Z" fill={C.gold} />
    </g>
    <g transform={`rotate(${minute} 200 200)`} opacity={draw}>
      <path d="M200 222 L195 200 L200 60 L205 200 Z" fill={C.goldSoft} />
    </g>
    <circle cx="200" cy="200" r="9" fill={C.gold} />
  </svg>
);
