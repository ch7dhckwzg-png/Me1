import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { captions, code, finderCamera, finderTaps, hookLines, palette, place, scenes, type Cap } from './ep02';

// Episode 02 edit, built on the Episode 01 template (same scenes, type, colours, captions).
// CATALYZE series look: near-black, cream, one orange accent used sparingly.
const C = { bg: '#12100e', cream: '#f1ebdd', muted: '#9a9286', orange: '#ff6e00', line: '#2b2622' };
const serif = '"Instrument Serif", Georgia, serif';
const sans = '"Hanken Grotesk", system-ui, sans-serif';
const mono = '"DM Mono", ui-monospace, monospace';
const out = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const whipEase = Easing.bezier(0.7, 0, 0.84, 0);
const lerp = (f: number, a: number, b: number, v0: number, v1: number, easing = out) =>
  interpolate(f, [a, b], [v0, v1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

const fade = (f: number, a: number, b: number, c: number, d: number) =>
  interpolate(f, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out });
const rise = (f: number, start: number, dist = 40, dur = 22) =>
  interpolate(f, [start, start + dur], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out });
const show = (f: number, start: number, dur = 18) =>
  interpolate(f, [start, start + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: out });

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 26, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, ...style }}>{children}</div>
);

/* ---------- 1. Hook: their shopfront draws itself, then the payoff ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const SW = 54; // 1.8s: the zoom through the sign into the dish
  // Part A: the street. Punches in on the sign at the end of the approach.
  const zoom = lerp(f, 0, 42, 1.02, 1.1, inOut) * lerp(f, 42, SW + 2, 1, 2.1, whipEase);
  const aBlur = lerp(f, SW - 10, SW + 2, 0, 18, whipEase);
  const aOut = 1 - lerp(f, SW - 4, SW + 4, 0, 1);
  // Part B: the dish spins, the cup becomes the pizza, the frame turns to night.
  const bIn = lerp(f, SW - 6, SW + 4, 0, 1);
  const bScale = lerp(f, SW - 6, SW + 10, 1.25, 1);
  const lineA = (i: number) => `translateY(${lerp(f, i * 3, 9 + i * 3, 70, 0)}%)`;
  const lineB = (i: number) => `translateY(${lerp(f, SW + 2 + i * 4, SW + 16 + i * 4, 115, 0)}%)`;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      {/* B underneath: a blurred scroll of the real site, teasing the reveal */}
      <AbsoluteFill style={{ background: C.bg, opacity: bIn, transform: `scale(${bScale})` }}>
        {f >= SW - 8 && (
          <Sequence from={SW - 8} layout="none">
            <AbsoluteFill style={{ filter: 'blur(14px) saturate(1.2) brightness(1.15)', transform: 'scale(1.12)' }}>
              {/* the capture simply scrolls down the page from frame 12 */}
              <OffthreadVideo src={staticFile('ep02/full-mobile.mp4')} muted trimBefore={14} playbackRate={2.6} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </AbsoluteFill>
          </Sequence>
        )}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,9,8,.6) 0%, rgba(10,9,8,.12) 40%, rgba(10,9,8,.35) 100%)' }} />
        <AbsoluteFill style={{ padding: '210px 84px 0', fontFamily: serif, fontSize: 150, lineHeight: 0.98, letterSpacing: '-0.02em' }}>
          {hookLines.b.map((l, i) => (
            <div key={l} style={{ overflow: 'hidden', paddingBottom: 10 }}><div style={{ color: i ? C.orange : C.cream, transform: lineB(i) }}>{l}</div></div>
          ))}
        </AbsoluteFill>
      </AbsoluteFill>
      {/* A on top: their shopfront drawing itself, then a whip zoom through the sign */}
      {f < SW + 4 && (
        <AbsoluteFill style={{ opacity: aOut }}>
          <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 64%', filter: aBlur > 0.3 ? `blur(${aBlur.toFixed(1)}px)` : undefined, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 300 }}>
            <SalonFront f={f} />
          </AbsoluteFill>
          <AbsoluteFill style={{ padding: '210px 84px 0', fontFamily: serif, fontSize: 132, lineHeight: 0.98, letterSpacing: '-0.02em' }}>
            {hookLines.a.map((l, i) => (
              <div key={l} style={{ overflow: 'hidden', paddingBottom: 8 }}><div style={{ color: C.cream, transform: lineA(i) }}>{l}</div></div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 34, opacity: show(f, 6, 10) }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.orange }} />
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, color: C.cream, letterSpacing: '0.01em' }}>{place.street}, {place.area}</div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 2. Their shopfront (from the venue photo), drawn in line ---------- */
const SalonFront: React.FC<{ f: number }> = ({ f }) => {
  const draw = (start: number, dur = 22) => interpolate(f, [start, start + dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut });
  const ln = (start: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: draw(start) });
  const lit = show(f, 22, 16);
  const bays = Array.from({ length: 7 }, (_, i) => 30 + i * 115);
  return (
    <svg viewBox="0 0 860 420" width={980} fill="none" stroke={C.cream} strokeWidth={1.6} style={{ overflow: 'visible' }}>
      <rect x={20} y={20} width={820} height={120} {...ln(0)} />
      <text x={430} y={64} textAnchor="middle" fill={C.cream} stroke="none" style={{ fontFamily: '${display}', fontWeight: 600, fontSize: 24, letterSpacing: 6, opacity: show(f, 10) }}>THE</text>
      <text x={430} y={112} textAnchor="middle" fill={C.cream} stroke="none" style={{ fontFamily: '${display}', fontWeight: 600, fontSize: 44, letterSpacing: 6, opacity: show(f, 12) }}>SALON SANCTUARY</text>
      <path d="M345 56 H395 M465 56 H515" {...ln(14)} />
      <g stroke="none" fill={C.cream} style={{ fontFamily: '${display}', fontSize: 22, opacity: show(f, 16) }}><text x={50} y={58}>T</text><text x={62} y={72}>S</text><text x={74} y={86}>S</text></g>
      <rect x={20} y={152} width={820} height={248} {...ln(4)} />
      {bays.map((x, i) => <rect key={i} x={x} y={164} width={107} height={224} fill={i === 5 ? '#e7c6bf' : '#f6dcc0'} fillOpacity={lit * (i === 5 ? 0.5 : 0.22)} {...ln(6 + i * 1.5)} />)}
      <path d="M0 400 H860" {...ln(2)} />
    </svg>
  );
};
const Business: React.FC = () => {
  const f = useCurrentFrame();
  const end = scenes.business.dur;
  return (
    <AbsoluteFill style={{ background: '#f6e6e8', opacity: fade(f, 0, 4, end - 6, end) }}>
      {/* the site's opening: the name writes itself on a steamed-up salon mirror (captured at 2.2x) */}
      <AbsoluteFill style={{ transform: `scale(${interpolate(f, [0, end], [1, 1.04])})`, transformOrigin: '50% 0%' }}>
        <OffthreadVideo src={staticFile('ep02/mirror-mobile.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </AbsoluteFill>
      {/* a soft dark fade under the mirror so the caption sits clear of the lettering */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(18,16,14,.75) 74%, rgba(18,16,14,.92) 100%)' }} />
    </AbsoluteFill>
  );
};

/* ---------- 3. The build: real code, real drafts, the decisions ---------- */
const Browser: React.FC<{ children: React.ReactNode; width: number; url?: string }> = ({ children, width, url = 'the-salon-sanctuary concept' }) => (
  <div style={{ width, borderRadius: 18, overflow: 'hidden', background: '#1c1a18', boxShadow: '0 50px 100px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08)' }}>
    <div style={{ height: 54, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px' }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: '#3a3632' }} />)}
      <div style={{ marginLeft: 18, flex: 1, height: 30, borderRadius: 6, background: '#2a2724', color: C.muted, fontFamily: sans, fontSize: 17, display: 'flex', alignItems: 'center', paddingLeft: 14 }}>{url}</div>
    </div>
    {children}
  </div>
);

const CodeShot: React.FC<{ f: number }> = ({ f }) => {
  const chars = Math.floor(interpolate(f, [0, 11], [0, code.length], { extrapolateRight: 'clamp' }));
  const shown = code.slice(0, chars);
  const kw = /\b(function|const|return|let|if|else)\b/g;
  return (
    <div style={{ background: '#16140f', borderRadius: 18, padding: '40px 44px', width: 940, boxShadow: '0 0 0 1px rgba(255,255,255,.07)' }}>
      <div style={{ fontFamily: mono, fontSize: 20, color: C.muted, marginBottom: 22 }}>src/scripts/main.ts</div>
      <pre style={{ margin: 0, fontFamily: mono, fontSize: 23, lineHeight: 1.55, color: C.cream, whiteSpace: 'pre-wrap' }}>
        {shown.split(kw).map((part, i) => (part.match(/^(function|const|return|let|if|else)$/) ? <span key={i} style={{ color: C.orange }}>{part}</span> : <span key={i}>{part}</span>))}
        <span style={{ display: 'inline-block', width: 13, height: 28, background: C.orange, verticalAlign: -5, opacity: Math.floor(f / 8) % 2 ? 0.2 : 1 }} />
      </pre>
    </div>
  );
};

const Build: React.FC = () => {
  const f = useCurrentFrame();
  const end = scenes.build.dur;
  const DRAFT0 = 14, PER = 6; // five drafts, 6 frames each
  const draft = Math.min(5, Math.max(1, Math.floor((f - DRAFT0) / PER) + 1));
  const inDrafts = f >= DRAFT0 && f < DRAFT0 + PER * 5;
  const pal0 = DRAFT0 + PER * 5; // 44
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fade(f, 0, 4, end - 6, end) }}>
      <AbsoluteFill style={{ padding: '150px 70px 0', justifyContent: 'flex-start' }}>
        <Label>{f < DRAFT0 ? 'Building the colour finder' : inDrafts ? `Draft 0${draft}` : 'Colours from the room'}</Label>
      </AbsoluteFill>
      {f < DRAFT0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: fade(f, 0, 4, DRAFT0 - 4, DRAFT0) }}>
          <div style={{ transform: `scale(${interpolate(f, [0, DRAFT0], [1, 1.04])})` }}><CodeShot f={f} /></div>
        </AbsoluteFill>
      )}
      {inDrafts && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: `scale(${interpolate(f - DRAFT0, [0, PER * 5], [0.98, 1.03])})` }}>
            <Browser width={980}><Img src={staticFile(`ep02/draft-v${draft}.jpg`)} style={{ width: 980, display: 'block' }} /></Browser>
          </div>
          <div style={{ position: 'absolute', top: 212, left: 70, display: 'flex', gap: 14 }}>
            {[1, 2, 3, 4, 5].map((v) => <div key={v} style={{ width: 52, height: 3, background: v <= draft ? C.orange : C.line }} />)}
          </div>
        </AbsoluteFill>
      )}
      {f >= pal0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 24 }}>
            {palette.map((c, i) => (
              <div key={i} style={{ opacity: show(f, pal0 + i * 3, 12), transform: `translateY(${rise(f, pal0 + i * 3, 30, 16)}px)` }}>
                <div style={{ height: 230, borderRadius: 14, background: c.hex, boxShadow: '0 0 0 1px rgba(255,255,255,.08)' }} />
                <div style={{ fontFamily: sans, fontSize: 24, color: C.cream, marginTop: 14 }}>{c.name}</div>
                <div style={{ fontFamily: mono, fontSize: 20, color: C.muted, marginTop: 4 }}>{c.hex}</div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 4. FEATURE: Find your colour, tapped through on a big phone ---------- */
const Feature: React.FC = () => {
  const f = useCurrentFrame();
  const end = scenes.feature.dur;
  const PW = 620;
  const t = finderTaps;
  const inP = lerp(f, 0, 18, 0, 1);
  // camera: pushes in on the dots for each tap and on the suggestion as it changes
  const ks = finderCamera.map((k) => k[0]);
  const cam = (i: number) => interpolate(f, ks, finderCamera.map((k) => k[i]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: inOut });
  const fy = cam(1), sc = cam(2);
  const CY = 1088;
  const pulse = (at: number) => interpolate(f, [at, at + 6, at + 22], [0, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = Math.max(...t.taps.map((at) => pulse(at - t.trim)));
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fade(f, 0, 4, end - 6, end) }}>
      <AbsoluteFill style={{ background: `radial-gradient(55% 40% at 50% 60%, rgba(231,198,191,${0.16 + glow * 0.1}), transparent 75%)` }} />
      <AbsoluteFill style={{ padding: '150px 96px 0' }}>
        <Label style={{ opacity: show(f, 2) }}>Find your colour</Label>
      </AbsoluteFill>
      {/* the stage keeps the zoomed phone clear of the caption above */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 400, bottom: 80, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: -400, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${540 - 540 * sc}px, ${CY - fy * sc}px) scale(${sc})` }}>
          <div style={{ position: 'absolute', left: 540 - PW / 2, top: 430, opacity: inP, transform: `translateY(${(1 - inP) * 120}px)` }}>
            <FrontPhone width={PW}>
              <OffthreadVideo src={staticFile('ep02/finder-mobile.mp4')} muted trimBefore={t.trim} style={{ width: PW - 22, display: 'block' }} />
            </FrontPhone>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5. The grand reveal: laptop and phone head-on, scrolling the whole site in sync ---------- */
const SCR_W = 904, SCR_H = 565; // 16:10, matches the desktop capture
const FrontLaptop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ padding: 18, paddingBottom: 26, borderRadius: '26px 26px 6px 6px', background: '#0c0c0e', boxShadow: '0 0 0 2px #2e2e33, inset 0 0 0 1px #1d1d21' }}>
      <div style={{ width: SCR_W, height: SCR_H, borderRadius: 6, overflow: 'hidden', position: 'relative', background: '#000' }}>{children}</div>
    </div>
    {/* the deck, seen from the front: a thin aluminium lip with a thumb notch */}
    <div style={{ position: 'relative', width: SCR_W + 140, height: 24, borderRadius: '3px 3px 22px 22px', background: 'linear-gradient(180deg, #d9dbe0 0%, #b9bbc1 45%, #8d9096 100%)' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 150, height: 9, marginLeft: -75, borderRadius: '0 0 10px 10px', background: '#9ea1a7' }} />
    </div>
  </div>
);
const FrontPhone: React.FC<{ children: React.ReactNode; width: number }> = ({ children, width }) => (
  <div style={{ width, padding: 11, borderRadius: 48, background: '#0b0a09', boxShadow: '0 0 0 2px #34312c, inset 0 0 0 2px #3a3631, 0 50px 90px -20px rgba(0,0,0,.85)' }}>
    <div style={{ borderRadius: 38, overflow: 'hidden', position: 'relative' }}>{children}</div>
  </div>
);
const Sheen: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const x = lerp(f, start, start + 26, -120, 220, inOut);
  if (f < start || f > start + 28) return null;
  return <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${x - 30}%, rgba(255,255,255,.16) ${x}%, transparent ${x + 30}%)`, pointerEvents: 'none' }} />;
};
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const end = scenes.reveal.dur;
  const bloom = lerp(f, 0, 30, 0, 1);
  const lapIn = lerp(f, 4, 30, 0, 1);
  const phoneIn = lerp(f, 14, 38, 0, 1);
  const push = lerp(f, 20, end, 1.02, 1.08, inOut); // slow push-in while it scrolls
  const PW = 310;
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fade(f, 0, 4, end - 6, end) }}>
      {/* warm light blooms in behind the devices */}
      <AbsoluteFill style={{ background: `radial-gradient(60% 34% at 50% 50%, rgba(255,140,60,${0.16 * bloom}), rgba(255,110,0,${0.05 * bloom}) 55%, transparent 80%)` }} />
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: '50% 48%' }}>
        {/* soft floor glow and shadow */}
        <div style={{ position: 'absolute', left: 90, right: 90, top: 1000, height: 90, borderRadius: '50%', background: 'rgba(0,0,0,.8)', filter: 'blur(40px)', opacity: lapIn }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', opacity: lapIn, transform: `translateY(${(1 - lapIn) * 120}px) scale(${0.94 + 0.06 * lapIn})` }}>
          <div style={{ position: 'relative' }}>
            <FrontLaptop>
              <OffthreadVideo src={staticFile('ep02/full-desktop.mp4')} muted style={{ width: SCR_W, height: SCR_H, objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
              <Sheen f={f} start={34} />
            </FrontLaptop>
          </div>
        </div>
        {/* the phone stands in front, centred on the laptop's deck */}
        <div style={{ position: 'absolute', left: 540 - PW / 2, top: 945, opacity: phoneIn, transform: `translateY(${(1 - phoneIn) * 160}px)` }}>
          <FrontPhone width={PW}>
            <OffthreadVideo src={staticFile('ep02/full-mobile.mp4')} muted style={{ width: PW - 22, display: 'block' }} />
            <Sheen f={f} start={40} />
          </FrontPhone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 6. Outro ---------- */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ opacity: show(f, 0, 12), transform: `scale(${interpolate(f, [0, 30], [0.94, 1], { extrapolateRight: 'clamp', easing: out })})` }}>
        <Img src={staticFile('catalyze-logo-orange-cream.svg')} style={{ width: 640 }} />
      </div>
      <div style={{ fontFamily: serif, fontSize: 120, color: C.orange, marginTop: 70, opacity: show(f, 12), transform: `translateY(${rise(f, 12, 30)}px)` }}>Who's next?</div>
      <div style={{ position: 'absolute', bottom: 430, fontFamily: sans, fontSize: 24, color: C.muted, opacity: show(f, 16) }}>Unofficial concept by CATALYZE · @catalyze.uk</div>
    </AbsoluteFill>
  );
};

