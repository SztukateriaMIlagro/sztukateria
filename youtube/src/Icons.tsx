import React from 'react';
import { C } from './theme';

// Line-art objects drawn in code, in the same engraving spirit as the AI images.
// Every path uses pathLength=1 so it can "draw itself on" (draw: 0 → 1).
type P = { draw: number; tint?: string };

const line = (draw: number, w = 4): React.SVGProps<SVGPathElement> => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - draw,
  fill: 'none',
  stroke: C.gold,
  strokeWidth: w,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

const Hatch: React.FC<{ id: string; color?: string }> = ({ id, color = C.gold }) => (
  <pattern id={id} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <line x1="0" y1="0" x2="0" y2="9" stroke={color} strokeWidth="1.6" opacity="0.55" />
  </pattern>
);

const fillIn = (draw: number, id: string): React.SVGProps<SVGPathElement> => ({
  fill: `url(#${id})`,
  stroke: 'none',
  opacity: Math.max(0, (draw - 0.5) * 2),
});

const tower = ({ draw }: P) => {
  const windows: string[] = [];
  for (let r = 0; r < 14; r++) for (let c = 0; c < 4; c++) windows.push(`M${142 + c * 30} ${70 + r * 21} h18 v11 h-18 z`);
  return (
    <>
      <path {...fillIn(draw, 'h')} d="M120 50 L280 50 L280 375 L120 375 Z" />
      <path {...line(draw)} d="M120 375 L120 50 L280 50 L280 375 M90 375 L310 375 M200 18 L200 50" />
      {windows.map((d, i) => (
        <path key={i} {...line(Math.min(1, draw * 1.4 - i * 0.008), 2)} d={d} />
      ))}
    </>
  );
};

const door = ({ draw }: P) => (
  <>
    <path {...fillIn(draw, 'h')} d="M120 380 L120 150 A80 80 0 0 1 280 150 L280 380 Z" />
    <path {...line(draw)} d="M110 385 L110 150 A90 90 0 0 1 290 150 L290 385 Z" />
    <path {...line(draw, 3)} d="M200 72 L200 385 M135 180 L180 180 M220 180 L265 180 M135 300 L180 300 M220 300 L265 300" />
    <circle cx="225" cy="250" r="7" fill={C.gold} opacity={draw} />
  </>
);

const gem = ({ draw, tint }: P) => (
  <>
    <path {...fillIn(draw, 'h')} d="M200 360 L70 170 L120 100 L280 100 L330 170 Z" style={{ fill: tint ? `${tint}55` : undefined }} />
    <path {...line(draw)} d="M200 360 L70 170 L120 100 L280 100 L330 170 Z M70 170 L330 170 M120 100 L160 170 L200 100 L240 170 L280 100 M160 170 L200 360 L240 170" />
  </>
);

const cluster = ({ draw, tint }: P) => (
  <>
    {[
      'M200 360 L170 140 L200 60 L230 140 Z',
      'M150 360 L95 190 L115 125 L150 180 Z',
      'M250 360 L285 170 L315 210 L300 300 Z',
      'M120 365 L60 260 L75 225 L135 300 Z',
    ].map((d, i) => (
      <React.Fragment key={i}>
        <path d={d} fill={tint ? `${tint}44` : 'url(#h)'} opacity={Math.max(0, (draw - 0.5) * 2)} />
        <path {...line(draw)} d={d} />
      </React.Fragment>
    ))}
    <path {...line(draw, 3)} d="M50 365 Q200 330 350 365" />
  </>
);

const chunk = ({ draw, tint }: P) => (
  <>
    <path d="M90 300 L70 200 L140 110 L260 95 L335 190 L310 300 L200 340 Z" fill={tint ? `${tint}44` : 'url(#h)'} opacity={Math.max(0, (draw - 0.5) * 2)} />
    <path {...line(draw)} d="M90 300 L70 200 L140 110 L260 95 L335 190 L310 300 L200 340 Z M140 110 L180 210 L260 95 M180 210 L70 200 M180 210 L200 340 M180 210 L335 190" />
  </>
);

const point = ({ draw, tint }: P) => (
  <>
    <path d="M150 370 L150 150 L200 50 L250 150 L250 370 Z" fill={tint ? `${tint}44` : 'url(#h)'} opacity={Math.max(0, (draw - 0.5) * 2)} />
    <path {...line(draw)} d="M150 370 L150 150 L200 50 L250 150 L250 370 Z M150 150 L200 185 L250 150 M200 185 L200 50 M200 185 L200 370" />
  </>
);

const plate = ({ draw }: P) => (
  <>
    <path {...fillIn(draw * 0.6, 'h')} d="M40 130 h320 a20 20 0 0 1 20 20 v100 a20 20 0 0 1 -20 20 h-320 a20 20 0 0 1 -20 -20 v-100 a20 20 0 0 1 20 -20 z" />
    <path {...line(draw)} d="M40 130 h320 a20 20 0 0 1 20 20 v100 a20 20 0 0 1 -20 20 h-320 a20 20 0 0 1 -20 -20 v-100 a20 20 0 0 1 20 -20 z M45 145 h310 v110 h-310 z" />
    {[60, 340].map((x) => [150, 250].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill={C.gold} opacity={draw} />))}
  </>
);

const receipt = ({ draw }: P) => (
  <>
    <path {...line(draw)} d="M120 30 L280 30 L280 330 L265 345 L250 330 L235 345 L220 330 L205 345 L190 330 L175 345 L160 330 L145 345 L130 330 L120 340 Z" />
    {[70, 95, 120, 145, 230, 255].map((y, i) => (
      <path key={y} {...line(Math.max(0, draw * 1.3 - i * 0.05), 2)} d={`M140 ${y} h${i % 2 ? 90 : 120}`} />
    ))}
  </>
);

