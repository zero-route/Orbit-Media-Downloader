import { AppError } from "../errors";
import { getPlatform } from "../detect/platforms";
import type { DetailsProvider, PlatformId, Provider } from "./types";
import { instagramDetails, instagramProvider } from "./instagram";
import { mockProvider } from "./mock";
import { pinterestDetails, pinterestProvider } from "./pinterest";
import { tiktokDetails, tiktokProvider } from "./tiktok";
import { xProvider } from "./x";

const REAL: Partial<Record<PlatformId, Provider>> = {
  tiktok: tiktokProvider,
  instagram: instagramProvider,
  pinterest: pinterestProvider,
  x: xProvider,
};

const DETAILS: Partial<Record<PlatformId, DetailsProvider>> = {
  tiktok: tiktokDetails,
  instagram: instagramDetails,
  pinterest: pinterestDetails,
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

export function getDetailsProvider(platform: PlatformId): DetailsProvider | null {
  if (process.env.ORBIT_MOCK === "1") {
    return null;
  }

  return DETAILS[platform] ?? null;
}
