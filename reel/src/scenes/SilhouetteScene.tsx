import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../brand';
import { pushIn } from '../components/util';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

// Side-profile head facing right, drawn in a 1100 x 1400 box.
const PROFILE =
  'M 360 1400 L 380 1150 C 300 1080 200 960 190 760 C 175 470 380 230 640 225 C 840 222 960 360 965 520 ' +
  'C 968 580 960 620 975 660 C 990 700 1040 760 1052 805 C 1056 822 1040 834 1010 836 ' +
  'C 1000 860 1016 880 1012 902 C 1008 916 990 926 1000 946 C 1010 966 1002 990 986 1010 ' +
  'C 976 1040 992 1072 970 1096 C 948 1120 882 1126 822 1120 C 802 1180 802 1260 832 1400 Z';

/** 3. Flat white head silhouette on light grey, black logo overlapping it. */
export const SilhouetteScene: React.FC<SceneProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: 'radial-gradient(90% 70% at 50% 40%, #E9E9E9 0%, #CFCFCF 60%, #BDBDBD 100%)', overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: pushIn(frame, duration) }}>
        <svg viewBox="0 0 1100 1400" width={1240} height={1578} style={{ position: 'absolute', left: -190, top: 420 }}>
          <path d={PROFILE} fill="#FFFFFF" />
        </svg>
      </AbsoluteFill>
      <Logo color={C.ink} />
    </AbsoluteFill>
  );
};
