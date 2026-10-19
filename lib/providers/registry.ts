import { AppError } from "../errors";
import { getPlatform } from "../detect/platforms";
import type { PlatformId, Provider } from "./types";
import { mockProvider } from "./mock";
import { tiktokProvider } from "./tiktok";

const REAL: Partial<Record<PlatformId, Provider>> = {
  tiktok: tiktokProvider,
};

export function getProvider(platform: PlatformId): Provider {
  if (process.env.ORBIT_MOCK === "1") {
    return mockProvider;
  }

  const real = REAL[platform];

  if (real) {
    return real;
  }

  return async () => {
    throw new AppError(
      `${getPlatform(platform).name} belum tersedia, segera hadir.`,
      501
    );
  };
}
