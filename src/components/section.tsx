interface Shortcut {
  keys: string[];
  label: string;
}

export function Key({ k }: { k: string }) {
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

export function KeyCombo({ keys }: { keys: string[] }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {keys.map((k, i) => (
        <Key key={i} k={k} />
      ))}
    </span>
  );
}

export function ShortcutRow({
  keys,
  label,
}: {
  keys: string[];
  label: string;
}) {
  return (
    <div
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
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", flex: 1 }}>
        {label}
      </span>
      <KeyCombo keys={keys} />
    </div>
  );
}
 

function ProjectShortcutRow() {
  return (
    <div
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
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", flex: 1 }}>
        Jump to project 1 – 9{" "}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          (sorted A–Z)
        </span>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <KeyCombo keys={["Alt", "1"]} />
        <span
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.3)",
            margin: "0 2px",
          }}
        >
          ···
        </span>
        <KeyCombo keys={["Alt", "9"]} />
      </span>
    </div>
  );
}

export function Section({
  title,
  shortcuts,
  projectShortcuts = false,
}: {
  title: string;
  shortcuts: Shortcut[];
  projectShortcuts?: boolean;
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
          <ShortcutRow key={i} keys={s.keys} label={s.label} />
        ))}
        {projectShortcuts && <ProjectShortcutRow />}
      </div>
    </div>
  );
}
