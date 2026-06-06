import { enhanceProjectPage } from "~/contents/project";
import {
  enhanceShopPage,
  enhanceShopItemCards,
  enhanceGoalsPanel,
} from "~/contents/shop";
import { enhanceHomeComposer } from "~contents/home";
import { enhanceDistractionFree } from "~contents/focus";
import { enhanceWordCount } from "~contents/word-count";
import {
  initCollapseDevlogs,
  enhanceCollapseDevlogs,
} from "~contents/collapse-devlogs";
import { initProjectView, enhanceProjectView } from "~contents/project-view";

let _syncing = false;

async function syncEnhancements(): Promise<void> {
  if (_syncing) return;
  _syncing = true;
  try {
    enhanceShopPage();
    enhanceProjectPage();
    enhanceHomeComposer();
    enhanceDistractionFree();
    enhanceWordCount();
    enhanceCollapseDevlogs();
    enhanceProjectView();
  } finally {
    _syncing = false;
  }
}

let syncScheduled = false;

export function scheduleSync(): void {
  if (syncScheduled) return;
  syncScheduled = true;

  queueMicrotask(async () => {
    syncScheduled = false;
    await syncEnhancements();
  });
}

const WATCHED_SELECTORS = [
  "#settings-modal",
  "#primary-nav",
  ".discover-rail",
  ".project-show__actions",
  ".project-show__feed",
  ".project-show__banner",
  ".project-show__info",
  ".composer-modal",
  ".app-layout__main",
  ".shop-hub",
  ".shop-hub__topbar-right",
  ".sidebar__user-balance-amount",
  ".shop-item-card",
  ".shop-goals__container",
  ".shop-goals__items",
  ".feed-post-card",
  ".feed-composer",
  ".sd-header",
  "#sd-df-home-bar",
  ".feed-home",
  ".feed-home__frame",
].join(", ");

const SD_OWN_CLASSES = new Set([
  "sd-progress",
  "sd-progress__track",
  "sd-progress__fill",
  "sd-progress__row",
  "sd-progress__balance",
  "sd-progress__status",
  "sd-goals",
  "sd-goals__summary",
  "sd-goals__chips",
  "sd-goals__chip",
  "sd-goals__grid",
  "sd-goals__item",
  "sd-goals__info",
  "sd-goals__name",
  "sd-goals__mini-track",
  "sd-goals__mini-fill",
  "sd-goals__item-status",
  "sd-goals__remove-wrap",
  "sd-goals__remove",
  "sd-goals__accordion",
  "sd-goals__accordion-header",
  "sd-goals__accordion-body",
  "sd-goals__accordion-arrow",
  "sd-goals__cumbar-wrap",
  "sd-goals__cumbar-track",
  "sd-goals__cumbar-seg",
  "sd-goals__cumbar-fill",
  "sd-goals__proj-loader",
  "sd-goals__proj-loader-dot",
  "sd-goals__tabs",
  "sd-goals__tab",
  "sd-goals__cumtabs",
  "sd-goals__cumtab",
  "sd-goals__cumtabs-wrap",
  "sd-goals__toprow",
  "sd-goals__title",
  "sd-goals__summary-track-wrap",
  "sd-goals__summary-track",
  "sd-goals__summary-fill",
  "sd-goals__summary-pct",
  "sd-goals__empty",
  "sd-goals__img",
  "sd-burst",
  "sd-burst__p",
  "sd-proj",
  "sd-proj__header",
  "sd-proj__title",
  "sd-proj__subtitle",
  "sd-proj__estimate",
  "sd-proj__range",
  "sd-proj__mid-label",
  "sd-proj__overall-bar",
  "sd-proj__overall-track",
  "sd-proj__overall-fill",
  "sd-proj__disclaimer",
  "sd-shell",
  "sd-header",
  "sd-title",
  "sd-df-btn",
  "sd-wc-badge",
]);

const SD_OWN_IDS = new Set([
  "sd-goals-panel",
  "sd-projection",
  "sd-orders-btn",
  "sd-shop-style",
  "sd-goals-style",
  "sd-df-home-bar",
  "sd-df-style",
  "sd-wc-composer",
  "sd-wc-style",
]);

function isOwnNode(el: Element): boolean {
  if (el.id && SD_OWN_IDS.has(el.id)) return true;
  for (const cls of Array.from(el.classList)) {
    if (SD_OWN_CLASSES.has(cls)) return true;
  }
  return false;
}

function mutationMatters(mutations: MutationRecord[]): boolean {
  return mutations.some((mutation) =>
    [...mutation.addedNodes, ...mutation.removedNodes].some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const el = node as Element;

      if (isOwnNode(el)) return false;

      if (
        el.id === "settings-modal" ||
        el.id === "primary-nav" ||
        el.classList?.contains("discover-rail") ||
        el.classList?.contains("project-show__actions") ||
        el.classList?.contains("project-show__feed") ||
        el.classList?.contains("project-show__banner") ||
        el.classList?.contains("project-show__info") ||
        el.classList?.contains("composer-modal") ||
        el.classList?.contains("app-layout__main") ||
        el.classList?.contains("shop-hub") ||
        el.classList?.contains("shop-hub__topbar-right") ||
        el.classList?.contains("sidebar__user-balance-amount") ||
        el.classList?.contains("shop-item-card") ||
        el.classList?.contains("shop-goals__container") ||
        el.classList?.contains("shop-goals__items") ||
        el.classList?.contains("feed-post-card") ||
        el.classList?.contains("feed-composer") ||
        el.classList?.contains("sd-header") ||
        el.classList?.contains("feed-home") ||
        el.id === "sd-df-home-bar"
      ) {
        return true;
      }

      return Boolean(el.querySelector?.(WATCHED_SELECTORS));
    }),
  );
}

function watchBalanceText(): void {
  const balanceEl = document.querySelector(".sidebar__user-balance-amount");
  if (!balanceEl) return;

  const textObserver = new MutationObserver(() => {
    enhanceShopItemCards();
    enhanceGoalsPanel();
  });

  textObserver.observe(balanceEl, {
    characterData: true,
    childList: true,
    subtree: true,
  });
}

const domObserver = new MutationObserver((mutations) => {
  if (mutationMatters(mutations)) scheduleSync();
});

export function bootstrap(): void {
  const observe = () => {
    domObserver.observe(document.body, { childList: true, subtree: true });
    watchBalanceText();
  };

  if (document.body) {
    observe();
  } else {
    const bodyWatcher = new MutationObserver(() => {
      if (document.body) {
        observe();
        bodyWatcher.disconnect();
      }
    });
    bodyWatcher.observe(document.documentElement, { childList: true });
  }

  window.addEventListener("turbo:load", scheduleSync);
  window.addEventListener("turbo:render", scheduleSync);
  window.addEventListener("pageshow", scheduleSync);

  initCollapseDevlogs();
  initProjectView();
  scheduleSync();
}
