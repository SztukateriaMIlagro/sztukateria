import { Easing, interpolate } from 'remotion';

export const C = {
  night: '#0e1029',
  night2: '#2a2457',
  gold: '#e2b866',
  goldStrong: '#c9993f',
  goldSoft: '#f6e6c4',
  cream: '#fbf8f2',
  violet: '#8c7fe0',
  muted: '#9f9ab8',
};

export const SERIF = '"Cormorant Garamond", Georgia, serif';
export const SANS = 'Inter, system-ui, sans-serif';

export const W = 1080;
export const H = 1920;
// Main visual area: clear of the YouTube UI (top 8%, bottom 18%, right-hand buttons).
export const STAGE = { top: 250, height: 960, left: 70, right: 150 };
export const CX = (W - STAGE.right + STAGE.left) / 2;
export const CAPTION_Y = 1310;

export const ease = Easing.bezier(0.33, 0, 0.2, 1);

// 0 → 1 over `dur` frames starting at `start`, eased and clamped.
export const ramp = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const goldText: React.CSSProperties = {
  backgroundImage: `linear-gradient(180deg, ${C.goldSoft} 0%, ${C.gold} 45%, ${C.goldStrong} 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  filter: 'drop-shadow(0 0 28px rgba(226,184,102,0.35))',
};

export const smallCaps: React.CSSProperties = {
  fontFamily: SANS,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
  color: C.goldSoft,
};
