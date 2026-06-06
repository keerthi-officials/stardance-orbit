export function TriggerBadge({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Keyboard shortcuts (?)"
      style={{
        position: "fixed",
        top: 24,
        right: 20,
        zIndex: 99998,
        background: "rgba(0,0,0,0.8)",
        border: "1px solid rgba(255,255,255,0.14)",
        color: "rgba(255,255,255,0.6)",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "ui-monospace, monospace",
        transition: "background 0.15s ease",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        lineHeight: 1,
      }}
    >
      ? Shortcuts
    </button>
  );
}
