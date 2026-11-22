import React, { useId } from 'react';
import { LOGO_H, LOGO_W, LOGO_X, LOGO_Y } from '../brand';
import { LOGO_PATH, LOGO_TRANSFORM, LOGO_VIEWBOX } from './logoPath';

type Props = {
  color?: string;
  opacity?: number;
  /** CSS filter on the whole mark (drop shadows etc.). */
  cssFilter?: string;
  /** Id of an SVG filter defined in `defs`. */
  svgFilter?: string;
  /** Extra SVG defs (filters, gradients, patterns). */
  defs?: React.ReactNode;
  /** Custom fill content, clipped to the mark. Replaces the solid colour. */
  fill?: React.ReactNode;
  style?: React.CSSProperties;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
};

/**
 * The traced CATALYZE mark, always drawn in the same box so it never moves between cuts.
 * It is only ever recoloured or filtered, never redrawn.
 */
export const Logo: React.FC<Props> = ({
  color = '#F2ECDE',
  opacity = 1,
  cssFilter,
  svgFilter,
  defs,
  fill,
  style,
  mixBlendMode,
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox={`0 0 ${LOGO_VIEWBOX.width} ${LOGO_VIEWBOX.height}`}
      width={LOGO_W}
      height={LOGO_H}
      style={{
        position: 'absolute',
        left: LOGO_X,
        top: LOGO_Y,
        overflow: 'visible',
        opacity,
        filter: cssFilter,
        mixBlendMode,
        ...style,
      }}
    >
      <defs>
        <clipPath id={`clip-${id}`}>
          <path transform={LOGO_TRANSFORM} d={LOGO_PATH} />
        </clipPath>
        {defs}
      </defs>
      {fill ? (
        <g clipPath={`url(#clip-${id})`} filter={svgFilter ? `url(#${svgFilter})` : undefined}>
          {fill}
        </g>
      ) : (
        <g filter={svgFilter ? `url(#${svgFilter})` : undefined}>
          <path transform={LOGO_TRANSFORM} d={LOGO_PATH} fill={color} />
        </g>
      )}
    </svg>
  );
};
