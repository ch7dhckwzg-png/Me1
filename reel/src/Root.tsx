import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './brand';
import { Reel } from './Reel';
import { END } from './timeline';

export const Root: React.FC = () => (
  <Composition id="Reel" component={Reel} durationInFrames={END} fps={FPS} width={W} height={H} />
);
