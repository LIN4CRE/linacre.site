from pathlib import Path
import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "02-assets" / "audio"
OUT.mkdir(parents=True, exist_ok=True)
SR = 44100
BPM = 86
BEAT = 60.0 / BPM

# ---------- helpers ----------
def env_adsr(n, sr=SR, attack=0.01, decay=0.18, sustain=0.55, release=0.45):
    # Robust ADSR: if the requested stages are longer than the note, scale them down.
    a = max(1, int(attack*sr)); d=max(1,int(decay*sr)); r=max(1,int(release*sr))
    total = a + d + r
    if total > n:
        scale = max(0.05, n / total)
        a = max(1, int(a*scale)); d=max(1,int(d*scale)); r=max(1,int(r*scale))
    s = max(0, n-a-d-r)
    # Correct rounding if still slightly long
    while a+d+r+s > n and r > 1:
        r -= 1
    e = np.zeros(n)
    pos = 0
    e[pos:pos+a] = np.linspace(0,1,a,endpoint=False); pos += a
    e[pos:pos+d] = np.linspace(1,sustain,d,endpoint=False); pos += d
    if s>0:
        e[pos:pos+s]=sustain; pos += s
    if pos < n:
        e[pos:] = np.linspace(sustain,0,n-pos)
    return e

def note_freq(name):
    # names like A3, C#4
    names = {'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11}
    if len(name)>=3 and name[1] in ['#','b']:
        key=name[:2]; octv=int(name[2:])
    else:
        key=name[0]; octv=int(name[1:])
    midi = 12*(octv+1)+names[key]
    return 440.0*2**((midi-69)/12)

def add(sig, start, wave):
    i=int(start*SR); n=len(wave)
    if i>=len(sig): return
    end=min(len(sig),i+n)
    sig[i:end]+=wave[:end-i]

def pan_mono(x, pan=0.0):
    # pan -1 left, +1 right
    l = np.cos((pan+1)*np.pi/4)
    r = np.sin((pan+1)*np.pi/4)
    return np.column_stack([x*l, x*r])

def piano_note(freq, dur, vel=0.4):
    n=int(dur*SR); t=np.arange(n)/SR
    e=env_adsr(n, attack=0.004, decay=0.35, sustain=0.18, release=min(0.7,dur*0.45))
    wave=(np.sin(2*np.pi*freq*t)*0.9 + np.sin(2*np.pi*freq*2.01*t)*0.24 + np.sin(2*np.pi*freq*3.02*t)*0.10 + np.sin(2*np.pi*freq*4.01*t)*0.04)
    # tiny hammer transient
    trans=np.random.default_rng(123).normal(0,0.03,n)*np.exp(-t*35)
    return (wave+trans)*e*vel

def rhodes_note(freq, dur, vel=0.32):
    n=int(dur*SR); t=np.arange(n)/SR
    e=env_adsr(n, attack=0.018, decay=0.4, sustain=0.50, release=min(0.85,dur*0.5))
    trem=1+0.035*np.sin(2*np.pi*5.2*t)
    bell=np.sin(2*np.pi*freq*2.01*t)*0.26*np.exp(-t*1.4)
    wave=(np.sin(2*np.pi*freq*t)*0.78 + np.sin(2*np.pi*freq*1.5*t)*0.08 + bell + np.sin(2*np.pi*freq*3.01*t)*0.035)
    return wave*e*trem*vel

def pad_note(freq, dur, vel=0.18):
    n=int(dur*SR); t=np.arange(n)/SR
    e=env_adsr(n, attack=1.2, decay=0.5, sustain=0.75, release=1.8)
    lfo=0.4*np.sin(2*np.pi*0.13*t)
    wave=(np.sin(2*np.pi*(freq*(1+0.001*lfo))*t)*0.45 +
          np.sin(2*np.pi*(freq*2.003)*t)*0.16 +
          np.sin(2*np.pi*(freq*0.5)*t)*0.22)
    return wave*e*vel

def chord(notes, dur, instrument='rhodes', vel=0.35, spread=0.0):
    n=int(dur*SR); out=np.zeros((n,2))
    for i,note in enumerate(notes):
        freq=note_freq(note) if isinstance(note,str) else note
        if instrument=='piano': mono=piano_note(freq,dur,vel/(1+0.12*len(notes)))
        elif instrument=='pad': mono=pad_note(freq,dur,vel/(1+0.04*len(notes)))
        else: mono=rhodes_note(freq,dur,vel/(1+0.08*len(notes)))
        pan = ((i/(max(1,len(notes)-1)))*2-1)*spread if len(notes)>1 else 0
        out += pan_mono(mono, pan)
    return out

def digital_pulse(freq=880, dur=0.11, vel=0.13):
    n=int(dur*SR); t=np.arange(n)/SR
    e=np.exp(-t*22)
    wave=(np.sin(2*np.pi*freq*t)+0.3*np.sin(2*np.pi*freq*2*t))*e*vel
    return pan_mono(wave, 0.55)

def kick(dur=0.32, vel=0.23):
    n=int(dur*SR); t=np.arange(n)/SR
    f=70*np.exp(-t*8)+35
    phase=2*np.pi*np.cumsum(f)/SR
    wave=np.sin(phase)*np.exp(-t*9)*vel
    return pan_mono(wave,0)

def snare(dur=0.22, vel=0.12):
    n=int(dur*SR); t=np.arange(n)/SR
    rng=np.random.default_rng(55)
    noise=rng.normal(0,1,n)*np.exp(-t*18)
    tone=np.sin(2*np.pi*190*t)*np.exp(-t*14)
    wave=(noise*0.55+tone*0.45)*vel
    return pan_mono(wave,-0.05)

def hat(dur=0.07, vel=0.05):
    n=int(dur*SR); t=np.arange(n)/SR
    rng=np.random.default_rng(77)
    noise=rng.normal(0,1,n)
    # high-passy-ish by differencing
    hp=np.concatenate([[0], np.diff(noise)])
    wave=hp*np.exp(-t*45)*vel
    return pan_mono(wave,0.25)

def add_noise_bed(sig, vel=0.006):
    rng=np.random.default_rng(99)
    n=len(sig); noise=rng.normal(0,1,n)
    # softened noise
    noise=np.convolve(noise, np.ones(32)/32, mode='same')
    sig += pan_mono(noise*vel,0)

def normalize(sig, peak=0.88):
    m=np.max(np.abs(sig))
    if m>0: sig=sig/m*peak
    # quick soft clip for warmth
    sig=np.tanh(sig*1.05)/np.tanh(1.05)
    return sig

def save_audio(name, sig):
    sig=normalize(sig,0.82)
    path=OUT/name
    sf.write(path, sig, SR, subtype='PCM_16')
    print(path.relative_to(ROOT))
    return path

CHORDS=[['A2','E3','G3','C4'], ['F2','C3','E3','A3'], ['C3','G3','B3','E4'], ['G2','D3','F3','B3']]
PAD_CHORDS=[['A2','E3','C4'], ['F2','C3','A3'], ['C3','G3','E4'], ['G2','D3','B3']]

# ---------- 3s sting ----------
def make_sting():
    dur=3.2; sig=np.zeros((int(dur*SR),2))
    add(sig,0.08, chord(['A3'],1.6,'piano',0.44,0))
    add(sig,0.62, digital_pulse(1040,0.10,0.16))
    add(sig,1.04, chord(['A2','E3','G3','C4','E4'],2.0,'rhodes',0.42,0.50))
    add(sig,1.36, chord(['A1'],1.6,'pad',0.13,0))
    add_noise_bed(sig,0.003)
    return sig

# ---------- music bed builder ----------
def add_drums(sig, start, end, intensity=1.0, bpm=BPM):
    beat=60/bpm
    b=start; count=0
    while b<end:
        # kick beat 1 and soft on 3
        if count%4 in [0,2]: add(sig,b,kick(0.26,0.12*intensity if count%4==2 else 0.17*intensity))
        if count%4==1 or count%4==3: add(sig,b,snare(0.20,0.075*intensity))
        add(sig,b+beat*0.50,hat(0.06,0.028*intensity))
        add(sig,b,hat(0.05,0.018*intensity))
        b += beat; count+=1

def make_bed(dur, social=False, loop=False):
    sig=np.zeros((int(dur*SR),2))
    add_noise_bed(sig,0.0045)
    # intro piano motif
    motif=['A3','C4','E4','G4','E4','C4']
    for i,n in enumerate(motif):
        t=0.18+i*BEAT*0.5
        if t<dur: add(sig,t, chord([n],1.25,'piano',0.30,0))
    # chord sections
    section = BEAT*4
    t=0
    idx=0
    while t<dur:
        ch=CHORDS[idx%len(CHORDS)]
        pch=PAD_CHORDS[idx%len(PAD_CHORDS)]
        # softer intro, fuller middle/chorus
        if t<2.0: vel=0.16
        elif t<dur*0.55: vel=0.29
        else: vel=0.36
        add(sig,t+0.05, chord(ch, min(section+1.2,dur-t),'rhodes',vel,0.58))
        add(sig,t, chord(pch, min(section+2.0,dur-t),'pad',0.12 if t<dur*0.55 else 0.18,0.75))
        # piano top notes in later section
        if t>dur*0.45:
            top=[ch[-1], ch[-2] if len(ch)>2 else ch[-1]]
            add(sig,t+BEAT*0.15, chord([top[0]],1.05,'piano',0.18,0.25))
            add(sig,t+BEAT*1.6, chord([top[1]],1.05,'piano',0.15,-0.25))
        # tiny pulses
        if t>1.5:
            add(sig,t+BEAT*3.25, digital_pulse(880+60*(idx%3),0.10,0.07 if t<dur*0.55 else 0.10))
        t += section; idx+=1
    # drums after quiet intro
    drum_start = 3.0 if dur>10 else 2.4
    if dur>6: add_drums(sig, drum_start, dur-0.6, intensity=0.70 if social else 0.55)
    # tiny chorus lift: add higher pad/rhodes in final third
    lift=dur*0.62
    t=lift; idx=0
    while t<dur-1:
        add(sig,t, chord(['C4','E4','G4','B4'], min(section*0.75,dur-t),'rhodes',0.16,0.62))
        t += section; idx+=1
    # end resolve for non-loop
    if not loop:
        add(sig,max(0,dur-2.4), chord(['A2','E3','G3','C4','E4'],2.3,'rhodes',0.28,0.55))
        add(sig,max(0,dur-1.6), digital_pulse(1040,0.12,0.10))
    else:
        # crossfade last 2 seconds into first 2 seconds for smoother loop
        fade=int(min(2.0,dur/5)*SR)
        if fade>0:
            a=np.linspace(0,1,fade)[:,None]
            sig[:fade]=sig[:fade]*(1-a)+sig[-fade:]*a
            sig[-fade:]=sig[-fade:]*(1-a)
    return sig

# generate
save_audio('linacre-audio-sting-03s-v01.wav', make_sting())
save_audio('linacre-audio-social-intro-08s-v01.wav', make_bed(8.0, social=True, loop=False))
save_audio('linacre-audio-social-cue-15s-v01.wav', make_bed(15.0, social=True, loop=False))
save_audio('linacre-audio-website-loop-30s-v01.wav', make_bed(30.0, social=False, loop=True))
save_audio('linacre-audio-brand-bed-60s-v01.wav', make_bed(60.0, social=False, loop=False))

# ---------- waveform contact image ----------
try:
    font_b=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 34)
    font_m=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 18)
