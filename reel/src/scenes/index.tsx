import React from 'react';
import type { SceneId } from '../timeline';
import { AppIconScene } from './AppIconScene';
import { ConcreteScene } from './ConcreteScene';
import { DarkFadeScene } from './DarkFadeScene';
import { EndCardScene } from './EndCardScene';
import { FlatGreyScene } from './FlatGreyScene';
import { GlassScene } from './GlassScene';
import { GridScene } from './GridScene';
import { LockupScene } from './LockupScene';
import { PaletteScene } from './PaletteScene';
import { RockScene } from './RockScene';
import { SilhouetteScene } from './SilhouetteScene';
import { SpaceScene } from './SpaceScene';
import type { SceneProps } from './types';

export const SCENES: Record<SceneId, React.FC<SceneProps>> = {
  concrete: (p) => <ConcreteScene {...p} tone="grey" />,
  concreteTan: (p) => <ConcreteScene {...p} tone="tan" />,
  grid: GridScene,
  silhouette: SilhouetteScene,
  lockup: LockupScene,
  flatGrey: FlatGreyScene,
  rock: RockScene,
  rockInverted: (p) => <RockScene {...p} inverted />,
  glass: GlassScene,
  space: SpaceScene,
  appIcon: AppIconScene,
  palette: PaletteScene,
  darkFade: DarkFadeScene,
  endCard: EndCardScene,
};