const papyrus = ({ draw }: P) => (
  <>
    <path {...fillIn(draw * 0.7, 'h')} d="M70 90 L150 75 L190 95 L260 70 L330 100 L320 190 L340 280 L250 320 L180 300 L95 325 L60 230 L80 160 Z" />
    <path {...line(draw)} d="M70 90 L150 75 L190 95 L260 70 L330 100 L320 190 L340 280 L250 320 L180 300 L95 325 L60 230 L80 160 Z" />
    {[120, 150, 180, 210, 240, 270].map((y, i) => (
      <path key={y} {...line(Math.max(0, draw * 1.3 - i * 0.06), 2.5)} d={`M100 ${y} q30 -8 60 0 t60 0 t60 0 t40 0`} />
    ))}
  </>
);

const book = ({ draw }: P) => (
  <>
    <path {...fillIn(draw, 'h')} d="M70 250 L230 300 L340 230 L180 185 Z" />
    <path {...line(draw)} d="M70 250 L230 300 L340 230 L180 185 Z M70 250 L70 275 L230 325 L340 255 L340 230 M230 300 L230 325" />
    <path {...line(draw, 3)} d="M150 200 C190 120 260 80 330 60 C290 110 240 160 170 205 M200 165 L250 120 M215 175 L280 105" />
  </>
);

const armillary = ({ draw }: P) => (
  <>
    <circle cx="200" cy="170" r="120" {...(line(draw) as object)} />
    <ellipse cx="200" cy="170" rx="120" ry="40" {...(line(draw, 3) as object)} />
    <ellipse cx="200" cy="170" rx="40" ry="120" {...(line(draw, 3) as object)} />
    <ellipse cx="200" cy="170" rx="120" ry="40" transform="rotate(-25 200 170)" {...(line(draw, 3) as object)} />
    <circle cx="200" cy="170" r="14" fill={C.gold} opacity={draw} />
    <path {...line(draw)} d="M200 290 L200 340 M150 370 L250 370 L230 340 L170 340 Z" />
  </>
);

const tophat = ({ draw }: P) => (
  <>
    <path {...fillIn(draw, 'h')} d="M130 290 L145 70 L255 70 L270 290 Z" />
    <path {...line(draw)} d="M130 290 L145 70 L255 70 L270 290 M60 300 Q200 340 340 300 Q200 270 60 300 Z M135 250 L265 250 M137 225 L263 225" />
  </>
);

const poppy = ({ draw }: P) => (
  <>
    <path {...line(draw)} d="M200 380 C205 320 190 260 200 200" />
    <path {...line(draw, 3)} d="M200 300 C240 290 260 270 270 250 C240 255 215 270 200 300" />
    {[0, 72, 144, 216, 288].map((a) => (
      <path key={a} {...line(draw)} transform={`rotate(${a} 200 140)`} d="M200 140 C150 120 150 60 200 50 C250 60 250 120 200 140 Z" />
    ))}
    <circle cx="200" cy="140" r="16" fill={C.gold} opacity={draw} />
  </>
);

const breastplate = ({ draw }: P) => {
  const stones: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 3; c++)
      stones.push(<ellipse key={`${r}${c}`} cx={140 + c * 60} cy={115 + r * 60} rx="20" ry="24" {...(line(Math.max(0, draw * 1.3 - (r * 3 + c) * 0.03), 3) as object)} />);
  return (
    <>
      <path {...fillIn(draw * 0.5, 'h')} d="M95 70 h210 v290 h-210 z" />
      <path {...line(draw)} d="M95 70 h210 v290 h-210 z M95 70 L60 40 M305 70 L340 40" />
      {stones}
    </>
  );
};

const river = ({ draw }: P) => (
  <>
    {[180, 220, 260, 300, 340].map((y, i) => (
      <path key={y} {...line(Math.max(0, draw * 1.3 - i * 0.06), 3)} d={`M${30 + i * 10} ${y} q40 -14 80 0 t80 0 t80 0 t80 0`} />
    ))}
    <path {...line(draw, 3)} d="M30 160 L370 160" />
    <path {...line(draw)} d="M300 70 a32 32 0 1 0 22 52 a26 26 0 1 1 -22 -52 z" />
  </>
);

const capsule = ({ draw }: P) => (
  <>
    <path {...fillIn(draw, 'h')} d="M200 70 L320 300 L80 300 Z" />
    <path {...line(draw)} d="M185 70 h30 L320 300 L80 300 L185 70 Z M95 270 h210 M75 300 Q200 345 325 300 M190 40 h20 v30 h-20 z" />
    <path {...line(draw, 3)} d="M175 170 h50 v40 h-50 z" />
  </>
);

const ICONS: Record<string, React.FC<P>> = {
  tower,
  door,
  gem,
  amethyst: (p) => cluster({ ...p, tint: '#9b7fe0' }),
  'rose-quartz': (p) => chunk({ ...p, tint: '#e6a3b8' }),
  citrine: (p) => point({ ...p, tint: '#e8c25a' }),
  'license-plate': plate,
  receipt,
  papyrus,
  'book-feather': book,
  armillary,
  tophat,
  poppy,
  breastplate,
  river,
  capsule,
};

export const hasIcon = (id: string) => id in ICONS;

export const Icon: React.FC<{ id: string; draw: number; size: number }> = ({ id, draw, size }) => {
  const Comp = ICONS[id];
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{ overflow: 'visible', filter: 'drop-shadow(0 0 18px rgba(226,184,102,0.25))' }}>
      <defs>
        <Hatch id="h" />
      </defs>
      {Comp ? <Comp draw={draw} /> : null}
    </svg>
  );
};
