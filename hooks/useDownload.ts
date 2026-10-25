"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DownloadFile = {
  url: string;
  filename: string;
};

export type SaveOutcome = "ok" | "expired" | "failed" | "mock";

const PROXY_PREFIXES = [
  "/api/download",
  "/api/mp3",
  "/api/slideshow",
  "/api/ytmp3",
  "/api/ytlink",
];
const LINK_PREFIX = "/api/ytlink";
const DONE_VISIBLE_MS = 4000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isProxy(url: string) {
  return PROXY_PREFIXES.some((prefix) => url.startsWith(prefix));
}

type Fetched =
  | { state: "ok"; blob: Blob }
  | { state: "direct"; url: string }
  | { state: "expired" }
  | { state: "failed"; message?: string };

async function readJson(response: Response) {
  try {
    const body: unknown = await response.json();

    return typeof body === "object" && body !== null
      ? (body as { url?: unknown; error?: unknown })
      : null;
  } catch {
    return null;
  }
}

function textOf(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

async function fetchLink(url: string): Promise<Fetched> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (response.status === 410 || response.status === 403) {
      return { state: "expired" };
    }

    const body = await readJson(response);
    const link = textOf(body?.url);

    if (response.ok && link && /^https:\/\//i.test(link)) {
      return { state: "direct", url: link };
    }

    return { state: "failed", message: textOf(body?.error) };
  } catch {
    return { state: "failed" };
  }
}

async function fetchFile(
  url: string,
  onProgress?: (percent: number) => void
): Promise<Fetched> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (response.status === 410 || response.status === 403) {
      return { state: "expired" };
    }

    const type = response.headers.get("content-type") ?? "";

    if (!response.ok || type.includes("json")) {
      const body = type.includes("json") ? await readJson(response) : null;
      const link = textOf(body?.url);

      if (link && /^https:\/\//i.test(link)) {
        return { state: "direct", url: link };
      }

      return { state: "failed", message: textOf(body?.error) };
    }

    const total = Number(response.headers.get("content-length")) || 0;

    if (!response.body) {
      const blob = await response.blob();

      return blob.size > 0 ? { state: "ok", blob } : { state: "failed" };
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    let lastPercent = -1;

    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      if (value) {
        chunks.push(value);
        received += value.length;

        if (total > 0 && onProgress) {
          const percent = Math.min(99, Math.floor((received / total) * 100));

          if (percent !== lastPercent) {
            lastPercent = percent;
            onProgress(percent);
          }
        }
      }
    }

    if (received === 0) {
      return { state: "failed" };
    }

    return { state: "ok", blob: new Blob(chunks as BlobPart[], { type }) };
  } catch {
    return { state: "failed" };
  }
}

function saveBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

function openLink(url: string) {
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

function saveDirect(file: DownloadFile) {
  const anchor = document.createElement("a");

  anchor.href = file.url;
  anchor.download = file.filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function useDownload() {
  const [notice, setNotice] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const clearNotice = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }

    setNotice(null);
  }, []);

  const flash = useCallback((message: string) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    setNotice(message);
    timer.current = setTimeout(() => setNotice(null), DONE_VISIBLE_MS);
  }, []);

  const saveMany = useCallback(
    async (files: DownloadFile[]): Promise<SaveOutcome> => {
      if (files.length === 0) {
        return "failed";
      }

      if (files.some((file) => !file.url || file.url.startsWith("about:"))) {
        setNotice("Mode contoh: unduhan belum aktif.");
        return "mock";
      }

      const total = files.length;

      for (let index = 0; index < total; index += 1) {
        const file = files[index];

        if (file.url.startsWith("/api/mp3")) {
          setNotice("Menyiapkan MP3, mohon tunggu...");
        } else if (file.url.startsWith("/api/ytmp3")) {
          setNotice("Menyiapkan MP3, mohon tunggu...");
        } else if (file.url.startsWith(LINK_PREFIX)) {
          setNotice("Menyiapkan link unduhan, mohon tunggu...");
        } else if (file.url.startsWith("/api/slideshow")) {
          setNotice("Membuat slideshow, mohon tunggu...");
        } else {
          setNotice(
            total > 1 ? `Mengunduh ${index + 1} dari ${total}...` : "Mengunduh..."
          );
        }

        if (!isProxy(file.url)) {
          saveDirect(file);
          continue;
        }

        const result = file.url.startsWith(LINK_PREFIX)
          ? await fetchLink(file.url)
          : await fetchFile(file.url, (percent) => {
              if (total === 1) {
                setNotice(`Mengunduh ${percent}%`);
              }
            });

        if (result.state === "expired" && index === 0) {
          clearNotice();
          return "expired";
        }

        if (result.state === "direct") {
          openLink(result.url);

          if (index < total - 1) {
            await wait(350);
          }

          continue;
        }

        if (result.state !== "ok") {
          setNotice(
            (result.state === "failed" ? result.message : undefined) ??
              (total > 1
                ? `Gagal mengunduh file ${index + 1} dari ${total}. Coba lagi.`
                : "Gagal mengunduh, coba lagi.")
          );
          return "failed";
        }

        saveBlob(result.blob, file.filename);

        if (index < total - 1) {
          await wait(350);
        }
      }

      flash(
        files.every((file) => file.url.startsWith(LINK_PREFIX))
          ? "Unduhan dimulai. Cek folder Unduhan."
          : total > 1
            ? `${total} file selesai diunduh. Cek folder Unduhan.`
            : "Selesai diunduh. Cek folder Unduhan."
      );

      return "ok";
    },
    [clearNotice, flash]
  );

  const save = useCallback(
    (file: DownloadFile) => saveMany([file]),
    [saveMany]
  );

  return { notice, setNotice, clearNotice, save, saveMany };
}
