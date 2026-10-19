"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DownloadFile = {
  url: string;
  filename: string;
};

export type SaveOutcome = "ok" | "expired" | "failed" | "mock";

const PROXY_PREFIX = "/api/download";
const DONE_VISIBLE_MS = 4000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isProxy(url: string) {
  return url.startsWith(PROXY_PREFIX);
}

type Fetched =
  | { state: "ok"; blob: Blob }
  | { state: "expired" }
  | { state: "failed" };

async function fetchFile(url: string): Promise<Fetched> {
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (response.status === 410 || response.status === 403) {
      return { state: "expired" };
    }

    if (!response.ok) {
      return { state: "failed" };
    }

    const blob = await response.blob();

    if (blob.size === 0 || blob.type.includes("json")) {
      return { state: "failed" };
    }

    return { state: "ok", blob };
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

        setNotice(
          total > 1 ? `Mengunduh ${index + 1} dari ${total}...` : "Mengunduh..."
        );

        if (!isProxy(file.url)) {
          saveDirect(file);
          continue;
        }

        const result = await fetchFile(file.url);

        if (result.state === "expired" && index === 0) {
          clearNotice();
          return "expired";
        }

        if (result.state !== "ok") {
          setNotice(
            total > 1
              ? `Gagal mengunduh file ${index + 1} dari ${total}. Coba lagi.`
              : "Gagal mengunduh, coba lagi."
          );
          return "failed";
        }

        saveBlob(result.blob, file.filename);

        if (index < total - 1) {
          await wait(350);
        }
      }

      flash(
        total > 1
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
