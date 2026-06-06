import {
  navigateTo,
  getOwnUsername,
  getOwnAvatarSrc,
  fetchOwnProjects,
  PAGE_SHORTCUTS,
  type OwnProject,
} from "~/contents/qs-utils";

const SD_QS_ID = "sd-qs-overlay";
const SD_QS_STYLE_ID = "sd-qs-style";

const CSS = `
#sd-qs-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  align-items: flex-start;
  justify-content: center;
  padding-top: 12vh;
}
#sd-qs-overlay.sd-qs--open { display: flex; }
#sd-qs-box {
  width: 100%;
  max-width: 620px;
  margin: 0 16px;
  background: var(--color-background, #1a1a2e);
  border: 1px solid var(--color-border, rgba(255,255,255,0.12));
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 72vh;
}
#sd-qs-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border, rgba(255,255,255,0.1));
}
#sd-qs-icon { flex-shrink: 0; opacity: 0.5; color: var(--color-text, #fff); }
#sd-qs-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px;
  color: var(--color-text, #fff);
  caret-color: var(--color-accent, #7c6af7);
}
#sd-qs-input::placeholder { color: var(--color-text, #fff); opacity: 0.35; }
#sd-qs-kbd {
  font-size: 11px;
  color: var(--color-text, #fff);
  opacity: 0.35;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 5px;
  padding: 2px 6px;
  flex-shrink: 0;
  font-family: monospace;
}
#sd-qs-results { overflow-y: auto; flex: 1; }
.sd-qs-state {
  padding: 32px 20px;
  text-align: center;
  color: var(--color-text, #fff);
  opacity: 0.45;
  font-size: 14px;
}
.sd-qs-section {
  padding: 10px 16px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.38;
  color: var(--color-text, #fff);
}
.sd-qs-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 16px;
  text-decoration: none;
  color: var(--color-text, #fff);
  transition: background 0.1s;
  cursor: pointer;
  border: none;
  width: 100%;
  background: transparent;
  text-align: left;
  box-sizing: border-box;
  font-family: inherit;
}
.sd-qs-row:hover, .sd-qs-row.sd-qs--focused {
  background: rgba(255,255,255,0.07);
  outline: none;
}
.sd-qs-row__icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
  background: rgba(255,255,255,0.06);
}
.sd-qs-row__icon--avatar { border-radius: 50%; overflow: hidden; padding: 0; }
.sd-qs-row__icon--avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sd-qs-row__text { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.sd-qs-row__title {
  font-size: 14px; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sd-qs-row__sub {
  font-size: 12px; opacity: 0.45; margin-top: 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.sd-qs-row__right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto; }
.sd-qs-row__badge {
  font-size: 10px; padding: 2px 7px; border-radius: 20px;
  background: var(--color-accent, #7c6af7); color: #fff;
  opacity: 0.85; font-weight: 600; letter-spacing: 0.03em;
}
.sd-qs-row__shortcut {
  font-size: 10px; font-family: monospace;
  padding: 2px 6px; border-radius: 5px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--color-text, #fff); opacity: 0.5;
}
#sd-qs-footer {
  display: flex; gap: 14px; padding: 8px 16px;
  border-top: 1px solid var(--color-border, rgba(255,255,255,0.08));
  font-size: 11px; color: var(--color-text, #fff); opacity: 0.35; flex-wrap: wrap;
}
#sd-qs-footer kbd {
  font-family: monospace;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 4px; padding: 1px 5px; font-size: 11px;
}
#sd-qs-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 8px; padding: 12px 14px;
}
.sd-qs-nav-tile {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  border-radius: 9px; text-decoration: none; color: var(--color-text, #fff);
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  transition: background 0.1s, border-color 0.1s;
  cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 500;
  text-align: left; position: relative;
}
.sd-qs-nav-tile:hover, .sd-qs-nav-tile.sd-qs--focused {
  background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.15); outline: none;
}
.sd-qs-nav-tile__icon { font-size: 18px; line-height: 1; flex-shrink: 0; }
.sd-qs-nav-tile__label { flex: 1; min-width: 0; }
.sd-qs-nav-tile__sub { display: block; font-size: 11px; opacity: 0.4; font-weight: 400; margin-top: 1px; }
.sd-qs-nav-tile__alt {
  position: absolute; top: 5px; right: 7px;
  font-size: 9px; font-family: monospace; opacity: 0.35;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px; padding: 1px 4px; line-height: 1.4;
}
`;

