#!/usr/bin/env python3
"""Check the rendered reel frame by frame at every cut.

For the last frame before and the first frame after each cut it checks that:
  1. the frame is not blank (a flat single colour) and the video has the right length;
  2. the logo is where it should be: the edges inside the fixed logo box are matched
     against the end card's logo, searching +/-4 px. Any best-match offset over 1 px fails.
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO = os.path.join(ROOT, 'out', 'catalyze-reel.mp4')
W, H = 1080, 1920
LW, LH = 756, 287
LX, LY = (W - LW) // 2, (H - LH) // 2

cfg = json.load(open(os.path.join(ROOT, 'src', 'cuts.json')))
cuts, end = cfg['cuts'], cfg['end']

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', VIDEO, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                     check=True, capture_output=True).stdout
n = len(raw) // (W * H)
video = np.frombuffer(raw, dtype=np.uint8)[: n * W * H].reshape(n, H, W).astype(np.float32)
problems = []
if n != end:
    problems.append(f'video has {n} frames, expected {end}')

# Reference: the logo on the end card's flat background.
ref = video[end - 1, LY - 10:LY + LH + 10, LX - 10:LX + LW + 10]


def edges(img):
    gx = np.abs(np.diff(img, axis=1))[:-1, :]
    gy = np.abs(np.diff(img, axis=0))[:, :-1]
    return gx + gy


def score_offset(img, ref_e):
    """Best (dx, dy) in [-4, 4] aligning img edges to the reference edges."""
    best = (-1, 0, 0)
    e = edges(img)
    e = e / (e.max() + 1e-6)
    for dy in range(-4, 5):
        for dx in range(-4, 5):
            a = e[10 + dy:-10 + dy or None, 10 + dx:-10 + dx or None]
            b = ref_e[10:-10, 10:-10]
            s = float((a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-6))
            if s > best[0]:
                best = (s, dx, dy)
    return best


ref_e = edges(ref)
ref_e = ref_e / (ref_e.max() + 1e-6)
report = []
for i, c in enumerate(cuts):
    for f in sorted({max(0, c - 1), c}):
        if f >= n:
            continue
        frame = video[f]
        if frame.std() < 2:
            problems.append(f'frame {f} looks blank (std {frame.std():.2f})')
        box = frame[LY - 10:LY + LH + 10, LX - 10:LX + LW + 10]
        s, dx, dy = score_offset(box, ref_e)
        report.append((f, s, dx, dy))
        if s < 0.2:
            problems.append(f'frame {f}: logo not found in its box (match {s:.2f})')
        elif abs(dx) > 1 or abs(dy) > 1:
            problems.append(f'frame {f}: logo offset by ({dx}, {dy}) px')

for f, s, dx, dy in report:
    print(f'frame {f:3d}  match {s:.2f}  offset ({dx:+d}, {dy:+d})')
print(f'\nChecked {len(report)} frames at {len(cuts)} cuts.')
if problems:
    print('PROBLEMS:\n  ' + '\n  '.join(problems))
    sys.exit(1)
print('OK: logo locked in place across every cut; no blank or broken frames.')
