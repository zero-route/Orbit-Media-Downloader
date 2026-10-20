import type { MediaResult } from "../providers/types";

const LEGACY_PLATFORMS = new Set(["spotify", "youtube"]);

function clean(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^[_.]+|[_.]+$/g, "")
    .slice(0, 60);
}

export function baseName(result: MediaResult) {
  const owner = result.author?.username ? clean(result.author.username) : "";
  const id = result.postId ? clean(result.postId) : "";

  if (LEGACY_PLATFORMS.has(result.platform)) {
    const parts = [result.platform, owner, id].filter(Boolean);

    return parts.length > 1 ? parts.join("_") : `${result.platform}_media`;
  }

  const unique = id || String(Date.now()).slice(-8);

  return ["Orbit", owner || result.platform, unique].join("_");
}

export function fileName(result: MediaResult, ext: string, suffix?: string) {
  const base = baseName(result);

  return `${base}${suffix ? `_${suffix}` : ""}.${ext}`;
}