let overlay: HTMLElement | null = null;
let input: HTMLInputElement | null = null;
let resultsEl: HTMLElement | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;
let focusedIdx = -1;

function buildOverlay(): void {
  if (document.getElementById(SD_QS_ID)) return;

  if (!document.getElementById(SD_QS_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = SD_QS_STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  overlay = document.createElement("div");
  overlay.id = SD_QS_ID;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Quick navigation");

  const box = document.createElement("div");
  box.id = "sd-qs-box";

  const inputRow = document.createElement("div");
  inputRow.id = "sd-qs-input-row";

  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.id = "sd-qs-icon";
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("viewBox", "0 0 40 40");
  icon.setAttribute("fill", "none");
  icon.innerHTML = `<path d="M39.05 34.21L29.86 25.02C31.42 22.53 32.33 19.59 32.33 16.43C32.33 7.51 25.09 0.27 16.16 0.27C7.24 0.27 0 7.51 0 16.43C0 25.36 7.24 32.59 16.16 32.59C19.6 32.59 22.78 31.52 25.39 29.7L34.48 38.78C35.11 39.42 35.94 39.73 36.77 39.73C37.59 39.73 38.42 39.42 39.05 38.78C40.32 37.52 40.32 35.48 39.05 34.21ZM16.16 27.36C10.13 27.36 5.24 22.47 5.24 16.43C5.24 10.4 10.13 5.51 16.16 5.51C22.2 5.51 27.09 10.4 27.09 16.43C27.09 22.47 22.2 27.36 16.16 27.36Z" fill="currentColor"/>`;
  icon.style.color = "var(--color-text, #fff)";

  input = document.createElement("input");
  input.id = "sd-qs-input";
  input.type = "search";
  input.placeholder = "Go to page or search…";
  input.autocomplete = "off";
  input.spellcheck = false;

  const kbd = document.createElement("span");
  kbd.id = "sd-qs-kbd";
  kbd.textContent = "Esc";

  inputRow.appendChild(icon);
  inputRow.appendChild(input);
  inputRow.appendChild(kbd);

  resultsEl = document.createElement("div");
  resultsEl.id = "sd-qs-results";

  const footer = document.createElement("div");
  footer.id = "sd-qs-footer";
  footer.innerHTML = `
    <span><kbd>↑↓</kbd> navigate</span>
    <span><kbd>↵</kbd> open</span>
    <span><kbd>Esc</kbd> close</span>
    <span><kbd>Alt</kbd>+<kbd>1–9</kbd> project</span>
    <span><kbd>Alt</kbd>+<kbd>H/R/M/S/E/P</kbd> pages</span>
  `;

  box.appendChild(inputRow);
  box.appendChild(resultsEl);
  box.appendChild(footer);
  overlay.appendChild(box);
  document.body.appendChild(overlay);

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === overlay) closeOverlay();
  });

  input.addEventListener("input", onInput);
  input.addEventListener("keydown", onInputKeydown);
}

