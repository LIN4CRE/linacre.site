import {
  ArrowUpRight,
  AudioLines,
  Captions,
  Clapperboard,
  ExternalLink,
  Play,
  Radio,
  Video,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_MUSIC_VIDEO_TRACK,
  MUSIC_VIDEO_PLAYER_URL,
  MUSIC_VIDEO_TRACKS,
} from '../data/musicVideos';

function trackFromHash(): string {
  if (typeof window === 'undefined') return DEFAULT_MUSIC_VIDEO_TRACK;
  let hash = window.location.hash.replace(/^#/, '').trim();
  try {
    hash = decodeURIComponent(hash);
  } catch {
    // An invalid percent escape should simply fall back to the first track.
  }
  return MUSIC_VIDEO_TRACKS.some(track => track.id === hash) ? hash : DEFAULT_MUSIC_VIDEO_TRACK;
}

function directPlayerUrl(trackId: string): string {
  return `${MUSIC_VIDEO_PLAYER_URL}#${trackId}`;
}

export default function MusicVideos() {
  const [activeTrackId, setActiveTrackId] = useState(trackFromHash);
  const [frameVersion, setFrameVersion] = useState(0);
  const currentTrackRef = useRef(activeTrackId);
  const playerRef = useRef<HTMLElement>(null);
  const activeTrack =
    MUSIC_VIDEO_TRACKS.find(track => track.id === activeTrackId) ?? MUSIC_VIDEO_TRACKS[0];

  useEffect(() => {
    const restoreTrack = () => {
      const nextTrackId = trackFromHash();
      if (nextTrackId === currentTrackRef.current) return;
      currentTrackRef.current = nextTrackId;
      setActiveTrackId(nextTrackId);
      setFrameVersion(version => version + 1);
    };
    window.addEventListener('popstate', restoreTrack);
    window.addEventListener('hashchange', restoreTrack);
    return () => {
      window.removeEventListener('popstate', restoreTrack);
      window.removeEventListener('hashchange', restoreTrack);
    };
  }, []);

  const selectTrack = (trackId: string) => {
    if (!MUSIC_VIDEO_TRACKS.some(track => track.id === trackId)) return;
    const target = `${window.location.pathname}${window.location.search}#${trackId}`;
    window.history.pushState({ musicTrack: trackId }, '', target);
    currentTrackRef.current = trackId;
    setActiveTrackId(trackId);
    setFrameVersion(version => version + 1);
    const scrollPlayer = () => {
      const player = playerRef.current;
      if (player && typeof player.scrollIntoView === 'function') {
        player.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    if (typeof window.requestAnimationFrame === 'function')
      window.requestAnimationFrame(scrollPlayer);
    else scrollPlayer();
  };

  return (
    <section className="music-videos-page" aria-labelledby="music-videos-title">
      <header className="music-videos-hero">
        <div className="music-videos-hero__copy">
          <p className="music-videos-eyebrow">
            <Clapperboard aria-hidden="true" /> LINACRE <span aria-hidden="true">//</span> PROPER
            MAD COLLECTION
          </p>
          <h1 id="music-videos-title">Music Videos</h1>
          <p className="music-videos-hero__lead">
            The official Proper Mad cinema: ten original lyric-video masters, with the original
            interactive lyrics, artwork and playback controls intact.
          </p>
          <div className="music-videos-stats" aria-label="Player features">
            <span>
              <Video aria-hidden="true" /> 10 master videos
            </span>
            <span>
              <Captions aria-hidden="true" /> Timed lyrics
            </span>
            <span>
              <AudioLines aria-hidden="true" /> Studio EQ profiles
            </span>
          </div>
          <div className="music-videos-hero__actions">
            <a
              href={directPlayerUrl(activeTrack.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="music-videos-open-link"
            >
              <Play aria-hidden="true" /> Open full cinema <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              href="https://github.com/LIN4CRE/linacre-music-videos"
              target="_blank"
              rel="noopener noreferrer"
              className="music-videos-source-link"
            >
              Project source <ExternalLink aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="music-videos-featured-art">
          <img
            src={activeTrack.cover}
            alt={`Cover artwork for ${activeTrack.title}`}
            fetchPriority="high"
          />
          <figcaption>
            <span>
              <Radio aria-hidden="true" /> NOW SELECTED
            </span>
            <strong>{activeTrack.title}</strong>
            <small>
              {activeTrack.genre.split('/')[0].trim()} · {activeTrack.duration}
            </small>
          </figcaption>
        </figure>
      </header>

      <section className="music-videos-track-section" aria-labelledby="music-track-list-title">
        <div className="music-videos-section-heading">
          <div>
            <p className="music-videos-section-kicker">THE MASTER COLLECTION</p>
            <h2 id="music-track-list-title">Choose a track</h2>
          </div>
          <span>{MUSIC_VIDEO_TRACKS.length} original videos</span>
        </div>
        <nav className="music-videos-track-rail" aria-label="Choose a music video">
          {MUSIC_VIDEO_TRACKS.map((track, index) => (
            <a
              key={track.id}
              href={`/music-videos#${track.id}`}
              className={`music-videos-track${activeTrack.id === track.id ? ' is-active' : ''}`}
              aria-current={activeTrack.id === track.id ? 'true' : undefined}
              onClick={event => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                selectTrack(track.id);
              }}
            >
              <span className="music-videos-track__art">
                <img src={track.cover} alt="" loading="lazy" decoding="async" />
                <span className="music-videos-track__play" aria-hidden="true">
                  <Play />
                </span>
              </span>
              <span className="music-videos-track__meta">
                <span className="music-videos-track__number">
                  {String(index + 1).padStart(2, '0')} / {track.duration}
                </span>
                <strong>{track.title}</strong>
                <small>
                  {track.bpm} · {track.genre.split('/')[0].trim()}
                </small>
              </span>
            </a>
          ))}
        </nav>
        <p className="music-videos-track-hint">
          Selecting a track updates this page’s deep link and loads it in the original player below.
        </p>
      </section>

      <section
        className="music-videos-player-section"
        aria-labelledby="music-player-title"
        ref={playerRef}
      >
        <div className="music-videos-section-heading music-videos-player-heading">
          <div>
            <p className="music-videos-section-kicker">OFFICIAL CINEMA PLAYER</p>
            <h2 id="music-player-title">{activeTrack.title}</h2>
          </div>
          <a
            href={directPlayerUrl(activeTrack.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="music-videos-open-link music-videos-open-link--compact"
          >
            Open in new tab <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="music-videos-frame-shell">
          <iframe
            key={`${activeTrack.id}-${frameVersion}`}
            title={`Official Linacre music video player — ${activeTrack.title}`}
            src={directPlayerUrl(activeTrack.id)}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; clipboard-write; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="music-videos-player-note">
          <p>
            The original player is hosted by GitHub Pages and streams the master media from its
            source project. Its synchronized lyrics, playlist search, shuffle/repeat, playback
            speed, theater mode, keyboard shortcuts, MediaSession controls and Web Audio profiles
            remain part of the experience.
          </p>
          <p>
            If your browser blocks a cross-site embedded player or its storage,{' '}
            <a href={directPlayerUrl(activeTrack.id)} target="_blank" rel="noopener noreferrer">
              open the cinema directly <ArrowUpRight aria-hidden="true" />
            </a>
            . The original player stores playback preferences on its own origin; linacre.site cannot
            read that storage.
          </p>
        </div>
      </section>

      <p className="music-videos-credit">
        Original project by Linacre · 1080p video masters and artwork remain in the{' '}
        <a
          href="https://github.com/LIN4CRE/linacre-music-videos"
          target="_blank"
          rel="noopener noreferrer"
        >
          official music-videos repository <ExternalLink aria-hidden="true" />
        </a>
        .
      </p>
    </section>
  );
}
