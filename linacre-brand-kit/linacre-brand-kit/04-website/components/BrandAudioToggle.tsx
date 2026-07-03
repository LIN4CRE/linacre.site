import React, { useEffect, useRef, useState } from "react";

type BrandAudioToggleProps = {
  src?: string;
  label?: string;
};

export function BrandAudioToggle({
  src = "/audio/linacre-audio-website-loop-30s-v01.wav",
  label = "Linacre.site audio pulse",
}: BrandAudioToggleProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("linacre-audio-enabled");
    if (saved === "true" && audioRef.current) {
      audioRef.current.volume = 0.22;
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        window.localStorage.setItem("linacre-audio-enabled", "false");
      });
    }
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.volume = 0.22;
      await audio.play();
      setPlaying(true);
      window.localStorage.setItem("linacre-audio-enabled", "true");
    } else {
      audio.pause();
      setPlaying(false);
      window.localStorage.setItem("linacre-audio-enabled", "false");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="linacre-audio-toggle"
      >
        <span aria-hidden="true">{playing ? "▮▮" : "▶"}</span>
        {playing ? "Pause pulse" : "Play pulse"}
      </button>
      <audio ref={audioRef} src={src} preload="none" loop />
    </>
  );
}
