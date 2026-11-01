import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { AmbientAudioEngine } from '../ambientAudio';

describe('AmbientAudioEngine', () => {
  let engine: AmbientAudioEngine;

  beforeEach(() => {
    localStorage.clear();
    engine = new AmbientAudioEngine();
  });

  afterEach(() => {
    engine.pause();
    vi.restoreAllMocks();
  });

  it('initializes with default volume, unmuted and correct metadata', () => {
    const state = engine.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.isMuted).toBe(false);
    expect(state.volume).toBe(0.35);
    expect(state.trackTitle).toBe('Pixel Adventure');
    expect(state.artist).toBe('Linacre');
    expect(state.sunoUrl).toContain('99ac3181-f6f5-491f-8e72-797b7c756cff');
  });

  it('restores stored volume and mute preferences from localStorage', () => {
    localStorage.setItem('linacre_ambient_volume', '0.72');
    localStorage.setItem('linacre_ambient_muted', 'true');

    const newEngine = new AmbientAudioEngine();
    const state = newEngine.getState();
    expect(state.volume).toBe(0.72);
    expect(state.isMuted).toBe(true);
  });

  it('updates volume and persists to localStorage', () => {
    engine.setVolume(0.85);
    expect(engine.getState().volume).toBe(0.85);
    expect(localStorage.getItem('linacre_ambient_volume')).toBe('0.85');

    // Clamps out-of-range values
    engine.setVolume(1.5);
    expect(engine.getState().volume).toBe(1);

    engine.setVolume(-0.2);
    expect(engine.getState().volume).toBe(0);
  });

  it('automatically unmutes when volume is raised while muted', () => {
    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(true);

    engine.setVolume(0.5);
    expect(engine.getState().isMuted).toBe(false);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('false');
  });

  it('toggles mute and persists to localStorage', () => {
    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(true);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('true');

    engine.toggleMute();
    expect(engine.getState().isMuted).toBe(false);
    expect(localStorage.getItem('linacre_ambient_muted')).toBe('false');
  });

  it('notifies subscribers of state changes and allows unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = engine.subscribe(listener);

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ volume: 0.35 }));
    listener.mockClear();

    engine.setVolume(0.5);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ volume: 0.5 }));

    unsubscribe();
    listener.mockClear();
    engine.setVolume(0.9);
    expect(listener).not.toHaveBeenCalled();
  });

  it('returns valid frequency data array from getVisualizerData', () => {
    const data = engine.getVisualizerData();
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data.length).toBeGreaterThan(0);
  });

  it('handles pause cleanly and updates state', () => {
    engine.pause();
    expect(engine.getState().isPlaying).toBe(false);
    expect(localStorage.getItem('linacre_ambient_enabled')).toBe('false');
  });

  it('registers and cleans up auto-unlock event listener', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const cleanup = engine.registerAutoUnlockListener();
    expect(addSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function), { once: true });

    cleanup();
    expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
  });
});
