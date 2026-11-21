import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../brand';
import { Logo } from '../logo/Logo';
import type { SceneProps } from './types';

/** 5. A breather: plain mid-grey, black logo. */
export const FlatGreyScene: React.FC<SceneProps> = () => (
  <AbsoluteFill style={{ backgroundColor: C.grey }}>
    <Logo color={C.ink} />
  </AbsoluteFill>
);
