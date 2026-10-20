"use client";

import { useEffect, useState } from "react";
import type { DetailsResponse, MediaPatch, MediaResult } from "@/lib/providers/types";

type State = {
  key: string;
  patch: MediaPatch | null;
  done: boolean;
};

export function useDetails(result: MediaResult | null) {
  const key = result?.detailsPending ? result.sourceUrl : "";
  const [state, setState] = useState<State>({ key: "", patch: null, done: false });

  useEffect(() => {
    if (!key) {
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const response = await fetch(`/api/details?url=${encodeURIComponent(key)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const json = (await response.json()) as DetailsResponse;

        if (!controller.signal.aborted) {
          setState({ key, patch: json.ok ? json.data : null, done: true });
        }
      } catch {
        if (!controller.signal.aborted) {
          setState({ key, patch: null, done: true });
        }
      }
    })();

    return () => controller.abort();
  }, [key]);

  const current = key && state.key === key ? state : null;

  return {
    patch: current?.patch ?? null,
    loading: Boolean(key) && !current?.done,
  };
}
