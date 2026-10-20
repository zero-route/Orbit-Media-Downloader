import { formatCount } from "@/lib/text";
import type { Stats } from "@/lib/providers/types";

type Props = {
  stats?: Stats;
};

const ITEMS: Array<[keyof Stats, string]> = [
  ["likes", "Suka"],
  ["comments", "Komentar"],
  ["shares", "Bagikan"],
  ["views", "Tonton"],
  ["saves", "Simpan"],
  ["reposts", "Posting ulang"],
];

export default function StatsGrid({ stats }: Props) {
  if (!stats) {
    return null;
  }

  const visible = ITEMS.filter(([key]) => typeof stats[key] === "number");

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className="o-stats" data-count={visible.length}>
      {visible.map(([key, label]) => (
        <div key={key} className="o-stat">
          <strong>{formatCount(stats[key])}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
