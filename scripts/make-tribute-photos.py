"""Builds the tribute photos in public/products/<slug>/ from the mockups in exports/iaf-frames/:
tight frame shots, lit versions (room dark, warm LEDs inside the frame only), the
4:5 homepage tiles, and the Newspaper Tribute sample (drawn here; no photo exists yet).

Run from the project root:  python3 scripts/make-tribute-photos.py
Needs Pillow, numpy and scipy, and macOS fonts (Times New Roman, Didot) for the newspaper.
When real photos arrive, swap the source files and crop boxes below, and give changed files
new names so the Next image cache does not serve the old ones."""
import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

E = "exports/iaf-frames/"
OUT = "public/products/"
SUP = "/System/Library/Fonts/Supplemental/"


def save(im, path, q=86):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.convert("RGB").save(path, quality=q, optimize=True, progressive=True)
    print(path, im.size, os.path.getsize(path) // 1024, "KB")


def interior_mask(size, shape, box, feather):
    """White inside the lit area (rect or ellipse), feathered."""
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    (d.ellipse if shape == "ellipse" else d.rectangle)(box, fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather)) if feather else m


def edge_distance(size, shape, box):
    """Distance (px) from each point inside the area to its edge."""
    w, h = size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x0, y0, x1, y1 = box
    if shape == "ellipse":
        cx, cy, rx, ry = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2
        r = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
        return np.clip((1 - r) * min(rx, ry), 0, None)
    return np.clip(np.minimum.reduce([xx - x0, x1 - xx, yy - y0, y1 - yy]), 0, None)


def led_points(shape, box, inset, spacing):
    x0, y0, x1, y1 = box
    pts = []
    if shape == "ellipse":
        cx, cy, rx, ry = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 - inset, (y1 - y0) / 2 - inset
        n = int(2 * math.pi * (rx + ry) / 2 / spacing)
        for i in range(n):
            a = 2 * math.pi * i / n
            pts.append((cx + rx * math.cos(a), cy + ry * math.sin(a)))
        return pts
    l, t, r, b = x0 + inset, y0 + inset, x1 - inset, y1 - inset
    for side in [((l, t), (r, t)), ((r, t), (r, b)), ((r, b), (l, b)), ((l, b), (l, t))]:
        (ax, ay), (bx, by) = side
        n = max(1, int(math.hypot(bx - ax, by - ay) / spacing))
        for i in range(n):
            f = i / n
            pts.append((ax + (bx - ax) * f, ay + (by - ay) * f))
    return pts


