"""Inline the built site into one HTML file for a private preview page.
Run after `npm run build`: python3 scripts/single-file.py"""
import base64, re, pathlib
dist = pathlib.Path('dist'); s = (dist / 'index.html').read_text()
def b64(p, mime): return f"data:{mime};base64," + base64.b64encode((dist / p.lstrip('/')).read_bytes()).decode()
def css_inline(m):
    css = (dist / m.group(1).lstrip('/')).read_text()
    css = re.sub(r'@font-face\{[^}]*?(latin-ext|vietnamese|cyrillic|greek)[^}]*\}', '', css)  # keep latin only
    css = re.sub(r'url\((/_astro/[^)]+\.woff2)\)', lambda f: f"url({b64(f.group(1), 'font/woff2')})", css)
    css = re.sub(r',\s*url\(/_astro/[^)]+\.woff\)\s*format\("woff"\)', '', css)
    return f"<style>{css}</style>"
s = re.sub(r'<link rel="stylesheet" href="([^"]+\.css)"\s*/?>', css_inline, s)
s = re.sub(r'<script type="module" src="([^"]+)"></script>', lambda m: f'<script type="module">{(dist / m.group(1).lstrip("/")).read_text()}</script>', s)
s = re.sub(r'<link rel="icon"[^>]*>', '', s)
s = re.sub(r'src="(/images/[^"]+\.webp)"', lambda m: f'src="{b64(m.group(1), "image/webp")}"', s)
for t in [r'<!DOCTYPE html>', r'<!doctype html>', r'</?head>', r'</?body>', r'</html>']: s = re.sub(t, '', s, flags=re.I)
s = re.sub(r'<html[^>]*>', '', s)
# the preview frame has no data-mode attribute on its own root; set it from the inline script (already does) and start in day
title = re.search(r'<title>.*?</title>', s).group(0); s = title + s.replace(title, '', 1)
out = pathlib.Path('preview/social-114-preview.html'); out.parent.mkdir(exist_ok=True); out.write_text(s)
print(out, len(s) // 1024, 'KB')
