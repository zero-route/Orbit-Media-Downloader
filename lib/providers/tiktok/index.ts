import { AppError } from "../../errors";
import { deadlineIn, rapidJson } from "../../rapidapi/client";
import { hostConfig } from "../../rapidapi/hosts";
import { expiryFromNow, proxyPath } from "../../sign";
import type { DetectedInput, MediaResult, Photo, Provider } from "../types";
import { fetchDetails } from "./details";
import { isBackupPayload, normalizeTikTok, type TikTokRaw } from "./normalize";
import { resolvePostUrl } from "./resolveUrl";

const MAX_ATTEMPTS = 3;
const TOTAL_BUDGET_MS = 45_000;
const RETRY_DELAY_MS = 1_200;
const DETAILS_BUDGET_MS = 25_000;

type Attempt = { raw: TikTokRaw; backup: boolean };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function score(attempt: Attempt) {
  return (
    (attempt.backup ? 0 : 4) +
    (attempt.raw.avatar ? 2 : 0) +
    (attempt.raw.description ? 1 : 0)
  );
}

function photoExt(url: string) {
  if (/\.webp(\?|$)/i.test(url)) return "webp";
  if (/\.png(\?|$)/i.test(url)) return "png";

  return "jpg";
}

async function fetchRaw(targetUrl: string, deadlineAt: number) {
  const { host, path } = hostConfig("tiktok");
  let best: Attempt | null = null;
  let lastError: unknown = null;

  for (let index = 0; index < MAX_ATTEMPTS; index += 1) {
    if (index > 0) {
      if (deadlineAt - Date.now() < 6_000) {
        break;
      }

      await sleep(RETRY_DELAY_MS);
    }

    try {
      const payload = await rapidJson({
        host,
        path,
        query: { url: targetUrl },
        deadlineAt,
        retries: 2,
      });

      const attempt: Attempt = {
        raw: normalizeTikTok(payload, targetUrl),
        backup: isBackupPayload(payload),
      };

      if (!best || score(attempt) > score(best)) {
        best = attempt;
      }

      if (!attempt.backup) {
        break;
      }
    } catch (error) {
      lastError = error;

      if (error instanceof AppError && error.status < 500 && error.status !== 429) {
        break;
      }
    }
  }

  if (best) {
    return best.raw;
  }

  if (lastError instanceof AppError) {
    throw lastError;
  }

  throw new AppError("Gagal mengambil data dari TikTok.", 502);
}

export const tiktokProvider: Provider = async (
  input: DetectedInput
): Promise<MediaResult> => {
  const deadlineAt = deadlineIn(TOTAL_BUDGET_MS);
  const targetUrl = await resolvePostUrl(input.url);

  const [raw, details] = await Promise.all([
    fetchRaw(targetUrl, deadlineAt),
    fetchDetails(targetUrl, input.url, deadlineIn(DETAILS_BUDGET_MS)).catch(
      () => null
    ),
  ]);

  const rawHasStats = [raw.likes, raw.comments, raw.shares, raw.views].some(
    (value) => (value ?? 0) > 0
  );
  const fromRaw = (value?: number) => (rawHasStats ? value : undefined);
  const expires = expiryFromNow();
  const wrap = (url?: string) => (url ? proxyPath(url, expires) : undefined);

  const isPhoto = raw.photos.length > 0;

  const photos: Photo[] = raw.photos.map((url, index) => ({
    id: String(index + 1),
    url: proxyPath(url, expires),
    ext: photoExt(url),
  }));

  const videoUrl = wrap(raw.videoUrl);
  const audioUrl = wrap(raw.audioUrl);

  return {
    platform: "tiktok",
    kind: isPhoto ? "photo" : "video",
    sourceUrl: input.url,
    postId: raw.id,
    caption: raw.description || details?.description || undefined,
    author: {
      name: raw.nickname ?? details?.nickname,
      username: raw.username ?? details?.username,
      avatarUrl: wrap(raw.avatar ?? details?.avatar),
    },
    stats: {
      likes: details?.likes ?? fromRaw(raw.likes),
      comments: details?.comments ?? fromRaw(raw.comments),
      shares: details?.shares ?? fromRaw(raw.shares),
      views: details?.views ?? fromRaw(raw.views),
      saves: details?.saves,
      reposts: details?.reposts,
    },
    durationSeconds: raw.durationSeconds,
    coverUrl: wrap(raw.cover),
    videos: !isPhoto && videoUrl
      ? [{ id: "original", label: "Asli", ext: "mp4", url: videoUrl }]
      : [],
    photos,
    audio: audioUrl
      ? {
          url: audioUrl,
          title: raw.audioTitle,
          artist: raw.audioArtist,
          ext: "mp3",
        }
      : undefined,
    expiresAt: expires * 1000,
  };
};
