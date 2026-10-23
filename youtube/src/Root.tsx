import React from 'react';
import { Composition } from 'remotion';
import timings from './generated/timings.json';
import { Short, shortDuration } from './Short';
import { Banner } from './Banner';
import { LH, LW, Long, Thumb, longDuration, longIds } from './Long';

const FPS = 30;

export const Root: React.FC = () => (
  <>
    <Composition id="banner" component={Banner} durationInFrames={1} fps={30} width={2560} height={1440} />
    {Object.keys(timings).map((id) => (
      <Composition key={id} id={id} component={Short} durationInFrames={shortDuration(id, FPS)} fps={FPS} width={1080} height={1920} defaultProps={{ id }} />
    ))}
    {longIds.map((id) => (
      <Composition key={id} id={id} component={Long} durationInFrames={longDuration(id, FPS)} fps={FPS} width={LW} height={LH} defaultProps={{ id }} />
    ))}
    {longIds.map((id) => (
      <Composition key={`thumb-${id}`} id={`thumb-${id}`} component={Thumb} durationInFrames={1} fps={FPS} width={1280} height={720} defaultProps={{ id }} />
    ))}
  </>
);
