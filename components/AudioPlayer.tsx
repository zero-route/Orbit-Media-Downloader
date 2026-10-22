"use client";

import { useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons/UiIcons";
import { formatDuration } from "@/lib/text";

type Props = {
  src: string;
  fallbackDuration?: number;
};

export default function AudioPlayer({ src, fallbackDuration }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const total = duration > 0 ? duration : (fallbackDuration ?? 0);
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  const toggle = () => {
    const element = audioRef.current;

    if (!element) {
      return;
    }

    if (element.paused) {
      setFailed(false);
      void element.play().catch(() => setFailed(true));
    } else {
      element.pause();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const element = audioRef.current;
    const value = Number(event.target.value);

    if (element && Number.isFinite(value)) {
      element.currentTime = value;
      setCurrent(value);
    }
  };

  return (
    <div className="o-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />

      <div className="o-player-row">
        <button
          type="button"
          className="o-pp"
          aria-label={playing ? "Jeda" : "Putar"}
          onClick={toggle}
        >
          {playing ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
        </button>

        <span className="o-time">{formatDuration(current)}</span>

        <input
          className="o-seek"
          type="range"
          min={0}
          max={total > 0 ? total : 0}
          step={0.1}
          value={Math.min(current, total > 0 ? total : 0)}
          onChange={seek}
          style={{ "--p": `${progress}%` } as React.CSSProperties}
          aria-label="Posisi lagu"
          disabled={total <= 0}
        />

        <span className="o-time">{formatDuration(total)}</span>
      </div>

      {failed ? (
        <p className="o-player-note">
          Audio tidak bisa diputar di browser ini. Kamu tetap bisa mengunduh
          MP3-nya.
        </p>
      ) : null}
    </div>
  );
}
