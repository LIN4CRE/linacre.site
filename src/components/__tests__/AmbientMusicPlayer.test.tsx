import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import AmbientMusicPlayer from '../AmbientMusicPlayer';
import { ambientAudio } from '../../lib/ambientAudio';

describe('AmbientMusicPlayer', () => {
  beforeEach(() => {
    localStorage.clear();
    act(() => {
      ambientAudio.pause();
      ambientAudio.setVolume(0.35);
      if (ambientAudio.getState().isMuted) {
        ambientAudio.toggleMute();
      }
    });
    vi.spyOn(ambientAudio, 'play').mockResolvedValue();
    vi.spyOn(ambientAudio, 'loadAudio').mockResolvedValue(true);
  });

  afterEach(() => {
    cleanup();
    act(() => {
      ambientAudio.pause();
    });
    vi.restoreAllMocks();
  });

  it('renders ambient music player region with controls', () => {
    render(<AmbientMusicPlayer />);
    expect(screen.getByRole('region', { name: /ambient background music player/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play background music/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute background music/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/ambient music volume slider/i)).toBeInTheDocument();
  });

  it('displays track title indicator linking to Suno track', () => {
    act(() => {
      render(<AmbientMusicPlayer />);
    });
    const link = screen.getByRole('link', { name: /pixel adventure/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('suno.com/song/99ac3181-f6f5-491f-8e72-797b7c756cff'));
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('toggles playback when play button is clicked', () => {
    act(() => {
      render(<AmbientMusicPlayer />);
    });
    const playBtn = screen.getByRole('button', { name: /play background music/i });

    const playSpy = vi.spyOn(ambientAudio, 'togglePlay').mockImplementation(() => {});
    act(() => {
      fireEvent.click(playBtn);
    });
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('toggles mute when mute button is clicked', () => {
    act(() => {
      render(<AmbientMusicPlayer />);
    });
    const muteBtn = screen.getByRole('button', { name: /mute background music/i });

    act(() => {
      fireEvent.click(muteBtn);
    });
    expect(ambientAudio.getState().isMuted).toBe(true);

    const unmuteBtn = screen.getByRole('button', { name: /unmute background music/i });
    expect(unmuteBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(unmuteBtn);
    });
    expect(ambientAudio.getState().isMuted).toBe(false);
  });

  it('updates volume slider on user change and persists to engine', () => {
    act(() => {
      render(<AmbientMusicPlayer />);
    });
    const slider = screen.getByLabelText(/ambient music volume slider/i) as HTMLInputElement;
    expect(slider.value).toBe('35');

    act(() => {
      fireEvent.change(slider, { target: { value: '70' } });
    });
    expect(ambientAudio.getState().volume).toBe(0.7);
    expect(slider.value).toBe('70');
  });

  it('renders compact mode without track title text when compact prop is true', () => {
    act(() => {
      render(<AmbientMusicPlayer compact={true} />);
    });
    expect(screen.queryByText('Pixel Adventure')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play background music/i })).toBeInTheDocument();
  });
});
