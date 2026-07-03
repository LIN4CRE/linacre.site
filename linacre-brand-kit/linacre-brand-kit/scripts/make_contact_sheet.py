from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'brand-kit-contact-sheet.png'
items=[
('Logo mark','02-assets/logo/linacre-logo-hex-pulse-dark-512-v01.png'),
('Wordmark','02-assets/logo/linacre-wordmark-horizontal-1600x450-v01.png'),
('Open Graph','02-assets/web/linacre-og-card-1200x630-v01.png'),
('LinkedIn banner','02-assets/social/linacre-linkedin-banner-1584x396-v01.png'),
('X header','02-assets/social/linacre-x-header-1500x500-v01.png'),
('GitHub banner','02-assets/social/linacre-github-readme-banner-1600x500-v01.png'),
('Social post','02-assets/social/linacre-social-post-template-1080x1080-v01.png'),
('Launch post','02-assets/social/linacre-launch-graphic-1080x1080-v01.png'),
('Code template','02-assets/social/linacre-code-snippet-template-1080x1080-v01.png'),
('Reel background','02-assets/social/linacre-reel-background-1080x1920-v01.png'),
('Hero bg','02-assets/web/linacre-hero-background-1920x1080-v01.png'),
('AI bg','02-assets/web/linacre-ai-amber-cyber-workspace-bg-v01.png'),
('Moodboard','02-assets/web/linacre-brand-moodboard-1920x1080-v01.png'),
('Logo sting GIF','02-assets/video/linacre-logo-sting-03s-v01.gif'),
('Waveform','02-assets/audio/linacre-audio-waveform-preview-v01.png'),
]
W,H=2400,1800
img=Image.new('RGB',(W,H),(7,10,15)); d=ImageDraw.Draw(img)
try:
    fb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',64)
    fm=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',24)
    fs=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',28)
except Exception:
    fb=fm=fs=None
# grid bg
for x in range(0,W,80): d.line([(x,0),(x,H)], fill=(45,34,12))
for y in range(0,H,80): d.line([(0,y),(W,y)], fill=(45,34,12))
d.text((80,62),'Linacre.site Generated Brand Assets',font=fb,fill=(245,231,200))
d.text((84,142),'logos · banners · web images · social templates · audio · motion',font=fm,fill=(245,158,11))
cols=3; cell_w=720; cell_h=290; start_x=80; start_y=230; gap=45
for idx,(label,rel) in enumerate(items):
    row=idx//cols; col=idx%cols
    x=start_x+col*(cell_w+gap); y=start_y+row*(cell_h+gap)
    d.rounded_rectangle([x,y,x+cell_w,y+cell_h],radius=28,fill=(17,24,39),outline=(245,158,11),width=2)
    path=ROOT/rel
    try:
        im=Image.open(path).convert('RGBA')
        im.seek(0) if getattr(im,'is_animated',False) else None
        # fit into image area
        box=(cell_w-60, cell_h-95)
        im.thumbnail(box, Image.Resampling.LANCZOS)
        # add dark mat
        px=x+30+(box[0]-im.width)//2; py=y+30+(box[1]-im.height)//2
        d.rounded_rectangle([x+24,y+24,x+cell_w-24,y+cell_h-70],radius=20,fill=(7,10,15),outline=(255,255,255))
        img.paste(im,(px,py),im)
    except Exception as e:
        d.text((x+30,y+60),'preview unavailable',font=fs,fill=(148,163,184))
    d.text((x+30,y+cell_h-55),label,font=fs,fill=(245,231,200))
    d.text((x+30,y+cell_h-25),rel,font=fm,fill=(148,163,184))
img.save(OUT)
print(OUT.relative_to(ROOT))
