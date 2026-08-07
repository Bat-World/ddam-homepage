"""Trace the logo PNG's alpha channel to clean, normalized SVG paths."""
import re, subprocess, sys
from PIL import Image

SRC = '/Users/user/Downloads/Company logo/logo-white.png'
TARGET_H = 900.0          # normalized viewBox height


def tokenize(d):
    return re.findall(r'[MmLlCcVvHhZz]|-?\d*\.?\d+', d)


def parse(d):
    """potrace emits M/l/c/v/z (mostly relative). Return absolute subpaths."""
    t = tokenize(d)
    i = 0
    cur = (0.0, 0.0)
    start = (0.0, 0.0)
    subs, seg = [], []
    cmd = None
    while i < len(t):
        if re.match(r'[A-Za-z]', t[i]):
            cmd = t[i]; i += 1
            if cmd in 'Zz':
                if seg: subs.append(seg); seg = []
                cur = start
                continue
        rel = cmd.islower()
        if cmd in 'Mm':
            x, y = float(t[i]), float(t[i+1]); i += 2
            if rel: x, y = cur[0]+x, cur[1]+y
            if seg: subs.append(seg); seg = []
            cur = start = (x, y)
            seg.append(('M', [(x, y)]))
            cmd = 'l' if rel else 'L'          # implicit lineto after moveto
        elif cmd in 'Ll':
            x, y = float(t[i]), float(t[i+1]); i += 2
            if rel: x, y = cur[0]+x, cur[1]+y
            seg.append(('L', [(x, y)])); cur = (x, y)
        elif cmd in 'Hh':
            x = float(t[i]); i += 1
            if rel: x = cur[0]+x
            seg.append(('L', [(x, cur[1])])); cur = (x, cur[1])
        elif cmd in 'Vv':
            y = float(t[i]); i += 1
            if rel: y = cur[1]+y
            seg.append(('L', [(cur[0], y)])); cur = (cur[0], y)
        elif cmd in 'Cc':
            pts = []
            for k in range(3):
                x, y = float(t[i]), float(t[i+1]); i += 2
                if rel: x, y = cur[0]+x, cur[1]+y
                pts.append((x, y))
            seg.append(('C', pts)); cur = pts[-1]
        else:
            raise ValueError('unhandled command ' + cmd)
    if seg: subs.append(seg)
    return subs


def run(upscale, alphamax, opttol, blur=0.0):
    im = Image.open(SRC).convert('RGBA')
    a = im.getchannel('A')
    a = a.crop(a.getbbox())
    big = a.resize((a.width*upscale, a.height*upscale), Image.LANCZOS)
    # The source is small and aliased; upscaling preserves the stair-stepping,
    # which potrace then traces node-for-node. Blurring before the 50% threshold
    # removes the steps without moving straight edges.
    if blur:
        from PIL import ImageFilter
        big = big.filter(ImageFilter.GaussianBlur(blur*upscale))
    # potrace treats BLACK as foreground, so opaque alpha must become black.
    big.point(lambda v: 0 if v >= 128 else 255).convert('1').save('mark.pbm')
    subprocess.run(['potrace', 'mark.pbm', '-s', '-o', 'traced.svg',
                    '--alphamax', str(alphamax), '--opttolerance', str(opttol),
                    '-t', str(upscale*upscale)], check=True)

    svg = open('traced.svg').read()
    H = float(re.search(r'height="([\d.]+)pt"', svg).group(1))
    # potrace emits one <path> per filled region — collect them all.
    subs = []
    for d in re.findall(r'\sd="([^"]+)"', svg):
        subs.extend(parse(d))
    subs = [[(c, [(x*0.1, H - y*0.1) for (x, y) in pts]) for c, pts in seg]
            for seg in subs]

    xs = [p[0] for s in subs for _, pts in s for p in pts]
    ys = [p[1] for s in subs for _, pts in s for p in pts]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    k = TARGET_H / (y1 - y0)
    W = round((x1 - x0) * k, 1)

    def fmt(v):
        # Integer precision: at the sizes this mark renders, one viewBox unit
        # is a quarter of a pixel. Decimals just bloat the critical-path HTML.
        return str(round(v))

    out = []
    for seg in subs:
        parts = []
        for c, pts in seg:
            xy = ' '.join(f'{fmt((x-x0)*k)} {fmt((y-y0)*k)}' for x, y in pts)
            parts.append(f'{c}{xy}')
        out.append(''.join(parts) + 'Z')
    return out, W, TARGET_H


if __name__ == '__main__':
    up, am, ot = int(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3])
    paths, W, H = run(up, am, ot)
    total = sum(len(p) for p in paths)
    print(f'up={up} alphamax={am} opttol={ot} -> {len(paths)} paths, '
          f'{total} chars, viewBox 0 0 {W} {H}')
    open('paths.txt', 'w').write('\n'.join(paths))
    open('preview.svg', 'w').write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W*0.6:.0f}" height="{H*0.6:.0f}">'
        f'<rect width="{W}" height="{H}" fill="#262421"/>'
        + ''.join(f'<path fill="#fff" d="{p}"/>' for p in paths) + '</svg>')
