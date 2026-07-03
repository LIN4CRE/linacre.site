from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'02-assets'/'v02-premium'
OUT=BASE/'linacre-v02-premium-contact-sheet.jpg'
items=[
('Premium mark','logo/linacre-v02-mark-glow-512.png'),
('Premium wordmark','logo/linacre-v02-wordmark-horizontal-1800x480.png'),
('Animated SVG mark','logo/linacre-v02-animated-mark.svg'),
('Open Graph card','web/linacre-v02-og-card-1200x630.png'),
('Homepage preview','web/linacre-v02-homepage-preview-1920x1080.png'),
('Hero background','web/linacre-v02-hero-background-2400x1350.jpg'),
('LinkedIn banner','social/linacre-v02-linkedin-banner-1584x396.png'),
('X header','social/linacre-v02-x-header-1500x500.png'),
('GitHub banner','social/linacre-v02-github-readme-banner-1600x500.png'),
('YouTube banner','social/linacre-v02-youtube-banner-2560x1440.png'),
('Launch graphic','social/linacre-v02-launch-graphic-1080x1080.png'),
('Toolkit graphic','social/linacre-v02-toolkit-card-1080x1080.png'),
('Changelog graphic','social/linacre-v02-changelog-card-1080x1080.png'),
('Code card','social/linacre-v02-code-card-1080x1080.png'),
('Reel background','social/linacre-v02-reel-background-1080x1920.png'),
('Logo sting GIF','video/linacre-v02-logo-sting-03s.gif'),
]
W,H=2600,2200
img=Image.new('RGB',(W,H),(7,10,15)); d=ImageDraw.Draw(img)
fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',74)
fm=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',25)
fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',27)
# background grid / glows
for x in range(0,W,80): d.line([(x,0),(x,H)], fill=(42,31,10))
for y in range(0,H,80): d.line([(0,y),(W,y)], fill=(42,31,10))
for r,a in [(820,40),(520,55),(280,70)]:
    d.ellipse([120-r,40-r,120+r,40+r], outline=(255,176,0,a), width=3)
d.text((90,70),'Linacre.site V02 Premium Asset Pack',font=fb,fill=(245,231,200))
d.text((96,158),'cinematic amber · hex pulse mark · social launch system · website hero pack',font=fm,fill=(245,158,11))
cols=4; cell_w=590; cell_h=410; gap=36; start_x=88; start_y=250
for idx,(label,rel) in enumerate(items):
    row=idx//cols; col=idx%cols
    x=start_x+col*(cell_w+gap); y=start_y+row*(cell_h+gap)
    d.rounded_rectangle([x,y,x+cell_w,y+cell_h],radius=30,fill=(17,24,39),outline=(245,158,11),width=2)
    d.rounded_rectangle([x+22,y+22,x+cell_w-22,y+cell_h-92],radius=20,fill=(7,10,15),outline=(255,255,255,24),width=1)
    path=BASE/rel
    try:
        if path.suffix.lower()=='.svg':
            # show simple placeholder label for SVG
            d.text((x+54,y+135),'SVG',font=fb,fill=(245,158,11))
            d.text((x+54,y+215),'animated vector source',font=fs,fill=(148,163,184))
        else:
            im=Image.open(path).convert('RGBA')
            if getattr(im,'is_animated',False): im.seek(0)
            box=(cell_w-64, cell_h-130)
            im.thumbnail(box, Image.Resampling.LANCZOS)
            px=x+32+(box[0]-im.width)//2; py=y+35+(box[1]-im.height)//2
            img.paste(im,(px,py),im)
    except Exception as e:
        d.text((x+45,y+120),'preview unavailable',font=fs,fill=(148,163,184))
    d.text((x+28,y+cell_h-62),label,font=fs,fill=(245,231,200))
    d.text((x+28,y+cell_h-28),rel,font=fm,fill=(148,163,184))
# Footer audio mention
d.rounded_rectangle([90,H-240,W-90,H-86],radius=32,fill=(17,24,39),outline=(245,158,11),width=2)
d.text((130,H-205),'Audio pack included from V01 and works with V02:',font=fs,fill=(245,231,200))
d.text((130,H-160),'3s sting · 8s intro · 15s social cue · 30s website loop · 60s brand bed',font=fm,fill=(245,158,11))
d.text((130,H-122),'Recommended public launch files live in 02-assets/v02-premium/',font=fm,fill=(148,163,184))
img.save(OUT, quality=92, optimize=True, progressive=True)
print(OUT.relative_to(ROOT))
