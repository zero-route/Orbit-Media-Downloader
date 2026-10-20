"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Alert from "@/components/Alert";
import Hero from "@/components/Hero";
import Logo from "@/components/Logo";
import PlatformRow from "@/components/PlatformRow";
import ResultCard from "@/components/ResultCard";
import ResultSkeleton from "@/components/Skeleton";
import UrlBox from "@/components/UrlBox";
import { useClipboard } from "@/hooks/useClipboard";
import { useDetails } from "@/hooks/useDetails";
import { useResolve } from "@/hooks/useResolve";
import { detectInput } from "@/lib/detect/detect";
import { mergeDetails } from "@/lib/providers/merge";

export default function Home() {
  const [value, setValue] = useState("");
  const { status, data, error, detail, resolve, reset } = useResolve();
  const clipboard = useClipboard();
  const details = useDetails(data);
  const view = useMemo(
    () => (data ? mergeDetails(data, details.patch) : null),
    [data, details.patch]
  );
  const lastResolved = useRef("");

  const detected = useMemo(() => detectInput(value), [value]);
  const trimmed = value.trim();
  const looksLikeLink = /https?:\/\/|\.[a-z]{2,}(\/|$)/i.test(trimmed);
  const unsupported = Boolean(trimmed) && !detected && looksLikeLink;
  const idle = status === "idle" && !detected;

  useEffect(() => {
    if (!trimmed) {
      lastResolved.current = "";
      reset();
      return;
    }

    if (!detected || lastResolved.current === detected.url) {
      return;
    }

    const timer = setTimeout(() => {
      lastResolved.current = detected.url;
      void resolve(detected.url);
    }, 350);

    return () => clearTimeout(timer);
  }, [trimmed, detected, resolve, reset]);

  const handlePaste = async () => {
    const text = await clipboard.read();

    if (text) {
      setValue(text);
    }
  };

  const handleClear = () => {
    lastResolved.current = "";
    setValue("");
    reset();
  };

  const handleRetry = () => {
    if (!detected) {
      return;
    }

    lastResolved.current = detected.url;
    void resolve(detected.url);
  };

  return (
    <div className="o-app" data-platform={detected?.platform ?? "none"}>
      <header className="o-header">
        <div className="o-brand">
          <Logo size={36} />
          <span>Orbit</span>
        </div>
      </header>

      <main className={`o-main${idle ? " is-idle" : ""}`}>
        {idle ? <Hero /> : null}

        <UrlBox
          value={value}
          detected={Boolean(detected)}
          loading={status === "loading"}
          onChange={setValue}
          onPaste={handlePaste}
          onClear={handleClear}
          onSubmit={handleRetry}
        />

        <p
          style={{
            margin: "-10px 4px 0",
            color: "var(--muted)",
            fontSize: "13px",
            lineHeight: 1.5,
            textAlign: "left",
          }}
        >
          Pengingat: Hormati karya dan hak kekayaan intelektual kreator.
        </p>

        <PlatformRow active={detected?.platform ?? null} />

        {unsupported ? (
          <Alert message="Link ini belum didukung." />
        ) : null}

        {status === "loading" ? <ResultSkeleton /> : null}

        {status === "error" && error ? (
          <Alert
            message={error}
            detail={detail}
            actionLabel="Coba lagi"
            onAction={handleRetry}
          />
        ) : null}

        {status === "ready" && data && view ? (
          <ResultCard
            key={data.sourceUrl}
            result={view}
            statsPending={details.loading}
            onRefresh={() => resolve(data.sourceUrl, { silent: true })}
          />
        ) : null}
      </main>
    </div>
  );
}