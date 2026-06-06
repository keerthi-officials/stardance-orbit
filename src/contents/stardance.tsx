import { useEffect, useRef, useState } from "react";

export const config = {
  matches: ["https://stardance.hackclub.com/*"],
};

const NAV_SHORTCUTS = [
  { keys: ["Alt", "K"], label: "Quick Search" },
  { keys: ["Alt", "H"], label: "Go to Home" },
  { keys: ["Alt", "P"], label: "Go to Projects" },
  { keys: ["Alt", "D"], label: "Go to Shop" },
  { keys: ["Alt", "E"], label: "Go to Resources" },
  { keys: ["Alt", "V"], label: "Go to Vote" },
  { keys: ["Alt", "M"], label: "Go to Missions" },
];

const PROJECT_SHORTCUTS = Array.from({ length: 9 }, (_, i) => ({
  keys: ["Alt", String(i + 1)],
  label: `Open project ${i + 1} (A–Z order)`,
}));

function Key({ k }: { k: string }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 26,
        height: 22,
        padding: "0 6px",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderBottom: "2px solid rgba(255,255,255,0.18)",
        borderRadius: 5,
        fontSize: 11,
        fontFamily: "ui-monospace, monospace",
        fontWeight: 600,
        color: "rgba(255,255,255,0.9)",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {k}
    </kbd>
  );
}

function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {keys.map((k, i) => (
        <Key key={i} k={k} />
      ))}
    </span>
  );
}

function Section({
  title,
  shortcuts,
}: {
  title: string;
  shortcuts: { keys: string[]; label: string }[];
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {shortcuts.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "5px 8px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                flex: 1,
              }}
            >
              {s.label}
            </span>
            <KeyCombo keys={s.keys} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ShortcutsOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
      }}
    >
      <div
        ref={ref}
        style={{
          background: "#1c1c22",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 14,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          width: "min(560px, 92vw)",
          maxHeight: "85vh",
          overflowY: "auto",
          padding: "24px 24px 20px",
          color: "#f0eeeb",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
              padding: "2px 6px",
              borderRadius: 4,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Section title="Navigation" shortcuts={NAV_SHORTCUTS} />
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.07)",
              margin: "0 -4px",
            }}
          />
          <Section title="Projects (A–Z order)" shortcuts={PROJECT_SHORTCUTS} />
        </div>
      </div>
    </div>
  );
}

function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (window as any).__sdShowToast = (text: string) => {
      setMsg(text);
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 1600);
    };
    return () => {
      delete (window as any).__sdShowToast;
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        background: "var(--color-background, #1a1a2e)",
        border: "1px solid var(--color-border, rgba(255,255,255,0.14))",
        color: "var(--color-text, #fff)",
        fontSize: 13,
        padding: "8px 18px",
        borderRadius: 999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        zIndex: 100000,
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
        transition: "opacity 0.18s, transform 0.18s",
        whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {msg}
    </div>
  );
}

function TriggerBadge({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Keyboard shortcuts (?)"
      style={{
        position: "fixed",
        bottom: 24,
        right: 20,
        zIndex: 99998,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
        color: "rgba(255,255,255,0.6)",
        width: 32,
        height: 32,
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, monospace",
        transition: "background 0.15s, color 0.15s",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.14)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "rgba(255,255,255,0.9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLButtonElement).style.color =
          "rgba(255,255,255,0.6)";
      }}
    >
      ?
    </button>
  );
}

export default function StardanceContent() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TriggerBadge onClick={() => setOpen((o) => !o)} />
      {open && <ShortcutsOverlay onClose={() => setOpen(false)} />}
      <Toast />
    </>
  );
}
