import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Grain } from './components/Grain';
import { SCENES } from './scenes';
import { CUTS, END, HAS_MUSIC, SEQUENCE } from './timeline';

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#1C1B17' }}>
    {SEQUENCE.map((id, i) => {
      const from = CUTS[i];
      const to = i + 1 < CUTS.length ? CUTS[i + 1] : END;
      const Scene = SCENES[id];
      return (
        <Sequence key={`${id}-${i}`} from={from} durationInFrames={to - from} name={id}>
          <Scene duration={to - from} />
        </Sequence>
      );
    })}
    <Grain />
    {HAS_MUSIC ? <Audio src={staticFile('music.mp3')} /> : null}
  </AbsoluteFill>
);
