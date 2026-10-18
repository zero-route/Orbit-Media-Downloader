"use client";

import { useCallback, useRef, useState } from "react";
import type { MediaResult, ResolveResponse } from "@/lib/providers/types";

export type ResolveStatus = "idle" | "loading" | "ready" | "error";

export function useResolve() {
  const [status, setStatus] = useState<ResolveStatus>("idle");
  const [data, setData] = useState<MediaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | undefined>(undefined);
  const controller = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setStatus("idle");
    setData(null);
    setError(null);
    setDetail(undefined);
  }, []);

  const resolve = useCallback(async (url: string) => {
    controller.current?.abort();

    const current = new AbortController();
    controller.current = current;

    setStatus("loading");
    setError(null);
    setDetail(undefined);

    try {
      const response = await fetch(
        `/api/resolve?url=${encodeURIComponent(url)}`,
        { signal: current.signal, cache: "no-store" }
      );
      const json = (await response.json()) as ResolveResponse;

      if (current.signal.aborted) {
        return;
      }

      if (json.ok) {
        setData(json.data);
        setStatus("ready");
        return;
      }

      setData(null);
      setError(json.error);
      setDetail(json.detail);
      setStatus("error");
    } catch {
      if (current.signal.aborted) {
        return;
      }

      setData(null);
      setError("Koneksi bermasalah, coba lagi.");
      setStatus("error");
    }
  }, []);

  return { status, data, error, detail, resolve, reset };
}
