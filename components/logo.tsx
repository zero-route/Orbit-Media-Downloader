"use client";

import { useId } from "react";

type Props = {
  size?: number;
};

export default function Logo({ size = 36 }: Props) {
  const id = useId().replace(/:/g, "");
  const a = `orb-a-${id}`;
  const b = `orb-b-${id}`;
  const c = `orb-c-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Logo Orbit"
    >
      <defs>
        <linearGradient id={a} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25F4EE" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="1" stopColor="#FF0033" />
        </linearGradient>
        <linearGradient id={c} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E5E7EB" />
          <stop offset="1" stopColor="#8B90A0" />
        </linearGradient>
      </defs>
      <polygon
        points="24,3 42,13.5 24,24 6,13.5"
        fill={`url(#${a})`}
        stroke="#0B0D12"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="42,13.5 42,34.5 24,45 24,24"
        fill={`url(#${b})`}
        stroke="#0B0D12"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="6,13.5 24,24 24,45 6,34.5"
        fill={`url(#${c})`}
        stroke="#0B0D12"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="5" fill="#0B0D12" />
      <circle
        cx="24"
        cy="24"
        r="5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.65"
        strokeWidth="1.2"
      />
    </svg>
  );
}
