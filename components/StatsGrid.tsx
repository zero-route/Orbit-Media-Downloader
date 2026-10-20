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

type Cell = {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  value?: string;
  skeleton?: boolean;
};

const ITEMS: Array<[keyof Stats, string, () => React.ReactNode]> = [
  ["views", "Tayangan", () => <EyeIcon size={20} />],
  ["likes", "Suka", () => <HeartIcon size={20} />],
  ["comments", "Komentar", () => <CommentIcon size={20} />],
  ["shares", "Bagikan", () => <ShareIcon size={20} />],
  ["saves", "Simpan", () => <BookmarkIcon size={20} />],
  ["reposts", "Posting ulang", () => <RepostIcon size={20} />],
];

function columnsFor(count: number) {
  if (count >= 5) return 3;
  if (count === 4) return 2;

  return Math.max(count, 1);
}

export default function StatsGrid({ stats, pending }: Props) {
  const visible: Cell[] = ITEMS.filter(
    ([key]) => typeof stats?.[key] === "number"
  ).map(([key, label, icon]) => ({
    key,
    label,
    icon: icon(),
    value: formatCount(stats?.[key]),
  }));

  let cells: Cell[] = visible;

  if (visible.length === 0) {
    if (!pending) {
      return null;
    }

    cells = Array.from({ length: 6 }, (_, index) => ({
      key: `skeleton-${index}`,
      skeleton: true,
    }));
  }

  const columns = columnsFor(cells.length);
  const fillers = (columns - (cells.length % columns)) % columns;
  const total = cells.length + fillers;
  const all: Array<Cell | null> = [
    ...cells,
    ...Array.from({ length: fillers }, () => null),
  ];

  return (
    <>
      <div className="o-divider" />
      <div
        className="o-stats"
        style={{ "--cols": columns } as React.CSSProperties}
        aria-hidden={cells[0]?.skeleton ? true : undefined}
      >
        {all.map((cell, index) => {
          const classes = [
            "o-stat",
            (index + 1) % columns !== 0 ? "has-r" : "",
            index < total - columns ? "has-b" : "",
          ]
            .filter(Boolean)
            .join(" ");

          if (!cell) {
            return <div key={`filler-${index}`} className={classes} />;
          }

          if (cell.skeleton) {
            return (
              <div key={cell.key} className={classes}>
                <span className="o-skel o-stat-skel" />
                <span className="o-skel o-stat-skel is-small" />
              </div>
            );
          }

          return (
            <div key={cell.key} className={classes}>
              <div className="o-stat-top">
                {cell.icon}
                <strong>{cell.value}</strong>
              </div>
              <span>{cell.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
