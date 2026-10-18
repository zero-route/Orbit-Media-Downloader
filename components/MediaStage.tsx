"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MusicIcon,
  PlayIcon,
} from "@/components/icons/UiIcons";
import { formatDuration } from "@/lib/text";
import type { MediaResult } from "@/lib/providers/types";

type Props = {
  result: MediaResult;
  videoUrl?: string;
  photoIndex: number;
  selected: Set<number>;
  onPhotoIndex: (index: number) => void;
  onToggle: (index: number) => void;
};

export default function MediaStage({
  result,
  videoUrl,
  photoIndex,
  selected,
  onPhotoIndex,
  onToggle,
}: Props) {
  const [playing, setPlaying] = useState(false);

  if (result.kind === "photo") {
    const total = result.photos.length;
    const current = result.photos[photoIndex];

    const step = (delta: number) => {
      onPhotoIndex((photoIndex + delta + total) % total);
    };

    return (
      <div className="o-stage-wrap">
        <div className="o-stage is-photo">
          <div className="o-stage-frame">
            <SmartImage src={current?.url} className="o-stage-img" />
            {total > 1 ? (
              <>
                <span className="o-badge is-top">
                  {photoIndex + 1} / {total}
                </span>
                <button
                  type="button"
                  className="o-nav is-prev"
                  aria-label="Foto sebelumnya"
                  onClick={() => step(-1)}
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <button
                  type="button"
                  className="o-nav is-next"
                  aria-label="Foto berikutnya"
                  onClick={() => step(1)}
                >
                  <ChevronRightIcon size={18} />
                </button>
              </>
            ) : null}
          </div>
        </div>
        {total > 1 ? (
          <div className="o-thumbs">
            {result.photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                className={`o-thumb${index === photoIndex ? " is-current" : ""}`}
                aria-label={`Foto ${index + 1}`}
                onClick={() => onPhotoIndex(index)}
              >
                <SmartImage
                  src={photo.thumbnailUrl ?? photo.url}
                  className="o-thumb-img"
                />
                <span
                  role="checkbox"
                  aria-checked={selected.has(index)}
                  aria-label={`Pilih foto ${index + 1}`}
                  tabIndex={0}
                  className={`o-thumb-check${selected.has(index) ? " is-on" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggle(index);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === " " || event.key === "Enter") {
                      event.preventDefault();
                      event.stopPropagation();
                      onToggle(index);
                    }
                  }}
                >
                  <CheckIcon size={10} />
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (result.kind === "audio") {
    return (
      <div className="o-stage-wrap">
        <div className="o-stage is-audio">
          <div className="o-stage-frame">
            <SmartImage src={result.coverUrl} className="o-stage-img" />
            <span className="o-audio-mark">
              <MusicIcon size={26} />
            </span>
            {result.durationSeconds ? (
              <span className="o-badge">
                {formatDuration(result.durationSeconds)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const canPlay = Boolean(videoUrl) && !videoUrl?.startsWith("about:");

  return (
    <div className="o-stage-wrap">
      <div className="o-stage is-video">
        <div className="o-stage-frame">
          {playing && canPlay ? (
            <video
              className="o-stage-video"
              src={videoUrl}
              poster={result.coverUrl}
              controls
              autoPlay
              playsInline
            />
          ) : (
            <>
              <SmartImage src={result.coverUrl} className="o-stage-img" />
              <button
                type="button"
                className="o-play"
                aria-label="Putar video"
                onClick={() => setPlaying(true)}
              >
                <PlayIcon size={26} />
              </button>
              {result.durationSeconds ? (
                <span className="o-badge">
                  {formatDuration(result.durationSeconds)}
                </span>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
