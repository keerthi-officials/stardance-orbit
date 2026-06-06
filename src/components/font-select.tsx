import {
  FONT_PRESETS,
} from "~/font-customizer";

export function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12px] text-white/60 shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 text-[11px] rounded-lg px-2 py-1.5
          bg-white/[0.06] border border-white/[0.1] text-white/80
          cursor-pointer appearance-none truncate
          focus:outline-none focus:border-white/25"
      >
        {FONT_PRESETS.map((f) => (
          <option key={f.id} value={f.id} style={{ background: "#1f1f2e" }}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
