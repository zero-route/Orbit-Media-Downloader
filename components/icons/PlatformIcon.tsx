import type { PlatformId } from "@/lib/providers/types";

type Props = {
  platform: PlatformId;
  size?: number;
};

export default function PlatformIcon({ platform, size = 22 }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (platform) {
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M9 18V6l9-2v11" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="15.5" cy="15" r="2.5" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H9l-5 4z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5" />
          <path d="M12 14v7" />
        </svg>
      );
    case "spotify":
      return (
        <svg {...common}>
          <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
      );
  }
}
