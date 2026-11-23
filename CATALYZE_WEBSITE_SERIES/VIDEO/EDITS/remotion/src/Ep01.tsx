import React from 'react';
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { captions, code, footage, hookLines, palette, place, scenes, type Cap } from './ep01';

// CATALYZE series look: near-black, cream, one orange accent used sparingly.
const C = { bg: '#12100e', cream: '#f1ebdd', muted: '#9a9286', orange: '#ff6e00', line: '#2b2622', day: '#f5f4f1', ink: '#17191e', navy: '#121722' };
const serif = '"Instrument Serif", Georgia, serif';
const fraunces = '"Fraunces Variable", Georgia, serif';
const sans = '"Hanken Grotesk", system-ui, sans-serif';
const mono = '"DM Mono", ui-monospace, monospace';
const out = Easing.bezier(0.16, 1, 0.3, 1);
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const whipEase = Easing.bezier(0.7, 0, 0.84, 0);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const lerp = (f: number, a: number, b: number, v0: number, v1: number, easing = out) => interpolate(f, [a, b], [v0, v1], { ...clamp, easing });
const fade = (f: number, a: number, b: number, c: number, d: number) => interpolate(f, [a, b, c, d], [0, 1, 1, 0], { ...clamp, easing: out });
const show = (f: number, start: number, dur = 18) => lerp(f, start, start + dur, 0, 1);
const rise = (f: number, start: number, dist = 40, dur = 22) => lerp(f, start, start + dur, dist, 0);

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 26, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, ...style }}>{children}</div>
);

