import type { DetectedInput, MediaResult, Photo } from "./types";
import { getPlatform } from "../detect/platforms";

function placeholder(color: string, width: number, height: number, seed: number) {
  const angle = 20 + seed * 23;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<defs><linearGradient id="g" gradientTransform="rotate(${angle})">` +
    `<stop offset="0" stop-color="#12161F"/><stop offset="1" stop-color="${color}" stop-opacity="0.55"/>` +
    `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildPhotos(color: string, count: number): Photo[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    url: placeholder(color, 1080, 1350, index),
    thumbnailUrl: placeholder(color, 240, 300, index),
    width: 1080,
    height: 1350,
    ext: "jpg",
  }));
}

export async function mockProvider(input: DetectedInput): Promise<MediaResult> {
  await wait(900);

  const platform = getPlatform(input.platform);
  const color = platform.accent;

  const base: MediaResult = {
    platform: input.platform,
    kind: "video",
    sourceUrl: input.url,
    postId: "0000000000",
    caption: "Contoh keterangan konten yang tampil dipotong dua baris di tampilan ringkas.",
    author: {
      name: "Nama kreator",
      username: "username",
    },
    stats: {
      likes: 12400,
      comments: 318,
      shares: 1200,
      views: 96000,
    },
    durationSeconds: 24,
    coverUrl: placeholder(color, 720, 1280, 2),
    videos: [
      { id: "1080", label: "1080p", ext: "mp4", url: "about:blank", height: 1080 },
      { id: "720", label: "720p", ext: "mp4", url: "about:blank", height: 720 },
      { id: "480", label: "480p", ext: "mp4", url: "about:blank", height: 480 },
    ],
    photos: [],
  };

  if (input.platform === "instagram" || input.platform === "pinterest") {
    return {
      ...base,
      kind: "photo",
      durationSeconds: undefined,
      coverUrl: placeholder(color, 1080, 1350, 0),
      videos: [],
      photos: buildPhotos(color, 6),
    };
  }

  if (input.platform === "spotify") {
    return {
      ...base,
      kind: "audio",
      caption: undefined,
      durationSeconds: 192,
      coverUrl: placeholder(color, 640, 640, 1),
      stats: undefined,
      videos: [],
      photos: [],
      audio: {
        url: "about:blank",
        title: "Contoh lagu",
        artist: "Nama artis",
        ext: "mp3",
      },
    };
  }

  return base;
}
