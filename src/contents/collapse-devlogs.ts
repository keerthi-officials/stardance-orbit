const COLLAPSE_STORAGE_KEY = "sd-orbit-collapse-devlogs";
const COLLAPSE_CLASS = "sd-collapsed";
const COLLAPSE_LINES = 3;
const LINE_HEIGHT_PX = 24;
const MAX_HEIGHT = LINE_HEIGHT_PX * COLLAPSE_LINES;

const STYLE_ID = "sd-collapse-devlogs-style";

function injectStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .feed-post-card__body.${COLLAPSE_CLASS} {
      max-height: ${MAX_HEIGHT}px;
      overflow: hidden;
      position: relative;
      mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
    }

    .sd-show-more-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      padding: 2px 10px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.03em;
      color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      cursor: pointer;
      transition: color 0.15s, background 0.15s, border-color 0.15s;
      line-height: 1.8;
    }

    .sd-show-more-btn:hover {
      color: rgba(255,255,255,0.85);
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.2);
    }

    .sd-show-more-btn svg {
      transition: transform 0.2s;
    }

    .sd-show-more-btn.expanded svg {
      transform: rotate(180deg);
    }

    .sd-collapse-wrap {
      display: flex;
      flex-direction: column;
    }
  `;
  document.head.appendChild(style);
}

function removeStyle(): void {
  document.getElementById(STYLE_ID)?.remove();
}

function makeChevron(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 4L6 8L10 4");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

function collapseBody(body: HTMLElement): void {
  if (body.scrollHeight <= MAX_HEIGHT + 10) return;

  if (body.parentElement?.classList.contains("sd-collapse-wrap")) return;

  const wrap = document.createElement("div");
  wrap.className = "sd-collapse-wrap";
  body.parentNode!.insertBefore(wrap, body);
  wrap.appendChild(body);

  body.classList.add(COLLAPSE_CLASS);

  const btn = document.createElement("button");
  btn.className = "sd-show-more-btn";
  btn.type = "button";
  btn.appendChild(document.createTextNode("show more"));
  btn.appendChild(makeChevron());

  let expanded = false;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    expanded = !expanded;

    if (expanded) {
      body.classList.remove(COLLAPSE_CLASS);
      btn.classList.add("expanded");
      btn.childNodes[0].textContent = "show less";
    } else {
      body.classList.add(COLLAPSE_CLASS);
      btn.classList.remove("expanded");
      btn.childNodes[0].textContent = "show more";
    }
  });

  wrap.appendChild(btn);
}

function uncollapseBody(body: HTMLElement): void {
  body.classList.remove(COLLAPSE_CLASS);

  const wrap = body.parentElement;
  if (!wrap?.classList.contains("sd-collapse-wrap")) return;

  wrap.parentNode!.insertBefore(body, wrap);
  wrap.remove();
}

function applyCollapse(): void {
  const bodies = document.querySelectorAll<HTMLElement>(
    ".feed-post-card__body.markdown-content",
  );
  bodies.forEach((body) => collapseBody(body));
}

function removeCollapse(): void {
  const wraps = document.querySelectorAll<HTMLElement>(".sd-collapse-wrap");
  wraps.forEach((wrap) => {
    const body = wrap.querySelector<HTMLElement>(".feed-post-card__body");
    if (body) {
      body.classList.remove(COLLAPSE_CLASS);
      wrap.parentNode!.insertBefore(body, wrap);
    }
    wrap.remove();
  });
}

let _enabled = false;

export function setCollapseDevlogs(enabled: boolean): void {
  _enabled = enabled;
  if (enabled) {
    injectStyle();
    applyCollapse();
  } else {
    removeCollapse();
    removeStyle();
  }
}

export function enhanceCollapseDevlogs(): void {
  if (!_enabled) return;
  applyCollapse();
}

export function initCollapseDevlogs(): void {
  chrome.storage.local.get(COLLAPSE_STORAGE_KEY, (result) => {
    const enabled = result[COLLAPSE_STORAGE_KEY] ?? false;
    setCollapseDevlogs(enabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && COLLAPSE_STORAGE_KEY in changes) {
      setCollapseDevlogs(changes[COLLAPSE_STORAGE_KEY].newValue ?? false);
    }
  });
}

export { COLLAPSE_STORAGE_KEY };
