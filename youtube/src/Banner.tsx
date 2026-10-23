import React from 'react';
import { AbsoluteFill } from 'remotion';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/inter/600.css';
import { Background } from './Background';
import { Moon } from './Art';
import { C, SERIF, goldText, smallCaps } from './theme';

// Channel banner, 2560×1440; everything important sits inside YouTube's 1546×423 safe area.
export const Banner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.night }}>
    <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.34)', transformOrigin: 'top left' }}>
      <Background seed="banner" />
    </div>
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Moon phase="crescent" size={190} />
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 170, color: C.cream, letterSpacing: '0.01em' }}>Signs &amp; Meanings</div>
      </div>
      <div style={{ ...smallCaps, fontSize: 34, letterSpacing: '0.28em' }}>The stories behind the numbers we keep seeing</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, ...goldText }}>New Shorts every day</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
