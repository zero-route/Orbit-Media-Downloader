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
      className={`o-urlbox${detected ? " is-detected" : ""}${
        loading ? " is-loading" : ""
      }`}
    >
      <div className="o-urlbox-inner">
        <span className="o-urlbox-icon">
          <LinkIcon size={22} />
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
        />
        {hasValue ? (
          <button
            type="button"
            className="o-iconbtn"
            aria-label="Hapus link"
            onClick={onClear}
          >
            <CloseIcon size={18} />
          </button>
        ) : (
          <button type="button" className="o-pastebtn" onClick={onPaste}>
            Tempel
          </button>
        )}
      </div>
    </div>
  );
}
