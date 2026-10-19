"use client";

import { useState } from "react";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  onSize?: (width: number, height: number) => void;
};

export default function SmartImage({
  src,
  alt = "",
  className = "",
  onSize,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`o-img-fallback ${className}`} />;
  }

  return (
    <img
      ref={(node) => {
        if (node && onSize && node.complete && node.naturalWidth > 0) {
          onSize(node.naturalWidth, node.naturalHeight);
        }
      }}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onLoad={(event) => {
        const image = event.currentTarget;

        if (onSize && image.naturalWidth > 0) {
          onSize(image.naturalWidth, image.naturalHeight);
        }
      }}
      onError={() => setFailed(true)}
    />
  );
}
