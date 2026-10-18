import type { PlatformId, Provider } from "./types";
import { mockProvider } from "./mock";

const REAL: Partial<Record<PlatformId, Provider>> = {};

export function getProvider(platform: PlatformId): Provider {
  if (process.env.ORBIT_MOCK === "1") {
    return mockProvider;
  }

  return REAL[platform] ?? mockProvider;
}
