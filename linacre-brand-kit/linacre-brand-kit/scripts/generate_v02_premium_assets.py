from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np, math, random, textwrap, os

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / '02-assets' / 'v02-premium'
SRC = BASE / 'ai-source'
DIRS = ['logo','web','social','social/carousel','video','css','copy']
for d in DIRS:
    (BASE/d).mkdir(parents=True, exist_ok=True)

INK=(7,10,15); SLATE=(11,18,32); PANEL=(17,24,39); PANEL2=(22,31,48)
AMBER=(245,158,11); GLOW=(255,176,0); DEEP=(217,119,6); CREAM=(245,231,200); MUTED=(148,163,184); CYAN=(34,211,238); VIOLET=(167,139,250)
WHITE=(255,255,255)
FONT_REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONT_MONO_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'
FONT_COND=FONT_BOLD

def font(size,bold=False,mono=False,cond=False):
    if mono: path=FONT_MONO_BOLD if bold else FONT_MONO
    elif cond: path=FONT_COND
    else: path=FONT_BOLD if bold else FONT_REG
    return ImageFont.truetype(path, size)

def bbox(draw, text, f):
    b=draw.textbbox((0,0), text, font=f)
    return b[2]-b[0], b[3]-b[1]

def fit_font(text, max_w, start, min_size=18, bold=True, mono=False, cond=False):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    for s in range(start, min_size-1, -2):
        f=font(s,bold=bold,mono=mono,cond=cond)
        if bbox(d,text,f)[0] <= max_w:
            return f
    return font(min_size,bold=bold,mono=mono,cond=cond)

def wrap_text(text, f, max_w):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    words=text.split(); lines=[]; cur=''
    for word in words:
        test=(cur+' '+word).strip()
        if not cur or bbox(d,test,f)[0] <= max_w:
            cur=test
        else:
            lines.append(cur); cur=word
    if cur: lines.append(cur)
    return '\n'.join(lines)

def cover(img, size, focus=(0.5,0.5)):
    img=img.convert('RGB')
    w,h=img.size; W,H=size
    scale=max(W/w,H/h)
    nw,nh=int(w*scale)+1,int(h*scale)+1
    im=img.resize((nw,nh), Image.Resampling.LANCZOS)
    x=int((nw-W)*focus[0]); y=int((nh-H)*focus[1])
    x=max(0,min(x,nw-W)); y=max(0,min(y,nh-H))
    return im.crop((x,y,x+W,y+H)).convert('RGBA')

def load_src(name, size, focus=(0.5,0.5)):
    path=SRC/name
    if path.exists(): return cover(Image.open(path), size, focus)
    return dark_bg(*size)

def dark_bg(W,H, strong=True):
    y=np.linspace(0,1,H)[:,None]; x=np.linspace(0,1,W)[None,:]
    t=(x*.36+y*.64)
    arr=np.zeros((H,W,3),dtype=np.float32)
    arr[:]=np.array(INK)*(1-t[...,None])+np.array(SLATE)*t[...,None]
    def glow(cx,cy,r,c,a):
        nonlocal arr
        xx=np.arange(W)[None,:]; yy=np.arange(H)[:,None]
        dist=np.sqrt((xx-cx)**2+(yy-cy)**2)
        inten=np.clip(1-dist/r,0,1)**2*a
        arr=arr*(1-inten[...,None])+np.array(c)*inten[...,None]
    glow(W*.18,H*.12,min(W,H)*.72,GLOW,.22 if strong else .13)
    glow(W*.86,H*.20,min(W,H)*.48,CYAN,.07)
    glow(W*.50,H*.95,min(W,H)*.75,DEEP,.08)
    im=Image.fromarray(np.clip(arr,0,255).astype('uint8'),'RGB').convert('RGBA')
    return im