def light_up(im, shape, box, *, inset, spacing, reach, ambient=0.26, piece=None):
    """Room lights off, warm LEDs on inside the frame only. `piece` (L image) overrides the lit area."""
    w, h = im.size
    a = np.asarray(im.convert("RGB")).astype(np.float32) / 255
    if piece is not None:
        from scipy import ndimage
        pm = np.asarray(piece).astype(np.float32) / 255
        mask = pm[..., None]
        dist = ndimage.distance_transform_edt(pm > 0.5)[..., None].astype(np.float32)
    else:
        mask = np.asarray(interior_mask(im.size, shape, box, 2)).astype(np.float32)[..., None] / 255
        dist = edge_distance(im.size, shape, box)[..., None]
    fall = np.exp(-dist / reach)  # 1 at the edge, fading inward

    dark = a * ambient
    warm = np.array([1.0, 0.86, 0.66], np.float32)
    lit = a * (0.78 + 0.55 * fall) * (0.82 + 0.18 * warm)
    lit = 1 - (1 - lit) * (1 - np.array([1.0, 0.62, 0.25], np.float32) * 0.42 * fall)  # screen in warm light near the edge
    out = dark * (1 - mask) + np.clip(lit, 0, 1) * mask

    # LED points: bloom then bright cores, clipped to the inside.
    glow = Image.new("RGB", im.size, (0, 0, 0))
    cores = Image.new("RGB", im.size, (0, 0, 0))
    dg, dc = ImageDraw.Draw(glow), ImageDraw.Draw(cores)
    for x, y in led_points(shape, box, inset, spacing):
        dg.ellipse([x - 9, y - 9, x + 9, y + 9], fill=(255, 150, 60))
        dc.ellipse([x - 2.6, y - 2.6, x + 2.6, y + 2.6], fill=(255, 244, 214))
    glow = np.asarray(glow.filter(ImageFilter.GaussianBlur(9))).astype(np.float32) / 255
    cores = np.asarray(cores.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
    hard = mask if piece is not None else np.asarray(interior_mask(im.size, shape, box, 0)).astype(np.float32)[..., None] / 255
    out = 1 - (1 - out) * (1 - glow * 0.9 * hard)
    out = 1 - (1 - out) * (1 - cores * hard)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def fit(im, width):
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


# ---------- Box Frame (blue shadow box) ----------
src = Image.open(E + "with-models/3-blue-shadow-box.jpg").convert("RGB")
crop = (130, 327, 950, 942)  # 820 x 615, 4:3, frame plus a thin margin
frame = src.crop(crop)
inside = (210 - 130, 395 - 327, 875 - 130, 870 - 327)  # the sky-blue mount
scale = 1200 / frame.width
frame = fit(frame, 1200)
inside = tuple(round(v * scale) for v in inside)
save(frame, OUT + "box-frame/frame.jpg")
save(light_up(frame, "rect", inside, inset=14, spacing=34, reach=90), OUT + "box-frame/frame-lit.jpg")


for name in ["2-happy-retirement-white-frame", "4-red-velvet-gold-frame"]:
    slug = "happy-retirement" if name.startswith("2") else "velvet-gold"
    save(Image.open(E + f"with-models/{name}.jpg"), OUT + f"box-frame/design-{slug}.jpg", q=84)

# ---------- Resin Frame (round plaque) ----------
src = Image.open(E + "with-models/1-round-resin-plaque.jpg").convert("RGB")
crop = (195, 280, 885, 970)  # 690 square
frame = src.crop(crop)
cx, cy, r = 540 - 195, 625 - 280, 292
inside = (cx - r, cy - r, cx + r, cy + r)
scale = 1080 / frame.width
frame = fit(frame, 1080)
inside = tuple(round(v * scale) for v in inside)
save(frame, OUT + "resin-frame/frame.jpg")
def plaque_shape(im):
    from scipy import ndimage
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    wall = (g >= r - 4) & (g > b + 6) & (np.abs(r - g) < 40) & (b < 140)
    m = ~wall
    m = ndimage.binary_opening(m, iterations=3)
    lab, n = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    m = lab == (int(np.argmax(sizes)) + 1)
    # Join with a disc inside the rim so darker rim notches still count as the piece.
    h, w = m.shape
    yy, xx = np.mgrid[0:h, 0:w]
    cx_, cy_ = w / 2, h / 2
    rr = np.hypot(xx - cx_, yy - cy_)
    m = (m | (rr < 0.44 * w)) & (rr < 0.49 * w)
    m = ndimage.binary_fill_holes(ndimage.binary_closing(m, iterations=14))
    m = ndimage.binary_erosion(m, iterations=2)
    return Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
shape = plaque_shape(frame)
save(light_up(frame, "ellipse", inside, inset=26, spacing=40, reach=110, piece=shape), OUT + "resin-frame/frame-lit.jpg")



# ---------- Newspaper Tribute (sample made here) ----------
def font(name, size, index=0):
    return ImageFont.truetype(SUP + name, size, index=index)


def vignette_wall(w, h, centre=(96, 110, 78), edge=(40, 48, 32)):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h * 0.42) / (h / 2)) ** 2)
    t = np.clip(d / 1.3, 0, 1)[..., None]
    c = np.array(centre, np.float32) * (1 - t) + np.array(edge, np.float32) * t
    return Image.fromarray(c.astype(np.uint8))


def wrap(draw, text, f, width):
    words, lines, line = text.split(), [], ""
    for w_ in words:
        test = (line + " " + w_).strip()
        if draw.textlength(test, font=f) <= width:
            line = test
        else:
            lines.append(line)
            line = w_
    lines.append(line)
    return lines


