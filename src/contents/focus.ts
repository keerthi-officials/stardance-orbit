const DF_BTN_ID = "sd-df-btn";
const DF_ACTIVE_CLASS = "sd-df-active";
const DF_STORAGE_KEY = "sd-distraction-free";

function isProjectPage(): boolean {
  return Boolean(document.querySelector(".project-show__feed"));
}

function isHomePage(): boolean {
  return Boolean(document.querySelector(".feed-home"));
}

function isActive(): boolean {
  return document.body.classList.contains(DF_ACTIVE_CLASS);
}

function saveState(active: boolean): void {
  try {
    localStorage.setItem(DF_STORAGE_KEY, active ? "1" : "0");
  } catch {}
}

function loadState(): boolean {
  try {
    return localStorage.getItem(DF_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function injectStyles(): void {
  if (document.getElementById("sd-df-style")) return;

  const style = document.createElement("style");
  style.id = "sd-df-style";
  style.textContent = `
    body.${DF_ACTIVE_CLASS} #primary-nav,
    body.${DF_ACTIVE_CLASS} .discover-rail,
    body.${DF_ACTIVE_CLASS} .app-layout__sidebar {
      display: none !important;
    }

    body.${DF_ACTIVE_CLASS} .project-show__banner,
    body.${DF_ACTIVE_CLASS} .project-show__read-footer,
    body.${DF_ACTIVE_CLASS} #sd-projection,
    body.${DF_ACTIVE_CLASS} .su-hero-ship,
    body.${DF_ACTIVE_CLASS} .project-show__back {
      display: none !important;
    }

    body.${DF_ACTIVE_CLASS} .feed-shelf {
      display: none !important;
    }

    body.${DF_ACTIVE_CLASS} .app-layout__main,
    body.${DF_ACTIVE_CLASS} .feed-home {
      max-width: 720px !important;
      margin: 0 auto !important;
      padding: 0 1.25rem !important;
      width: 100% !important;
    }

    #${DF_BTN_ID} {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.08);
      color: inherit;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
      white-space: nowrap;
      line-height: 1;
      height: 28px;
      flex-shrink: 0;
    }

    #${DF_BTN_ID}:hover {
      background: rgba(255,255,255,0.16);
      border-color: rgba(255,255,255,0.32);
    }

    body.${DF_ACTIVE_CLASS} #${DF_BTN_ID} {
      background: rgba(255,255,255,0.15);
      border-color: rgba(255,255,255,0.4);
    }

    #sd-df-home-bar {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0 4px;
    }
  `;
  document.head.appendChild(style);
}

function updateBtnLabel(): void {
  const btn = document.getElementById(DF_BTN_ID);
  if (!btn) return;
  const active = isActive();
  btn.textContent = active ? "✕ Exit focus" : "⊙ Focus mode";
  btn.setAttribute("aria-pressed", String(active));
  btn.title = active
    ? "Exit distraction-free mode"
    : "Enter distraction-free mode";
}

function toggleMode(): void {
  const next = !isActive();
  if (next) {
    document.body.classList.add(DF_ACTIVE_CLASS);
  } else {
    document.body.classList.remove(DF_ACTIVE_CLASS);
  }
  saveState(next);
  updateBtnLabel();
}

function createBtn(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.id = DF_BTN_ID;
  btn.type = "button";
  btn.setAttribute("aria-pressed", "false");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMode();
  });
  return btn;
}

function injectProjectBtn(): void {
  const header = document.querySelector(".sd-header");
  if (!header || document.getElementById(DF_BTN_ID)) return;
  header.appendChild(createBtn());
  updateBtnLabel();
}

function injectHomeBtn(): void {
  if (document.getElementById(DF_BTN_ID)) return;

  const composer = document.querySelector<HTMLElement>(
    ".feed-home > .feed-composer",
  );
  if (!composer) return;

  const bar = document.createElement("div");
  bar.id = "sd-df-home-bar";
  bar.appendChild(createBtn());
  composer.before(bar);
  updateBtnLabel();
}

export function enhanceDistractionFree(): void {
  const onProject = isProjectPage();
  const onHome = isHomePage();

  if (!onProject && !onHome) return;

  injectStyles();

  if (onProject) injectProjectBtn();
  if (onHome) injectHomeBtn();

  if (loadState() && !isActive()) {
    document.body.classList.add(DF_ACTIVE_CLASS);
    updateBtnLabel();
  }
}