async function renderEmptyState(): Promise<void> {
  const username = getOwnUsername();
  const avatarSrc = getOwnAvatarSrc();
  const wrap = document.createElement("div");

  const pagesLbl = document.createElement("div");
  pagesLbl.className = "sd-qs-section";
  pagesLbl.textContent = "Pages";
  wrap.appendChild(pagesLbl);

  const grid = document.createElement("div");
  grid.id = "sd-qs-nav-grid";

  if (username) {
    grid.appendChild(
      makeTile({
        label: "My Projects",
        subtitle: `@${username}`,
        icon: null,
        avatarSrc: avatarSrc ?? undefined,
        href: `/@${username}/projects`,
        altHint: "Alt+P",
      }),
    );
  }

  PAGE_SHORTCUTS.forEach((p) => {
    grid.appendChild(
      makeTile({
        label: p.label,
        subtitle: p.subtitle,
        icon: p.icon,
        href: p.href,
        altHint: `Alt+${p.altKey.toUpperCase()}`,
      }),
    );
  });

  if (username) {
    grid.appendChild(
      makeTile({
        label: "My Profile",
        subtitle: `@${username}`,
        icon: "👤",
        href: `/@${username}`,
      }),
    );
  }

  wrap.appendChild(grid);

  const projLbl = document.createElement("div");
  projLbl.className = "sd-qs-section";
  projLbl.textContent = "My Projects";
  wrap.appendChild(projLbl);

  const projContainer = document.createElement("div");
  projContainer.innerHTML = `<div class="sd-qs-state" style="padding:12px 20px;font-size:13px;">Loading…</div>`;
  wrap.appendChild(projContainer);

  resultsEl!.innerHTML = "";
  resultsEl!.appendChild(wrap);

  const projects = await fetchOwnProjects();
  projContainer.innerHTML = "";

  if (projects.length === 0) {
    projContainer.innerHTML = `<div class="sd-qs-state" style="padding:12px 20px;font-size:13px;">No projects found</div>`;
  } else {
    projects.forEach((proj, i) =>
      projContainer.appendChild(makeProjectRow(proj, i + 1)),
    );
  }
}

interface TileOpts {
  label: string;
  subtitle?: string;
  icon?: string | null;
  avatarSrc?: string;
  href: string;
  altHint?: string;
}

function makeTile(opts: TileOpts): HTMLElement {
  const a = document.createElement("a");
  a.className = "sd-qs-nav-tile sd-qs-row";
  a.href = opts.href;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(opts.href);
  });

  const iconWrap = document.createElement("div");
  iconWrap.className = "sd-qs-nav-tile__icon";

  if (opts.avatarSrc) {
    const img = document.createElement("img");
    img.src = opts.avatarSrc;
    img.alt = "";
    img.style.cssText =
      "width:32px;height:32px;border-radius:50%;object-fit:cover;display:block;";
    iconWrap.style.cssText =
      "width:32px;height:32px;font-size:0;border-radius:50%;overflow:hidden;background:transparent;";
    iconWrap.appendChild(img);
  } else {
    iconWrap.textContent = opts.icon ?? "📄";
  }

  const textWrap = document.createElement("div");
  textWrap.className = "sd-qs-nav-tile__label";
  textWrap.textContent = opts.label;
  if (opts.subtitle) {
    const sub = document.createElement("span");
    sub.className = "sd-qs-nav-tile__sub";
    sub.textContent = opts.subtitle;
    textWrap.appendChild(sub);
  }

  a.appendChild(iconWrap);
  a.appendChild(textWrap);

  if (opts.altHint) {
    const hint = document.createElement("span");
    hint.className = "sd-qs-nav-tile__alt";
    hint.textContent = opts.altHint;
    a.appendChild(hint);
  }

  return a;
}

