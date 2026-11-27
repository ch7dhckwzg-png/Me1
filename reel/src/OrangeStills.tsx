import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, FONT_MONO, FONT_SANS, H, LOGO_H, LOGO_W, LOGO_X, LOGO_Y, W } from './brand';
import { Grain } from './components/Grain';
import { Logo } from './logo/Logo';
import { LogoColorContext } from './logo/LogoColor';
import { SCENES } from './scenes';

/** CATALYZE orange (Pantone 16-1355 Orange Slices), as on catalyze.uk. */
export const ORANGE = '#FF6E00';

type Custom = {
  bg: string;
  grid?: string; // line colour for a construction grid
  words?: string; // faint repeated lowercase wordmark
  tagline?: string; // tagline colour
  tile?: { bg: string; shadow: string }; // rounded tile behind the logo
  swatches?: boolean; // palette strip
  label?: string; // small mono caption, top left
  ink?: string; // text colour for captions and swatch labels
};

type Entry = { tone: 'light' | 'dark'; name: string } & ({ scene: keyof typeof SCENES } | { custom: Custom });

const TAGLINE = 'MARKETING · DESIGN · IMAGERY';

// Alternates light, dark, light, dark... (odd numbers light, even dark).
export const ORANGE_SERIES: Entry[] = [
  { tone: 'light', name: 'concrete', scene: 'concrete' },
  { tone: 'dark', name: 'space', scene: 'space' },
  { tone: 'light', name: 'silhouette', scene: 'silhouette' },
  { tone: 'dark', name: 'rock', scene: 'rock' },
  { tone: 'light', name: 'glass', scene: 'glass' },
  { tone: 'dark', name: 'end-card', scene: 'endCard' },
  { tone: 'light', name: 'cream', custom: { bg: C.cream } },
  { tone: 'dark', name: 'ink', custom: { bg: C.ink } },
  { tone: 'light', name: 'cream-tagline', custom: { bg: C.cream, tagline: C.ink } },
  { tone: 'dark', name: 'palette-card', scene: 'palette' },
  { tone: 'light', name: 'cream-grid', custom: { bg: '#EFE8D8', grid: 'rgba(28,27,23,0.16)', label: 'CATALYZE · BRAND GUIDELINES\n02 / ORANGE ON LIGHT', ink: C.ink } },
  { tone: 'dark', name: 'ink-grid', custom: { bg: '#1A1915', grid: 'rgba(242,236,222,0.12)', label: 'CATALYZE · BRAND GUIDELINES\n03 / ORANGE ON DARK', ink: C.cream } },
  { tone: 'light', name: 'cream-wordmark', custom: { bg: '#F4EFE3', words: 'rgba(28,27,23,0.07)' } },
  { tone: 'dark', name: 'brown-wordmark', custom: { bg: C.brown, words: 'rgba(242,236,222,0.06)' } },
  { tone: 'light', name: 'white', custom: { bg: 'linear-gradient(180deg, #FFFFFF 0%, #F1F0EE 100%)' } },
  { tone: 'dark', name: 'dark-fade', scene: 'darkFade' },
  { tone: 'light', name: 'cream-tile', custom: { bg: 'linear-gradient(180deg, #E9E3D5 0%, #DCD4C3 100%)', tile: { bg: C.cream, shadow: 'rgba(60,45,25,0.18)' } } },
  { tone: 'dark', name: 'ink-tile', custom: { bg: 'linear-gradient(180deg, #2A231B 0%, #15120E 100%)', tile: { bg: C.ink, shadow: 'rgba(0,0,0,0.5)' } } },
  { tone: 'light', name: 'cream-palette', custom: { bg: C.cream, swatches: true, ink: C.ink } },
  { tone: 'dark', name: 'ink-palette', custom: { bg: C.ink, swatches: true, ink: C.cream } },
  { tone: 'light', name: 'pale-grey', custom: { bg: '#DEDDDA' } },
  { tone: 'dark', name: 'black', custom: { bg: '#0B0A08' } },
  { tone: 'light', name: 'sand', custom: { bg: 'linear-gradient(200deg, #F3E7D3 0%, #E6D5BA 100%)' } },
  { tone: 'dark', name: 'brown', custom: { bg: 'linear-gradient(200deg, #372E1F 0%, #221C14 100%)' } },
  { tone: 'light', name: 'stone-grid', custom: { bg: '#E4E1DA', grid: 'rgba(28,27,23,0.12)', ink: C.ink } },
  { tone: 'dark', name: 'brown-tagline', custom: { bg: C.brown, tagline: C.gold } },
  { tone: 'light', name: 'white-tagline', custom: { bg: '#FAF9F7', tagline: '#5A564F' } },
  { tone: 'dark', name: 'charcoal', custom: { bg: 'linear-gradient(180deg, #26251F 0%, #12110E 100%)' } },
  { tone: 'light', name: 'cream-wordmark-tagline', custom: { bg: C.cream, words: 'rgba(28,27,23,0.06)', tagline: C.ink } },
  { tone: 'dark', name: 'ink-wordmark-tagline', custom: { bg: C.ink, words: 'rgba(242,236,222,0.05)', tagline: C.gold } },
];