/* ---------- Captions: minimal, one line at a time, inside the 9:16 safe zone ---------- */
const Caption: React.FC<{ c: Cap }> = ({ c }) => {
  const f = useCurrentFrame();
  const o = fade(f, c.from, c.from + 4, c.to - 4, c.to);
  if (f < c.from || f > c.to) return null;
  const words = c.text.split(' ');
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0 150px 0 96px', top: c.top ? 300 : 1400 }}>
      <div style={{ opacity: o, transform: `translateY(${interpolate(o, [0, 1], [8, 0])}px)`, fontFamily: sans, fontWeight: 600, fontSize: 64, lineHeight: 1.1, color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.45)' }}>
        {words.map((w, i) => <span key={i} style={{ color: w === c.hl ? C.orange : '#fff' }}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
      </div>
    </AbsoluteFill>
  );
};

export const Ep02: React.FC<{ withCaptions: boolean }> = ({ withCaptions }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence from={scenes.hook.from} durationInFrames={scenes.hook.dur}><Hook /></Sequence>
    <Sequence from={scenes.business.from} durationInFrames={scenes.business.dur}><Business /></Sequence>
    <Sequence from={scenes.build.from} durationInFrames={scenes.build.dur}><Build /></Sequence>
    <Sequence from={scenes.feature.from} durationInFrames={scenes.feature.dur}><Feature /></Sequence>
    <Sequence from={scenes.reveal.from} durationInFrames={scenes.reveal.dur}><Reveal /></Sequence>
    <Sequence from={scenes.outro.from} durationInFrames={scenes.outro.dur}><Outro /></Sequence>
    {withCaptions && captions.map((c, i) => <Caption key={i} c={c} />)}
  </AbsoluteFill>
);

/* ---------- Cover (key text kept inside the centre 1080x1350 that the Instagram grid shows) ---------- */
export const Ep02Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, alignItems: 'center' }}>
    <div style={{ position: 'absolute', top: 330, width: '100%', padding: '0 90px' }}>
      <Label>{place.street}, {place.area}</Label>
      <div style={{ fontFamily: '${display}', fontWeight: 600, fontSize: 118, color: C.cream, letterSpacing: '0.02em', marginTop: 16, lineHeight: 1, textTransform: 'uppercase' }}>The Salon<br />Sanctuary<span style={{ color: C.orange }}>.</span></div>
      <div style={{ fontFamily: serif, fontSize: 64, color: C.cream, marginTop: 22 }}>A website they <span style={{ color: C.orange }}>didn't ask for.</span></div>
    </div>
    <div style={{ position: 'absolute', top: 900 }}>
      <Browser width={980}><Img src={staticFile('ep02/draft-v3.jpg')} style={{ width: 980, display: 'block' }} /></Browser>
    </div>
    <Img src={staticFile('catalyze-logo-orange-cream.svg')} style={{ position: 'absolute', top: 1560, width: 250 }} />
  </AbsoluteFill>
);