function makeProjectRow(proj: OwnProject, idx: number): HTMLElement {
  const row = document.createElement("a");
  row.className = "sd-qs-row";
  row.href = proj.href;
  row.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(proj.href);
  });

  const iconWrap = document.createElement("div");
  iconWrap.className = "sd-qs-row__icon";
  iconWrap.textContent = "🗂️";

  const textWrap = document.createElement("div");
  textWrap.className = "sd-qs-row__text";

  const title = document.createElement("div");
  title.className = "sd-qs-row__title";
  title.textContent = proj.title;

  const sub = document.createElement("div");
  sub.className = "sd-qs-row__sub";
  sub.textContent = [
    proj.hours > 0 ? `${proj.hours}h` : null,
    proj.devlogs > 0 ? `${proj.devlogs} devlogs` : null,
    proj.description || null,
  ]
    .filter(Boolean)
    .join(" · ");

  textWrap.appendChild(title);
  if (sub.textContent) textWrap.appendChild(sub);

  const rightWrap = document.createElement("div");
  rightWrap.className = "sd-qs-row__right";
  if (idx <= 9) {
    const shortcut = document.createElement("span");
    shortcut.className = "sd-qs-row__shortcut";
    shortcut.textContent = `Alt+${idx}`;
    rightWrap.appendChild(shortcut);
  }

  row.appendChild(iconWrap);
  row.appendChild(textWrap);
  row.appendChild(rightWrap);
  return row;
}

function openOverlay(): void {
  buildOverlay();
  overlay!.classList.add("sd-qs--open");
  input!.value = "";
  focusedIdx = -1;
  renderEmptyState();
  requestAnimationFrame(() => input!.focus());
}

function closeOverlay(): void {
  overlay?.classList.remove("sd-qs--open");
  abortController?.abort();
  if (debounceTimer) clearTimeout(debounceTimer);
}

function isOpen(): boolean {
  return overlay?.classList.contains("sd-qs--open") ?? false;
}

function onInput(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  const q = input!.value.trim();
  if (!q) {
    abortController?.abort();
    focusedIdx = -1;
    renderEmptyState();
    return;
  }
  debounceTimer = setTimeout(doSearch, 250);
}

async function doSearch(): Promise<void> {
  const q = input!.value.trim();
  if (!q) return;

  abortController?.abort();
  abortController = new AbortController();
  resultsEl!.innerHTML = `<div class="sd-qs-state">Searching…</div>`;

  try {
    const res = await fetch(`/search/global?q=${encodeURIComponent(q)}`, {
      signal: abortController.signal,
      headers: {
        Accept: "text/html",
        "X-Requested-With": "XMLHttpRequest",
        "Turbo-Frame": "command-palette-results",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    renderSearchResults(await res.text(), q);
  } catch (err: any) {
    if (err.name === "AbortError") return;
    resultsEl!.innerHTML = `<div class="sd-qs-state">Something went wrong. Try again.</div>`;
  }
}

interface CommandPaletteItem {
  title: string;
  meta: string;
  path: string;
}

function parseCommandPaletteItems(
  html: string,
): { section: string; items: CommandPaletteItem[] }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const frame =
    doc.querySelector("turbo-frame#command-palette-results") ?? doc.body;

  const results: { section: string; items: CommandPaletteItem[] }[] = [];
  let currentSection = "Results";
  let currentItems: CommandPaletteItem[] = [];

  frame.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element;

    if (el.matches("p.command-palette__section-label")) {
      if (currentItems.length > 0) {
        results.push({ section: currentSection, items: currentItems });
        currentItems = [];
      }
      currentSection = el.textContent?.trim() ?? "Results";
      return;
    }

    if (el.matches("ul.command-palette__list")) {
      el.querySelectorAll<HTMLElement>("li.command-palette__item").forEach(
        (li) => {
          const path = li.dataset.path ?? "";
          const title =
            li
              .querySelector(".command-palette__item-title")
              ?.textContent?.trim() ?? path;
          const meta =
            li
              .querySelector(".command-palette__item-meta")
              ?.textContent?.trim() ?? "";
          if (path) currentItems.push({ title, meta, path });
        },
      );
    }
  });

  if (currentItems.length > 0) {
    results.push({ section: currentSection, items: currentItems });
  }

  return results;
}


