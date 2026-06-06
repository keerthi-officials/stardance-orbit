const WC_COMPOSER_ID = "sd-wc-composer";
const WC_STYLE_ID = "sd-wc-style";
const WC_CARD_ATTR = "data-sd-wc";

function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function readingTime(words: number): string {
  const secs = Math.round((words / 200) * 60);
  if (secs < 60) return `${secs}s read`;
  return `${Math.ceil(words / 200)} min read`;
}

function label(text: string): string {
  const w = wordCount(text);
  if (w === 0) return "";
  return `${w} ${w === 1 ? "word" : "words"} · ${readingTime(w)}`;
}

function injectStyles(): void {
  if (document.getElementById(WC_STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = WC_STYLE_ID;
  s.textContent = `
    /* Bar sits above the toolbar, full-width */
    .sd-wc-bar {
      display: flex;
      justify-content: flex-end;
      padding: 4px 12px 2px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      min-height: 22px;
    }

    #${WC_COMPOSER_ID} {
      font-size: 11.5px;
      opacity: 0;
      white-space: nowrap;
      pointer-events: none;
      line-height: 1;
      transition: opacity 0.15s;
    }

    #${WC_COMPOSER_ID}:not(:empty) {
      opacity: 0.5;
    }

    /* Per-card badge on duration line */
    .sd-wc-badge {
      font-size: 11px;
      opacity: 0.5;
      margin-left: 6px;
      white-space: nowrap;
    }
    .sd-wc-badge::before {
      content: "·";
      margin-right: 6px;
    }
  `;
  document.head.appendChild(s);
}

function injectComposerIndicator(composer: Element): void {
  if (composer.closest(".composer-modal")) return;
  if (composer.closest(".feed-post-card")) return;

  const textarea = composer.querySelector<HTMLTextAreaElement>(
    'textarea[name="post_devlog[body]"]',
  );
  if (!textarea) return;

  const toolbar = composer.querySelector<HTMLElement>(
    ".feed-composer__toolbar",
  );
  if (!toolbar) return;

  if (toolbar.previousElementSibling?.classList.contains("sd-wc-bar")) return;

  const bar = document.createElement("div");
  bar.className = "sd-wc-bar";

  const indicator = document.createElement("span");
  indicator.id = WC_COMPOSER_ID;
  bar.appendChild(indicator);

  toolbar.before(bar);

  const update = () => {
    indicator.textContent = label(textarea.value);
  };

  textarea.addEventListener("input", update);
  update();
}

function injectCardBadge(card: Element): void {
  if (card.hasAttribute(WC_CARD_ATTR)) return;
  card.setAttribute(WC_CARD_ATTR, "1");

  const body = card.querySelector<HTMLElement>(
    ".feed-post-card__body.markdown-content",
  );
  if (!body) return;

  const durationEl = card.querySelector<HTMLElement>(
    ".feed-post-card__duration",
  );
  if (!durationEl) return;

  if (durationEl.querySelector(".sd-wc-badge")) return;

  const text = body.innerText ?? body.textContent ?? "";
  const w = wordCount(text);
  if (w === 0) return;

  const badge = document.createElement("span");
  badge.className = "sd-wc-badge";
  badge.textContent = `${w}w · ${readingTime(w)}`;
  durationEl.appendChild(badge);
}

export function enhanceWordCount(): void {
  injectStyles();
  document
    .querySelectorAll<Element>(".feed-composer")
    .forEach(injectComposerIndicator);
  document
    .querySelectorAll<Element>(".feed-post-card")
    .forEach(injectCardBadge);
}
