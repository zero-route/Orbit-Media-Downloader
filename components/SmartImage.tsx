"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export default function SmartImage({ src, alt = "", className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`o-img-fallback ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
