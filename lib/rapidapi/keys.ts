import { AppError } from "../errors";

export function getKeys(): string[] {
  const raw = process.env.RAPIDAPI_KEYS || process.env.RAPIDAPI_KEY || "";

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function requireKeys(): string[] {
  const keys = getKeys();

  if (keys.length === 0) {
    throw new AppError("RAPIDAPI_KEY belum dikonfigurasi di environment.", 500);
  }

  return keys;
}
