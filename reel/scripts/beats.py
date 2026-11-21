#!/usr/bin/env python3
"""Snap the scene cuts in src/cuts.json to the beats of public/music.mp3.

Without music.mp3 it restores the even ~0.3 s grid and turns audio off.
Onsets come from a spectral-flux envelope (numpy only); each cut moves to the
nearest onset within +/-3 frames, keeping every scene at least 4 frames long.
"""
import json, os, subprocess, sys
import numpy as np

FPS = 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CUTS = os.path.join(ROOT, 'src', 'cuts.json')
MUSIC = os.path.join(ROOT, 'public', 'music.mp3')
GRID = [0, 10, 19, 28, 38, 46, 56, 66, 76, 86, 98, 106, 114, 122, 129, 136, 143, 150, 157,
        163, 169, 175, 181, 187, 193, 199, 205]
END = 255


def onsets(path, sr=22050):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr),
                          '-f', 'f32le', '-'], check=True, capture_output=True).stdout
    x = np.frombuffer(pcm, dtype=np.float32)
    hop, win = 512, 2048
    frames = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    mag = np.log1p(np.abs(np.fft.rfft(frames, axis=1)))
    flux = np.maximum(0, np.diff(mag, axis=0)).sum(axis=1)
    flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    t = (np.arange(len(flux)) + 1) * hop / sr
    peaks = [i for i in range(1, len(flux) - 1)
             if flux[i] > 1.0 and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
    return np.array([t[i] * FPS for i in peaks])


def main():
    if not os.path.exists(MUSIC):
        json.dump({'music': False, 'cuts': GRID, 'end': END}, open(CUTS, 'w'), indent=2)
        print('No public/music.mp3: kept the even grid, audio off.')
        return
    beats = onsets(MUSIC)
    cuts = [0]
    for c in GRID[1:]:
        near = beats[np.abs(beats - c) <= 3]
        best = int(round(near[np.argmin(np.abs(near - c))])) if len(near) else c
        cuts.append(max(best, cuts[-1] + 4))
    if END - cuts[-1] < 30:
        sys.exit('Snapping left the end card under 1 s; check the track.')
    json.dump({'music': True, 'cuts': cuts, 'end': END}, open(CUTS, 'w'), indent=2)
    moved = sum(a != b for a, b in zip(cuts, GRID))
    print(f'Found {len(beats)} onsets; snapped {moved} of {len(GRID)} cuts. Audio on.')


if __name__ == '__main__':
    main()
