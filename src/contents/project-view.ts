export const PROJECT_VIEW_STORAGE_KEY = "sd-orbit-project-list-view";

import {
  PROJECT_VIEW_CSS,
  TOOLBAR_ID,
  SORT_ID,
} from "~/project-view-styles";

const STYLE_ID = "sd-project-view-style";
const BTN_ID = "sd-proj-view-toggle";


const GRID_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
</svg>`;

const LIST_ICON = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="2" width="14" height="3" rx="1.5" fill="currentColor"/>
  <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill="currentColor"/>
  <rect x="1" y="11" width="14" height="3" rx="1.5" fill="currentColor"/>
</svg>`;

const SORT_ICON = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

function injectStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = PROJECT_VIEW_CSS;
  document.head.appendChild(style);
}

let _listView = false;
let _sort: SortKey = "updated";

type SortKey = "updated" | "devlogs" | "time" | "alpha";

const SORT_LABELS: Record<SortKey, string> = {
  updated: "Last updated",
  devlogs: "Most devlogs",
  time: "Most time",
  alpha: "A → Z",
};

function parseTime(text: string): number {
  let mins = 0;
  const h = text.match(/(\d+)h/);
  const m = text.match(/(\d+)m/);
  if (h) mins += parseInt(h[1]) * 60;
  if (m) mins += parseInt(m[1]);
  return mins;
}

function parseDevlogs(text: string): number {
  const m = text.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function parseUpdated(text: string): number {
  const t = text.toLowerCase();
  if (t.includes("minute")) return 1;
  if (t.includes("hour")) return 2;
  if (t.includes("day")) {
    const m = t.match(/(\d+)/);
    return 100 + (m ? parseInt(m[1]) : 1);
  }
  if (t.includes("week")) {
    const m = t.match(/(\d+)/);
    return 1000 + (m ? parseInt(m[1]) : 1);
  }
  if (t.includes("month")) {
    const m = t.match(/(\d+)/);
    return 10000 + (m ? parseInt(m[1]) : 1);
  }
  return 999999;
}

interface CardData {
  item: HTMLElement;
  title: string;
  devlogs: number;
  time: number;
  updated: number;
  isNew: boolean;
}

function extractCardData(item: HTMLElement): CardData {
  const card = item.querySelector<HTMLElement>(".profile-project-card");
  const isNew = card?.classList.contains("profile-project-card--new") ?? false;

  const title =
    item.querySelector(".profile-project-card__title")?.textContent?.trim() ??
    "";

  const metaItems = item.querySelectorAll(".profile-project-card__meta-item");
  let devlogs = 0;
  let time = 0;
  metaItems.forEach((mi) => {
    const txt = mi.textContent?.trim() ?? "";
    if (txt.includes("devlog")) devlogs = parseDevlogs(txt);
    else if (txt.match(/\d+h/)) time = parseTime(txt);
  });

  const updatedTxt =
    item.querySelector(".profile-project-card__updated")?.textContent?.trim() ??
    "";
  const updated = parseUpdated(updatedTxt);

  return { item, title, devlogs, time, updated, isNew };
}

function applySorting(): void {
  const list = document.querySelector<HTMLElement>(".project-list");
  if (!list) return;

  const rawItems = Array.from(
    list.querySelectorAll<HTMLElement>(":scope > .project-list__item"),
  );
  const cards = rawItems.map(extractCardData);

  const normal = cards.filter((c) => !c.isNew);
  const newCard = cards.filter((c) => c.isNew);

  const comparators: Record<SortKey, (a: CardData, b: CardData) => number> = {
    updated: (a, b) => a.updated - b.updated,
    devlogs: (a, b) => b.devlogs - a.devlogs,
    time: (a, b) => b.time - a.time,
    alpha: (a, b) => a.title.localeCompare(b.title),
  };

  normal.sort(comparators[_sort]);

  [...normal, ...newCard].forEach(({ item }) => list.appendChild(item));
}

function getSection(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    '.profile-tab-content[aria-label="Projects"]',
  );
}

function applyView(): void {
  const list = document.querySelector<HTMLElement>(".project-list");
  if (!list) return;

  list.classList.toggle("sd-list-view", _listView);

  const btn = document.getElementById(BTN_ID);
  if (btn) {
    btn.classList.toggle("active", _listView);
    btn.innerHTML = _listView
      ? `${GRID_ICON}<span>Grid</span>`
      : `${LIST_ICON}<span>List</span>`;
    btn.setAttribute(
      "aria-label",
      _listView ? "Switch to grid view" : "Switch to list view",
    );
  }
}

function updateSortFace(): void {
  const face = document.querySelector<HTMLElement>(".sd-sort-face-label");
  if (face) face.textContent = SORT_LABELS[_sort];
}

function injectToolbar(): void {
  if (document.getElementById(TOOLBAR_ID)) return;

  const section = getSection();
  if (!section) return;

  const list = section.querySelector<HTMLElement>(".project-list");
  if (!list) return;

  const toolbar = document.createElement("div");
  toolbar.id = TOOLBAR_ID;

  const sortWrap = document.createElement("div");
  sortWrap.className = "sd-sort-wrap";

  const sortFace = document.createElement("span");
  sortFace.className = "sd-sort-face";
  sortFace.innerHTML = `
    ${SORT_ICON}
    <span class="sd-sort-face-label">${SORT_LABELS[_sort]}</span>
    <svg class="sd-sort-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const select = document.createElement("select");
  select.id = SORT_ID;
  select.setAttribute("aria-label", "Sort projects");

  (Object.entries(SORT_LABELS) as [SortKey, string][]).forEach(
    ([val, label]) => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = label;
      if (val === _sort) opt.selected = true;
      select.appendChild(opt);
    },
  );

  select.addEventListener("change", () => {
    _sort = select.value as SortKey;
    updateSortFace();
    applySorting();
  });

  sortWrap.appendChild(sortFace);
  sortWrap.appendChild(select);

  const viewBtn = document.createElement("button");
  viewBtn.id = BTN_ID;
  viewBtn.type = "button";
  viewBtn.className = "sd-pill";
  viewBtn.innerHTML = _listView
    ? `${GRID_ICON}<span>Grid</span>`
    : `${LIST_ICON}<span>List</span>`;
  viewBtn.setAttribute(
    "aria-label",
    _listView ? "Switch to grid view" : "Switch to list view",
  );
  if (_listView) viewBtn.classList.add("active");

  viewBtn.addEventListener("click", () => {
    _listView = !_listView;
    chrome.storage.local.set({ [PROJECT_VIEW_STORAGE_KEY]: _listView });
    applyView();
  });

  const left = document.createElement("div");
  left.className = "sd-toolbar-left";
  left.appendChild(sortWrap);

  toolbar.appendChild(left);
  toolbar.appendChild(viewBtn);

  list.parentElement!.insertBefore(toolbar, list);
}

export function enhanceProjectView(): void {
  const onProjectsPage = Boolean(getSection());
  if (!onProjectsPage) return;

  injectStyle();
  injectToolbar();
  applyView();
  applySorting();
}

export function initProjectView(): void {
  chrome.storage.local.get(PROJECT_VIEW_STORAGE_KEY, (result) => {
    _listView = result[PROJECT_VIEW_STORAGE_KEY] ?? false;
    enhanceProjectView();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && PROJECT_VIEW_STORAGE_KEY in changes) {
      _listView = changes[PROJECT_VIEW_STORAGE_KEY].newValue ?? false;
      applyView();
    }
  });
}