except Exception:
    font_b=font_m=None
W,H=1600,900
img=Image.new('RGB',(W,H),(7,10,15)); d=ImageDraw.Draw(img)
# background grid
for x in range(0,W,80): d.line([(x,0),(x,H)], fill=(50,40,16))
for y in range(0,H,80): d.line([(0,y),(W,y)], fill=(50,40,16))
d.text((70,55),'Linacre.site Audio Identity',font=font_b,fill=(245,231,200))
d.text((72,105),'felt piano · Rhodes · soft pulse · easy listening',font=font_m,fill=(245,158,11))
files=[('03s sting','linacre-audio-sting-03s-v01.wav'),('08s intro','linacre-audio-social-intro-08s-v01.wav'),('15s social cue','linacre-audio-social-cue-15s-v01.wav'),('30s website loop','linacre-audio-website-loop-30s-v01.wav'),('60s brand bed','linacre-audio-brand-bed-60s-v01.wav')]
row_y=190
for label,fn in files:
    data, sr = sf.read(OUT/fn)
    mono=data.mean(axis=1)
    # downsample to 1250 columns
    cols=1250; block=max(1,len(mono)//cols)
    vals=[]
    for i in range(cols):
        seg=mono[i*block:(i+1)*block]
        vals.append(float(np.max(np.abs(seg))) if len(seg) else 0)
    vals=np.array(vals); vals=vals/(vals.max()+1e-9)
    x0=280; y0=row_y; mid=y0+45
    d.text((70,y0+25),label,font=font_m,fill=(245,231,200))
    d.rounded_rectangle([x0-10,y0,x0+cols+10,y0+90],radius=18,outline=(245,158,11),fill=(17,24,39))
    for i,v in enumerate(vals):
        col=(245,158,11) if i%2 else (255,176,0)
        d.line([(x0+i, mid-v*38),(x0+i, mid+v*38)], fill=col)
    row_y += 130
img.save(OUT/'linacre-audio-waveform-preview-v01.png')
print((OUT/'linacre-audio-waveform-preview-v01.png').relative_to(ROOT))
print('Audio assets generated.')
