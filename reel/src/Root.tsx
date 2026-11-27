import React from 'react';
import { Composition } from 'remotion';
import { FPS, H, W } from './brand';
import { Reel } from './Reel';
import { OrangeStill } from './OrangeStills';
import { END } from './timeline';

export const Root: React.FC = () => (
  <>
    <Composition id="Reel" component={Reel} durationInFrames={END} fps={FPS} width={W} height={H} />
    {/* Orange stills series: render a frame with --props='{"n":1}' ... 30 */}
    <Composition id="Orange" component={OrangeStill} durationInFrames={30} fps={FPS} width={W} height={H} defaultProps={{ n: 1 }} />
  </>
);
