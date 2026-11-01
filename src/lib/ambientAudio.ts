/**
 * Ambient Continuous Background Audio Engine for linacre.site
 *
 * Implements seamless, perpetual audio looping using Web Audio API with
 * sample-accurate scheduling and equal-power (cos/sin) crossfading.
 * Eliminates MP3 encoder padding gaps, silences, and loop seams, creating
 * an endless continuous ambient track.
 */

export interface AmbientAudioState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0.0 to 1.0
  isUnlocked: boolean;
  isLoading: boolean;
  error: string | null;
  trackTitle: string;
  artist: string;
  sunoUrl: string;
}

export type AmbientAudioListener = (state: AmbientAudioState) => void;

const STORAGE_KEY_VOLUME = 'linacre_ambient_volume';
const STORAGE_KEY_MUTED = 'linacre_ambient_muted';
const STORAGE_KEY_ENABLED = 'linacre_ambient_enabled';

const TRACK_TITLE = 'Pixel Adventure';
const TRACK_ARTIST = 'Linacre';
const SUNO_URL = 'https://suno.com/song/99ac3181-f6f5-491f-8e72-797b7c756cff';
const AUDIO_SRC = '/audio/99ac3181-f6f5-491f-8e72-797b7c756cff.mp3';

function getAudioUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin && !window.location.origin.startsWith('null')) {
    try {
      return new URL(AUDIO_SRC, window.location.origin).toString();
    } catch {}
  }
  return AUDIO_SRC;
}

// Audio timing constants
const START_TRIM = 0.15; // Skip MP3 encoder silence padding
const CROSSFADE_DURATION = 4.0; // 4-second equal-power crossfade
const DEFAULT_VOLUME = 0.35; // Ideal low-fatigue ambient volume

function createEqualPowerCurves(points = 64) {
  const fadeOut = new Float32Array(points);
  const fadeIn = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const frac = i / (points - 1);
    fadeOut[i] = Math.cos(frac * 0.5 * Math.PI);
    fadeIn[i] = Math.sin(frac * 0.5 * Math.PI);
  }
  return { fadeOut, fadeIn };
}

const { fadeOut: CURVE_OUT, fadeIn: CURVE_IN } = createEqualPowerCurves(64);

interface PlayingNode {
  source: AudioBufferSourceNode;
  gain: GainNode;
  startTime: number;
  stopTime: number;
}

