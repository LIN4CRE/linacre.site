from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np, math

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / '02-assets' / 'v03-green-cyberpunk'
SRC = BASE / 'ai-source'
for d in ['logo','web','social','social/carousel','video','css','copy']:
    (BASE/d).mkdir(parents=True, exist_ok=True)

# V03 palette — green cyberpunk / dark terminal
INK=(2,5,4); BLACK=(0,0,0); SLATE=(5,13,10); PANEL=(8,22,16); PANEL2=(10,32,24)
NEON=(57,255,20); MATRIX=(0,255,120); DEEP=(0,120,70); ACID=(170,255,0); MINT=(205,255,218)
MUTED=(118,165,140); CYAN=(0,255,214); RED=(255,55,88)
FONT_REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
FONT_MONO='/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'
FONT_MONO_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf'

def font(size,bold=False,mono=False):
    return ImageFont.truetype(FONT_MONO_BOLD if mono and bold else FONT_MONO if mono else FONT_BOLD if bold else FONT_REG, size)

def bbox(draw,text,f):
    b=draw.textbbox((0,0),text,font=f); return b[2]-b[0], b[3]-b[1]

def fit_font(text,max_w,start,min_size=16,bold=True,mono=False):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    for s in range(start,min_size-1,-2):
        f=font(s,bold=bold,mono=mono)
        if bbox(d,text,f)[0]<=max_w: return f
    return font(min_size,bold=bold,mono=mono)

def wrap_text(text,f,max_w):
    d=ImageDraw.Draw(Image.new('RGB',(10,10)))
    words=text.split(); lines=[]; cur=''
    for w in words:
        test=(cur+' '+w).strip()
        if not cur or bbox(d,test,f)[0]<=max_w: cur=test
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    return '\n'.join(lines)

def cover(img,size,focus=(.5,.5)):
    img=img.convert('RGB'); w,h=img.size; W,H=size
    scale=max(W/w,H/h); nw,nh=int(w*scale)+1,int(h*scale)+1
    im=img.resize((nw,nh),Image.Resampling.LANCZOS)
    x=int((nw-W)*focus[0]); y=int((nh-H)*focus[1])
    x=max(0,min(x,nw-W)); y=max(0,min(y,nh-H))
    return im.crop((x,y,x+W,y+H)).convert('RGBA')

def dark_bg(W,H):
    y=np.linspace(0,1,H)[:,None]; x=np.linspace(0,1,W)[None,:]
    t=(x*.42+y*.58)
    arr=np.zeros((H,W,3),dtype=np.float32)
    arr[:]=np.array(INK)*(1-t[...,None])+np.array(SLATE)*t[...,None]
    def glow(cx,cy,r,c,a):
        nonlocal arr
        xx=np.arange(W)[None,:]; yy=np.arange(H)[:,None]
        dist=np.sqrt((xx-cx)**2+(yy-cy)**2)
        inten=np.clip(1-dist/r,0,1)**2*a
        arr=arr*(1-inten[...,None])+np.array(c)*inten[...,None]
    glow(W*.18,H*.12,min(W,H)*.72,NEON,.18)
    glow(W*.80,H*.18,min(W,H)*.46,CYAN,.08)
    glow(W*.50,H*.98,min(W,H)*.78,DEEP,.14)
    return Image.fromarray(np.clip(arr,0,255).astype('uint8'),'RGB').convert('RGBA')

def load_src(name,size,focus=(.5,.5)):
    p=SRC/name
    return cover(Image.open(p),size,focus) if p.exists() else dark_bg(*size)

