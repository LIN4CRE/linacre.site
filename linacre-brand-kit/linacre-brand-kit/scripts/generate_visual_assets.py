from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
from pathlib import Path
import math, random, textwrap
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AS = ROOT / "02-assets"
for p in [AS/'logo', AS/'web', AS/'social', AS/'social/carousel', AS/'video']:
    p.mkdir(parents=True, exist_ok=True)

# Palette
INK = (7, 10, 15)
SLATE = (11, 18, 32)
PANEL = (17, 24, 39)
PANEL_SOFT = (23, 32, 51)
AMBER = (245, 158, 11)
GLOW = (255, 176, 0)
AMBER_DEEP = (217, 119, 6)
CREAM = (245, 231, 200)
MUTED = (148, 163, 184)
CYAN = (34, 211, 238)
VIOLET = (167, 139, 250)
WHITE = (255,255,255)

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

def f(size, bold=False, mono=False):
    return ImageFont.truetype(FONT_MONO_BOLD if mono and bold else FONT_MONO if mono else FONT_BOLD if bold else FONT_REG, size)

def rounded_rect_mask(size, radius):
    m = Image.new('L', size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0,0,size[0]-1,size[1]-1], radius=radius, fill=255)
    return m

def make_bg(w,h, grid=True, strong=False):
    # smooth diagonal dark gradient
    y = np.linspace(0,1,h)[:,None]
    x = np.linspace(0,1,w)[None,:]
    t = (x*0.42 + y*0.58)
    base = np.zeros((h,w,3), dtype=np.float32)
    c0 = np.array(INK, dtype=np.float32)
    c1 = np.array(SLATE, dtype=np.float32)
    base[:] = c0*(1-t[...,None]) + c1*t[...,None]

    def add_glow(cx,cy,r,color,alpha):
        nonlocal base
        xx = np.arange(w)[None,:]
        yy = np.arange(h)[:,None]
        dist = np.sqrt((xx-cx)**2 + (yy-cy)**2)
        intensity = np.clip(1-dist/r,0,1)**2 * alpha
        col=np.array(color,dtype=np.float32)
        base = base*(1-intensity[...,None]) + col*intensity[...,None]
    add_glow(w*0.18,h*0.14, min(w,h)*(0.65 if strong else 0.48), GLOW, 0.22 if strong else 0.16)
    add_glow(w*0.88,h*0.16, min(w,h)*0.38, CYAN, 0.06)
    add_glow(w*0.65,h*0.92, min(w,h)*0.52, AMBER_DEEP, 0.08)
    im = Image.fromarray(np.clip(base,0,255).astype(np.uint8), 'RGB').convert('RGBA')
    d=ImageDraw.Draw(im,'RGBA')
    if grid:
        step=max(36, min(w,h)//18)
        for gx in range(-step, w+step, step):
            d.line([(gx,0),(gx,h)], fill=(245,158,11,18), width=1)
        for gy in range(-step, h+step, step):
            d.line([(0,gy),(w,gy)], fill=(245,158,11,14), width=1)
        # diagonal signal strokes
        for i in range(-h, w, step*4):
            d.line([(i, h),(i+h,0)], fill=(255,176,0,10), width=1)
    # subtle grain
    noise = np.random.default_rng(42).integers(0, 22, (h,w,1), dtype=np.uint8)
    na = np.zeros((h,w,4), dtype=np.uint8)
    na[...,0:3]=noise
    na[...,3]=18
    im = Image.alpha_composite(im, Image.fromarray(na,'RGBA'))
    return im

def hex_points(cx,cy,r, flat=False):
    start = 0 if flat else -90
    return [(cx + r*math.cos(math.radians(start+i*60)), cy + r*math.sin(math.radians(start+i*60))) for i in range(6)]

def line(draw, pts, fill, width, joint='curve'):
    draw.line(pts, fill=fill, width=width, joint=joint)

def draw_hex_mark(im, cx, cy, r, stroke=None, with_bg_glow=True, scale=1.0):
    stroke = stroke or max(4, int(r*0.09))
    layer = Image.new('RGBA', im.size, (0,0,0,0))
    gd = ImageDraw.Draw(layer,'RGBA')
    pts = hex_points(cx,cy,r)
    if with_bg_glow:
        gd.line(pts+[pts[0]], fill=(255,176,0,110), width=stroke*3, joint='curve')
        layer = layer.filter(ImageFilter.GaussianBlur(stroke*1.7))
        im.alpha_composite(layer)
        layer = Image.new('RGBA', im.size, (0,0,0,0)); gd = ImageDraw.Draw(layer,'RGBA')
    # outline as layered gradient-ish lines
    gd.line(pts+[pts[0]], fill=(255,176,0,235), width=stroke, joint='curve')
    gd.line(pts+[pts[0]], fill=(245,158,11,255), width=max(2,stroke//2), joint='curve')
    # inner L stem
    stem_x = cx - r*0.50
    gd.line([(stem_x,cy-r*0.56),(stem_x,cy+r*0.62)], fill=(245,158,11,232), width=max(3,int(stroke*0.85)))
    # pulse waveform
    y=cy+r*0.12
    pts2=[(cx-r*0.66,y),(cx-r*0.30,y),(cx-r*0.18,cy-r*0.23),(cx+r*0.12,cy+r*0.50),(cx+r*0.31,y),(cx+r*0.67,y)]
    gd.line(pts2, fill=(245,231,200,255), width=max(3,int(stroke*0.86)), joint='curve')
    dot_r=max(3,int(stroke*0.60))
    gd.ellipse([cx+r*0.67-dot_r, y-dot_r, cx+r*0.67+dot_r, y+dot_r], fill=(34,211,238,230))
    im.alpha_composite(layer)

def draw_text(draw, xy, text, font, fill, anchor=None, align='left', spacing=4):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor, align=align, spacing=spacing)

def text_size(draw, text, font):
    b=draw.textbbox((0,0), text, font=font)
    return b[2]-b[0], b[3]-b[1]

def fit_font(text, max_w, start, bold=True, mono=False, min_size=20):
    size=start
    while size>min_size:
        font=f(size,bold=bold,mono=mono)
        im=Image.new('RGB',(10,10)); d=ImageDraw.Draw(im)
        w,_=text_size(d,text,font)
        if w<=max_w:
            return font
        size-=2
    return f(min_size,bold=bold,mono=mono)

def wrap_to_width(text, font, max_w):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    words=text.split()
    lines=[]; cur=""
    for word in words:
        test=(cur+" "+word).strip()
        if text_size(d,test,font)[0] <= max_w or not cur:
            cur=test
        else:
            lines.append(cur); cur=word
    if cur: lines.append(cur)
    return "\n".join(lines)

def save(im, path):
    path=Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path)
    print(path.relative_to(ROOT))

# ---------- Logo / favicon package ----------
def make_mark(size=1024, bg=True, transparent=False):
    im = Image.new('RGBA', (size,size), (0,0,0,0))
    if bg:
        base = make_bg(size,size,grid=True,strong=True)
        mask = rounded_rect_mask((size,size), int(size*0.22))
        im.alpha_composite(base)
        im.putalpha(mask)
    draw_hex_mark(im, size/2, size/2, size*0.36, stroke=int(size*0.035), with_bg_glow=bg)
    return im

save(make_mark(1024, bg=True), AS/'logo/linacre-logo-hex-pulse-dark-1024-v01.png')
save(make_mark(512, bg=True), AS/'logo/linacre-logo-hex-pulse-dark-512-v01.png')
save(make_mark(1024, bg=False), AS/'logo/linacre-logo-hex-pulse-transparent-1024-v01.png')
save(make_mark(800, bg=True), AS/'social/linacre-social-avatar-800x800-v01.png')
save(make_mark(400, bg=True), AS/'social/linacre-social-avatar-400x400-v01.png')
for s in [16,32,64,180,192,512]:
    save(make_mark(s, bg=True), AS/f'logo/linacre-icon-{s}x{s}-v01.png')
# favicon.ico
ico = make_mark(256, bg=True).convert('RGBA')
ico.save(AS/'logo/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
print((AS/'logo/favicon.ico').relative_to(ROOT))

# Wordmark
w,h = 1600,450
im=make_bg(w,h,grid=True,strong=False); d=ImageDraw.Draw(im,'RGBA')
# panel overlay
d.rounded_rectangle([34,34,w-34,h-34], radius=54, outline=(245,158,11,70), width=2, fill=(7,10,15,80))
draw_hex_mark(im, 205, 225, 122, stroke=13)
font1=f(118,bold=True); font2=f(78,bold=True,mono=True); font3=f(28,mono=True)
draw_text(d,(390,183),"Linacre",font1,CREAM)
draw_text(d,(880,202),".site",font2,AMBER)
draw_text(d,(396,266),"FULL-STACK & AI ENGINEERING",font3,MUTED)
d.line([(398,315),(1190,315)], fill=(255,176,0,130), width=2)
save(im, AS/'logo/linacre-wordmark-horizontal-1600x450-v01.png')

# Transparent wordmark quick (transparent bg)
im=Image.new('RGBA',(1600,450),(0,0,0,0)); d=ImageDraw.Draw(im,'RGBA')
draw_hex_mark(im, 205,225,122,stroke=13,with_bg_glow=False)
draw_text(d,(390,183),"Linacre",font1,CREAM)
draw_text(d,(880,202),".site",font2,AMBER)
draw_text(d,(396,266),"FULL-STACK & AI ENGINEERING",font3,MUTED)
save(im, AS/'logo/linacre-wordmark-transparent-1600x450-v01.png')

# site manifest
(AS/'logo/site.webmanifest').write_text('{\n  "name": "Linacre.site",\n  "short_name": "Linacre",\n  "icons": [\n    {"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},\n    {"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}\n  ],\n  "theme_color": "#F59E0B",\n  "background_color": "#070A0F",\n  "display": "standalone"\n}\n')
print((AS/'logo/site.webmanifest').relative_to(ROOT))

# ---------- Banners ----------
def add_brand_corner(im, small=False):
    d=ImageDraw.Draw(im,'RGBA')
    size=56 if small else 82
    draw_hex_mark(im, size*0.95, size*0.95, size*0.36, stroke=max(4,size//14))
    draw_text(d,(size*1.55, size*0.72),"Linacre.site", f(24 if small else 34,bold=True), CREAM)
    draw_text(d,(size*1.58, size*1.13),"amber · hexagon · pulse · cyber", f(11 if small else 15,mono=True), MUTED)

def make_banner(w,h,title,subtitle,tagline,path,layout='left', safe_hint=None):
    im=make_bg(w,h,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
    # decorative cards
    for i in range(5):
        x=int(w*(0.60+0.08*math.sin(i))) + i*18
        y=int(h*(0.16+i*0.12))
        ww=int(w*0.22); hh=int(h*0.16)
        d.rounded_rectangle([x,y,x+ww,y+hh], radius=18, outline=(245,158,11,32), fill=(17,24,39,70), width=1)
    if layout=='rightmark':
        tx=int(w*0.28); ty=int(h*0.26)
        draw_hex_mark(im, int(w*0.13), int(h*0.50), min(w,h)*0.20, stroke=max(6,int(min(w,h)*0.025)))
    elif layout=='centermark':
        tx=int(w*0.50); ty=int(h*0.38)
    else:
        tx=int(w*0.07); ty=int(h*0.24)
        draw_hex_mark(im, int(w*0.82), int(h*0.50), min(w,h)*0.28, stroke=max(6,int(min(w,h)*0.026)))
    title_font=fit_font(title, int(w*0.62 if layout!='centermark' else w*0.82), int(h*0.17), bold=True)
    sub_font=fit_font(subtitle, int(w*0.60 if layout!='centermark' else w*0.78), int(h*0.075), bold=False)
    tag_font=f(max(13,int(h*0.035)), mono=True)
    if layout=='centermark':
        draw_hex_mark(im, int(w*0.50), int(h*0.25), min(w,h)*0.12, stroke=max(5,int(h*0.018)))
        draw_text(d,(w/2,ty),title,title_font,CREAM,anchor='mm',align='center')
        draw_text(d,(w/2,ty+int(h*0.12)),subtitle,sub_font,MUTED,anchor='mm',align='center')
        draw_text(d,(w/2,ty+int(h*0.21)),tagline,tag_font,AMBER,anchor='mm',align='center')
    else:
        draw_text(d,(tx,ty),title,title_font,CREAM)
        draw_text(d,(tx,ty+int(h*0.18)),subtitle,sub_font,MUTED)
        draw_text(d,(tx,ty+int(h*0.31)),tagline,tag_font,AMBER)
    d.line([(int(w*0.07), int(h*0.84)), (int(w*0.93), int(h*0.84))], fill=(255,176,0,120), width=max(1,h//180))
    save(im,path)

make_banner(1584,396,"David Linacre","Full-Stack & AI Engineer","Tools · Roadmaps · AI Experiments · Clean Web Systems", AS/'social/linacre-linkedin-banner-1584x396-v01.png', layout='rightmark')
make_banner(1500,500,"Full-Stack & AI Engineering","Tools, roadmaps, experiments, and clean web systems","Linacre.site", AS/'social/linacre-x-header-1500x500-v01.png')
make_banner(1600,500,"Linacre.site","Full-Stack & AI Engineering Toolkit","React · TypeScript · Express · AI Lab · Toolkit Directory", AS/'social/linacre-github-readme-banner-1600x500-v01.png', layout='centermark')
make_banner(2560,1440,"Linacre.site","Tools, builds, AI experiments","Full-Stack & AI Engineering", AS/'social/linacre-youtube-banner-2560x1440-v01.png', layout='centermark')

# ---------- Web images ----------
# OG Card
w,h=1200,630
im=make_bg(w,h,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
d.rounded_rectangle([52,52,w-52,h-52], radius=42, outline=(245,158,11,70), width=2, fill=(7,10,15,72))
draw_hex_mark(im, 198, 315, 116, stroke=13)
draw_text(d,(365,190),"Linacre.site", f(70,bold=True), CREAM)
draw_text(d,(367,278),"Full-Stack & AI Engineering Toolkit", fit_font("Full-Stack & AI Engineering Toolkit", 690, 42, bold=True), AMBER)
body="Tools, roadmaps, AI experiments, and clean web systems from David Linacre."
draw_text(d,(370,344),wrap_to_width(body,f(28),680),f(28),MUTED,spacing=8)
d.line([(370,465),(1045,465)], fill=(255,176,0,140), width=2)
draw_text(d,(370,502),"amber · hexagon · pulse · cyber", f(18,mono=True), CREAM)
save(im, AS/'web/linacre-og-card-1200x630-v01.png')

# Hero background no text
im=make_bg(1920,1080,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
for i,(cx,cy,r) in enumerate([(1540,310,160),(1700,700,95),(250,800,130)]):
    pts=hex_points(cx,cy,r)
    d.line(pts+[pts[0]], fill=(255,176,0,42), width=2)
d.line([(240,680),(720,680),(780,620),(860,760),(940,680),(1230,680)], fill=(245,231,200,55), width=4)
save(im, AS/'web/linacre-hero-background-1920x1080-v01.png')

# Web texture SVG-ish pattern as PNG
im=Image.new('RGBA',(1200,800),INK+(255,)); d=ImageDraw.Draw(im,'RGBA')
for x in range(0,1200,80):
  for y in range(0,800,70):
    if (x//80+y//70)%3==0:
      pts=hex_points(x+40,y+35,24)
      d.line(pts+[pts[0]], fill=(245,158,11,32), width=1)
save(im, AS/'web/linacre-hex-grid-texture-1200x800-v01.png')

# Moodboard
im=make_bg(1920,1080,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
draw_text(d,(90,95),"Linacre.site", f(82,bold=True), CREAM)
draw_text(d,(94,178),"soft retro-modern brand system", f(28,mono=True), AMBER)
draw_hex_mark(im, 1580, 220, 145, stroke=14)
# palette swatches
palette=[('Ink','#070A0F',INK),('Slate','#0B1220',SLATE),('Panel','#111827',PANEL),('Amber','#F59E0B',AMBER),('Glow','#FFB000',GLOW),('Cream','#F5E7C8',CREAM),('Cyan','#22D3EE',CYAN)]
for i,(name,hexv,col) in enumerate(palette):
    x=90+i*245; y=760
    d.rounded_rectangle([x,y,x+195,y+150], radius=24, fill=col+(255,), outline=(255,255,255,30), width=2)
    tc=INK if name in ['Amber','Glow','Cream','Cyan'] else CREAM
    draw_text(d,(x+18,y+84),name,f(22,bold=True),tc)
    draw_text(d,(x+18,y+116),hexv,f(17,mono=True),tc)
# cards
for idx,(title,body) in enumerate([
    ('Visual','amber · hexagon · pulse · cyber'),
    ('Audio','felt piano · Rhodes · soft synth'),
    ('Voice','calm · practical · builder-led')]):
    x=100+idx*520; y=350
    d.rounded_rectangle([x,y,x+440,y+240], radius=30, fill=(17,24,39,190), outline=(245,158,11,75), width=2)
    draw_text(d,(x+34,y+42),title,f(38,bold=True),CREAM)
    draw_text(d,(x+34,y+104),wrap_to_width(body,f(25,mono=True),360),f(25,mono=True),MUTED,spacing=8)
    d.line([(x+34,y+190),(x+380,y+190)], fill=(255,176,0,120), width=2)
save(im, AS/'web/linacre-brand-moodboard-1920x1080-v01.png')

# ---------- Social templates ----------
def make_square_template(path, label, title, bullets, cta="Linacre.site"):
    W=H=1080
    im=make_bg(W,H,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
    d.rounded_rectangle([58,58,W-58,H-58], radius=46, outline=(245,158,11,68), fill=(7,10,15,78), width=2)
    d.rounded_rectangle([92,92,260,138], radius=23, fill=(245,158,11,230))
    draw_text(d,(116,104),label.upper(),f(19,bold=True,mono=True),INK)
    draw_hex_mark(im, 910, 130, 52, stroke=6)
    tfont=fit_font(title, 820, 76, bold=True, min_size=48)
    wrapped=wrap_to_width(title,tfont,820)
    draw_text(d,(100,230),wrapped,tfont,CREAM,spacing=8)
    y=560
    for b in bullets:
        d.ellipse([105,y+10,124,y+29], fill=AMBER+(255,))
        draw_text(d,(150,y),wrap_to_width(b,f(31),760),f(31),MUTED,spacing=6)
        y += 105
    d.line([(100,920),(980,920)], fill=(255,176,0,130), width=2)
    draw_text(d,(100,956),cta,f(25,bold=True),CREAM)
    draw_text(d,(810,957),"save · build · ship",f(18,mono=True),AMBER)
    save(im,path)

make_square_template(AS/'social/linacre-social-post-template-1080x1080-v01.png', 'build note', 'One useful idea per build.', ['Keep the interface calm.', 'Make the resource practical.', 'Ship the change and write the changelog.'])
make_square_template(AS/'social/linacre-launch-graphic-1080x1080-v01.png', 'launch', 'Linacre.site is becoming more than a portfolio.', ['Toolkit directory', 'AI Lab and roadmap', 'Changelog-driven build archive'], 'Explore Linacre.site')
make_square_template(AS/'social/linacre-changelog-graphic-1080x1080-v01.png', 'v3.5', 'React & Full-Stack Evolution', ['React + TypeScript workspace', 'Secure AI chat routes', 'Polished toolkit and command palette'], 'Follow the changelog')

# Code snippet template
W=H=1080
im=make_bg(W,H,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
d.rounded_rectangle([70,80,1010,1000], radius=42, fill=(7,10,15,150), outline=(245,158,11,72), width=2)
d.rounded_rectangle([120,190,960,760], radius=30, fill=(12,17,27,240), outline=(245,158,11,60), width=2)
d.rounded_rectangle([120,190,960,250], radius=30, fill=(245,158,11,210))
d.rectangle([120,220,960,250], fill=(245,158,11,210))
draw_text(d,(150,206),"linacre-component.tsx",f(22,bold=True,mono=True),INK)
code=["const identity = {", "  colour: 'amber',", "  shape: 'hexagon',", "  motion: 'pulse',", "  mood: 'soft retro cyber'", "};"]
y=300
for i,line_text in enumerate(code, start=1):
    draw_text(d,(150,y),str(i).rjust(2),f(27,mono=True),MUTED)
    draw_text(d,(210,y),line_text,f(27,mono=True),CREAM if i not in [2,3,4,5] else AMBER)
    y+=58
draw_text(d,(120,835),"CODE NOTE",f(20,bold=True,mono=True),AMBER)
draw_text(d,(120,878),"Use tiny details to make the brand recognisable without making the UI noisy.",f(30),MUTED)
draw_text(d,(120,952),"Linacre.site",f(25,bold=True),CREAM)
save(im, AS/'social/linacre-code-snippet-template-1080x1080-v01.png')

# Vertical reel background
W,H=1080,1920
im=make_bg(W,H,grid=True,strong=True); d=ImageDraw.Draw(im,'RGBA')
# safe caption panel ghost
for y in [260,860,1450]:
    d.rounded_rectangle([110,y,970,y+180], radius=34, outline=(245,158,11,34), fill=(17,24,39,55), width=1)
draw_hex_mark(im, 540, 260, 88, stroke=9)
d.line([(160,1680),(920,1680)], fill=(255,176,0,120), width=3)
draw_text(d,(540,1740),"Linacre.site",f(42,bold=True),CREAM,anchor='mm')
draw_text(d,(540,1795),"Full-Stack & AI Engineering",f(22,mono=True),AMBER,anchor='mm')
save(im, AS/'social/linacre-reel-background-1080x1920-v01.png')

# Carousel slides
slides=[
('01','COVER','A portfolio is stronger when it behaves like a product.',['A useful hub beats a static page.']),
('02','PROBLEM','Static portfolios are easy to forget.',['Visitors need a reason to return.','Useful tools create repeat visits.']),
('03','KEY IDEA','Make the site useful first.',['Toolkit. Roadmap. AI Lab. Changelog.','Then make it beautiful.']),
('04','EXAMPLE','Linacre.site is built as a workspace.',['Curated free tools','AI sandbox experiments','Release notes and build history']),
('05','STACK','The build stack stays practical.',['React + TypeScript','Express routes','Tailwind/CSS tokens','AI provider integrations']),
('06','CHECKLIST','Before launch, check the system.',['Clear hero','Searchable toolkit','Accessible focus states','Open Graph image']),
('07','CTA','Explore the toolkit and follow the build.',['Linacre.site','amber · hexagon · pulse · cyber'])
]
for num,label,title,bullets in slides:
    make_square_template(AS/f'social/carousel/linacre-carousel-{num}-{label.lower()}-1080x1080-v01.png', label, title, bullets, 'Linacre.site')

# ---------- Animated logo sting GIF frames ----------
frames=[]
S=640
for idx in range(48):
    t=idx/47
    im=make_bg(S,S,grid=True,strong=True)
    d=ImageDraw.Draw(im,'RGBA')
    # pulse line grows
    line_len=int((0.15+0.85*min(1,t*1.6))*S*0.74)
    x0=S//2-line_len//2; x1=S//2+line_len//2; y=int(S*0.52)
    d.line([(x0,y),(x1,y)], fill=(255,176,0,int(60+110*min(1,t*2))), width=3)
    # hex fades/draw-ish by scaling and alpha through layer
    r=S*0.31*(0.72+0.28*min(1,max(0,(t-0.12)/0.55)))
    layer=Image.new('RGBA',(S,S),(0,0,0,0))
    draw_hex_mark(layer,S/2,S/2,r,stroke=int(S*0.025),with_bg_glow=True)
    alpha=int(255*min(1,max(0,(t-0.10)/0.55)))
    layer.putalpha(Image.eval(layer.getchannel('A'), lambda a: a*alpha//255))
    im.alpha_composite(layer)
    if t>0.72:
        draw_text(d,(S/2,S*0.82),"Linacre.site",f(36,bold=True),CREAM,anchor='mm')
        if int(t*16)%2==0:
            d.rectangle([S/2+120,S*0.80,S/2+132,S*0.84], fill=AMBER+(240,))
    frames.append(im.convert('P', palette=Image.Palette.ADAPTIVE))
frames[0].save(AS/'video/linacre-logo-sting-03s-v01.gif', save_all=True, append_images=frames[1:], duration=62, loop=0, optimize=True)
print((AS/'video/linacre-logo-sting-03s-v01.gif').relative_to(ROOT))

print("Visual assets generated.")
