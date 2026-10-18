"use client";

import { useEffect, useMemo, useState } from "react";
import ActionBar from "@/components/ActionBar";
import Alert from "@/components/Alert";
import AuthorRow from "@/components/AuthorRow";
import CaptionBlock from "@/components/CaptionBlock";
import MediaStage from "@/components/MediaStage";
import QualityPicker from "@/components/QualityPicker";
import StatsGrid from "@/components/StatsGrid";
import { useClipboard } from "@/hooks/useClipboard";
import { useDownload } from "@/hooks/useDownload";
import { fileName } from "@/lib/media/filename";
import type { MediaResult } from "@/lib/providers/types";

type Props = {
  result: MediaResult;
};

export default function ResultCard({ result }: Props) {
  const [qualityId, setQualityId] = useState(result.videos[0]?.id ?? "");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(result.photos.map((_, index) => index))
  );
  const [info, setInfo] = useState<string | null>(null);
  const { notice, setNotice, save, saveMany } = useDownload();
  const clipboard = useClipboard();

  useEffect(() => {
    if (!info) {
      return;
    }

    const timer = setTimeout(() => setInfo(null), 2400);

    return () => clearTimeout(timer);
  }, [info]);

  const quality = useMemo(
    () => result.videos.find((item) => item.id === qualityId) ?? result.videos[0],
    [result.videos, qualityId]
  );

  const toggle = (index: number) => {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const selectedPhotos = result.photos.filter((_, index) => selected.has(index));

  const handlePrimary = () => {
    setNotice(null);

    if (result.kind === "video" && quality) {
      save({
        url: quality.url,
        filename: fileName(result, quality.ext, quality.label),
      });
      return;
    }

    if (result.kind === "audio" && result.audio) {
      save({
        url: result.audio.url,
        filename: fileName(result, result.audio.ext),
      });
      return;
    }

    if (result.kind === "photo") {
      void saveMany(
        selectedPhotos.map((photo, index) => ({
          url: photo.url,
          filename: fileName(result, photo.ext, String(index + 1)),
        }))
      );
    }
  };

  const handleAudio = () => {
    setNotice(null);

    if (result.audio) {
      save({
        url: result.audio.url,
        filename: fileName(result, result.audio.ext),
      });
      return;
    }

    setNotice("Unduh audio belum aktif di tahap ini.");
  };

  const handleCopy = async () => {
    if (!result.caption) {
      return;
    }

    const ok = await clipboard.write(result.caption);

    setInfo(ok ? "Keterangan disalin." : "Tidak bisa menyalin keterangan.");
  };

  const primaryLabel =
    result.kind === "photo"
      ? selectedPhotos.length > 0
        ? `Unduh ${selectedPhotos.length} foto`
        : "Pilih foto"
      : result.kind === "audio"
      ? "Unduh MP3"
      : "Unduh";

  const showAudio = result.kind === "video";

  return (
    <section className="o-result">
      <MediaStage
        result={result}
        videoUrl={quality?.url}
        photoIndex={photoIndex}
        selected={selected}
        onPhotoIndex={setPhotoIndex}
        onToggle={toggle}
      />

      <div className="o-details">
        <AuthorRow author={result.author} />

        {result.kind === "audio" ? (
          <div className="o-track">
            <strong>{result.audio?.title}</strong>
            <span>{result.audio?.artist}</span>
          </div>
        ) : null}

        <CaptionBlock text={result.caption} />
        <StatsGrid stats={result.stats} />

        {result.kind === "video" ? (
          <QualityPicker
            options={result.videos.map((item) => ({
              id: item.id,
              label: item.label,
            }))}
            value={qualityId}
            onChange={setQualityId}
          />
        ) : null}

        {result.kind === "photo" && result.photos.length > 1 ? (
          <div className="o-selectbar">
            <span>
              {selectedPhotos.length} / {result.photos.length} dipilih
            </span>
            <button
              type="button"
              onClick={() =>
                setSelected(
                  selectedPhotos.length === result.photos.length
                    ? new Set()
                    : new Set(result.photos.map((_, index) => index))
                )
              }
            >
              {selectedPhotos.length === result.photos.length
                ? "Kosongkan"
                : "Pilih semua"}
            </button>
          </div>
        ) : null}

        {notice || info ? (
          <Alert tone="info" message={(notice ?? info) as string} />
        ) : null}

        <ActionBar
          primaryLabel={primaryLabel}
          busy={result.kind === "photo" && selectedPhotos.length === 0}
          onPrimary={handlePrimary}
          onAudio={showAudio ? handleAudio : undefined}
          onCopy={result.caption ? handleCopy : undefined}
          slideshow={
            result.kind === "photo" && result.platform === "tiktok"
              ? result.audio
                ? "enabled"
                : "disabled"
              : "hidden"
          }
        />
      </div>
    </section>
  );
}
