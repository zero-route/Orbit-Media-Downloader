export function formatCount(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "-";
  }

  const units: Array<[number, string]> = [
    [1_000_000_000, "M"],
    [1_000_000, "jt"],
    [1_000, "rb"],
  ];

  for (const [size, label] of units) {
    if (value >= size) {
      const scaled = value / size;
      const text = scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1);

      return `${text.replace(/\.0$/, "").replace(".", ",")} ${label}`;
    }
  }

  return String(Math.round(value));
}

export function formatDuration(seconds?: number) {
  if (seconds === undefined || seconds === null || seconds < 0) {
    return "";
  }

  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`;
  }

  return `${minutes}:${pad(secs)}`;
}

export function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) {
    return "";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const text = value >= 100 || index === 0 ? value.toFixed(0) : value.toFixed(1);

  return `${text.replace(".", ",")} ${units[index]}`;
}
