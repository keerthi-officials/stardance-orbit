import { useRef } from "react";
import { Section } from "./section";

const NAV_SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Quick Search" },
  { keys: ["Alt", "H"], label: "Go to Home" },
  { keys: ["Alt", "P"], label: "Go to Projects" },
  { keys: ["Alt", "D"], label: "Go to Shop" },
  { keys: ["Alt", "E"], label: "Go to Resources" },
  { keys: ["Alt", "V"], label: "Go to Vote" },
  { keys: ["Alt", "M"], label: "Go to Missions" },
];

export function ShortcutsOverlay({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
          width: "min(520px, 92vw)",
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
            aria-label="Close"
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
          <Section title="Projects" shortcuts={[]} projectShortcuts />
        </div>
      </div>
    </div>
  );
}
