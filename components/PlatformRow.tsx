import PlatformIcon from "@/components/icons/PlatformIcon";
import { PLATFORMS } from "@/lib/detect/platforms";
import type { PlatformId } from "@/lib/providers/types";

type Props = {
  active: PlatformId | null;
};

export default function PlatformRow({ active }: Props) {
  return (
    <div className={`o-platforms${active ? " has-active" : ""}`}>
      {PLATFORMS.map((platform) => {
        const state =
          active === null ? "" : active === platform.id ? " is-active" : " is-dim";

        return (
          <span
            key={platform.id}
            role="img"
            aria-label={
              active === platform.id
                ? `${platform.name}, terdeteksi`
                : platform.name
            }
            className={`o-platform${state}`}
            style={
              {
                "--p-accent": platform.accent,
              } as React.CSSProperties
            }
          >
            <PlatformIcon platform={platform.id} />
          </span>
        );
      })}
    </div>
  );
}
