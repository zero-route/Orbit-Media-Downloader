"use client";

import { useMemo, useState } from "react";
import { splitCaption } from "@/lib/text";

type Props = {
  text?: string;
};

export default function CaptionBlock({ text }: Props) {
  const [open, setOpen] = useState(false);
  const parts = useMemo(() => splitCaption(text), [text]);

  if (!parts.text && parts.tags.length === 0) {
    return null;
  }

  const long = parts.text.length > 110;

  return (
    <>
      <div className="o-divider" />
      <div className="o-caption o-profile-caption">
        {parts.text ? (
          <>
            <p className={open ? "is-open" : ""}>{parts.text}</p>
            {long ? (
              <button type="button" onClick={() => setOpen((value) => !value)}>
                {open ? "Ringkas" : "Selengkapnya"}
              </button>
            ) : null}
          </>
        ) : null}
        {parts.tags.length > 0 ? (
          <div className="o-tags">
            {parts.tags.map((tag) => (
              <span key={tag} className="o-tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
}
