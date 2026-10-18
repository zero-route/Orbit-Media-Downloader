"use client";

import { CloseIcon, LinkIcon } from "@/components/icons/UiIcons";

type Props = {
  value: string;
  detected: boolean;
  loading: boolean;
  onChange: (value: string) => void;
  onPaste: () => void;
  onClear: () => void;
  onSubmit: () => void;
};

function ClipboardIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="4" width="12" height="16" rx="2" />
      <path d="M16 4V3a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h2" />
      <path d="M11 9h6M11 13h6M11 17h3" />
    </svg>
  );
}

export default function UrlBox({
  value,
  detected,
  loading,
  onChange,
  onPaste,
  onClear,
  onSubmit,
}: Props) {
  const hasValue = value.trim().length > 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "10px",
        width: "100%",
        minWidth: 0,
      }}
    >
      <div
        className={`o-urlbox${detected ? " is-detected" : ""}${
          loading ? " is-loading" : ""
        }`}
        style={{
          flex: "1 1 0%",
          minWidth: 0,
        }}
      >
        <div
          className="o-urlbox-inner"
          style={{
            height: "100%",
            minHeight: "54px",
            padding: "5px 8px 5px 14px",
            gap: "8px",
          }}
        >
          <span className="o-urlbox-icon">
            <LinkIcon size={20} />
          </span>

          <label htmlFor="orbit-url" className="o-sr">
            Tautan media
          </label>

          <input
            id="orbit-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Tempel link di sini"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSubmit();
              }
            }}
            style={{
              width: "100%",
              minWidth: 0,
              padding: "11px 0",
              fontSize: "15px",
            }}
          />

          {hasValue && (
            <button
              type="button"
              className="o-iconbtn"
              aria-label="Hapus link"
              onClick={onClear}
              style={{
                width: "36px",
                height: "36px",
                flexShrink: 0,
              }}
            >
              <CloseIcon size={17} />
            </button>
          )}
        </div>
      </div>

      {!hasValue && (
        <button
          type="button"
          className="o-pastebtn"
          onClick={onPaste}
          aria-label="Tempel tautan dari clipboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            flex: "0 0 auto",
            minWidth: "104px",
            height: "54px",
            padding: "0 15px",
            borderRadius: "15px",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#777b87",
              opacity: 0.75,
            }}
          >
            <ClipboardIcon />
          </span>

          <span>Tempel</span>
        </button>
      )}
    </div>
  );
}