from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'02-assets'/'v03-green-cyberpunk'
OUT=BASE/'linacre-v03-green-contact-sheet.jpg'
items=[
('Green neon mark','logo/linacre-v03-green-neon-mark-512.png'),
('Green wordmark','logo/linacre-v03-green-wordmark-1800x480.png'),
('Animated SVG mark','logo/linacre-v03-green-animated-mark.svg'),
('Open Graph card','web/linacre-v03-og-card-1200x630.png'),
('Homepage preview','web/linacre-v03-homepage-preview-1920x1080.png'),
('Hero background','web/linacre-v03-hero-background-2400x1350.jpg'),
('LinkedIn banner','social/linacre-v03-linkedin-banner-1584x396.png'),
('X header','social/linacre-v03-x-header-1500x500.png'),
('GitHub banner','social/linacre-v03-github-readme-banner-1600x500.png'),
('YouTube banner','social/linacre-v03-youtube-banner-2560x1440.png'),
('Launch graphic','social/linacre-v03-launch-graphic-1080x1080.png'),
('Darkweb card','social/linacre-v03-darkweb-card-1080x1080.png'),
('Toolkit card','social/linacre-v03-toolkit-card-1080x1080.png'),
('Terminal code card','social/linacre-v03-terminal-code-card-1080x1080.png'),
('Reel background','social/linacre-v03-reel-background-1080x1920.png'),
('Logo sting GIF','video/linacre-v03-green-logo-sting-03s.gif'),
]
W,H=2600,2200
img=Image.new('RGB',(W,H),(0,0,0)); d=ImageDraw.Draw(img)
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',74)
fm=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',25)
fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',27)
# matrix background
for x in range(0,W,62): d.line([(x,0),(x,H)], fill=(0,42,20))
for y in range(0,H,62): d.line([(0,y),(W,y)], fill=(0,34,16))
for i,ch in enumerate('01{}[]$#LIN4CRE'*80):
    x=(i*137)%W; y=(i*83)%H
    if i%5==0: d.text((x,y),ch,font=fm,fill=(57,255,20,50))
for r,a in [(900,36),(560,46),(260,60)]:
    d.ellipse([80-r,30-r,80+r,30+r], outline=(57,255,20,a), width=3)
d.text((90,70),'Linacre.site V03 Green Cyberpunk Pack',font=fb,fill=(205,255,218))
d.text((96,158),'smooth dark theme · neon hacker console · Linacre.site · github.com/LIN4CRE',font=fm,fill=(57,255,20))
cols=4; cell_w=590; cell_h=410; gap=36; start_x=88; start_y=250
for idx,(label,rel) in enumerate(items):
    row=idx//cols; col=idx%cols
    x=start_x+col*(cell_w+gap); y=start_y+row*(cell_h+gap)
    d.rounded_rectangle([x,y,x+cell_w,y+cell_h],radius=30,fill=(3,12,7),outline=(57,255,20),width=2)
    d.rounded_rectangle([x+22,y+22,x+cell_w-22,y+cell_h-92],radius=20,fill=(0,0,0),outline=(205,255,218,28),width=1)
    path=BASE/rel
    try:
        if path.suffix.lower()=='.svg':
            d.text((x+54,y+135),'SVG',font=fb,fill=(57,255,20))
            d.text((x+54,y+215),'animated vector source',font=fs,fill=(118,165,140))
        else:
            im=Image.open(path).convert('RGBA')
            if getattr(im,'is_animated',False): im.seek(0)
            box=(cell_w-64,cell_h-130)
            im.thumbnail(box,Image.Resampling.LANCZOS)
            px=x+32+(box[0]-im.width)//2; py=y+35+(box[1]-im.height)//2
            img.paste(im,(px,py),im)
    except Exception:
        d.text((x+45,y+120),'preview unavailable',font=fs,fill=(118,165,140))
    d.text((x+28,y+cell_h-62),label,font=fs,fill=(205,255,218))
    d.text((x+28,y+cell_h-28),rel,font=fm,fill=(118,165,140))
d.rounded_rectangle([90,H-240,W-90,H-86],radius=32,fill=(3,12,7),outline=(57,255,20),width=2)
d.text((130,H-205),'Theme note:',font=fs,fill=(205,255,218))
d.text((300,H-205),'darkweb-inspired aesthetic only — no harmful/illegal content. Built for brand visuals, profile banners, launch posts and website styling.',font=fs,fill=(118,165,140))
d.text((130,H-154),'Primary links baked into key assets: Linacre.site · github.com/LIN4CRE',font=fm,fill=(57,255,20))
img.save(OUT,quality=92,optimize=True,progressive=True)
print(OUT.relative_to(ROOT))
