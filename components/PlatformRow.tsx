"use client";

type Props = {
  active: string | null;
};

const platforms = [
  {
    id: "tiktok",
    name: "TikTok",
    src: "/images/tiktok.png",
  },
  {
    id: "instagram",
    name: "Instagram",
    src: "/images/instagram.png",
  },
  {
    id: "youtube",
    name: "YouTube",
    src: "/images/youtube.png",
  },
  {
    id: "x",
    name: "X",
    src: "/images/x.png",
  },
  {
    id: "threads",
    name: "Threads",
    src: "/images/threads.png",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    src: "/images/pinterest.png",
  },
  {
    id: "spotify",
    name: "Spotify",
    src: "/images/spotify.png",
  },
];

export default function PlatformRow({ active }: Props) {
  return (
    <section
      aria-label="Applications Support"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        marginTop: "2px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            height: "1px",
            flex: "1 1 0",
            minWidth: "12px",
            background:
              "linear-gradient(90deg, transparent, rgba(232,234,240,0.3))",
          }}
        />

        <h2
          style={{
            margin: 0,
            color: "var(--muted)",
            fontSize: "clamp(11px, 3.2vw, 15px)",
            lineHeight: 1.4,
            fontWeight: 500,
            letterSpacing: "0.035em",
            whiteSpace: "nowrap",
          }}
        >
          Applications Support
        </h2>

        <span
          aria-hidden="true"
          style={{
            height: "1px",
            flex: "1 1 0",
            minWidth: "12px",
            background:
              "linear-gradient(90deg, rgba(232,234,240,0.3), transparent)",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          gap: "0px",
        }}
      >
        {platforms.map((platform) => {
          const isActive = active === platform.id;

          return (
            <div
              key={platform.id}
              title={platform.name}
              aria-label={platform.name}
              aria-current={isActive ? "true" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                minWidth: 0,
                minHeight: "44px",
              }}
            >
              <img
                src={platform.src}
                alt={platform.name}
                width={44}
                height={44}
                draggable={false}
                style={{
                  display: "block",
                  width: "clamp(27px, 8vw, 44px)",
                  height: "clamp(27px, 8vw, 44px)",
                  objectFit: "contain",
                  objectPosition: "center",
                  opacity: active && !isActive ? 0.85 : 1,
                  filter: "none",
                  boxShadow: "none",
                  flexShrink: 0,
                  userSelect: "none",
                  WebkitUserDrag: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}