const CustomScene: React.FC<{ c: Custom }> = ({ c }) => (
  <AbsoluteFill style={{ background: c.bg, overflow: 'hidden' }}>
    {c.grid ? (
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={(i * W) / 12} y1={0} x2={(i * W) / 12} y2={H} stroke={c.grid} strokeWidth={1} />
        ))}
        {Array.from({ length: 22 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i * H) / 21} x2={W} y2={(i * H) / 21} stroke={c.grid} strokeWidth={1} />
        ))}
        <rect x={LOGO_X - 36} y={LOGO_Y - 36} width={LOGO_W + 72} height={LOGO_H + 72} fill="none" stroke={c.grid} strokeWidth={2} strokeDasharray="8 8" />
      </svg>
    ) : null}
    {c.words ? (
      <div style={{ position: 'absolute', inset: -40, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', transform: 'rotate(-8deg)' }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ fontFamily: FONT_SANS, fontWeight: 800, fontStyle: 'italic', fontSize: 200, lineHeight: 1, letterSpacing: '-0.04em', color: c.words, whiteSpace: 'nowrap', marginLeft: i % 2 ? -260 : -40 }}>
            catalyze catalyze
          </div>
        ))}
      </div>
    ) : null}
    {c.tile ? (
      <div style={{ position: 'absolute', left: LOGO_X - 70, top: LOGO_Y - 150, width: LOGO_W + 140, height: LOGO_H + 300, borderRadius: 96, background: c.tile.bg, boxShadow: `0 40px 80px ${c.tile.shadow}` }} />
    ) : null}
    {c.label ? (
      <div style={{ position: 'absolute', left: 64, top: 96, fontFamily: FONT_MONO, fontSize: 24, letterSpacing: '0.14em', lineHeight: 1.7, color: c.ink, opacity: 0.8, whiteSpace: 'pre' }}>{c.label}</div>
    ) : null}
    {c.swatches ? (
      <div style={{ position: 'absolute', left: 64, right: 64, bottom: 120, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          { label: 'ORANGE', hex: '#FF6E00', bg: ORANGE, fg: C.ink },
          { label: 'LIGHT', hex: '#F2ECDE', bg: C.cream, fg: C.ink },
          { label: 'DARK', hex: '#1C1B17', bg: C.ink, fg: C.cream },
        ].map((s) => (
          <div key={s.label} style={{ height: 240, borderRadius: 18, background: s.bg, padding: 24, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: `inset 0 0 0 2px ${c.ink === C.cream ? 'rgba(242,236,222,0.14)' : 'rgba(28,27,23,0.12)'}` }}>
            <div style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 24, letterSpacing: '0.2em', color: s.fg }}>{s.label}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 22, color: s.fg, opacity: 0.8 }}>HEX {s.hex}</div>
          </div>
        ))}
      </div>
    ) : null}
    <Logo />
    {c.tagline ? (
      <div style={{ position: 'absolute', left: 0, right: 0, top: LOGO_Y + LOGO_H + 82, textAlign: 'center', fontFamily: FONT_SANS, fontWeight: 500, fontSize: 38, letterSpacing: '0.24em', paddingLeft: '0.24em', color: c.tagline, whiteSpace: 'nowrap' }}>
        {TAGLINE}
      </div>
    ) : null}
  </AbsoluteFill>
);

/** One still from the orange series: pick it with the `n` prop (1 to 30). */
export const OrangeStill: React.FC<{ n: number }> = ({ n }) => {
  const e = ORANGE_SERIES[Math.max(1, Math.min(ORANGE_SERIES.length, n)) - 1];
  const Scene = 'scene' in e ? SCENES[e.scene] : null;
  return (
    <LogoColorContext.Provider value={ORANGE}>
      <AbsoluteFill style={{ backgroundColor: e.tone === 'light' ? C.cream : C.ink }}>
        {Scene ? <Scene duration={30} /> : <CustomScene c={(e as { custom: Custom }).custom} />}
        <Grain />
      </AbsoluteFill>
    </LogoColorContext.Provider>
  );
};
