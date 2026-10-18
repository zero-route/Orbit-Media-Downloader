type IconProps = {
  size?: number;
};

function Base({
  size = 20,
  strokeWidth = 1.9,
  children,
}: IconProps & { strokeWidth?: number; children?: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={1.8}>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
    </Base>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2.4}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </Base>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2.2}>
      <path d="M12 4v11" />
      <path d="M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </Base>
  );
}

export function MusicIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 18V6l9-2v11" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="15.5" cy="15" r="2.5" />
    </Base>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </Base>
  );
}

export function FolderIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </Base>
  );
}

export function SlidesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M10 9.5v5l4.5-2.5z" />
    </Base>
  );
}

export function PlayIcon({ size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2.2}>
      <path d="M15 5l-7 7 7 7" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={2.2}>
      <path d="M9 5l7 7-7 7" />
    </Base>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Base {...props} strokeWidth={1.8}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </Base>
  );
}
