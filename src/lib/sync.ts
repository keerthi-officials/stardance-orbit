import { enhanceProjectPage } from "~contents/project";
import { enhanceShopPage } from "~contents/shop";

async function syncEnhancements(): Promise<void> {
  enhanceShopPage();
  enhanceProjectPage();
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
  ".composer-modal",
  ".app-layout__main",
  ".shop-hub",
  ".shop-hub__topbar-right",
].join(", ");

function mutationMatters(mutations: MutationRecord[]): boolean {
  return mutations.some((mutation) =>
    [...mutation.addedNodes, ...mutation.removedNodes].some((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      const el = node as Element;

      if (
        el.id === "settings-modal" ||
        el.id === "primary-nav" ||
        el.classList?.contains("discover-rail") ||
        el.classList?.contains("project-show__actions") ||
        el.classList?.contains("project-show__feed") ||
        el.classList?.contains("project-show__banner") ||
        el.classList?.contains("composer-modal") ||
        el.classList?.contains("app-layout__main") ||
        el.classList?.contains("shop-hub") ||
        el.classList?.contains("shop-hub__topbar-right")
      ) {
        return true;
      }

      return Boolean(el.querySelector?.(WATCHED_SELECTORS));
    }),
  );
}

const domObserver = new MutationObserver((mutations) => {
  if (mutationMatters(mutations)) scheduleSync();
});

export function bootstrap(): void {
  const observe = () =>
    domObserver.observe(document.body, { childList: true, subtree: true });

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

  scheduleSync();
}