"""Cut the hero dishes out of their (baked-in) checkerboard backgrounds.
PLACEHOLDER images supplied by the owner for the private comp only; replace with
Catalyze's own photography before any video, pitch or publishing.
Usage: python3 scripts/cutout.py <cup.jpg> <pizza.jpg>"""
import sys, numpy as np
from PIL import Image, ImageFilter, ImageEnhance

def hsv_parts(a):
    rgb = a[..., :3].astype(np.float32) / 255
    mx, mn = rgb.max(-1), rgb.min(-1)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) * 255
    return sat, lum

def circle_fit(mask):
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = np.percentile(xs, .3), np.percentile(xs, 99.7), np.percentile(ys, .3), np.percentile(ys, 99.7)
    return (x0 + x1) / 2, (y0 + y1) / 2, ((x1 - x0) + (y1 - y0)) / 4

def finish(img, alpha, out, size, grade):
    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    im = img.convert('RGB')
    for enh, f in grade: im = enh(im).enhance(f)
    im = im.convert('RGBA'); im.putalpha(a)
    bb = a.getbbox(); im = im.crop(bb)
    side = max(im.size); canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    canvas = canvas.resize((size, size), Image.LANCZOS)
    canvas.save(out + '.webp', 'WEBP', quality=88, method=6); canvas.save(out + '.png')
    print(out, canvas.size)

cup_src, pizza_src = sys.argv[1], sys.argv[2]
H, W = 768, 1408
yy, xx = np.mgrid[0:H, 0:W]

# pizza: saturated, bright pie on a dark grey checker -> fit the circle
p = Image.open(pizza_src); pa = np.asarray(p.convert('RGB'))
sat, lum = hsv_parts(pa)
cx, cy, r = circle_fit((sat > .28) & (lum > 60))
d = np.hypot(xx - cx, yy - cy)
alpha = np.clip((r - 1.5 - d) / 2.0 + 1, 0, 1)
print('pizza circle', round(cx), round(cy), round(r))
finish(p, alpha, 'public/images/hero-pizza', 1100, [(ImageEnhance.Contrast, 1.06), (ImageEnhance.Color, 1.04)])

# cup: charcoal mug + coffee on a light checker -> dark or saturated pixels, plus the round body
c = Image.open(cup_src); ca = np.asarray(c.convert('RGB'))
sat, lum = hsv_parts(ca)
fg = (lum < 150) | (sat > .2)
body = fg & (np.hypot(xx - 690, yy - 380) < 300)
cx, cy, r = circle_fit(body & (np.hypot(xx - 690, yy - 380) < 280))
inside = np.hypot(xx - cx, yy - cy) < r - 4
def grow(seed, allowed, steps=400):
    # region growing (no scipy): dilate within the allowed mask until it stops changing
    reg = seed & allowed
    for _ in range(steps):
        g = reg.copy()
        g[1:] |= reg[:-1]; g[:-1] |= reg[1:]; g[:, 1:] |= reg[:, :-1]; g[:, :-1] |= reg[:, 1:]
        g &= allowed
        if (g == reg).all(): break
        reg = g
    return reg
dark = lum < 95
ring = np.hypot(xx - cx, yy - cy) < r + 6
# seed on the handle: darkest pixel in the lower-right zone beyond the rim
zone = (xx > cx + r * .8) & (xx < cx + r * 1.5) & (yy > cy + r * .4) & (yy < cy + r * .95)
zl = np.where(zone, lum, 999); sy, sx = np.unravel_index(np.argmin(zl), zl.shape)
seed = np.zeros_like(dark); seed[sy, sx] = True
handle = grow(seed, dark | ring)
def shift_or(m, n):
    for _ in range(n):
        g = m.copy(); g[1:] |= m[:-1]; g[:-1] |= m[1:]; g[:, 1:] |= m[:, :-1]; g[:, :-1] |= m[:, 1:]; m = g
    return m
def shift_and(m, n):
    for _ in range(n):
        g = m.copy(); g[1:] &= m[:-1]; g[:-1] &= m[1:]; g[:, 1:] &= m[:, :-1]; g[:, :-1] &= m[:, 1:]; m = g
    return m
handle = shift_and(shift_or(handle, 9), 9)  # close the highlight gap on the handle
a0 = inside | handle | (ring & (lum < 140))
a1 = shift_and(shift_or(a0, 12), 12)      # close any gaps in the silhouette
alpha = a1.astype(np.float32)
# the source has checkerboard showing through the handle: fill it with the handle's own charcoal
holes = a1 & (np.hypot(xx - cx, yy - cy) > r - 2) & ((~a0) | (lum > 100))
print("handle px", int(handle.sum()), "holes", int(holes.sum()), "seed", sx, sy)
if holes.any():
    arr = ca.copy(); base = arr[handle & (lum < 80)].mean(0)
    arr[holes] = (base * 1.15).clip(0, 255).astype(np.uint8)
    c = Image.fromarray(arr)
    c = Image.composite(c.filter(ImageFilter.GaussianBlur(2)), c, Image.fromarray((shift_or(holes, 2) * 255).astype(np.uint8)))
print('cup circle', round(cx), round(cy), round(r))
finish(c, alpha, 'public/images/hero-cup', 1100, [(ImageEnhance.Contrast, 1.05), (ImageEnhance.Brightness, 1.02)])
