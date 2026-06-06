import {
  navigateTo,
  getOwnUsername,
  fetchOwnProjects,
  prefetchProjects,
  PAGE_SHORTCUTS,
} from "~/contents/qs-utils";

function showToast(msg: string): void {
  (window as any).__sdShowToast?.(msg);
}

async function handleAltShortcut(e: KeyboardEvent): Promise<void> {
  if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

  const target = e.target as HTMLElement;
  const tag = target.tagName;
  if (
    (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) &&
    target.id !== "sd-qs-input"
  )
    return;

  const key = e.key.toLowerCase();

  if (key >= "1" && key <= "9") {
    e.preventDefault();
    e.stopPropagation();
    const idx = parseInt(key, 10) - 1;
    const projects = await fetchOwnProjects();
    if (projects[idx]) {
      showToast(`→ ${projects[idx].title}`);
      navigateTo(projects[idx].href);
    } else {
      showToast(`No project #${idx + 1}`);
    }
    return;
  }

  if (key === "p") {
    const username = getOwnUsername();
    if (username) {
      e.preventDefault();
      e.stopPropagation();
      showToast("→ My Projects");
      navigateTo(`/@${username}/projects`);
    }
    return;
  }

  const page = PAGE_SHORTCUTS.find((p) => p.altKey === key);
  if (page) {
    e.preventDefault();
    e.stopPropagation();
    showToast(`→ ${page.label}`);
    navigateTo(page.href);
  }
}

export function initShortcuts(): void {
  if ((window as any).__sdShortcutsInit) return;
  (window as any).__sdShortcutsInit = true;

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        handleAltShortcut(e);
      }
    },
    true,
  );

  prefetchProjects();
}
