"use client";

import { useCallback, useState } from "react";

export type DownloadFile = {
  url: string;
  filename: string;
};

export type SaveOutcome = "ok" | "expired" | "failed" | "mock";

const PROXY_PREFIX = "/api/download";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isProxy(url: string) {
  return url.startsWith(PROXY_PREFIX);
}

function withParams(url: string, params: Record<string, string>) {
  const next = new URL(url, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    next.searchParams.set(key, value);
  }

  return `${next.pathname}${next.search}`;
}

async function probe(url: string): Promise<SaveOutcome> {
  try {
    const response = await fetch(withParams(url, { c: "1" }), {
      cache: "no-store",
    });

    if (response.ok) {
      return "ok";
    }

    if (response.status === 410 || response.status === 403) {
      return "expired";
    }

    return "failed";
  } catch {
    return "failed";
  }
}

function trigger(file: DownloadFile) {
  const href = isProxy(file.url)
    ? withParams(file.url, { d: "1", n: file.filename })
    : file.url;

  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = file.filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function useDownload() {
  const [notice, setNotice] = useState<string | null>(null);

  const clearNotice = useCallback(() => setNotice(null), []);

  const saveMany = useCallback(
    async (files: DownloadFile[]): Promise<SaveOutcome> => {
      if (files.length === 0) {
        return "failed";
      }

      if (files.some((file) => !file.url || file.url.startsWith("about:"))) {
        setNotice("Mode contoh: unduhan belum aktif.");
        return "mock";
      }

      if (isProxy(files[0].url)) {
        const outcome = await probe(files[0].url);

        if (outcome === "expired") {
          return "expired";
        }

        if (outcome === "failed") {
          setNotice("Gagal mengunduh, coba lagi.");
          return "failed";
        }
      }

      for (let index = 0; index < files.length; index += 1) {
        trigger(files[index]);

        if (index < files.length - 1) {
          await wait(400);
        }
      }

      return "ok";
    },
    []
  );

  const save = useCallback(
    (file: DownloadFile) => saveMany([file]),
    [saveMany]
  );

  return { notice, setNotice, clearNotice, save, saveMany };
}
