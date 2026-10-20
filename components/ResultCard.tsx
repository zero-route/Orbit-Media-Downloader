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
import { useDownload, type DownloadFile } from "@/hooks/useDownload";
import { fileName } from "@/lib/media/filename";
import type { MediaResult } from "@/lib/providers/types";

type Props = {
  result: MediaResult;
  statsPending?: boolean;
  onRefresh?: () => Promise<MediaResult | null>;
};

const REFRESH_MARGIN_MS = 60_000;

function isStale(result: MediaResult) {
  return (
    typeof result.expiresAt === "number" &&
    Date.now() > result.expiresAt - REFRESH_MARGIN_MS
  );
}

export default function ResultCard({
  result,
  statsPending,
  onRefresh,
}: Props) {
  const [qualityId, setQualityId] = useState(result.videos[0]?.id ?? "");
  const [photoIndex, setPhotoIndex] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(result.photos.map((_, index) => index))
  );
  const [info, setInfo] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const { notice, setNotice, saveMany } = useDownload();
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

  const run = async (build: (current: MediaResult) => DownloadFile[]) => {
    if (working) {
      return;
    }

    setNotice(null);
    setWorking(true);

    try {
      let current = result;

      if (onRefresh && isStale(current)) {
        current = (await onRefresh()) ?? current;
      }

      let outcome = await saveMany(build(current));

      if (outcome === "expired") {
        const fresh = onRefresh ? await onRefresh() : null;

        outcome = fresh ? await saveMany(build(fresh)) : "failed";

        if (outcome === "expired") {
          setNotice("Tautan kedaluwarsa, tempel ulang link-nya.");
        }
      }
    } catch {
      setNotice("Terjadi kesalahan saat mengunduh, coba lagi.");
    } finally {
      setWorking(false);
    }
  };

  const handlePrimary = () => {
    void run((current) => {
      if (current.kind === "video") {
        const item =
          current.videos.find((entry) => entry.id === qualityId) ??
          current.videos[0];

        return item
          ? [
              {
                url: item.url,
                filename: fileName(
                  current,
                  item.ext,
                  current.videos.length > 1 ? item.label : undefined
                ),
              },
            ]
          : [];
      }

      if (current.kind === "audio") {
        return current.audio
          ? [
              {
                url: current.audio.url,
                filename: fileName(current, current.audio.ext),
              },
            ]
          : [];
      }

      return current.photos
        .filter((_, index) => selected.has(index))
        .map((photo, position) => ({
          url: photo.url,
          filename: fileName(current, photo.ext, String(position + 1)),
        }));
    });
  };

  const handleAudio = () => {
    if (!result.audio) {
      setNotice("Audio tidak tersedia untuk konten ini.");
      return;
    }

    void run((current) =>
      current.audio
        ? [
            {
              url: current.audio.url,
              filename: fileName(current, current.audio.ext),
            },
          ]
        : []
    );
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
        {result.kind === "audio" ? (
          <div className="o-track">
            <strong>{result.audio?.title}</strong>
            <span>{result.audio?.artist}</span>
          </div>
        ) : null}

        <div className="o-profile">
          <AuthorRow author={result.author} platform={result.platform} />
          <StatsGrid stats={result.stats} pending={statsPending} />
          <CaptionBlock text={result.caption} />
        </div>

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

        {notice || info ? (
          <Alert tone="info" message={(notice ?? info) as string} />
        ) : null}

        <ActionBar
          primaryLabel={working ? "Mengunduh..." : primaryLabel}
          busy={
            working || (result.kind === "photo" && selectedPhotos.length === 0)
          }
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