function renderSearchResults(html: string, q: string): void {
  const sections = parseCommandPaletteItems(html);
  const allItems = sections.flatMap((s) => s.items);

  if (allItems.length === 0) {
    resultsEl!.innerHTML = `<div class="sd-qs-state">No results for "<strong>${escHtml(q)}</strong>"</div>`;
    return;
  }

  const container = document.createElement("div");
  const username = getOwnUsername();

  sections.forEach(({ section, items }) => {
    const lbl = document.createElement("div");
    lbl.className = "sd-qs-section";
    lbl.textContent = section;
    container.appendChild(lbl);

    items.forEach((item) => {
      container.appendChild(makeCommandRow(item, username));
    });
  });

  resultsEl!.innerHTML = "";
  resultsEl!.appendChild(container);
  focusedIdx = -1;
  updateFocusedItem(0);
}

function itemIcon(item: CommandPaletteItem): string {
  const meta = item.meta.toLowerCase();
  const path = item.path;
  if (meta === "command") {
    if (path.includes("/shop")) return "🛒";
    if (path.includes("/home")) return "🏠";
    if (path.includes("/balance")) return "💰";
    if (path.includes("/mission")) return "🎯";
    return "⚡";
  }
  if (meta === "project") return "🗂️";
  if (meta === "stardancer") return "👤";
  return "🔗";
}

function makeCommandRow(
  item: CommandPaletteItem,
  username: string | null,
): HTMLElement {
  const row = document.createElement("a");
  row.className = "sd-qs-row";
  row.href = item.path;
  row.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo(item.path);
  });

  const iconWrap = document.createElement("div");
  iconWrap.className = "sd-qs-row__icon";
  iconWrap.textContent = itemIcon(item);

  const textWrap = document.createElement("div");
  textWrap.className = "sd-qs-row__text";

  const title = document.createElement("div");
  title.className = "sd-qs-row__title";
  title.textContent = item.title;

  const sub = document.createElement("div");
  sub.className = "sd-qs-row__sub";
  sub.textContent = item.meta;

  textWrap.appendChild(title);
  textWrap.appendChild(sub);

  const rightWrap = document.createElement("div");
  rightWrap.className = "sd-qs-row__right";

  const isMine =
    username &&
    (item.path.startsWith(`/@${username}`) || item.path === `/@${username}`);

  if (isMine) {
    const badge = document.createElement("span");
    badge.className = "sd-qs-row__badge";
    badge.textContent = "mine";
    rightWrap.appendChild(badge);
  }

  row.appendChild(iconWrap);
  row.appendChild(textWrap);
  if (rightWrap.hasChildNodes()) row.appendChild(rightWrap);

  return row;
}

function escHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}

function getResultItems(): HTMLElement[] {
  return Array.from(
    resultsEl?.querySelectorAll<HTMLElement>(".sd-qs-row") ?? [],
  );
}

function updateFocusedItem(idx: number): void {
  const items = getResultItems();
  if (items.length === 0) return;
  const clamped = Math.max(0, Math.min(idx, items.length - 1));
  items.forEach((el, i) =>
    el.classList.toggle("sd-qs--focused", i === clamped),
  );
  focusedIdx = clamped;
  items[clamped]?.scrollIntoView({ block: "nearest" });
}

function onInputKeydown(e: KeyboardEvent): void {
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      updateFocusedItem(focusedIdx < 0 ? 0 : focusedIdx + 1);
      break;
    case "ArrowUp":
      e.preventDefault();
      updateFocusedItem(focusedIdx <= 0 ? 0 : focusedIdx - 1);
      break;
    case "Enter": {
      e.preventDefault();
      const items = getResultItems();
      if (focusedIdx >= 0 && items[focusedIdx]) {
        (items[focusedIdx] as HTMLAnchorElement).click();
      }
      break;
    }
    case "Escape":
      closeOverlay();
      break;
  }
}

function onKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "TEXTAREA") return;
    e.preventDefault();
    e.stopPropagation();
    isOpen() ? closeOverlay() : openOverlay();
  }
}

export function initQuickSearch(): void {
  if ((window as any).__sdQsInit) return;
  (window as any).__sdQsInit = true;
  document.addEventListener("keydown", onKeydown, true);
  buildOverlay();
}
