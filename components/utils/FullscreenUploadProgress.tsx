import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/utils/images/logo-sem-texto.png";
import { cn } from "@/lib/utils";

type FullscreenUploadProgressProps = {
  /** 0–100 while active, or `null` when idle (the overlay renders nothing). */
  value: number | null;
  /** Functional status lines that cross-fade in sequence while active. */
  messages: string[];
  /** Small caption shown beside the logo, e.g. "Iniciando o uso do veículo". */
  title?: string;
  /** How long each message stays before crossfading to the next. */
  messageIntervalMs?: number;
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Full-view circular progress tracker. Takes over the screen while an upload /
 * submission is in flight: an Ampère-blue ring fills toward 100%, then flips to
 * an indeterminate "finalizing" sweep once the upload completes but the request
 * is still resolving. The caption cycles through the provided process messages.
 *
 * Brand: blue is the progress signal (never amber — amber is reserved for
 * attention). Motion is subtle and honors `prefers-reduced-motion` via the
 * `motion-safe` / `motion-reduce` Tailwind variants (no JS animation library).
 */
export default function FullscreenUploadProgress({
  value,
  messages,
  title,
  messageIntervalMs = 2400,
}: FullscreenUploadProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (value === null || messages.length <= 1) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, messageIntervalMs);
    return () => clearInterval(interval);
  }, [value, messages.length, messageIntervalMs]);

  if (value === null) return null;

  const clamped = Math.min(100, Math.max(0, value));
  const rounded = Math.round(clamped);
  const isFinalizing = clamped >= 100;
  const dashoffset = CIRCUMFERENCE * (1 - clamped / 100);
  const currentMessage = messages[messageIndex] ?? messages[0] ?? "";

  return (
    <div
      role="progressbar"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={title ?? "Progresso do envio"}
      aria-busy="true"
      className="bg-background/95 animate-in fade-in fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6 backdrop-blur-sm duration-200"
      style={{
        paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-2">
        <Image src={Logo} alt="Ampère Energias" width={28} height={28} />
        {title ? (
          <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {title}
          </span>
        ) : null}
      </div>

      <div className="relative grid h-40 w-40 place-items-center">
        <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle className="stroke-secondary" cx="60" cy="60" r={RADIUS} strokeWidth="8" />
          {!isFinalizing ? (
            <circle
              className="stroke-primary"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashoffset}
              style={{ transition: "stroke-dashoffset 400ms cubic-bezier(0.25, 1, 0.5, 1)" }}
            />
          ) : null}
        </svg>

        {isFinalizing ? (
          <svg
            className="absolute inset-0 h-40 w-40 -rotate-90 motion-safe:animate-spin"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="stroke-primary"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * 0.7}
            />
          </svg>
        ) : null}

        <span className="text-foreground absolute text-3xl font-bold tracking-tight tabular-nums">
          {rounded}
          <span className="text-muted-foreground text-lg font-semibold">%</span>
        </span>
      </div>

      <div className="flex h-6 items-center justify-center">
        <p
          key={messageIndex}
          className="text-muted-foreground animate-in fade-in motion-safe:slide-in-from-bottom-2 text-center text-sm font-medium tracking-tight duration-300"
        >
          {currentMessage}
        </p>
      </div>
    </div>
  );
}