export class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private buffer: AudioBuffer | null = null;

  private isPlaying = false;
  private isMuted = false;
  private volume = DEFAULT_VOLUME;
  private isUnlocked = false;
  private isLoading = false;
  private error: string | null = null;

  private activeNodes: PlayingNode[] = [];
  private scheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private nextLoopStartTime = 0;
  private pauseOffset = 0;

  private listeners = new Set<AmbientAudioListener>();
  private frequencyData: Uint8Array<ArrayBuffer> = new Uint8Array(32);

  // Fallback HTML audio elements if Web Audio buffer decode is unavailable
  private fallbackAudioA: HTMLAudioElement | null = null;
  private fallbackAudioB: HTMLAudioElement | null = null;
  private isFallbackMode = false;

  private cachedState: AmbientAudioState;

  constructor() {
    this.restoreStoredPreferences();
    this.cachedState = this.buildSnapshot();
  }

  private buildSnapshot(): AmbientAudioState {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
      isUnlocked: this.isUnlocked,
      isLoading: this.isLoading,
      error: this.error,
      trackTitle: TRACK_TITLE,
      artist: TRACK_ARTIST,
      sunoUrl: SUNO_URL,
    };
  }

  private restoreStoredPreferences() {
    if (typeof window === 'undefined') return;

    try {
      const storedVol = localStorage.getItem(STORAGE_KEY_VOLUME);
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      const storedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      if (storedMuted !== null) {
        this.isMuted = storedMuted === 'true';
      }
    } catch {
      // Ignore localStorage access failures (e.g. strict security modes)
    }
  }

  public getState(): AmbientAudioState {
    return this.cachedState;
  }

  public subscribe(listener: AmbientAudioListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.cachedState = this.buildSnapshot();
    const state = this.cachedState;
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('AmbientAudioListener error:', err);
      }
    });
  }

  private ensureAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) return null;

      try {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64;
        this.analyser.smoothingTimeConstant = 0.8;

        this.updateMasterVolume(false);
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
        return null;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  private updateMasterVolume(smooth = true) {
    if (!this.masterGain || !this.ctx) return;
    const target = this.isMuted ? 0 : this.volume;
    try {
      if (smooth && this.ctx.state === 'running') {
        this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.04);
      } else {
        this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
      }
    } catch {
      this.masterGain.gain.value = target;
    }
  }

  public async loadAudio(): Promise<boolean> {
    if (this.buffer) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    this.error = null;
    this.notify();

    try {
      const res = await fetch(getAudioUrl());
      if (!res.ok) {
        throw new Error(`Failed to fetch audio: ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();

      const ctx = this.ensureAudioContext();
      if (!ctx) {
        throw new Error('AudioContext not available');
      }

      this.buffer = await ctx.decodeAudioData(arrayBuffer);
      this.isLoading = false;
      this.notify();
      return true;
    } catch (err) {
      console.warn('Web Audio buffer decode failed, initializing fallback:', err);
      this.isLoading = false;
      this.error = err instanceof Error ? err.message : String(err);
      this.initFallbackMode();
      this.notify();
      return false;
    }
  }

  private initFallbackMode() {
    if (typeof window === 'undefined' || this.isFallbackMode) return;
    this.isFallbackMode = true;

    try {
      const src = getAudioUrl();
      this.fallbackAudioA = new Audio(src);
      this.fallbackAudioB = new Audio(src);
      this.fallbackAudioA.preload = 'auto';
      this.fallbackAudioB.preload = 'auto';
    } catch {}
  }

  /**
   * Schedule seamless overlapping audio buffers with equal-power crossfade
   */
  private scheduleLoop(startTime: number, offset = START_TRIM) {
    if (!this.ctx || !this.buffer || !this.isPlaying) return;

    const effectiveDuration = Math.max(10, (this.buffer.duration - 1.2) - START_TRIM);
    const loopPlayDuration = effectiveDuration - (offset - START_TRIM);
    const stopTime = startTime + loopPlayDuration;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const gain = this.ctx.createGain();

    // Initial gain: if starting mid-way, full volume; if starting at beginning, fade in
    const isFirstStart = offset === START_TRIM && this.activeNodes.length === 0;
    if (isFirstStart) {
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(1, startTime + 1.2);
    } else {
      gain.gain.setValueAtTime(1, startTime);
    }

    // Schedule equal-power fade-out at the end of this loop segment
    const fadeOutStart = Math.max(startTime, stopTime - CROSSFADE_DURATION);
    const fadeOutDuration = stopTime - fadeOutStart;

    try {
      gain.gain.setValueCurveAtTime(CURVE_OUT, fadeOutStart, fadeOutDuration);
    } catch {
      gain.gain.setValueAtTime(1, fadeOutStart);
      gain.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gain);
    gain.connect(this.masterGain!);

    try {
      source.start(startTime, offset);
      source.stop(stopTime);
    } catch (err) {
      console.error('Error starting AudioBufferSourceNode:', err);
    }

    const nodeEntry: PlayingNode = { source, gain, startTime, stopTime };
    this.activeNodes.push(nodeEntry);

    // Prune expired nodes
    source.onended = () => {
      try {
        source.disconnect();
        gain.disconnect();
      } catch {}
      this.activeNodes = this.activeNodes.filter(n => n !== nodeEntry);
    };

    // Calculate when the next overlapping track should begin
    this.nextLoopStartTime = fadeOutStart;

    // Schedule the next cycle slightly before fadeOutStart
    const leadTimeMs = Math.max(50, (fadeOutStart - this.ctx.currentTime - 0.2) * 1000);
    if (this.scheduleTimer) clearTimeout(this.scheduleTimer);

    this.scheduleTimer = setTimeout(() => {
      if (this.isPlaying && this.ctx) {
        // Next loop starts fresh from START_TRIM
        this.scheduleNextLoopWithCrossfade(this.nextLoopStartTime);
      }
    }, leadTimeMs);
  }

  private scheduleNextLoopWithCrossfade(startTime: number) {
    if (!this.ctx || !this.buffer || !this.isPlaying) return;

    const effectiveDuration = Math.max(10, (this.buffer.duration - 1.2) - START_TRIM);
    const stopTime = startTime + effectiveDuration;

    const source = this.ctx.createBufferSource();
    source.buffer = this.buffer;
    const gain = this.ctx.createGain();

    // Equal-power fade in
    try {
      gain.gain.setValueCurveAtTime(CURVE_IN, startTime, CROSSFADE_DURATION);
    } catch {
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(1, startTime + CROSSFADE_DURATION);
    }

    // Equal-power fade out
    const fadeOutStart = stopTime - CROSSFADE_DURATION;
    try {
      gain.gain.setValueCurveAtTime(CURVE_OUT, fadeOutStart, CROSSFADE_DURATION);
    } catch {
      gain.gain.setValueAtTime(1, fadeOutStart);
      gain.gain.linearRampToValueAtTime(0, stopTime);
    }

    source.connect(gain);
    gain.connect(this.masterGain!);

    try {
      source.start(startTime, START_TRIM);
      source.stop(stopTime);
    } catch (err) {
      console.error('Error starting next AudioBufferSourceNode:', err);
    }

    const nodeEntry: PlayingNode = { source, gain, startTime, stopTime };
    this.activeNodes.push(nodeEntry);

    source.onended = () => {
      try {
        source.disconnect();
        gain.disconnect();
      } catch {}
      this.activeNodes = this.activeNodes.filter(n => n !== nodeEntry);
    };

    this.nextLoopStartTime = fadeOutStart;

    const leadTimeMs = Math.max(50, (fadeOutStart - this.ctx.currentTime - 0.2) * 1000);
    if (this.scheduleTimer) clearTimeout(this.scheduleTimer);

    this.scheduleTimer = setTimeout(() => {
      if (this.isPlaying && this.ctx) {
        this.scheduleNextLoopWithCrossfade(this.nextLoopStartTime);
      }
    }, leadTimeMs);
  }

  public async play(): Promise<void> {
    this.isUnlocked = true;
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, 'true');
    } catch {}

    const ctx = this.ensureAudioContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {}
    }

    if (!this.buffer) {
      const loaded = await this.loadAudio();
      if (!loaded && this.isFallbackMode) {
        this.playFallback();
        return;
      }
    }

    if (!this.ctx || !this.buffer) return;

    this.isPlaying = true;
    this.updateMasterVolume(true);

    const now = this.ctx.currentTime;
    const offset = this.pauseOffset > 0 ? this.pauseOffset : START_TRIM;
    this.pauseOffset = 0;

    this.scheduleLoop(now + 0.05, offset);
    this.notify();
  }

  public pause(): void {
    this.isPlaying = false;
    try {
      localStorage.setItem(STORAGE_KEY_ENABLED, 'false');
    } catch {}

    if (this.scheduleTimer) {
      clearTimeout(this.scheduleTimer);
      this.scheduleTimer = null;
    }

    if (this.ctx && this.activeNodes.length > 0) {
      // Calculate current playback offset for resuming
      const primary = this.activeNodes[0];
      const elapsed = Math.max(0, this.ctx.currentTime - primary.startTime);
      this.pauseOffset = (START_TRIM + elapsed) % ((this.buffer?.duration ?? 150) - START_TRIM);

      // Smooth fade out
      this.activeNodes.forEach(n => {
        try {
          n.gain.gain.cancelScheduledValues(this.ctx!.currentTime);
          n.gain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.05);
          setTimeout(() => {
            try {
              n.source.stop();
              n.source.disconnect();
              n.gain.disconnect();
            } catch {}
          }, 150);
        } catch {
          try {
            n.source.stop();
          } catch {}
        }
      });
      this.activeNodes = [];
    }

    if (this.isFallbackMode) {
      try {
        this.fallbackAudioA?.pause();
        this.fallbackAudioB?.pause();
      } catch {}
    }

    this.notify();
  }

  public togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      void this.play();
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.volume > 0 && this.isMuted) {
      this.isMuted = false;
      try {
        localStorage.setItem(STORAGE_KEY_MUTED, 'false');
      } catch {}
    }

    try {
      localStorage.setItem(STORAGE_KEY_VOLUME, String(this.volume));
    } catch {}

    this.updateMasterVolume(true);
    this.notify();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(this.isMuted));
    } catch {}

    this.updateMasterVolume(true);
    this.notify();
  }

  private playFallback() {
    if (!this.fallbackAudioA) return;
    this.isPlaying = true;
    const vol = this.isMuted ? 0 : this.volume;
    this.fallbackAudioA.volume = vol;
    this.fallbackAudioA.loop = true;
    try {
      const playPromise = this.fallbackAudioA.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {}
    this.notify();
  }

  public getVisualizerData(): Uint8Array {
    if (!this.isPlaying || this.isMuted || !this.analyser) {
      this.frequencyData.fill(0);
      return this.frequencyData;
    }
    try {
      this.analyser.getByteFrequencyData(this.frequencyData as any);
    } catch {
      this.frequencyData.fill(0);
    }
    return this.frequencyData;
  }

  /**
   * Set up passive interaction listener to respect browser autoplay policies.
   * If the user previously had audio enabled (default: true), the first user
   * click or tap automatically activates the ambient soundtrack seamlessly.
   */
  public registerAutoUnlockListener(): () => void {
    if (typeof window === 'undefined') return () => {};

    let enabledPref = true;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ENABLED);
      if (stored === 'false') {
        enabledPref = false;
      }
    } catch {}

    if (!enabledPref) return () => {};

    const handleUserGesture = () => {
      cleanup();
      if (!this.isPlaying) {
        void this.play();
      }
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
      window.removeEventListener('touchstart', handleUserGesture);
    };

    window.addEventListener('pointerdown', handleUserGesture, { once: true });
    window.addEventListener('keydown', handleUserGesture, { once: true });
    window.addEventListener('touchstart', handleUserGesture, { once: true });

    return cleanup;
  }
}

// Global singleton instance for linacre.site
export const ambientAudio = new AmbientAudioEngine();
