import {
  CopyIcon,
  DownloadIcon,
  MusicIcon,
  SlidesIcon,
} from "@/components/icons/UiIcons";

type Props = {
  primaryLabel: string;
  busy?: boolean;
  onPrimary: () => void;
  onAudio?: () => void;
  onCopy?: () => void;
  slideshow?: "hidden" | "disabled" | "enabled";
  onSlideshow?: () => void;
};

export default function ActionBar({
  primaryLabel,
  busy,
  onPrimary,
  onAudio,
  onCopy,
  slideshow = "hidden",
  onSlideshow,
}: Props) {
  return (
    <div className="o-actions">
      <button
        type="button"
        className="o-primary"
        onClick={onPrimary}
        disabled={busy}
      >
        <DownloadIcon size={20} />
        {primaryLabel}
      </button>
      {onAudio ? (
        <button
          type="button"
          className="o-iconbtn is-large"
          aria-label="Unduh audio MP3"
          onClick={onAudio}
        >
          <MusicIcon size={22} />
        </button>
      ) : null}
      {slideshow !== "hidden" ? (
        <button
          type="button"
          className={`o-iconbtn is-large${
            slideshow === "disabled" ? " is-dashed" : ""
          }`}
          aria-label={
            slideshow === "disabled"
              ? "Slideshow tidak tersedia, tidak ada audio"
              : "Buat slideshow"
          }
          disabled={slideshow === "disabled"}
          onClick={onSlideshow}
        >
          <SlidesIcon size={22} />
        </button>
      ) : null}
      {onCopy ? (
        <button
          type="button"
          className="o-iconbtn is-large"
          aria-label="Salin keterangan"
          onClick={onCopy}
        >
          <CopyIcon size={22} />
        </button>
      ) : null}
    </div>
  );
}
