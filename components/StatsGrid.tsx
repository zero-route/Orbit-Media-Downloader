import {
  BookmarkIcon,
  CommentIcon,
  EyeIcon,
  HeartIcon,
  RepostIcon,
  ShareIcon,
} from "@/components/icons/StatIcons";
import { formatCount } from "@/lib/text";
import type { Stats } from "@/lib/providers/types";

type Props = {
  stats?: Stats;
  pending?: boolean;
};

const ITEMS: Array<[keyof Stats, string, () => React.ReactNode]> = [
  ["likes", "Suka", () => <HeartIcon />],
  ["comments", "Komentar", () => <CommentIcon />],
  ["shares", "Bagikan", () => <ShareIcon />],
  ["views", "Tonton", () => <EyeIcon />],
  ["saves", "Simpan", () => <BookmarkIcon />],
  ["reposts", "Posting ulang", () => <RepostIcon />],
];

export default function StatsGrid({ stats, pending }: Props) {
  const visible = ITEMS.filter(([key]) => typeof stats?.[key] === "number");

  if (visible.length === 0) {
    if (!pending) {
      return null;
    }

    return (
      <div className="o-stats" aria-hidden="true">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="o-skel o-stat-skel" />
        ))}
      </div>
    );
  }

  return (
    <div className="o-stats" data-count={visible.length}>
      {visible.map(([key, label, icon]) => (
        <div key={key} className="o-stat" title={label} aria-label={label}>
          {icon()}
          <strong>{formatCount(stats?.[key])}</strong>
        </div>
      ))}
    </div>
  );
}
