"use client";

import { useState } from "react";

type Props = {
  text?: string;
};

export default function CaptionBlock({ text }: Props) {
  const [open, setOpen] = useState(false);

  if (!text) {
    return null;
  }

  const long = text.length > 110;

  return (
    <div className="o-caption">
      <p className={open ? "is-open" : ""}>{text}</p>
      {long ? (
        <button type="button" onClick={() => setOpen((value) => !value)}>
          {open ? "Ringkas" : "Selengkapnya"}
        </button>
      ) : null}
    </div>
  );
}
