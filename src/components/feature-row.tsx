import { Switch } from "./ui/switch";

export function FeatureRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-4 px-4 py-3 cursor-pointer hover:bg-white/[0.04] transition-colors"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-semibold text-white/80 leading-tight">
          {label}
        </span>
        <span className="text-[11px] text-white/35 leading-tight">
          {description}
        </span>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0"
      />
    </label>
  );
}