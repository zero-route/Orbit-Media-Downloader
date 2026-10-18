import type { MediaResult } from "../providers/types";

function clean(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

export function baseName(result: MediaResult) {
  const owner = result.author?.username
    ? clean(result.author.username)
    : "";
  const id = result.postId ? clean(result.postId) : "";
  const parts = [result.platform, owner, id].filter(Boolean);

  return parts.length > 1 ? parts.join("_") : `${result.platform}_media`;
}

export function fileName(result: MediaResult, ext: string, suffix?: string) {
  const base = baseName(result);

  return `${base}${suffix ? `_${suffix}` : ""}.${ext}`;
}
