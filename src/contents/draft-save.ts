const DRAFT_PREFIX = "sd-draft-";
const DRAFT_STYLE_ID = "sd-draft-style";
const DRAFT_STATUS_ID = "sd-draft-status";
const SAVE_DEBOUNCE_MS = 800;

function draftKey(projectId: string): string {
  return `${DRAFT_PREFIX}${projectId}`;
}

function getProjectId(): string | null {
  return window.location.pathname.match(/\/projects\/(\d+)/)?.[1] ?? null;
}

function getComposerProjectId(form: HTMLFormElement): string | null {
  return form.getAttribute("action")?.match(/\/projects\/(\d+)/)?.[1] ?? null;
}

function injectStyles(): void {
  if (document.getElementById(DRAFT_STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = DRAFT_STYLE_ID;
  s.textContent = `
    #${DRAFT_STATUS_ID} {
      font-size: 11.5px;
      opacity: 0;
      white-space: nowrap;
      pointer-events: none;
      line-height: 1;
      transition: opacity 0.25s;
      margin-right: auto; /* pushes word count to the right */
    }
    #${DRAFT_STATUS_ID}.sd-draft--visible {
      opacity: 0.45;
    }
    #${DRAFT_STATUS_ID}.sd-draft--restored {
      opacity: 0.7;
    }

    .sd-draft-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 5px 12px;
      font-size: 12px;
      margin-bottom: 12px;
      background: rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.07);
      color: rgba(255,255,255,0.65);
    }
    .sd-draft-banner__actions {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }
    .sd-draft-banner__btn {
      font-size: 11.5px;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.2);
      background: transparent;
      color: rgba(255,255,255,0.7);
      cursor: pointer;
      font-family: inherit;
      transition: background 0.12s;
    }
    .sd-draft-banner__btn:hover {
      background: rgba(255,255,255,0.1);
    }
    .sd-draft-banner__btn--discard {
      border-color: rgba(255,80,80,0.35);
      color: rgba(255,120,120,0.85);
    }
    .sd-draft-banner__btn--discard:hover {
      background: rgba(255,80,80,0.1);
    }
  `;
  document.head.appendChild(s);
}

let statusTimeout: ReturnType<typeof setTimeout> | null = null;

function showStatus(
  text: string,
  cls: "sd-draft--visible" | "sd-draft--restored",
  duration?: number,
): void {
  const el = document.getElementById(DRAFT_STATUS_ID);
  if (!el) return;
  el.textContent = text;
  el.className = cls;
  if (statusTimeout) clearTimeout(statusTimeout);
  if (duration) {
    statusTimeout = setTimeout(() => {
      el.textContent = "";
      el.className = "";
    }, duration);
  }
}

function showRestoreBanner(
  composer: Element,
  textarea: HTMLTextAreaElement,
  projectId: string,
  savedText: string,
): void {
  if (composer.querySelector(".sd-draft-banner")) return;

  const banner = document.createElement("div");
  banner.className = "sd-draft-banner";
  banner.innerHTML = `
  <span>Draft restored · attachments not saved</span>
  <span class="sd-draft-banner__actions">
    <button class="sd-draft-banner__btn" data-action="keep">Keep</button>
    <button class="sd-draft-banner__btn sd-draft-banner__btn--discard" data-action="discard">Discard</button>
  </span>
`;

  banner
    .querySelector('[data-action="keep"]')
    ?.addEventListener("click", () => {
      banner.remove();
      showStatus("Draft kept", "sd-draft--visible", 2000);
    });

  banner
    .querySelector('[data-action="discard"]')
    ?.addEventListener("click", () => {
      textarea.value = "";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      localStorage.removeItem(draftKey(projectId));
      banner.remove();
      showStatus("Draft discarded", "sd-draft--visible", 2000);
    });

  const scroll = composer.querySelector(".feed-composer__scroll");
  scroll?.prepend(banner) ?? composer.prepend(banner);
}

function attachDraftSave(composer: Element): void {
  if (composer.closest(".composer-modal")) return;
  if (composer.closest(".feed-post-card")) return;
  if (composer.getAttribute("data-sd-draft") === "true") return;

  const textarea = composer.querySelector<HTMLTextAreaElement>(
    'textarea[name="post_devlog[body]"]',
  );
  const form = composer.querySelector<HTMLFormElement>(".feed-composer__form");
  if (!textarea || !form) return;

  const projectId = getComposerProjectId(form) ?? getProjectId();
  if (!projectId) return;

  composer.setAttribute("data-sd-draft", "true");

  const wcBar = composer.querySelector(".sd-wc-bar");
  if (wcBar && !document.getElementById(DRAFT_STATUS_ID)) {
    const status = document.createElement("span");
    status.id = DRAFT_STATUS_ID;
    wcBar.prepend(status);
  }

  let isRestoring = false;
  let submitted = false;

  const saved = localStorage.getItem(draftKey(projectId));
  if (saved && saved.trim() !== "" && textarea.value.trim() === "") {
    isRestoring = true;
    textarea.value = saved;
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    isRestoring = false;
    showRestoreBanner(composer, textarea, projectId, saved);
  }

  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  textarea.addEventListener("input", () => {
    if (isRestoring) return;
    if (submitted) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const text = textarea.value;
      if (text.trim() === "") {
        localStorage.removeItem(draftKey(projectId));
      } else {
        localStorage.setItem(draftKey(projectId), text);
        showStatus("Draft saved", "sd-draft--visible", 1800);
      }
    }, SAVE_DEBOUNCE_MS);
  });

  form.addEventListener("turbo:submit-end", (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail?.success) {
      submitted = true;
      if (saveTimer) clearTimeout(saveTimer);
      localStorage.removeItem(draftKey(projectId));
    }
  });

  form.addEventListener("submit", () => {
    submitted = true;
    if (saveTimer) clearTimeout(saveTimer);
    localStorage.removeItem(draftKey(projectId));
  });
}

export function enhanceDraftSave(): void {
  injectStyles();
  document.querySelectorAll<Element>(".feed-composer").forEach(attachDraftSave);
}