def newspaper(pw, ph):
    """The front page itself."""
    page = Image.new("RGB", (pw, ph), (236, 228, 210))
    d = ImageDraw.Draw(page)
    ink = (34, 30, 26)
    m = 34
    d.text((m, 22), "RETIREMENT SPECIAL  ·  KEEPSAKE EDITION", font=font("Times New Roman Bold.ttf", 15), fill=ink)
    t = "PRICELESS"
    d.text((pw - m - d.textlength(t, font=font("Times New Roman Bold.ttf", 15)), 22), t, font=font("Times New Roman Bold.ttf", 15), fill=ink)
    d.line([(m, 46), (pw - m, 46)], fill=ink, width=2)
    mast = font("Didot.ttc", 84, 1)
    t = "The Nation's Pride"
    d.text(((pw - d.textlength(t, font=mast)) / 2, 52), t, font=mast, fill=ink)
    d.line([(m, 156), (pw - m, 156)], fill=ink, width=3)
    d.line([(m, 162), (pw - m, 162)], fill=ink, width=1)

    size = 66
    while d.textlength("A LIFETIME OF SERVICE", font=font("Times New Roman Bold.ttf", size)) > pw - 2 * m - 10:
        size -= 1
    head = font("Times New Roman Bold.ttf", size)
    y = 178
    for line in ["A LIFETIME OF SERVICE", "TO THE NATION"]:
        d.text(((pw - d.textlength(line, font=head)) / 2, y), line, font=head, fill=ink)
        y += size + 6
    sub = font("Times New Roman Italic.ttf", 25)
    for line in wrap(d, "Thank you for every posting, every sacrifice and every year in uniform.", sub, pw - 2 * m - 40):
        d.text(((pw - d.textlength(line, font=sub)) / 2, y + 6), line, font=sub, fill=ink)
        y += 31
    y += 20
    d.line([(m, y), (pw - m, y)], fill=ink, width=1)
    y += 16

    # Photograph (stock model, sepia) with caption.
    portrait = Image.open(E + "with-models/4-red-velvet-gold-frame.jpg").convert("L").crop((452, 448, 628, 668))
    pwid = 250
    portrait = portrait.resize((pwid, round(portrait.height * pwid / portrait.width)), Image.LANCZOS)
    sep = Image.merge("RGB", [portrait.point(lambda v: min(255, v * 1.02 + 8)), portrait.point(lambda v: v * 0.94 + 6), portrait.point(lambda v: v * 0.80)])
    px = m
    page.paste(sep, (px, y))
    d.rectangle([px, y, px + pwid, y + sep.height], outline=ink, width=2)
    cap = font("Times New Roman Italic.ttf", 17)
    d.text((px, y + sep.height + 8), "Rank and Name", font=cap, fill=ink)
    photo_bottom = y + sep.height + 34

    body = font("Times New Roman.ttf", 17)
    bold = font("Times New Roman Bold.ttf", 19)
    text = (
        "From the first salute to the last parade, a life given to the nation. Postings far from home, "
        "festivals spent on duty and nights on watch, all carried with quiet pride. Comrades became "
        "family, and the family at home stood strong through every move. Today we say thank you, for "
        "the courage, the discipline and the kindness that marked every year in uniform. "
    )
    # Column beside the photo
    cx0 = px + pwid + 24
    cw = pw - m - cx0
    d.text((cx0, y), "A JOURNEY OF HONOUR", font=bold, fill=ink)
    yy = y + 28
    for line in wrap(d, text * 3, body, cw):
        if yy > photo_bottom - 10:
            break
        d.text((cx0, yy), line, font=body, fill=ink)
        yy += 21
    # Three columns below
    y = photo_bottom + 12
    d.line([(m, y), (pw - m, y)], fill=ink, width=1)
    y += 14
    gap = 20
    colw = (pw - 2 * m - 2 * gap) / 3
    heads = ["THE EARLY YEARS", "ACROSS THE COUNTRY", "A FAMILY'S PRIDE"]
    bottom = ph - 120
    for i, hd in enumerate(heads):
        x = m + i * (colw + gap)
        d.text((x, y), hd, font=bold, fill=ink)
        yy = y + 28
        for line in wrap(d, text * 3, body, colw):
            if yy > bottom:
                break
            d.text((x, yy), line, font=body, fill=ink)
            yy += 21
        if i:
            d.line([(x - gap / 2, y), (x - gap / 2, bottom + 18)], fill=ink, width=1)
    # Message box
    d.rectangle([m, ph - 92, pw - m, ph - 30], outline=ink, width=2)
    msg = font("Times New Roman Bold Italic.ttf", 26)
    t = "With love and pride, from your family"
    d.text(((pw - d.textlength(t, font=msg)) / 2, ph - 78), t, font=msg, fill=ink)
    # A little paper texture
    noise = (np.random.default_rng(7).normal(0, 5, (ph, pw, 1))).astype(np.float32)
    a = np.clip(np.asarray(page).astype(np.float32) + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(a)


def framed(pw, ph, border=48, mat=26):
    W, H = pw + 2 * (border + mat), ph + 2 * (border + mat)
    fr = Image.new("RGB", (W, H), (32, 22, 15))
    d = ImageDraw.Draw(fr)
    # Bevel: lighter top-left, darker bottom-right
    for i in range(10):
        d.rectangle([i, i, W - 1 - i, H - 1 - i], outline=(58 - i * 2, 41 - i, 28 - i))
    d.rectangle([border - 3, border - 3, W - border + 2, H - border + 2], fill=(18, 12, 8))
    d.rectangle([border, border, W - border - 1, H - border - 1], fill=(242, 238, 228))
    fr.paste(newspaper(pw, ph), (border + mat, border + mat))
    # Inner shadow from the frame onto the mat
    sh = Image.new("L", (W, H), 0)
    ImageDraw.Draw(sh).rectangle([border, border, W - border - 1, H - border - 1], outline=255, width=10)
    sh = sh.filter(ImageFilter.GaussianBlur(8))
    fr = Image.composite(Image.new("RGB", (W, H), (60, 50, 40)), fr, sh.point(lambda v: v * 0.35))
    return fr, (border, border, W - border, H - border)


PW, PH = 760, 1040
art, inner = framed(PW, PH)
# Unlit: frame on a wall, tight 4:5.
W, H = 1080, 1350
scale = min((W - 80) / art.width, (H - 80) / art.height)
art_s = art.resize((round(art.width * scale), round(art.height * scale)), Image.LANCZOS)
wall = vignette_wall(W, H)
ox, oy = (W - art_s.width) // 2, (H - art_s.height) // 2
shadow = Image.new("L", (W, H), 0)
ImageDraw.Draw(shadow).rectangle([ox + 8, oy + 16, ox + art_s.width + 8, oy + art_s.height + 16], fill=150)
wall = Image.composite(Image.new("RGB", (W, H), (12, 14, 10)), wall, shadow.filter(ImageFilter.GaussianBlur(18)))
wall.paste(art_s, (ox, oy))
inner_s = tuple(round(v * scale) for v in inner)
inner_s = (inner_s[0] + ox, inner_s[1] + oy, inner_s[2] + ox, inner_s[3] + oy)
save(wall, OUT + "newspaper-tribute/frame.jpg")
save(light_up(wall, "rect", inner_s, inset=12, spacing=36, reach=100), OUT + "newspaper-tribute/frame-lit.jpg")



# ---------- Homepage cards: each photo on a 4:5 canvas, edges blended into its own background ----------
def tile(path, out, W=900, H=1125, fill_frac=0.94):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    border = np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3), a[:, :6].reshape(-1, 3), a[:, -6:].reshape(-1, 3)])
    fill = tuple(int(v) for v in np.median(border, axis=0))
    s = min(W * fill_frac / im.width, H * fill_frac / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    canvas = Image.new("RGB", (W, H), fill)
    feather = 36
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rectangle([feather, feather, im.width - feather, im.height - feather], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(feather / 2))
    canvas.paste(im, ((W - im.width) // 2, (H - im.height) // 2), m)
    save(canvas, out, q=84)


for slug in ["newspaper-tribute", "box-frame", "resin-frame"]:
    tile(OUT + f"{slug}/frame.jpg", OUT + f"{slug}/tile.jpg")
    tile(OUT + f"{slug}/frame-lit.jpg", OUT + f"{slug}/tile-lit.jpg")