def add_matrix_overlay(im, shade=.38, grid=True, rain=True, grain=True, vignette=True):
    W,H=im.size
    d=ImageDraw.Draw(im,'RGBA')
    d.rectangle([0,0,W,H],fill=(0,8,4,int(255*shade)))
    # left/right cinematic dark gradient
    arr=np.zeros((H,W,4),dtype=np.uint8)
    x=np.linspace(0,1,W)[None,:]
    alpha=((np.abs(x-.5)*2)**1.8*130).astype(np.uint8)
    arr[...,3]=alpha
    im.alpha_composite(Image.fromarray(arr,'RGBA'))
    d=ImageDraw.Draw(im,'RGBA')
    if grid:
        step=max(40,min(W,H)//18)
        for gx in range(-step,W+step,step): d.line([(gx,0),(gx,H)],fill=(57,255,20,14),width=1)
        for gy in range(-step,H+step,step): d.line([(0,gy),(W,gy)],fill=(57,255,20,10),width=1)
    if rain:
        rng=np.random.default_rng(404)
        chars='01<>/{}[]$#LIN4CRE'
        f=font(max(8,min(W,H)//70),mono=True)
        for col in range(0,W,max(26,W//70)):
            y0=int(rng.integers(-H,H))
            for j in range(0,H,max(28,H//42)):
                if rng.random()<.22:
                    ch=chars[int(rng.integers(0,len(chars)))]
                    a=int(rng.integers(18,62))
                    d.text((col,y0+j),ch,font=f,fill=(57,255,20,a))
    # scanlines
    for y in range(0,H,5):
        d.line([(0,y),(W,y)],fill=(0,0,0,22),width=1)
    d.line([(0,int(H*.74)),(W,int(H*.74))],fill=(57,255,20,55),width=max(2,H//250))
    if vignette:
        mask=Image.new('L',(W,H),0); md=ImageDraw.Draw(mask)
        md.ellipse([int(-W*.20),int(-H*.34),int(W*1.20),int(H*1.30)],fill=220)
        mask=mask.filter(ImageFilter.GaussianBlur(int(min(W,H)*.14)))
        v=Image.new('RGBA',(W,H),(0,0,0,160)); v.putalpha(ImageOps.invert(mask)); im.alpha_composite(v)
    if grain:
        rng=np.random.default_rng(808)
        noise=rng.integers(0,42,(H,W,1),dtype=np.uint8)
        n=np.zeros((H,W,4),dtype=np.uint8); n[...,:3]=noise; n[...,3]=14
        im.alpha_composite(Image.fromarray(n,'RGBA'))
    return im

def hex_pts(cx,cy,r,rot=-90):
    return [(cx+r*math.cos(math.radians(rot+i*60)),cy+r*math.sin(math.radians(rot+i*60))) for i in range(6)]

def round_line(d,pts,fill,width):
    d.line(pts,fill=fill,width=width,joint='curve')
    rad=width/2
    for x,y in [pts[0],pts[-1]]:
        d.ellipse([x-rad,y-rad,x+rad,y+rad],fill=fill)

def draw_neon_mark(im,cx,cy,r,stroke=None,glow=True,intensity=1.0):
    W,H=im.size; stroke=stroke or max(6,int(r*.074))
    if glow:
        layer=Image.new('RGBA',(W,H),(0,0,0,0)); gd=ImageDraw.Draw(layer,'RGBA')
        for rr,aa,wid in [(r*1.05,165,stroke*4),(r*.82,50,stroke*2),(r*1.28,38,stroke)]:
            p=hex_pts(cx,cy,rr); gd.line(p+[p[0]],fill=(57,255,20,int(aa*intensity)),width=max(1,int(wid)),joint='curve')
        layer=layer.filter(ImageFilter.GaussianBlur(max(5,stroke*2)))
        im.alpha_composite(layer)
    d=ImageDraw.Draw(im,'RGBA')
    outer=hex_pts(cx,cy,r); inner=hex_pts(cx,cy,r*.80)
    d.line(outer+[outer[0]],fill=(0,40,18,255),width=stroke+6,joint='curve')
    d.line(outer+[outer[0]],fill=(57,255,20,255),width=stroke,joint='curve')
    d.line(inner+[inner[0]],fill=(0,255,120,98),width=max(2,stroke//3),joint='curve')
    for i in [0,1,5]: d.line([outer[i],outer[(i+1)%6]],fill=(205,255,218,220),width=max(2,stroke//3),joint='curve')
    # L monogram + pulse, slightly outlaw/terminal angled
    lw=max(6,int(stroke*.92)); sx=cx-r*.50
    round_line(d,[(sx,cy-r*.54),(sx,cy+r*.56),(cx-r*.09,cy+r*.56)],fill=(57,255,20,245),width=lw)
    pts=[(cx-r*.62,cy+r*.04),(cx-r*.25,cy+r*.04),(cx-r*.12,cy-r*.25),(cx+r*.11,cy+r*.50),(cx+r*.31,cy+r*.04),(cx+r*.66,cy+r*.04)]
    round_line(d,pts,fill=(205,255,218,255),width=lw)
    dot=max(4,int(stroke*.75)); x,y=pts[-1]
    d.ellipse([x-dot,y-dot,x+dot,y+dot],fill=(0,255,214,250))
    # small breach/cursor ticks
    for a in [30,150,270]:
        nx=cx+r*1.01*math.cos(math.radians(a)); ny=cy+r*1.01*math.sin(math.radians(a))
        d.rectangle([nx-stroke*.20,ny-stroke*.20,nx+stroke*.20,ny+stroke*.20],fill=(57,255,20,155))

def glass(im,box,radius=36,fill=(0,12,6,140),outline=(57,255,20,80)):
    d=ImageDraw.Draw(im,'RGBA')
    d.rounded_rectangle(box,radius=radius,fill=fill,outline=outline,width=2)
    x0,y0,x1,y1=map(int,box)
    d.line([(x0+radius,y0+1),(x1-radius,y0+1)],fill=(205,255,218,34),width=1)

def label(d,x,y,text,size=16,fill=NEON,dark=True):
    f=font(size,bold=True,mono=True); tw,th=bbox(d,text,f)
    d.rounded_rectangle([x,y,x+tw+28,y+th+18],radius=(th+18)//2,fill=fill+(238,))
    d.text((x+14,y+8),text,font=f,fill=INK if dark else MINT)
    return x+tw+28

def save(im,path,q=94):
    path=Path(path); path.parent.mkdir(parents=True,exist_ok=True)
    if path.suffix.lower() in ['.jpg','.jpeg']:
        im.convert('RGB').save(path,quality=q,optimize=True,progressive=True)
    else: im.save(path,optimize=True,compress_level=7)
    print(path.relative_to(ROOT))

# ---------- SVG logo assets ----------
logo_svg='''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="bg" cx="50%" cy="44%" r="75%"><stop offset="0" stop-color="#092016"/><stop offset=".55" stop-color="#050D0A"/><stop offset="1" stop-color="#000000"/></radialGradient><filter id="glow" x="0" y="0" width="1024" height="1024"><feGaussianBlur stdDeviation="20" result="b"/><feColorMatrix in="b" type="matrix" values="0 0 0 0 0.1 0 1 0 0 1 0 0 0 0 0.08 0 0 0 .9 0"/><feBlend in2="SourceGraphic" mode="screen"/></filter><linearGradient id="g" x1="190" y1="120" x2="850" y2="900"><stop stop-color="#D9FFDA"/><stop offset=".22" stop-color="#39FF14"/><stop offset=".7" stop-color="#00FF78"/><stop offset="1" stop-color="#007A46"/></linearGradient></defs>
<rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
<path d="M512 118 853.5 315v394L512 906 170.5 709V315L512 118Z" stroke="url(#g)" stroke-width="34" stroke-linejoin="round" filter="url(#glow)"/>
<path d="M512 190 791 351v322L512 834 233 673V351L512 190Z" stroke="#00FF78" stroke-opacity=".36" stroke-width="10"/>
<path d="M333 691V332M333 691H463" stroke="#39FF14" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M280 537H402L455 407 565 681 628 537H744" stroke="#D9FFDA" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="744" cy="537" r="23" fill="#00FFD6"/>
<text x="512" y="965" text-anchor="middle" fill="#39FF14" font-family="monospace" font-size="28" opacity=".8">github.com/LIN4CRE</text>
</svg>'''
(BASE/'logo/linacre-v03-green-neon-mark.svg').write_text(logo_svg)
anim_svg='''<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<style>.hex{stroke-dasharray:2400;stroke-dashoffset:2400;animation:draw 1.55s cubic-bezier(.2,.8,.2,1) forwards}.pulse{stroke-dasharray:900;stroke-dashoffset:900;animation:draw .9s cubic-bezier(.2,.8,.2,1) .65s forwards}.dot{opacity:0;animation:pop .45s ease 1.35s forwards}.scan{animation:scan 2.5s linear infinite}@keyframes draw{to{stroke-dashoffset:0}}@keyframes pop{to{opacity:1}}@keyframes scan{from{transform:translateY(-220px)}to{transform:translateY(1220px)}}</style>
<rect width="1024" height="1024" rx="224" fill="#000000"/><path class="scan" d="M0 0H1024" stroke="#39FF14" stroke-opacity=".38" stroke-width="8"/>
<path class="hex" d="M512 118 853.5 315v394L512 906 170.5 709V315L512 118Z" stroke="#39FF14" stroke-width="34" stroke-linejoin="round"/>
<path class="pulse" d="M333 691V332M333 691H463M280 537H402L455 407 565 681 628 537H744" stroke="#D9FFDA" stroke-width="38" stroke-linecap="round" stroke-linejoin="round"/>
<circle class="dot" cx="744" cy="537" r="23" fill="#00FFD6"/><text x="512" y="965" text-anchor="middle" fill="#39FF14" font-family="monospace" font-size="28">Linacre.site</text>
</svg>'''
(BASE/'logo/linacre-v03-green-animated-mark.svg').write_text(anim_svg)
print((BASE/'logo/linacre-v03-green-neon-mark.svg').relative_to(ROOT)); print((BASE/'logo/linacre-v03-green-animated-mark.svg').relative_to(ROOT))

def make_logo(size=1024,bg=True):
    im=Image.new('RGBA',(size,size),(0,0,0,0))
    if bg:
        im=dark_bg(size,size); add_matrix_overlay(im,shade=.20,grid=False,rain=False,grain=True)
        d=ImageDraw.Draw(im,'RGBA')
        for rr,aa in [(size*.45,20),(size*.33,25),(size*.22,24)]: d.ellipse([size/2-rr,size/2-rr,size/2+rr,size/2+rr],outline=(57,255,20,aa),width=max(1,size//230))
        mask=Image.new('L',(size,size),0); md=ImageDraw.Draw(mask); md.rounded_rectangle([0,0,size-1,size-1],radius=int(size*.22),fill=255); im.putalpha(mask)
    draw_neon_mark(im,size/2,size/2,size*.36,stroke=int(size*.033),glow=bg,intensity=1.18)
    return im
for s in [1024,512,256]: save(make_logo(s,True),BASE/f'logo/linacre-v03-green-neon-mark-{s}.png')
save(make_logo(1024,False),BASE/'logo/linacre-v03-green-neon-mark-transparent-1024.png')
for s in [16,32,64,180,192,512]: save(make_logo(s,True),BASE/f'logo/linacre-v03-icon-{s}x{s}.png')
make_logo(256,True).save(BASE/'logo/favicon.ico',sizes=[(16,16),(32,32),(48,48),(64,64),(128,128),(256,256)])
for src,dst in [(16,'favicon-16x16.png'),(32,'favicon-32x32.png'),(180,'apple-touch-icon.png'),(192,'android-chrome-192x192.png'),(512,'android-chrome-512x512.png')]: Image.open(BASE/f'logo/linacre-v03-icon-{src}x{src}.png').save(BASE/'logo'/dst)
print((BASE/'logo/favicon.ico').relative_to(ROOT))

# wordmark
W,H=1800,480
im=add_matrix_overlay(load_src('linacre-v03-green-code-tunnel.png',(W,H),(.55,.5)),shade=.50,grid=False,rain=True)
glass(im,[44,44,W-44,H-44],radius=58,fill=(0,9,5,145),outline=(57,255,20,96))
d=ImageDraw.Draw(im,'RGBA'); draw_neon_mark(im,220,235,132,stroke=14,glow=True)
d.text((430,137),'Linacre',font=font(96,bold=True),fill=MINT)
d.text((890,149),'.site',font=font(64,bold=True,mono=True),fill=NEON)
d.text((435,252),'OUTLAW CYBERPUNK · FULL-STACK & AI ENGINEERING',font=font(25,mono=True),fill=MUTED)
d.line([(435,315),(1400,315)],fill=(57,255,20,170),width=3)
d.text((435,350),'github.com/LIN4CRE',font=font(26,bold=True,mono=True),fill=NEON)
save(im,BASE/'logo/linacre-v03-green-wordmark-1800x480.png')
im2=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im2,'RGBA'); draw_neon_mark(im2,220,235,132,stroke=14,glow=False); d.text((430,137),'Linacre',font=font(96,bold=True),fill=MINT); d.text((890,149),'.site',font=font(64,bold=True,mono=True),fill=NEON); d.text((435,252),'OUTLAW CYBERPUNK · FULL-STACK & AI ENGINEERING',font=font(25,mono=True),fill=MUTED); d.text((435,350),'github.com/LIN4CRE',font=font(26,bold=True,mono=True),fill=NEON)
save(im2,BASE/'logo/linacre-v03-green-wordmark-transparent-1800x480.png')

(BASE/'logo/site.webmanifest').write_text('''{
  "name": "Linacre.site",
  "short_name": "Linacre",
  "icons": [
    {"src":"/android-chrome-192x192.png","sizes":"192x192","type":"image/png"},
    {"src":"/android-chrome-512x512.png","sizes":"512x512","type":"image/png"}
  ],
  "theme_color": "#39FF14",
  "background_color": "#000000",
  "display": "standalone"
}
''')

# ---------- composition helpers ----------
def banner(W,H,path,title,subtitle,kicker='LINACRE.SITE',source='linacre-v03-green-cyberpunk-hacker-lair.png',focus=(.55,.5),center=False):
    im=add_matrix_overlay(load_src(source,(W,H),focus),shade=.33,grid=False,rain=True)
    d=ImageDraw.Draw(im,'RGBA')
    if center: d.rectangle([0,0,W,H],fill=(0,0,0,65))
    else:
        grad=np.zeros((H,W,4),dtype=np.uint8); x=np.linspace(1,0,W)[None,:]; grad[...,3]=(x**1.7*190).astype(np.uint8); im.alpha_composite(Image.fromarray(grad,'RGBA'))
    # ghost panels
    for i in range(4):
        bx=int(W*(.60+i*.065)); by=int(H*(.15+i*.12)); bw=int(W*.16); bh=int(H*.18)
        d.rounded_rectangle([bx,by,bx+bw,by+bh],radius=max(14,H//20),fill=(0,0,0,58),outline=(57,255,20,32),width=1)
    if center:
        draw_neon_mark(im,W/2,H*.27,min(W,H)*.12,stroke=max(6,int(H*.018)),glow=True)
        tf=fit_font(title,int(W*.76),int(H*.12),bold=True)
        d.text((W/2,H*.44),title,font=tf,fill=MINT,anchor='mm')
        d.text((W/2,H*.54),subtitle,font=fit_font(subtitle,int(W*.72),int(H*.048),bold=False),fill=MUTED,anchor='mm')
        label(d,int(W*.5-190),int(H*.64),'github.com/LIN4CRE',size=max(13,int(H*.018)))
    else:
        x=int(W*.07); y=int(H*.21)
        label(d,x,int(H*.12),kicker.upper(),size=max(11,int(H*.034)))
        d.text((x,y),title,font=fit_font(title,int(W*.56),int(H*.17),bold=True),fill=MINT)
        d.text((x,y+int(H*.18)),wrap_text(subtitle,font(max(15,int(H*.055))),int(W*.58)),font=font(max(15,int(H*.055))),fill=MUTED,spacing=5)
        d.line([(x,y+int(H*.34)),(int(W*.72),y+int(H*.34))],fill=(57,255,20,170),width=max(2,H//180))
        d.text((x,y+int(H*.43)),'Linacre.site',font=font(max(18,int(H*.065)),bold=True),fill=MINT)
        d.text((x+int(W*.20),y+int(H*.448)),'github.com/LIN4CRE',font=font(max(12,int(H*.035)),bold=True,mono=True),fill=NEON)
        draw_neon_mark(im,int(W*.84),int(H*.52),min(W,H)*.25,stroke=max(7,int(H*.034)),glow=True,intensity=.86)
    save(im,path)

banner(1584,396,BASE/'social/linacre-v03-linkedin-banner-1584x396.png','David Linacre','Full-Stack & AI Engineer · Linacre.site · github.com/LIN4CRE','GREEN CYBERPUNK')
banner(1500,500,BASE/'social/linacre-v03-x-header-1500x500.png','Linacre.site','futuristic full-stack systems · AI lab · github.com/LIN4CRE','OUTLAW HACKER MODE')
banner(1600,500,BASE/'social/linacre-v03-github-readme-banner-1600x500.png','LIN4CRE','Linacre.site · full-stack & AI engineering · green cyberpunk toolkit','github.com/LIN4CRE',center=True,source='linacre-v03-green-code-tunnel.png')
banner(2560,1440,BASE/'social/linacre-v03-youtube-banner-2560x1440.png','Linacre.site','dark terminal builds · tools · AI experiments','github.com/LIN4CRE',center=True,source='linacre-v03-green-cyberpunk-hacker-lair.png')
save(make_logo(800,True),BASE/'social/linacre-v03-social-avatar-800x800.png'); save(make_logo(400,True),BASE/'social/linacre-v03-social-avatar-400x400.png')

# web OG
W,H=1200,630
im=add_matrix_overlay(load_src('linacre-v03-green-code-tunnel.png',(W,H),(.52,.48)),shade=.46,grid=False,rain=True)
glass(im,[52,54,W-52,H-54],radius=44,fill=(0,8,4,150),outline=(57,255,20,100))
d=ImageDraw.Draw(im,'RGBA'); draw_neon_mark(im,205,315,115,stroke=13,glow=True)
d.text((370,162),'Linacre.site',font=font(74,bold=True),fill=MINT)
d.text((372,250),'Green Cyberpunk Engineering',font=fit_font('Green Cyberpunk Engineering',720,42,bold=True),fill=NEON)
d.text((374,320),wrap_text('Full-stack tools, AI experiments, and dark terminal builds from LIN4CRE.',font(29),690),font=font(29),fill=MUTED,spacing=9)
d.line([(374,468),(1048,468)],fill=(57,255,20,180),width=3)
d.text((374,512),'github.com/LIN4CRE',font=font(22,bold=True,mono=True),fill=NEON)
save(im,BASE/'web/linacre-v03-og-card-1200x630.png')
# hero bg + homepage preview
im=add_matrix_overlay(load_src('linacre-v03-green-cyberpunk-hacker-lair.png',(2400,1350),(.55,.5)),shade=.22,grid=False,rain=True)
# left shade safe area
arr=np.zeros((1350,2400,4),dtype=np.uint8); x=np.linspace(1,0,2400)[None,:]; arr[...,3]=(x**1.1*158).astype(np.uint8); im.alpha_composite(Image.fromarray(arr,'RGBA'))
save(im,BASE/'web/linacre-v03-hero-background-2400x1350.jpg')
W,H=1920,1080
im=add_matrix_overlay(load_src('linacre-v03-green-cyberpunk-hacker-lair.png',(W,H),(.55,.5)),shade=.42,grid=False,rain=True)
d=ImageDraw.Draw(im,'RGBA'); glass(im,[74,74,W-74,H-74],radius=56,fill=(0,8,4,92),outline=(57,255,20,70))
label(d,135,145,'GREEN CYBERPUNK · OUTLAW HACKER AESTHETIC',size=19)
d.text((135,220),'Linacre.site',font=font(86,bold=True),fill=MINT)
d.text((140,325),wrap_text('Futuristic full-stack systems, AI experiments, and dark terminal builds.',font(40),760),font=font(40),fill=MUTED,spacing=10)
label(d,140,532,'VISIT LINACRE.SITE',size=19); label(d,405,532,'GITHUB.COM/LIN4CRE',size=19,fill=PANEL2,dark=False)
draw_neon_mark(im,1510,545,210,stroke=22,glow=True)
save(im,BASE/'web/linacre-v03-homepage-preview-1920x1080.png')
# matrix texture wallpaper
im=add_matrix_overlay(load_src('linacre-v03-green-terminal-grid-texture.png',(1600,1000),(.5,.5)),shade=.18,grid=True,rain=True)
save(im,BASE/'web/linacre-v03-terminal-texture-1600x1000.jpg')

# social square cards
def square(path,label_text,title,bullets):
    W=H=1080; im=add_matrix_overlay(load_src('linacre-v03-green-terminal-grid-texture.png',(W,H),(.5,.5)),shade=.42,grid=False,rain=True)
    d=ImageDraw.Draw(im,'RGBA'); glass(im,[58,58,W-58,H-58],radius=54,fill=(0,8,4,142),outline=(57,255,20,92))
    label(d,100,110,label_text.upper(),size=18); draw_neon_mark(im,895,158,66,stroke=8,glow=True,intensity=.80)
    tf=fit_font(title,820,64,bold=True)
    d.text((100,232),wrap_text(title,tf,820),font=tf,fill=MINT,spacing=4)
    y=552
    for i,b in enumerate(bullets):
        d.rounded_rectangle([104,y+4,154,y+54],radius=12,fill=NEON+(235,))
        d.text((129,y+14),str(i+1),font=font(22,bold=True,mono=True),fill=INK,anchor='ma')
        bf=font(29)
        d.text((178,y),wrap_text(b,bf,748),font=bf,fill=MUTED,spacing=7)
        y+=112
    d.line([(100,920),(980,920)],fill=(57,255,20,180),width=3)
    d.text((100,956),'Linacre.site',font=font(28,bold=True),fill=MINT)
    d.text((640,960),'github.com/LIN4CRE',font=font(18,bold=True,mono=True),fill=NEON)
    save(im,path)

square(BASE/'social/linacre-v03-launch-graphic-1080x1080.png','green mode','Linacre.site just went green cyberpunk.',['Smooth dark terminal theme','Neon hacker-console identity','Full-stack systems by LIN4CRE'])
square(BASE/'social/linacre-v03-darkweb-card-1080x1080.png','dark terminal','Darkweb-inspired look. Ethical builder energy.',['Outlaw aesthetic, clean execution','Noisy cyberpunk replaced with smooth UI','A brand that feels like a hidden console'])
square(BASE/'social/linacre-v03-toolkit-card-1080x1080.png','toolkit','Build like an operator, not a tourist.',['Curate the tools','Automate the workflow','Ship the proof'])
# code terminal card
W=H=1080; im=add_matrix_overlay(load_src('linacre-v03-green-terminal-grid-texture.png',(W,H),(.5,.5)),shade=.47,grid=False,rain=True); d=ImageDraw.Draw(im,'RGBA')
glass(im,[58,58,1022,1022],radius=54,fill=(0,8,4,150),outline=(57,255,20,92)); label(d,100,108,'TERMINAL DROP',size=18); draw_neon_mark(im,898,158,64,stroke=8,glow=True)
d.text((100,220),'Linacre.site // operator mode',font=fit_font('Linacre.site // operator mode',820,58,bold=True,mono=True),fill=MINT)
d.rounded_rectangle([100,360,980,800],radius=28,fill=(0,0,0,225),outline=(57,255,20,82),width=2)
d.rounded_rectangle([100,360,980,422],radius=28,fill=(57,255,20,225)); d.rectangle([100,392,980,422],fill=(57,255,20,225))
d.text((130,378),'linacre@site:~/ops',font=font(22,bold=True,mono=True),fill=INK)
lines=['$ whoami','LIN4CRE // full-stack + AI engineer','$ scan --brand','green neon · smooth dark · cyberpunk','$ open https://linacre.site','$ repo github.com/LIN4CRE']
y=470
for i,line in enumerate(lines):
    col=NEON if line.startswith('$') else MINT
    d.text((132,y),line,font=font(28,bold=True,mono=True),fill=col)
    y+=54
d.text((100,856),wrap_text('A darker social look for launches, build logs, GitHub banners, and terminal-style posts.',font(28),820),font=font(28),fill=MUTED,spacing=8)
d.line([(100,930),(980,930)],fill=(57,255,20,180),width=3); d.text((100,958),'Linacre.site',font=font(27,bold=True),fill=MINT); d.text((650,960),'github.com/LIN4CRE',font=font(18,bold=True,mono=True),fill=NEON)
save(im,BASE/'social/linacre-v03-terminal-code-card-1080x1080.png')
# reel bg
W,H=1080,1920; im=add_matrix_overlay(load_src('linacre-v03-green-vertical-darkweb-reel.png',(W,H),(.5,.5)),shade=.26,grid=False,rain=True); d=ImageDraw.Draw(im,'RGBA')
for y,a in [(300,46),(850,34),(1335,46)]: d.rounded_rectangle([94,y,986,y+260],radius=44,fill=(0,0,0,a),outline=(57,255,20,38),width=2)
draw_neon_mark(im,540,250,92,stroke=10,glow=True); d.line([(130,1688),(950,1688)],fill=(57,255,20,190),width=4)
d.text((540,1760),'Linacre.site',font=font(54,bold=True),fill=MINT,anchor='mm'); d.text((540,1822),'github.com/LIN4CRE',font=font(24,bold=True,mono=True),fill=NEON,anchor='mm')
save(im,BASE/'social/linacre-v03-reel-background-1080x1920.png')
# carousel
slides=[('01','ACCESS','Green cyberpunk mode activated.',['Linacre.site','github.com/LIN4CRE']),('02','SIGNAL','Smooth dark beats noisy neon.',['Black glass surfaces','Green terminal glow','Readable, premium hierarchy']),('03','IDENTITY','Outlaw hacker aesthetic, ethical builder core.',['Full-stack systems','AI experiments','Open GitHub proof']),('04','STACK','The brand works across the stack.',['Website hero','GitHub README','Social launches','Video intros']),('05','RULE','Make it feel hidden, but make it useful.',['Dark terminal energy','Clear navigation','Strong CTAs']),('06','CTA','Enter the build log.',['Linacre.site','github.com/LIN4CRE'])]
for num,label_text,title,bullets in slides:
    square(BASE/f'social/carousel/linacre-v03-carousel-{num}-{label_text.lower()}-1080x1080.png',label_text,title,bullets)

# animated GIF
S=720; frames=[]; bg=load_src('linacre-v03-green-terminal-grid-texture.png',(S,S),(.5,.5))
for i in range(72):
    t=i/71
    im=add_matrix_overlay(bg.copy(),shade=.35,grid=False,rain=True,grain=False,vignette=True)
    d=ImageDraw.Draw(im,'RGBA')
    # scan line animation
    sy=int(-80 + t*(S+160)); d.rectangle([0,sy,S,sy+6],fill=(57,255,20,90))
    # wipe pulse
    l=S*(.08+.80*min(1,t*1.55)); y=S*.52; d.line([(S/2-l/2,y),(S/2+l/2,y)],fill=(57,255,20,int(80+120*min(1,t*2))),width=4)
    prog=min(1,max(0,(t-.08)/.62)); layer=Image.new('RGBA',(S,S),(0,0,0,0)); draw_neon_mark(layer,S/2,S/2,S*.34*(.82+.18*prog),stroke=int(S*.028),glow=True,intensity=1.15)
    layer.putalpha(Image.eval(layer.getchannel('A'),lambda a:int(a*prog))); im.alpha_composite(layer)
    if t>.66:
        alpha=int(255*min(1,(t-.66)/.18)); txt=Image.new('RGBA',(S,S),(0,0,0,0)); td=ImageDraw.Draw(txt,'RGBA')
        td.text((S/2,S*.835),'Linacre.site',font=font(40,bold=True,mono=True),fill=MINT+(alpha,),anchor='mm')
        td.text((S/2,S*.895),'github.com/LIN4CRE',font=font(16,bold=True,mono=True),fill=NEON+(alpha,),anchor='mm')
        if int(t*14)%2==0: td.rectangle([S*.69,S*.817,S*.71,S*.855],fill=NEON+(alpha,))
        im.alpha_composite(txt)
    frames.append(im.convert('P',palette=Image.Palette.ADAPTIVE))
frames[0].save(BASE/'video/linacre-v03-green-logo-sting-03s.gif',save_all=True,append_images=frames[1:],duration=42,loop=0,optimize=True)
print((BASE/'video/linacre-v03-green-logo-sting-03s.gif').relative_to(ROOT))

# css + copy + readme
(BASE/'css/linacre-v03-green-cyberpunk-tokens.css').write_text('''/* Linacre.site V03 — Green Cyberpunk Neon Dark Theme */
:root {
  --linacre-ink: #020504;
  --linacre-black: #000000;
  --linacre-panel: #081610;
  --linacre-panel-soft: #0A2018;
  --linacre-neon: #39FF14;
  --linacre-matrix: #00FF78;
  --linacre-cyan: #00FFD6;
  --linacre-mint: #CDFFDA;
  --linacre-muted: #76A58C;
  --linacre-border: rgba(57, 255, 20, .28);
  --linacre-glow: 0 0 38px rgba(57, 255, 20, .32);
  --linacre-ease: cubic-bezier(.2,.8,.2,1);
}
.linacre-green-surface {
  background: linear-gradient(180deg, rgba(8,22,16,.84), rgba(0,0,0,.86));
  border: 1px solid var(--linacre-border);
  border-radius: 32px;
  box-shadow: 0 30px 90px rgba(0,0,0,.5), var(--linacre-glow);
}
.linacre-green-scanline { height: 2px; background: linear-gradient(90deg, transparent, var(--linacre-neon), transparent); }
.linacre-green-text { color: var(--linacre-mint); text-shadow: 0 0 18px rgba(57,255,20,.22); }
''')
(BASE/'copy/linacre-v03-green-launch-copy.md').write_text('''# Linacre.site V03 Green Cyberpunk Launch Copy

## Positioning

Linacre.site enters green cyberpunk mode: smooth dark interfaces, neon terminal glow, full-stack systems, AI experiments, and GitHub proof from LIN4CRE.

## Note

This is an aesthetic direction: outlaw hacker energy, dark terminal visuals, and cyberpunk atmosphere — without illegal or harmful content.

## Launch Post

Green cyberpunk mode is live for Linacre.site.

The new look is darker, sharper, and more terminal-native:

- smooth black glass surfaces
- neon green scanlines
- hacker-console layouts
- GitHub-first proof
- full-stack and AI engineering energy

Links:

Linacre.site  
github.com/LIN4CRE

It is an outlaw hacker aesthetic with an ethical builder core: useful tools, clean systems, AI experiments, and open project work.
''')
(BASE/'README.md').write_text('''# Linacre.site V03 Green Cyberpunk Neon Theme

A darker, smoother, green neon cyberpunk version of the Linacre.site brand kit.

## Theme

- Green neon terminal glow
- Smooth black glass UI
- Cyberpunk hacker-console energy
- Darkweb-inspired atmosphere as an aesthetic only
- Linacre.site + github.com/LIN4CRE across key assets

## Open first

- `linacre-v03-green-gallery.html`
- `linacre-v03-green-contact-sheet.jpg`

## Best public files

- `logo/linacre-v03-green-neon-mark.svg`
- `logo/linacre-v03-green-neon-mark-512.png`
- `logo/linacre-v03-green-wordmark-1800x480.png`
- `web/linacre-v03-og-card-1200x630.png`
- `web/linacre-v03-hero-background-2400x1350.jpg`
- `social/linacre-v03-linkedin-banner-1584x396.png`
- `social/linacre-v03-x-header-1500x500.png`
- `social/linacre-v03-github-readme-banner-1600x500.png`
- `social/linacre-v03-launch-graphic-1080x1080.png`
- `video/linacre-v03-green-logo-sting-03s.gif`
''')
print('V03 green cyberpunk assets complete.')
