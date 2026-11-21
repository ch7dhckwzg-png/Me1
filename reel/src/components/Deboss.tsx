import React from 'react';

/**
 * Inner-shadow filter for marks pressed into a surface. Units are the logo's viewBox
 * units (about 3.4 per CSS pixel). Light comes from the top-left.
 */
export const DebossFilter: React.FC<{ id: string; depth?: number; shadow?: number; highlight?: number }> = ({
  id,
  depth = 1,
  shadow = 0.75,
  highlight = 0.4,
}) => (
  <filter id={id} x="-5%" y="-10%" width="110%" height="120%" colorInterpolationFilters="sRGB">
    <feOffset in="SourceAlpha" dx={14 * depth} dy={18 * depth} result="offS" />
    <feComposite in="SourceAlpha" in2="offS" operator="out" result="edgeS" />
    <feGaussianBlur in="edgeS" stdDeviation={6 * depth} result="edgeSB" />
    <feFlood floodColor="#000" floodOpacity={shadow} />
    <feComposite in2="edgeSB" operator="in" />
    <feComposite in2="SourceAlpha" operator="in" result="shadowIn" />
    <feOffset in="SourceAlpha" dx={-7 * depth} dy={-9 * depth} result="offH" />
    <feComposite in="SourceAlpha" in2="offH" operator="out" result="edgeH" />
    <feGaussianBlur in="edgeH" stdDeviation={3 * depth} result="edgeHB" />
    <feFlood floodColor="#fff" floodOpacity={highlight} />
    <feComposite in2="edgeHB" operator="in" />
    <feComposite in2="SourceAlpha" operator="in" result="hiIn" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="shadowIn" />
      <feMergeNode in="hiIn" />
    </feMerge>
  </filter>
);
