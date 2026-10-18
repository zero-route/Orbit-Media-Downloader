"use client";

import { useCallback, useState } from "react";

export type DownloadFile = {
  url: string;
  filename: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useDownload() {
  const [notice, setNotice] = useState<string | null>(null);

  const clearNotice = useCallback(() => setNotice(null), []);

  const save = useCallback((file: DownloadFile) => {
    if (!file.url || file.url.startsWith("about:")) {
      setNotice("Mode contoh: unduhan belum aktif.");
      return false;
    }

    const anchor = document.createElement("a");

    anchor.href = file.url;
    anchor.download = file.filename;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    return true;
  }, []);

  const saveMany = useCallback(
    async (files: DownloadFile[]) => {
      for (let index = 0; index < files.length; index += 1) {
        const ok = save(files[index]);

        if (!ok) {
          return;
        }

        if (index < files.length - 1) {
          await wait(400);
        }
      }
    },
    [save]
  );

  return { notice, setNotice, clearNotice, save, saveMany };
}
