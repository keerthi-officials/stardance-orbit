import { useState } from "react";
import { TriggerBadge } from "~components/trigger-badge";
import { ShortcutsOverlay } from "~components/shortcuts-overlay";
import { Toast } from "~components/toast";

export const config = {
  matches: ["https://stardance.hackclub.com/*"],
};

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