def add_overlays(im, vignette=True, grid=True, grain=True, shade=0.28):
    W,H=im.size
    ov=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(ov,'RGBA')
    # dark brand grading
    d.rectangle([0,0,W,H], fill=(2,4,8,int(255*shade)))
    # premium side gradient
    grad=np.zeros((H,W,4),dtype=np.uint8)
    x=np.linspace(0,1,W)[None,:]
    a=(np.clip((x-.35)/.65,0,1)**1.4*120).astype(np.uint8)
    grad[...,3]=a
    im=Image.alpha_composite(im,ov)
    im=Image.alpha_composite(im,Image.fromarray(grad,'RGBA'))
    d=ImageDraw.Draw(im,'RGBA')
    if grid:
        step=max(42,min(W,H)//16)
        for gx in range(-step,W+step,step): d.line([(gx,0),(gx,H)], fill=(255,176,0,13), width=1)
        for gy in range(-step,H+step,step): d.line([(0,gy),(W,gy)], fill=(255,176,0,10), width=1)
    # scan/pulse line
    d.line([(0,int(H*.76)),(W,int(H*.76))], fill=(255,176,0,38), width=max(1,H//260))
    if vignette:
        mask=Image.new('L',(W,H),0); md=ImageDraw.Draw(mask)
        md.ellipse([int(-W*.20),int(-H*.38),int(W*1.20),int(H*1.28)], fill=220)
        mask=mask.filter(ImageFilter.GaussianBlur(int(min(W,H)*.14)))
        v=Image.new('RGBA',(W,H),(0,0,0,150)); v.putalpha(ImageOps.invert(mask))
        im=Image.alpha_composite(im,v)
    if grain:
        rng=np.random.default_rng(202)
        noise=rng.integers(0,35,(H,W,1),dtype=np.uint8)
        arr=np.zeros((H,W,4),dtype=np.uint8); arr[...,:3]=noise; arr[...,3]=13
        im=Image.alpha_composite(im,Image.fromarray(arr,'RGBA'))
    return im

def hex_pts(cx,cy,r,rot=-90):
    return [(cx+r*math.cos(math.radians(rot+i*60)),cy+r*math.sin(math.radians(rot+i*60))) for i in range(6)]

def round_line(d, pts, fill, width):
    d.line(pts, fill=fill, width=width, joint='curve')
    rad=width/2
    for x,y in [pts[0],pts[-1]]:
        d.ellipse([x-rad,y-rad,x+rad,y+rad], fill=fill)

def draw_premium_mark(im, cx, cy, r, stroke=None, glow=True, textless=True, intensity=1.0):
    W,H=im.size
    stroke=stroke or max(6,int(r*.075))
    # glow layer
    if glow:
        layer=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(layer,'RGBA')
        pts=hex_pts(cx,cy,r)
        d.line(pts+[pts[0]], fill=(255,176,0,int(150*intensity)), width=stroke*4, joint='curve')
        for rr,aa in [(r*1.18,42),(r*.73,28)]:
            p=hex_pts(cx,cy,rr); d.line(p+[p[0]], fill=(255,176,0,aa), width=max(2,stroke//2), joint='curve')
        layer=layer.filter(ImageFilter.GaussianBlur(max(5,stroke*2)))
        im.alpha_composite(layer)
    d=ImageDraw.Draw(im,'RGBA')
    outer=hex_pts(cx,cy,r)
    inner=hex_pts(cx,cy,r*.82)
    # shadow/outer high-gloss lines
    d.line(outer+[outer[0]], fill=(90,54,6,230), width=stroke+5, joint='curve')
    d.line(outer+[outer[0]], fill=(255,187,42,255), width=stroke, joint='curve')
    d.line(inner+[inner[0]], fill=(245,158,11,82), width=max(2,stroke//3), joint='curve')
    # top highlight segments
    for i in [0,1,5]:
        d.line([outer[i],outer[(i+1)%6]], fill=(255,228,160,190), width=max(2,stroke//3), joint='curve')
    # monogram L + pulse
    lw=max(6,int(stroke*.92))
    sx=cx-r*.49
    round_line(d, [(sx,cy-r*.52),(sx,cy+r*.52),(cx-r*.11,cy+r*.52)], fill=(245,158,11,245), width=lw)
    # pulse line with rounded caps
    pts=[(cx-r*.60,cy+r*.05),(cx-r*.24,cy+r*.05),(cx-r*.12,cy-r*.24),(cx+r*.11,cy+r*.48),(cx+r*.30,cy+r*.05),(cx+r*.63,cy+r*.05)]
    round_line(d, pts, fill=(245,231,200,255), width=lw)
    # cyan endpoint and tiny nodes
    dot=max(4,int(stroke*.75)); x,y=pts[-1]
    d.ellipse([x-dot,y-dot,x+dot,y+dot], fill=(34,211,238,245))
    for a in [30,150,270]:
        nx=cx+r*.98*math.cos(math.radians(a)); ny=cy+r*.98*math.sin(math.radians(a))
        d.ellipse([nx-stroke*.18,ny-stroke*.18,nx+stroke*.18,ny+stroke*.18], fill=(245,158,11,130))

def glass_card(im, box, radius=34, fill=(7,10,15,138), outline=(255,176,0,65), blur=False):
    W,H=im.size; x0,y0,x1,y1=map(int,box)
    layer=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(layer,'RGBA')
    if blur:
        crop=im.crop((x0,y0,x1,y1)).filter(ImageFilter.GaussianBlur(10))
        m=Image.new('L',(x1-x0,y1-y0),0); md=ImageDraw.Draw(m); md.rounded_rectangle([0,0,x1-x0-1,y1-y0-1],radius=radius,fill=180)
        im.paste(crop,(x0,y0),m)
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=2)
    d.line([(x0+radius,y0+1),(x1-radius,y0+1)], fill=(255,255,255,35), width=1)
    im.alpha_composite(layer)

def draw_wordmark(d, x, y, scale=1.0, tagline=True):
    d.text((x,y), 'Linacre', font=font(int(76*scale), bold=True, cond=True), fill=CREAM)
    dx= int(330*scale)
    d.text((x+dx,y+int(9*scale)), '.site', font=font(int(54*scale), bold=True, mono=True), fill=AMBER)
    if tagline:
        d.text((x+int(3*scale),y+int(85*scale)), 'FULL-STACK & AI ENGINEERING', font=font(int(18*scale), mono=True), fill=MUTED)

def label_pill(d, x, y, text, fill=AMBER, dark=True, size=16):
    f=font(size,bold=True,mono=True); tw,th=bbox(d,text,f)
    d.rounded_rectangle([x,y,x+tw+28,y+th+18], radius=(th+18)//2, fill=fill+(235,) if isinstance(fill,tuple) else fill)
    d.text((x+14,y+8), text, font=f, fill=INK if dark else CREAM)
    return x+tw+28

def save(im, path, q=94):
    path=Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix.lower() in ['.jpg','.jpeg']:
        im.convert('RGB').save(path, quality=q, optimize=True, progressive=True)
    else:
        im.save(path, optimize=True, compress_level=7)
    print(path.relative_to(ROOT))

# ---------------- SVG master logos ----------------
logo_svg = '''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<radialGradient id="bg" cx="50%" cy="42%" r="72%"><stop offset="0" stop-color="#1f2a3d"/><stop offset="0.52" stop-color="#0B1220"/><stop offset="1" stop-color="#070A0F"/></radialGradient>
<linearGradient id="amber" x1="230" y1="120" x2="790" y2="900"><stop stop-color="#FFE0A3"/><stop offset="0.28" stop-color="#FFB000"/><stop offset="0.72" stop-color="#F59E0B"/><stop offset="1" stop-color="#D97706"/></linearGradient>
<filter id="glow" x="0" y="0" width="1024" height="1024"><feGaussianBlur stdDeviation="18" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 1 0 1 0 0 .58 0 0 1 0 0 0 0 0 .8 0"/><feBlend in2="SourceGraphic" mode="screen"/></filter>
</defs>
<rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
<path d="M512 118 853.5 315v394L512 906 170.5 709V315L512 118Z" stroke="url(#amber)" stroke-width="34" stroke-linejoin="round" filter="url(#glow)"/>
<path d="M512 188 792.9 350v324L512 836 231.1 674V350L512 188Z" stroke="#F59E0B" stroke-opacity=".34" stroke-width="10"/>
<path d="M333 691V332M333 691H463" stroke="#F59E0B" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M280 537H402L455 407 565 681 628 537H744" stroke="#F5E7C8" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="744" cy="537" r="23" fill="#22D3EE"/>
</svg>'''
(BASE/'logo/linacre-v02-mark.svg').write_text(logo_svg)
word_svg = '''<svg width="1800" height="480" viewBox="0 0 1800 480" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1800" height="480" rx="72" fill="#070A0F"/>
<g transform="translate(76 58) scale(.36)">''' + logo_svg.split('<rect width="1024" height="1024" rx="224" fill="url(#bg)"/>',1)[1].replace('</svg>','') + '''</g>
<text x="500" y="210" fill="#F5E7C8" font-family="DejaVu Sans Condensed, Space Grotesk, Inter, sans-serif" font-size="142" font-weight="800" letter-spacing="-7">Linacre</text>
<text x="1100" y="218" fill="#F59E0B" font-family="DejaVu Sans Mono, JetBrains Mono, monospace" font-size="94" font-weight="700">.site</text>
<text x="508" y="292" fill="#94A3B8" font-family="DejaVu Sans Mono, JetBrains Mono, monospace" font-size="33" letter-spacing="3">FULL-STACK &amp; AI ENGINEERING</text>
<path d="M508 346H1395" stroke="#FFB000" stroke-opacity=".72" stroke-width="3"/>
</svg>'''
(BASE/'logo/linacre-v02-wordmark.svg').write_text(word_svg)
anim_svg = '''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<style>
.hex{stroke-dasharray:2400;stroke-dashoffset:2400;animation:draw 1.6s cubic-bezier(.2,.8,.2,1) forwards}.pulse{stroke-dasharray:900;stroke-dashoffset:900;animation:draw .9s cubic-bezier(.2,.8,.2,1) .65s forwards}.dot{opacity:0;animation:pop .45s ease 1.35s forwards}.glow{animation:breathe 3s ease-in-out infinite}@keyframes draw{to{stroke-dashoffset:0}}@keyframes pop{to{opacity:1}}@keyframes breathe{50%{filter:drop-shadow(0 0 42px #ffb000)}}</style>
<rect width="1024" height="1024" rx="224" fill="#070A0F"/>
<path class="hex glow" d="M512 118 853.5 315v394L512 906 170.5 709V315L512 118Z" stroke="#FFB000" stroke-width="34" stroke-linejoin="round"/>
<path class="pulse" d="M333 691V332M333 691H463M280 537H402L455 407 565 681 628 537H744" stroke="#F5E7C8" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<circle class="dot" cx="744" cy="537" r="23" fill="#22D3EE"/>
</svg>'''
(BASE/'logo/linacre-v02-animated-mark.svg').write_text(anim_svg)
print((BASE/'logo/linacre-v02-mark.svg').relative_to(ROOT)); print((BASE/'logo/linacre-v02-wordmark.svg').relative_to(ROOT)); print((BASE/'logo/linacre-v02-animated-mark.svg').relative_to(ROOT))

# ---------------- logos raster ----------------
def make_logo(size=1024, bg=True, transparent=False):
    im=Image.new('RGBA',(size,size),(0,0,0,0))
    if bg:
        im=dark_bg(size,size,True)
        # radial texture
        d=ImageDraw.Draw(im,'RGBA')
        for rr,aa in [(size*.42,14),(size*.32,18),(size*.22,20)]:
            d.ellipse([size/2-rr,size/2-rr,size/2+rr,size/2+rr], outline=(255,176,0,aa), width=max(1,size//220))
        mask=Image.new('L',(size,size),0); md=ImageDraw.Draw(mask); md.rounded_rectangle([0,0,size-1,size-1], radius=int(size*.22), fill=255)
        im.putalpha(mask)
    draw_premium_mark(im,size/2,size/2,size*.36,stroke=int(size*.033),glow=bg,intensity=1.15)
    return im

for s in [1024,512,256]: save(make_logo(s,True), BASE/f'logo/linacre-v02-mark-glow-{s}.png')
save(make_logo(1024,False), BASE/'logo/linacre-v02-mark-transparent-1024.png')
for s in [16,32,64,180,192,512]: save(make_logo(s,True), BASE/f'logo/linacre-v02-icon-{s}x{s}.png')
make_logo(256,True).save(BASE/'logo/favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
print((BASE/'logo/favicon.ico').relative_to(ROOT))
# common names
for src,dst in [(16,'favicon-16x16.png'),(32,'favicon-32x32.png'),(180,'apple-touch-icon.png'),(192,'android-chrome-192x192.png'),(512,'android-chrome-512x512.png')]:
    Image.open(BASE/f'logo/linacre-v02-icon-{src}x{src}.png').save(BASE/'logo'/dst)

# wordmark raster
W,H=1800,480
im=add_overlays(load_src('linacre-v02-cinematic-amber-command-room.png',(W,H),(0.44,0.48)), shade=.52, grid=False)
glass_card(im,[44,44,W-44,H-44],radius=58,fill=(7,10,15,136),outline=(255,176,0,78))
draw_premium_mark(im,225,240,132,stroke=14,glow=True)
d=ImageDraw.Draw(im,'RGBA'); draw_wordmark(d,430,145,1.26,tagline=True)
d.line([(435,343),(1378,343)], fill=(255,176,0,160), width=3)
save(im, BASE/'logo/linacre-v02-wordmark-horizontal-1800x480.png')
im2=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im2,'RGBA'); draw_premium_mark(im2,225,240,132,stroke=14,glow=False); draw_wordmark(d,430,145,1.26,True); d.line([(435,343),(1378,343)], fill=(255,176,0,160), width=3)
save(im2, BASE/'logo/linacre-v02-wordmark-transparent-1800x480.png')

# manifest
(BASE/'logo/site.webmanifest').write_text('''{
  "name": "Linacre.site",
  "short_name": "Linacre",
  "icons": [
    {"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},
    {"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}
  ],
  "theme_color": "#F59E0B",
  "background_color": "#070A0F",
  "display": "standalone"
}
''')

# ---------------- composition helpers ----------------
def premium_banner(W,H,path,title,subtitle,kicker='amber · hexagon · pulse · cyber', mode='left', source='linacre-v02-cinematic-amber-command-room.png', focus=(.52,.48)):
    im=add_overlays(load_src(source,(W,H),focus), shade=.34, grid=False)
    d=ImageDraw.Draw(im,'RGBA')
    # left/readability shadow
    if mode != 'center':
        grad=np.zeros((H,W,4),dtype=np.uint8); x=np.linspace(1,0,W)[None,:]; grad[...,3]=(x**1.7*188).astype(np.uint8)
        im.alpha_composite(Image.fromarray(grad,'RGBA'))
    else:
        d.rectangle([0,0,W,H], fill=(0,0,0,72))
    # decorative panels
    for i in range(3):
        bx=int(W*(.62+i*.09)); by=int(H*(.18+i*.13)); bw=int(W*.20); bh=int(H*.18)
        d.rounded_rectangle([bx,by,bx+bw,by+bh], radius=max(16,H//18), fill=(7,10,15,52), outline=(255,176,0,32), width=1)
    if mode=='center':
        draw_premium_mark(im,W/2,H*.27,min(W,H)*.115,stroke=max(6,int(H*.018)),glow=True)
        tf=fit_font(title,int(W*.78),int(H*.12),bold=True,cond=True)
        sf=fit_font(subtitle,int(W*.72),int(H*.045),bold=False)
        d.text((W/2,H*.43),title,font=tf,fill=CREAM,anchor='mm')
        d.text((W/2,H*.53),subtitle,font=sf,fill=MUTED,anchor='mm')
        label_pill(d,int(W*.50-190),int(H*.62),kicker,fill=AMBER,size=max(12,int(H*.018)))
    else:
        x=int(W*.07); y=int(H*.24)
        draw_premium_mark(im,int(W*.84),int(H*.52),min(W,H)*.26,stroke=max(8,int(H*.035)),glow=True,intensity=.8)
        label_pill(d,x,int(H*.13),kicker,fill=AMBER,size=max(11,int(H*.032)))
        tf=fit_font(title,int(W*.58),int(H*.17),bold=True,cond=True)
        sf=fit_font(subtitle,int(W*.55),int(H*.057),bold=False)
        d.text((x,y),title,font=tf,fill=CREAM)
        d.text((x,y+int(H*.19)),wrap_text(subtitle,sf,int(W*.54)),font=sf,fill=MUTED,spacing=max(4,int(H*.012)))
        d.line([(x,y+int(H*.36)),(int(W*.70),y+int(H*.36))], fill=(255,176,0,170), width=max(2,H//190))
        d.text((x,y+int(H*.43)),'Linacre.site',font=font(max(20,int(H*.07)),bold=True,cond=True),fill=CREAM)
    save(im,path)

premium_banner(1584,396,BASE/'social/linacre-v02-linkedin-banner-1584x396.png','David Linacre','Full-Stack & AI Engineer · Tools, roadmaps, AI experiments','SIGNATURE IDENTITY',mode='left')
premium_banner(1500,500,BASE/'social/linacre-v02-x-header-1500x500.png','Full-Stack & AI Engineering','Tools, roadmaps, experiments, and clean web systems','LINACRE.SITE',mode='left',focus=(.5,.5))
premium_banner(1600,500,BASE/'social/linacre-v02-github-readme-banner-1600x500.png','Linacre.site','A premium full-stack and AI engineering toolkit','REACT · TYPESCRIPT · EXPRESS · AI LAB',mode='center')
premium_banner(2560,1440,BASE/'social/linacre-v02-youtube-banner-2560x1440.png','Linacre.site','Tools, builds, AI experiments','FULL-STACK & AI ENGINEERING',mode='center')

# social avatars
save(make_logo(800,True), BASE/'social/linacre-v02-social-avatar-800x800.png')
save(make_logo(400,True), BASE/'social/linacre-v02-social-avatar-400x400.png')

# ---------------- web assets ----------------
# OG
W,H=1200,630
im=add_overlays(load_src('linacre-v02-cinematic-amber-command-room.png',(W,H),(.55,.5)), shade=.45, grid=False)
glass_card(im,[52,54,W-52,H-54],radius=44,fill=(7,10,15,142),outline=(255,176,0,82),blur=False)
d=ImageDraw.Draw(im,'RGBA')
draw_premium_mark(im,205,315,115,stroke=13,glow=True)
d.text((370,170),'Linacre.site',font=font(74,bold=True,cond=True),fill=CREAM)
d.text((372,252),'Full-Stack & AI Engineering Toolkit',font=fit_font('Full-Stack & AI Engineering Toolkit',720,40,bold=True),fill=AMBER)
body='Tools, roadmaps, AI experiments, and clean web systems from David Linacre.'
d.text((374,322),wrap_text(body,font(28),680),font=font(28),fill=MUTED,spacing=9)
d.line([(374,466),(1048,466)],fill=(255,176,0,168),width=3)
d.text((374,510),'amber · hexagon · pulse · cyber',font=font(19,mono=True),fill=CREAM)
save(im, BASE/'web/linacre-v02-og-card-1200x630.png')
# hero no text
im=add_overlays(load_src('linacre-v02-cinematic-amber-command-room.png',(2400,1350),(.55,.46)), shade=.24, grid=False)
d=ImageDraw.Draw(im,'RGBA')
# extra safe overlay left for hero copy
left=np.zeros((1350,2400,4),dtype=np.uint8); x=np.linspace(1,0,2400)[None,:]; left[...,3]=(x**1.25*150).astype(np.uint8); im.alpha_composite(Image.fromarray(left,'RGBA'))
for x0,y0,w0,h0 in [(120,120,780,430),(132,680,520,240),(1540,160,560,300)]:
    d.rounded_rectangle([x0,y0,x0+w0,y0+h0], radius=48, outline=(255,176,0,28), fill=(7,10,15,30), width=2)
save(im, BASE/'web/linacre-v02-hero-background-2400x1350.jpg')
# homepage preview with text/card
im=add_overlays(load_src('linacre-v02-cinematic-amber-command-room.png',(1920,1080),(.55,.47)), shade=.45, grid=False)
d=ImageDraw.Draw(im,'RGBA')
glass_card(im,[78,78,1842,1002],radius=58,fill=(7,10,15,92),outline=(255,176,0,52))
label_pill(d,140,160,'AMBER · HEXAGON · PULSE · CYBER',size=20)
headline='Full-stack and AI engineering, built with calm systems.'
hf=fit_font(headline,850,82,bold=True,cond=True)
d.text((140,245),wrap_text(headline,hf,850),font=hf,fill=CREAM,spacing=2)
d.text((145,535),wrap_text('Linacre.site is a toolkit directory, AI lab, roadmap, and changelog-driven workspace for modern web builders.',font(31),760),font=font(31),fill=MUTED,spacing=10)
label_pill(d,145,700,'EXPLORE THE TOOLKIT',size=19); label_pill(d,405,700,'TRY THE AI LAB',fill=(17,24,39),dark=False,size=19)
draw_premium_mark(im,1530,545,210,stroke=22,glow=True)
save(im, BASE/'web/linacre-v02-homepage-preview-1920x1080.png')
# brand board
W,H=2400,1600
im=add_overlays(load_src('linacre-v02-social-amber-signal-texture.png',(W,H),(.5,.5)), shade=.48, grid=False)
d=ImageDraw.Draw(im,'RGBA')
d.text((110,90),'Linacre.site V02',font=font(104,bold=True,cond=True),fill=CREAM)
d.text((118,202),'premium amber-coded engineering identity',font=font(34,mono=True),fill=AMBER)
draw_premium_mark(im,2060,235,150,stroke=17,glow=True)
# palette
palette=[('Ink','#070A0F',INK),('Slate','#0B1220',SLATE),('Panel','#111827',PANEL),('Amber','#F59E0B',AMBER),('Glow','#FFB000',GLOW),('Cream','#F5E7C8',CREAM),('Cyan','#22D3EE',CYAN)]
for i,(name,hexv,col) in enumerate(palette):
    x=110+i*310; y=1240
    d.rounded_rectangle([x,y,x+248,y+210],radius=32,fill=col+(255,),outline=(255,255,255,38),width=2)
    tc=INK if name in ['Amber','Glow','Cream','Cyan'] else CREAM
    d.text((x+24,y+116),name,font=font(31,bold=True),fill=tc)
    d.text((x+24,y+158),hexv,font=font(22,mono=True),fill=tc)
# mood cards
cards=[('Visual language','Cinematic dark workspace, amber signal lines, hexagonal structure, premium restraint.'),('Audio signature','Quiet felt-piano intro, warm Rhodes build, tiny chorus lift, subtle digital pulse.'),('Voice','Clear, practical, builder-led. Technical without hype; premium without becoming cold.')]
for i,(t,b) in enumerate(cards):
    x=115+i*720; y=520
    glass_card(im,[x,y,x+620,y+430],radius=44,fill=(7,10,15,126),outline=(255,176,0,70))
    d.text((x+46,y+48),t,font=font(43,bold=True,cond=True),fill=CREAM)
    d.text((x+48,y+130),wrap_text(b,font(29),520),font=font(29),fill=MUTED,spacing=9)
    d.line([(x+48,y+346),(x+520,y+346)],fill=(255,176,0,145),width=3)
save(im, BASE/'web/linacre-v02-brand-board-2400x1600.jpg')

# ---------------- social square templates ----------------
def square_card(path,label,title,bullets,kind='default'):
    W=H=1080
    source='linacre-v02-social-amber-signal-texture.png'
    im=add_overlays(load_src(source,(W,H),(.5,.5)), shade=.45, grid=False)
    d=ImageDraw.Draw(im,'RGBA')
    glass_card(im,[58,58,W-58,H-58],radius=54,fill=(7,10,15,128),outline=(255,176,0,78))
    draw_premium_mark(im,897,158,66,stroke=8,glow=True,intensity=.72)
    label_pill(d,100,110,label.upper(),size=18)
    tf=fit_font(title,805,68,bold=True,cond=True,min_size=42)
    d.text((100,235),wrap_text(title,tf,805),font=tf,fill=CREAM,spacing=4)
    y=555
    for i,b in enumerate(bullets):
        # numbered neon tick
        d.rounded_rectangle([104,y+4,152,y+52],radius=14,fill=(245,158,11,230))
        d.text((128,y+13),str(i+1),font=font(21,bold=True,mono=True),fill=INK,anchor='ma')
        bf=font(30)
        d.text((178,y),wrap_text(b,bf,750),font=bf,fill=MUTED,spacing=6)
        y += 112
    d.line([(100,920),(980,920)],fill=(255,176,0,160),width=3)
    d.text((100,956),'Linacre.site',font=font(27,bold=True,cond=True),fill=CREAM)
    d.text((760,958),'save · build · ship',font=font(18,mono=True),fill=AMBER)
    save(im,path)

square_card(BASE/'social/linacre-v02-launch-graphic-1080x1080.png','launch','Linacre.site is no longer just a portfolio.',['A curated toolkit for modern builders','An AI Lab for practical experiments','A changelog that treats the site like a product'])
square_card(BASE/'social/linacre-v02-toolkit-card-1080x1080.png','toolkit','The best developer stack is useful before it is impressive.',['Start with tools you can actually use','Build a workflow you understand','Ship small releases and document them'])
square_card(BASE/'social/linacre-v02-changelog-card-1080x1080.png','v3.5','React & Full-Stack Evolution',['React + TypeScript workspace','Secure AI chat routes','Command palette, toolkit polish, PWA fixes'])
# code card
W=H=1080
im=add_overlays(load_src('linacre-v02-social-amber-signal-texture.png',(W,H),(.5,.5)), shade=.50, grid=False); d=ImageDraw.Draw(im,'RGBA')
glass_card(im,[58,58,1022,1022],radius=54,fill=(7,10,15,132),outline=(255,176,0,78))
label_pill(d,100,108,'CODE NOTE',size=18); draw_premium_mark(im,898,158,64,stroke=8,glow=True,intensity=.65)
d.text((100,220),'Use restraint to make cyber feel premium.',font=fit_font('Use restraint to make cyber feel premium.',800,56,bold=True,cond=True),fill=CREAM)
# terminal code window
d.rounded_rectangle([100,380,980,785],radius=30,fill=(8,12,21,225),outline=(255,176,0,72),width=2)
d.rounded_rectangle([100,380,980,442],radius=30,fill=(245,158,11,220)); d.rectangle([100,412,980,442],fill=(245,158,11,220))
d.text((132,397),'linacre-brand.ts',font=font(22,bold=True,mono=True),fill=INK)
code=['const linacre = {','  accent: "amber",','  shape: "hexagon",','  motion: "pulse",','  mood: "quietly premium",','};']
y=488
for i,line in enumerate(code,1):
    d.text((132,y),str(i).rjust(2),font=font(26,mono=True),fill=MUTED)
    d.text((200,y),line,font=font(26,mono=True),fill=AMBER if i in [2,3,4,5] else CREAM)
    y+=52
d.text((100,842),wrap_text('One strong visual system beats ten random effects. Keep the signal recognisable.',font(29),820),font=font(29),fill=MUTED,spacing=8)
d.line([(100,930),(980,930)],fill=(255,176,0,160),width=3); d.text((100,958),'Linacre.site',font=font(27,bold=True,cond=True),fill=CREAM)
save(im,BASE/'social/linacre-v02-code-card-1080x1080.png')
# reel bg
W,H=1080,1920
im=add_overlays(load_src('linacre-v02-vertical-reel-amber-workspace.png',(W,H),(.5,.5)), shade=.30, grid=False)
d=ImageDraw.Draw(im,'RGBA')
# safe caption areas + bottom brand
for y,alpha in [(300,44),(860,32),(1340,44)]:
    d.rounded_rectangle([94,y,986,y+260],radius=44,fill=(7,10,15,alpha),outline=(255,176,0,32),width=2)
draw_premium_mark(im,540,250,92,stroke=10,glow=True)
d.line([(130,1685),(950,1685)],fill=(255,176,0,170),width=4)
d.text((540,1760),'Linacre.site',font=font(54,bold=True,cond=True),fill=CREAM,anchor='mm')
d.text((540,1822),'FULL-STACK & AI ENGINEERING',font=font(23,mono=True),fill=AMBER,anchor='mm')
save(im,BASE/'social/linacre-v02-reel-background-1080x1920.png')

# carousel
slides=[
('01','COVER','A portfolio should work like a product.',['Make it useful enough to revisit.']),
('02','PROBLEM','Most portfolios are static.',['They show skills once.','They rarely create ongoing value.']),
('03','PRINCIPLE','Build a useful system around your work.',['Toolkit. Roadmap. AI Lab. Changelog.','Proof of taste through structure.']),
('04','EXAMPLE','Linacre.site becomes the product.',['Curated tools','AI experiments','Release history','Build notes']),
('05','STACK','The stack tells the story.',['React + TypeScript','Express routes','Tailwind/CSS tokens','AI provider workflows']),
('06','CHECKLIST','Before you launch, check the signal.',['Clear hero','Searchable resources','Accessible interactions','Strong preview card']),
('07','CTA','Explore the build and steal the structure.',['Linacre.site','amber · hexagon · pulse · cyber'])
]
for num,label,title,bullets in slides:
    square_card(BASE/f'social/carousel/linacre-v02-carousel-{num}-{label.lower()}-1080x1080.png',label,title,bullets)

# ---------------- animation GIF ----------------
frames=[]; S=720
bgsrc=load_src('linacre-v02-social-amber-signal-texture.png',(S,S),(.5,.5))
for i in range(72):
    t=i/71
    im=add_overlays(bgsrc.copy(), shade=.40, grid=False, grain=False)
    d=ImageDraw.Draw(im,'RGBA')
    # dark wipe + pulse line
    d.rectangle([0,0,S,S], fill=(0,0,0,int(70*(1-t))))
    y=S*.52; l=S*(.08+.78*min(1,t*1.6)); x0=S/2-l/2; x1=S/2+l/2
    d.line([(x0,y),(x1,y)],fill=(255,176,0,int(70+110*min(1,t*2))),width=4)
    # mark reveal layer with alpha/scale
    prog=min(1,max(0,(t-.08)/.62)); r=S*.34*(.82+.18*prog)
    layer=Image.new('RGBA',(S,S),(0,0,0,0)); draw_premium_mark(layer,S/2,S/2,r,stroke=int(S*.028),glow=True,intensity=1.1)
    layer.putalpha(Image.eval(layer.getchannel('A'),lambda a:int(a*prog)))
    im.alpha_composite(layer)
    if t>.66:
        alpha=int(255*min(1,(t-.66)/.18))
        txt=Image.new('RGBA',(S,S),(0,0,0,0)); td=ImageDraw.Draw(txt,'RGBA')
        td.text((S/2,S*.84),'Linacre.site',font=font(42,bold=True,cond=True),fill=CREAM+(alpha,),anchor='mm')
        td.text((S/2,S*.895),'FULL-STACK & AI',font=font(15,mono=True),fill=AMBER+(alpha,),anchor='mm')
        if int(t*14)%2==0:
            td.rectangle([S*.64,S*.823,S*.66,S*.858],fill=AMBER+(alpha,))
        im.alpha_composite(txt)
    frames.append(im.convert('P', palette=Image.Palette.ADAPTIVE))
frames[0].save(BASE/'video/linacre-v02-logo-sting-03s.gif',save_all=True,append_images=frames[1:],duration=42,loop=0,optimize=True)
print((BASE/'video/linacre-v02-logo-sting-03s.gif').relative_to(ROOT))

# ---------------- css/copy/readme ----------------
(BASE/'css/linacre-v02-premium-tokens.css').write_text('''/* Linacre.site V02 Premium Tokens */
:root {
  --linacre-ink: #070A0F;
  --linacre-slate: #0B1220;
  --linacre-panel: #111827;
  --linacre-panel-soft: #172033;
  --linacre-amber: #F59E0B;
  --linacre-amber-glow: #FFB000;
  --linacre-cream: #F5E7C8;
  --linacre-muted: #94A3B8;
  --linacre-cyan: #22D3EE;
  --linacre-border: rgba(245, 158, 11, .24);
  --linacre-glow: 0 0 42px rgba(255, 176, 0, .28);
  --linacre-ease: cubic-bezier(.2,.8,.2,1);
}
.linacre-v02-surface {
  background: linear-gradient(180deg, rgba(17,24,39,.82), rgba(7,10,15,.82));
  border: 1px solid var(--linacre-border);
  border-radius: 32px;
  box-shadow: 0 28px 90px rgba(0,0,0,.34), var(--linacre-glow);
}
.linacre-v02-pulse-line { height: 2px; background: linear-gradient(90deg, transparent, var(--linacre-amber-glow), transparent); }
''')
(BASE/'copy/linacre-v02-launch-copy.md').write_text('''# Linacre.site V02 Launch Copy

## Short Positioning

Linacre.site is a premium full-stack and AI engineering workspace: tools, roadmaps, experiments, and changelog-driven build notes with a soft retro-modern amber identity.

## Launch Post

I’ve pushed the Linacre.site brand further.

The new direction is built around a simple signal:

amber · hexagon · pulse · cyber

But the goal is not loud cyberpunk. It is a calmer kind of technical confidence: cinematic dark surfaces, warm amber signal lines, useful tools, AI experiments, and a site that behaves more like a living product than a static portfolio.

The system now includes:

- a premium logo and wordmark
- social banners and post templates
- Open Graph/share cards
- a soft retro-modern audio identity
- a launch carousel
- website hero assets and components
- a practical toolkit/AI/changelog structure

The design rule is simple: make the useful thing feel memorable.

Explore it at https://linacre.site
''')
(BASE/'README.md').write_text('''# Linacre.site V02 Premium Asset Pack

This is the upgraded “turn-heads” version of the Linacre.site brand system.

## What changed from V01

- More cinematic backgrounds using AI-generated amber command-room imagery.
- Stronger logo rendering with deeper glow, inner hex detail, and cleaner pulse mark.
- More premium social layouts with better hierarchy and negative space.
- New carousel and reel assets designed for launch/discovery.
- Upgraded Open Graph, hero, LinkedIn, X, GitHub, and YouTube assets.
- Animated SVG and GIF logo sting.
- Dedicated V02 CSS tokens and launch copy.

## Recommended first files

- `web/linacre-v02-homepage-preview-1920x1080.png`
- `web/linacre-v02-og-card-1200x630.png`
- `social/linacre-v02-linkedin-banner-1584x396.png`
- `social/linacre-v02-launch-graphic-1080x1080.png`
- `video/linacre-v02-logo-sting-03s.gif`
- `logo/linacre-v02-mark.svg`
- `logo/linacre-v02-animated-mark.svg`

## Usage rule

Use V02 for public-facing launch, social, profile, and hero assets. Keep V01 as the practical system/reference layer.
''')
print('V02 premium visual assets complete.')
