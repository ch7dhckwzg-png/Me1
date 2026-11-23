import React from 'react';
import { Composition, Still } from 'remotion';
import { Ep01, Ep01Cover } from './Ep01';
import { FPS, H, TOTAL, W } from './ep01';
import { Ep02, Ep02Cover } from './Ep02';
import { TOTAL as TOTAL2 } from './ep02';

export const Root: React.FC = () => (
  <>
    <Composition id="Ep01" component={Ep01} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ withCaptions: true }} />
    <Composition id="Ep01Clean" component={Ep01} durationInFrames={TOTAL} fps={FPS} width={W} height={H} defaultProps={{ withCaptions: false }} />
    <Still id="Ep01Cover" component={Ep01Cover} width={W} height={H} />
    <Composition id="Ep02" component={Ep02} durationInFrames={TOTAL2} fps={FPS} width={W} height={H} defaultProps={{ withCaptions: true }} />
    <Composition id="Ep02Clean" component={Ep02} durationInFrames={TOTAL2} fps={FPS} width={W} height={H} defaultProps={{ withCaptions: false }} />
    <Still id="Ep02Cover" component={Ep02Cover} width={W} height={H} />
  </>
);
