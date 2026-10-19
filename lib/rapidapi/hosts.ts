import type { PlatformId } from "../providers/types";

export type HostConfig = {
  host: string;
  path: string;
};

const DEFAULTS: Partial<Record<PlatformId, HostConfig>> = {
  tiktok: {
    host: "instagram-tiktok-youtube-downloader.p.rapidapi.com",
    path: "/fetch",
  },
};

function clean(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : undefined;
}

function normalizePath(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

export function hostConfig(platform: PlatformId): HostConfig {
  const base = DEFAULTS[platform];
  const key = platform.toUpperCase();

  const legacyHost =
    platform === "tiktok" ? clean(process.env.RAPIDAPI_DOWNLOAD_HOST) : undefined;
  const legacyPath =
    platform === "tiktok" ? clean(process.env.RAPIDAPI_PATH) : undefined;

  const host =
    clean(process.env[`RAPIDAPI_${key}_HOST`]) ?? legacyHost ?? base?.host;
  const path =
    clean(process.env[`RAPIDAPI_${key}_PATH`]) ?? legacyPath ?? base?.path;

  if (!host || !path) {
    throw new Error(`Host RapidAPI untuk ${platform} belum diatur.`);
  }

  return { host, path: normalizePath(path) };
}
