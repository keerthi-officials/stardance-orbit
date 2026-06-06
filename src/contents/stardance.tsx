import { useEffect, useRef, useState } from "react";

export const config = {
  matches: ["https://stardance.hackclub.com/*"],
};

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

function ActiveBadge() {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 999998,
        background: "#1c1c1f",
        color: "#f0eeeb",
        padding: "10px 16px",
        borderRadius: 999,
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      ✨ Shortcuts
    </div>
  );
}

function StardanceContent() {
  return (
    <>
      <ActiveBadge />
      <Toast />
    </>
  );
}

export default StardanceContent;