// Every shot whips in from the right and out to the left, with a little motion blur.
const Shot: React.FC<{ dur: number; children: React.ReactNode; bg?: string; noIn?: boolean }> = ({ dur, children, bg = C.bg, noIn }) => {
  const f = useCurrentFrame();
  const inX = noIn ? 0 : lerp(f, 0, 9, 220, 0);
  const outX = interpolate(f, [dur - 8, dur], [0, -260], { ...clamp, easing: whipEase });
  const blur = (noIn ? 0 : lerp(f, 0, 9, 14, 0)) + interpolate(f, [dur - 8, dur], [0, 16], { ...clamp, easing: whipEase });
  return (
    <AbsoluteFill style={{ background: bg, transform: `translateX(${inX + outX}px)`, filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------- 1. The hook: the payoff first ---------- */
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const SW = 40; // the switch: cup to pizza, day to night
  const night = lerp(f, SW - 4, SW + 16, 0, 1, inOut);
  const wipe = lerp(f, SW - 6, SW + 14, 0, 150, inOut);
  const spin = f * 1.6 + lerp(f, SW - 10, SW + 18, 0, 220, inOut);
  const punch = lerp(f, 0, 14, 1.22, 1) * lerp(f, SW - 2, SW + 10, 1, 1.04) * (1 + f * 0.0009);
  const cupO = 1 - lerp(f, SW - 2, SW + 10, 0, 1, inOut);
  const blur = Math.max(0, 10 * Math.sin(Math.PI * Math.min(1, Math.max(0, (f - (SW - 10)) / 26))));
  const lineA = (i: number) => ({ transform: `translateY(${lerp(f, 2 + i * 4, 18 + i * 4, 120, 0) + lerp(f, SW - 6, SW + 2, 0, -150, whipEase)}%)` });
  const lineB = (i: number) => ({ transform: `translateY(${lerp(f, SW + 2 + i * 4, SW + 20 + i * 4, 120, 0)}%)` });
  const ink = night > 0.5 ? C.cream : C.ink;
  return (
    <AbsoluteFill style={{ background: C.day, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: C.navy, clipPath: `circle(${wipe}% at 50% 60%)` }} />
      {/* the dish, big enough to break the frame */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 330 }}>
        <div style={{ position: 'relative', width: 1280, height: 1280, transform: `scale(${punch})` }}>
          <div style={{ position: 'absolute', inset: '14% 12% 4% 14%', borderRadius: '50%', background: `rgba(0,0,0,${0.28 + 0.3 * night})`, filter: 'blur(50px)', transform: 'translateY(5%)' }} />
          <div style={{ position: 'absolute', inset: 0, transform: `rotate(${spin}deg)`, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined }}>
            <Img src={staticFile('ep01/hero-cup.webp')} style={{ position: 'absolute', inset: 0, width: '100%', opacity: cupO }} />
            <Img src={staticFile('ep01/hero-pizza.webp')} style={{ position: 'absolute', inset: 0, width: '100%', opacity: 1 - cupO }} />
          </div>
        </div>
      </AbsoluteFill>
      {/* the two lines */}
      <AbsoluteFill style={{ padding: '210px 84px 0', fontFamily: serif, fontSize: 132, lineHeight: 0.98, letterSpacing: '-0.02em' }}>
        {f < SW + 2 && hookLines.a.map((l, i) => (
          <div key={l} style={{ overflow: 'hidden', paddingBottom: 8 }}><div style={{ color: C.ink, ...lineA(i) }}>{l}</div></div>
        ))}
        {f >= SW && <div style={{ position: 'absolute', top: 210, left: 84 }}>{hookLines.b.map((l, i) => (
          <div key={l} style={{ overflow: 'hidden', paddingBottom: 8 }}><div style={{ color: i ? C.orange : C.cream, ...lineB(i) }}>{l}</div></div>
        ))}</div>}
      </AbsoluteFill>
      {/* location, pinned from the first second */}
      <AbsoluteFill style={{ justifyContent: 'flex-start', padding: '505px 84px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: show(f, 6, 10), transform: `translateY(${rise(f, 6, 30, 14)}px)` }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.orange }} />
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, letterSpacing: '0.02em', color: ink }}>Social 114 <span style={{ opacity: 0.55 }}>·</span> {place.area}</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- 2. The business ---------- */
const Shopfront: React.FC<{ f: number }> = ({ f }) => {
  const draw = (start: number, dur = 22) => interpolate(f, [start, start + dur], [1, 0], { ...clamp, easing: inOut });
  const ln = (start: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: draw(start) });
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const tones = ['', '', '', '', '#d4a53a', '#4d8a84', '#86a9c2', ''];
  const panes = [[40, 300, 12], [360, 120, 4], [500, 300, 12]].flatMap(([x0, w, n]) =>
    Array.from({ length: n * 2 }, (_, i) => ({ x: x0 + (i % n) * (w / n), y: 40 + Math.floor(i / n) * 20, w: w / n, t: tones[Math.floor(rnd() * tones.length)] })));
  const lit = show(f, 26, 20);
  return (
    <svg viewBox="0 0 840 430" width={980} fill="none" stroke={C.cream} strokeWidth={1.6} style={{ overflow: 'visible' }}>
      {panes.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={20} fill={p.t || 'none'} fillOpacity={p.t ? show(f, 14 + (i % 12), 10) * 0.8 : 0} strokeOpacity={0.6} {...ln(2 + (i % 12))} />)}
      <rect x={20} y={24} width={800} height={380} {...ln(0)} />
      <rect x={40} y={88} width={300} height={296} fill="#e9b86a" fillOpacity={lit * 0.2} {...ln(4)} />
      <rect x={500} y={88} width={300} height={296} fill="#e9b86a" fillOpacity={lit * 0.2} {...ln(6)} />
      <rect x={360} y={88} width={120} height={316} fill="#a3461e" fillOpacity={show(f, 16, 12) * 0.95} {...ln(8)} />
      <text x={190} y={214} textAnchor="middle" fill={C.cream} stroke="none" style={{ fontFamily: fraunces, fontSize: 44, opacity: show(f, 20) }}>Social 114.</text>
      <path d="M0 404 H840" {...ln(1)} />
    </svg>
  );
};
const Business: React.FC = () => {
  const f = useCurrentFrame();
  const cam = `perspective(2200px) rotateY(${lerp(f, 0, 60, 14, 4, inOut)}deg) rotateX(${lerp(f, 0, 60, 6, 2, inOut)}deg) scale(${lerp(f, 0, 60, 0.94, 1.04, inOut)})`;
  return (
    <Shot dur={scenes.business.dur}>
      {footage.storefront ? (
        <OffthreadVideo src={staticFile(footage.storefront)} muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(f, 0, 60, 1, 1.08, inOut)})` }} />
      ) : (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 120 }}><div style={{ transform: cam }}><Shopfront f={f} /></div></AbsoluteFill>
      )}
      <AbsoluteFill style={{ padding: '200px 84px', justifyContent: 'flex-start' }}>
        <Label style={{ opacity: show(f, 4) }}>{place.street}</Label>
        <div style={{ overflow: 'hidden', marginTop: 14 }}>
          <div style={{ fontFamily: fraunces, fontWeight: 420, fontSize: 150, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.05, transform: `translateY(${rise(f, 4, 110, 20)}%)` }}>
            Social 114<span style={{ color: C.orange }}>.</span>
          </div>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* ---------- 3. The build ---------- */
const Browser: React.FC<{ children: React.ReactNode; width: number; url?: string }> = ({ children, width, url = 'social-114 concept' }) => (
  <div style={{ width, borderRadius: 18, overflow: 'hidden', background: '#1c1a18', boxShadow: '0 50px 100px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08)' }}>
    <div style={{ height: 50, display: 'flex', alignItems: 'center', gap: 11, padding: '0 20px' }}>
      {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: '#3a3632' }} />)}
      <div style={{ marginLeft: 16, flex: 1, height: 28, borderRadius: 6, background: '#2a2724', color: C.muted, fontFamily: sans, fontSize: 16, display: 'flex', alignItems: 'center', paddingLeft: 14 }}>{url}</div>
    </div>
    {children}
  </div>
);
const CodeCard: React.FC<{ f: number }> = ({ f }) => {
  const chars = Math.floor(interpolate(f, [0, 38], [0, code.length], clamp));
  const kw = /\b(function|const|return)\b/g;
  return (
    <div style={{ background: '#16140f', borderRadius: 20, padding: '40px 44px', width: 940, boxShadow: '0 60px 120px -30px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.07)' }}>
      <div style={{ fontFamily: mono, fontSize: 20, color: C.muted, marginBottom: 22 }}>src/scripts/main.ts</div>
      <pre style={{ margin: 0, fontFamily: mono, fontSize: 25, lineHeight: 1.55, color: C.cream, whiteSpace: 'pre-wrap', minHeight: 560 }}>
        {code.slice(0, chars).split(kw).map((part, i) => (/^(function|const|return)$/.test(part) ? <span key={i} style={{ color: C.orange }}>{part}</span> : <span key={i}>{part}</span>))}
        <span style={{ display: 'inline-block', width: 13, height: 28, background: C.orange, verticalAlign: -5, opacity: Math.floor(f / 7) % 2 ? 0.25 : 1 }} />
      </pre>
    </div>
  );
};
const Build: React.FC = () => {
  const f = useCurrentFrame();
  const D0 = 40, PER = 12, P0 = D0 + PER * 5; // drafts from 40, palette from 100
  const draft = Math.min(5, Math.max(1, Math.floor((f - D0) / PER) + 1));
  const label = f < D0 ? 'Building the hero' : f < P0 ? `Draft 0${draft} of 05` : 'Colours from the room';
  return (
    <Shot dur={scenes.build.dur}>
      <AbsoluteFill style={{ padding: '200px 84px 0' }}>
        <Label key={label} style={{ opacity: show(f, f < D0 ? 2 : f < P0 ? D0 : P0, 8) }}>{label}</Label>
        {f >= D0 && f < P0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            {[1, 2, 3, 4, 5].map((v) => <div key={v} style={{ width: 58, height: 3, background: v <= draft ? C.orange : C.line }} />)}
          </div>
        )}
      </AbsoluteFill>
      {f < D0 + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 80, opacity: 1 - lerp(f, D0 - 2, D0 + 6, 0, 1) }}>
          <div style={{ transform: `perspective(2000px) rotateY(${lerp(f, 0, D0, -18, -6, inOut)}deg) rotateX(${lerp(f, 0, D0, 12, 4, inOut)}deg) scale(${lerp(f, 0, D0, 0.92, 1, inOut)})` }}>
            <CodeCard f={f} />
          </div>
        </AbsoluteFill>
      )}
      {f >= D0 - 2 && f < P0 + 6 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 80, perspective: 2400, opacity: 1 - lerp(f, P0 - 2, P0 + 6, 0, 1) }}>
          {[1, 2, 3, 4, 5].map((v) => {
            const t0 = D0 + (v - 1) * PER;
            if (f < t0 - 2) return null;
            const age = draft - v; // 0 = the newest card
            const x = lerp(f, t0 - 2, t0 + 8, 900, 0) - age * 40;
            const ry = lerp(f, t0 - 2, t0 + 8, -38, -10);
            return (
              <div key={v} style={{ position: 'absolute', transform: `translateX(${x}px) translateY(${-age * 34}px) translateZ(${-age * 120}px) rotateY(${ry}deg)`, opacity: age > 2 ? 0 : 1 - age * 0.28, filter: age ? `brightness(${1 - age * 0.25})` : undefined }}>
                <Browser width={940}><Img src={staticFile(`ep01/draft-v${v}.jpg`)} style={{ width: 940, display: 'block' }} /></Browser>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
      {f >= P0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 280px)', gap: 26, transform: `scale(${lerp(f, P0, scenes.build.dur, 0.96, 1.03, inOut)})` }}>
            {palette.map((c, i) => {
              const s = P0 + i * 3;
              return (
                <div key={i} style={{ opacity: show(f, s, 8), transform: `translateY(${lerp(f, s, s + 14, -260, 0)}px) rotate(${lerp(f, s, s + 16, i % 2 ? 7 : -7, 0)}deg)` }}>
                  <div style={{ height: 250, borderRadius: 16, background: c.hex, boxShadow: '0 30px 60px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.08)' }} />
                  <div style={{ fontFamily: sans, fontSize: 24, color: C.cream, marginTop: 14 }}>{c.name}</div>
                  <div style={{ fontFamily: mono, fontSize: 20, color: C.muted, marginTop: 4 }}>{c.hex}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}
    </Shot>
  );
};

/* ---------- 4. The laptop: the site fills the frame, then the camera pulls back and swings right ---------- */
const LW = 1000, LH = 640, SCR_W = 948, SCR_H = 593; // lid and screen (16:10)
const Laptop: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: 'relative', width: LW, height: LH, transformStyle: 'preserve-3d' }}>
    <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transformOrigin: 'bottom center', transform: 'rotateX(-12deg)' }}>
    {/* lid back + edge for thickness */}
    <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: '#8e9096', transform: 'translateZ(-10px)' }} />
    <div style={{ position: 'absolute', top: 14, bottom: 0, right: -5, width: 10, background: 'linear-gradient(#b5b7bc, #7d8086)', transform: 'rotateY(90deg)', transformOrigin: 'left' }} />
    {/* lid front: bezel and screen */}
    <div style={{ position: 'absolute', inset: 0, borderRadius: 26, background: '#0c0c0e', boxShadow: 'inset 0 0 0 2px #2b2b2f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: SCR_W, height: SCR_H, borderRadius: 8, overflow: 'hidden', background: '#000', position: 'relative' }}>
        {children}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 38%)' }} />
      </div>
    </div>
    </div>
    {/* base: lies flat, toward the viewer from the hinge */}
    <div style={{ position: 'absolute', left: -30, top: LH - 2, width: LW + 60, height: 640, transformOrigin: 'top center', transform: 'rotateX(90deg)', transformStyle: 'preserve-3d' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '6px 6px 34px 34px', background: 'linear-gradient(180deg, #c4c6cb 0%, #a9abb1 100%)' }}>
        <div style={{ position: 'absolute', left: 90, right: 90, top: 50, height: 330, borderRadius: 14, background: '#2a2b2f', display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: 7, padding: 12 }}>
          {Array.from({ length: 84 }, (_, i) => <div key={i} style={{ background: '#17181b', borderRadius: 5 }} />)}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: 410, width: 420, height: 200, marginLeft: -210, borderRadius: 16, background: '#b6b8bd', boxShadow: 'inset 0 0 0 1.5px #9d9fa5' }} />
      </div>
      {/* front edge */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: -18, height: 18, borderRadius: '0 0 20px 20px', background: '#7f8187', transformOrigin: 'top', transform: 'rotateX(-90deg)' }} />
    </div>
  </div>
);
const LaptopShot: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerp(f, 8, 70, 0, 1, inOut); // the camera move
  const night = lerp(f, 40, 80, 0, 1);
  const cam = `translateY(${-40 - 120 * t}px) scale(${1.9 - 1.0 * t}) rotateX(${-24 * t}deg) rotateY(${-32 * t}deg) rotateZ(${1.5 * t}deg)`;
  const drift = `rotateY(${lerp(f, 70, scenes.laptop.dur, 0, -5, inOut)}deg)`;
  return (
    <Shot dur={scenes.laptop.dur}>
      <AbsoluteFill style={{ background: `radial-gradient(80% 50% at 50% 62%, rgba(255,110,0,${0.08 * night}), transparent)` }} />
      {/* floor shadow appears as the laptop is revealed */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 560 }}>
        <div style={{ width: 1000, height: 220, borderRadius: '50%', background: 'rgba(0,0,0,.7)', filter: 'blur(60px)', opacity: t, transform: `scaleX(${0.7 + 0.3 * t})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', perspective: 2600, perspectiveOrigin: '50% 40%', top: 60 }}>
        <div style={{ transformStyle: 'preserve-3d', transform: `${cam} ${drift}` }}>
          <Laptop>
            <OffthreadVideo src={staticFile('ep01/hero-desktop.mp4')} muted playbackRate={1.3} style={{ width: SCR_W, height: SCR_H, objectFit: 'cover', display: 'block' }} />
          </Laptop>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* ---------- 5. The phone ---------- */
const Phone: React.FC<{ children: React.ReactNode; width: number }> = ({ children, width }) => (
  <div style={{ width, padding: 16, borderRadius: 74, background: '#0b0a09', boxShadow: '0 0 0 2px #2c2925, inset 0 0 0 2px #3a3631' }}>
    <div style={{ borderRadius: 60, overflow: 'hidden', position: 'relative' }}>{children}</div>
  </div>
);
const PhoneShot: React.FC = () => {
  const f = useCurrentFrame();
  const t = lerp(f, 0, 40, 0, 1);
  return (
    <Shot dur={scenes.phone.dur}>
      <AbsoluteFill style={{ background: 'radial-gradient(70% 45% at 50% 60%, rgba(255,110,0,.06), transparent)' }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', top: 1040 }}>
        <div style={{ width: 520, height: 120, borderRadius: '50%', background: 'rgba(0,0,0,.75)', filter: 'blur(40px)' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', perspective: 2200, top: 40 }}>
        <div style={{ transform: `translateY(${(1 - t) * 300}px) rotateY(${lerp(f, 0, 90, 26, 4, inOut)}deg) rotateX(${lerp(f, 0, 90, 10, 2, inOut)}deg) rotateZ(${lerp(f, 0, 90, -5, 0, inOut)}deg)` }}>
          <Phone width={560}>
            <OffthreadVideo src={staticFile('ep01/hero-mobile.mp4')} muted playbackRate={1.9} style={{ width: 528, display: 'block' }} />
          </Phone>
        </div>
      </AbsoluteFill>
    </Shot>
  );
};

/* ---------- 6. Outro ---------- */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Shot dur={scenes.outro.dur + 8}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ opacity: show(f, 0, 10), transform: `scale(${lerp(f, 0, 26, 1.15, 1)})` }}>
          <Img src={staticFile('catalyze-logo-orange-cream.svg')} style={{ width: 640 }} />
        </div>
        <Label style={{ marginTop: 46, color: C.cream, opacity: show(f, 6) }}>Liverpool × Wirral</Label>
        <div style={{ overflow: 'hidden', marginTop: 56 }}>
          <div style={{ fontFamily: serif, fontSize: 124, color: C.orange, transform: `translateY(${rise(f, 10, 110, 18)}%)` }}>Who's next?</div>
        </div>
        <div style={{ position: 'absolute', bottom: 430, fontFamily: sans, fontSize: 24, color: C.muted, opacity: show(f, 14) }}>Unofficial concept by CATALYZE · @catalyze.uk</div>
      </AbsoluteFill>
    </Shot>
  );
};

/* ---------- Captions: minimal, one line at a time, inside the 9:16 safe zone ---------- */
const Caption: React.FC<{ c: Cap }> = ({ c }) => {
  const f = useCurrentFrame();
  if (f < c.from || f > c.to) return null;
  const o = fade(f, c.from, c.from + 4, c.to - 4, c.to);
  const words = c.text.split(' ');
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start', alignItems: 'flex-start', padding: '0 150px 0 84px', top: c.top ? 330 : 1430 }}>
      <div style={{ opacity: o, transform: `translateY(${interpolate(o, [0, 1], [8, 0])}px)`, fontFamily: sans, fontWeight: 600, fontSize: 64, lineHeight: 1.1, color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.45)' }}>
        {words.map((w, i) => <span key={i} style={{ color: w === c.hl ? C.orange : '#fff' }}>{w}{i < words.length - 1 ? ' ' : ''}</span>)}
      </div>
    </AbsoluteFill>
  );
};

export const Ep01: React.FC<{ withCaptions: boolean }> = ({ withCaptions }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Sequence from={scenes.hook.from} durationInFrames={scenes.hook.dur}><Shot dur={scenes.hook.dur} bg={C.day} noIn><Hook /></Shot></Sequence>
    <Sequence from={scenes.business.from} durationInFrames={scenes.business.dur}><Business /></Sequence>
    <Sequence from={scenes.build.from} durationInFrames={scenes.build.dur}><Build /></Sequence>
    <Sequence from={scenes.laptop.from} durationInFrames={scenes.laptop.dur}><LaptopShot /></Sequence>
    <Sequence from={scenes.phone.from} durationInFrames={scenes.phone.dur}><PhoneShot /></Sequence>
    <Sequence from={scenes.outro.from} durationInFrames={scenes.outro.dur}><Outro /></Sequence>
    {withCaptions && captions.map((c, i) => <Caption key={i} c={c} />)}
  </AbsoluteFill>
);

/* ---------- Cover (key text kept inside the centre 1080x1350 that the Instagram grid shows) ---------- */
export const Ep01Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, alignItems: 'center' }}>
    <div style={{ position: 'absolute', top: 330, width: '100%', padding: '0 90px' }}>
      <Label>{place.area}</Label>
      <div style={{ fontFamily: fraunces, fontWeight: 420, fontSize: 150, color: C.cream, letterSpacing: '-0.03em', marginTop: 16, lineHeight: 1 }}>Social 114<span style={{ color: C.orange }}>.</span></div>
      <div style={{ fontFamily: serif, fontSize: 64, color: C.cream, marginTop: 22 }}>A website they <span style={{ color: C.orange }}>didn't ask for.</span></div>
    </div>
    <div style={{ position: 'absolute', top: 860 }}>
      <Browser width={980}><Img src={staticFile('ep01/cover-site.jpg')} style={{ width: 980, display: 'block' }} /></Browser>
    </div>
    <Img src={staticFile('catalyze-logo-orange-cream.svg')} style={{ position: 'absolute', top: 1560, width: 250 }} />
  </AbsoluteFill>
);
