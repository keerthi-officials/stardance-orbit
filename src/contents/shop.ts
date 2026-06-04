import { injectShopStyles } from "~/shop-styles";
import {
  enhanceGoalsPanel,
  enhanceGoalsRemoveButtons,
} from "@/src/contents/shop-goals";

export { enhanceGoalsPanel } from "@/src/contents/shop-goals";

const ORDERS_BTN_ID = "sd-orders-btn";
const STAR_STORAGE_PREFIX = "sd_wishlist_";
const PROGRESS_ATTR = "data-sd-progress";
const STARDUST_PER_HOUR = 10;

const STARDUST_ICON = `
<img
  src="https://stardance.hackclub.com/assets/icons/stardust-18e809ef.png"
  alt="Stardust"
  class="sd-stardust-icon"
/>
`;

export function enhanceShopPage(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  injectShopStyles();
  addOrdersButton();
  reorderShopSections();
  enhanceShopItemCards();
  enhanceGoalsPanel();
  enhanceWishlistStars();
  enhanceGoalsRemoveButtons();

  watchWishlistStars();
}

function addOrdersButton(): void {
  document
    .querySelectorAll('[aria-label="Your orders"]')
    .forEach((el) => el.remove());

  if (document.getElementById(ORDERS_BTN_ID)) return;

  const container = document.querySelector(".shop-hub__topbar-right");
  if (!container) return;

  const btn = document.createElement("a");
  btn.id = ORDERS_BTN_ID;
  btn.href = "/shop/orders";
  btn.textContent = "Orders";
  container.prepend(btn);
}

function reorderShopSections(): void {
  const updatesSection = document.querySelector<HTMLElement>(
    '[aria-label="Shop updates"]',
  );
  const wishlistSection = document.querySelector<HTMLElement>(
    ".discover-rail__section--wishlist",
  );
  const mainSection = document.querySelector<HTMLElement>(".shop-hub__main");

  if (updatesSection && mainSection) {
    updatesSection.remove();
    mainSection.insertAdjacentElement("afterend", updatesSection);
  }

  if (wishlistSection && updatesSection) {
    wishlistSection.remove();
    updatesSection.insertAdjacentElement("afterend", wishlistSection);
  }
}

export function getUserStardust(): number | null {
  const el = document.querySelector(".sidebar__user-balance-amount");
  if (!el) return null;
  const raw = el.textContent?.replace(/[^\d.]/g, "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function getItemPrice(card: Element): number | null {
  const label = card.querySelector(".action-btn__label");
  if (!label) return null;
  const raw = label.textContent?.replace(/[^\d.]/g, "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function getProgressColor(balance: number, price: number): string {
  if (balance >= price) return "#48bb78";
  if (balance >= price * 0.8) return "#ed8936";
  return "#fc5c65";
}

function formatHours(stardust: number): string {
  return `${(stardust / STARDUST_PER_HOUR).toFixed(1)}h`;
}

function getStarItemId(btn: HTMLElement): string | null {
  const card = btn.closest<HTMLElement>("[data-shop-wishlist-item-id-value]");
  return card?.getAttribute("data-shop-wishlist-item-id-value") ?? null;
}

function getStarSiteState(btn: HTMLElement): boolean {
  const card = btn.closest<HTMLElement>(
    "[data-shop-wishlist-wishlisted-value]",
  );
  return card?.getAttribute("data-shop-wishlist-wishlisted-value") === "true";
}

function starLoadState(itemId: string): boolean | null {
  const val = localStorage.getItem(STAR_STORAGE_PREFIX + itemId);
  if (val === null) return null;
  return val === "true";
}

function starSaveState(itemId: string, active: boolean): void {
  localStorage.setItem(STAR_STORAGE_PREFIX + itemId, String(active));
}

function starApply(btn: HTMLElement, active: boolean, animate = false): void {
  btn.classList.toggle("sd-star--active", active);

  if (animate) {
    btn.classList.remove("sd-star--pop");
    void btn.offsetWidth;
    btn.classList.add("sd-star--pop");
    setTimeout(() => btn.classList.remove("sd-star--pop"), 500);

    if (active) starBurst(btn);
  }
}

function starBurst(btn: HTMLElement): void {
  btn.querySelectorAll(".sd-burst").forEach((el) => el.remove());

  const container = document.createElement("div");
  container.className = "sd-burst";
  btn.appendChild(container);

  const colors = ["#FBBF24", "#F59E0B", "#FDE68A", "#FB923C", "#A78BFA"];
  const COUNT = 8;

  for (let i = 0; i < COUNT; i++) {
    const angle = (360 / COUNT) * i + Math.random() * 15;
    const dist = 16 + Math.random() * 10;
    const rad = (angle * Math.PI) / 180;
    const tx = Math.cos(rad) * dist;
    const ty = Math.sin(rad) * dist;
    const delay = i * 20;

    const p = document.createElement("div");
    p.className = "sd-burst__p";
    p.style.cssText = `
    background: ${colors[i % colors.length]};
    animation: sd-burst-fade 0.45s ease-out ${delay}ms forwards;
    `;

    container.appendChild(p);

    const startTime = performance.now() + delay;
    const duration = 450;

    const tick = (now: number) => {
      if (now < startTime) {
        requestAnimationFrame(tick);
        return;
      }
      const prog = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - prog, 2);
      p.style.transform = `translate(calc(-50% + ${tx * eased}px), calc(-50% + ${ty * eased}px))`;
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  setTimeout(() => container.remove(), 700);
}

export function enhanceWishlistStars(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  document
    .querySelectorAll<HTMLElement>(".shop-item-card__star")
    .forEach((btn) => {
      if (btn.dataset.sdStarInit) return;
      btn.dataset.sdStarInit = "1";

      const itemId = getStarItemId(btn);
      if (!itemId) return;

      let stored = starLoadState(itemId);
      if (stored === null) {
        stored = getStarSiteState(btn);
        starSaveState(itemId, stored);
      }
      starApply(btn, stored);

      btn.addEventListener("click", () => {
        const current = starLoadState(itemId) ?? false;
        const next = !current;

        starSaveState(itemId, next);
        starApply(btn, next, true);

        if (window.location.pathname === "/shop") {
          setTimeout(() => window.location.reload(), 350);
        }
      });
    });
}

let _wishlistObserver: MutationObserver | null = null;

function watchWishlistStars(): void {
  _wishlistObserver?.disconnect();

  _wishlistObserver = new MutationObserver(() => {
    enhanceWishlistStars();
    enhanceGoalsRemoveButtons();
  });

  _wishlistObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function buildProgressBar(balance: number, price: number): HTMLElement {
  const needed = Math.max(0, price - balance);
  const pct = Math.min(100, (balance / price) * 100);
  const color = getProgressColor(balance, price);
  const canAfford = balance >= price;

  const wrap = document.createElement("div");
  wrap.className = "sd-progress";
  wrap.setAttribute(PROGRESS_ATTR, "true");

  const track = document.createElement("div");
  track.className = "sd-progress__track";

  const fill = document.createElement("div");
  fill.className = "sd-progress__fill";
  fill.style.width = `${pct}%`;
  fill.style.background = color;

  track.appendChild(fill);

  const row = document.createElement("div");
  row.className = "sd-progress__row";

  const balanceSpan = document.createElement("span");
  balanceSpan.className = "sd-progress__balance";
  balanceSpan.innerHTML = `${STARDUST_ICON} ${balance.toLocaleString()} / ${price.toLocaleString()}`;

  const statusSpan = document.createElement("span");
  statusSpan.className = "sd-progress__status";
  statusSpan.style.color = color;

  if (canAfford) {
    statusSpan.textContent = "You can afford this!";
  } else {
    statusSpan.innerHTML = `Need <strong>${needed.toLocaleString()}</strong> more (${formatHours(needed)})`;
  }

  row.appendChild(balanceSpan);
  row.appendChild(statusSpan);

  wrap.appendChild(track);
  wrap.appendChild(row);

  return wrap;
}

function injectProgressBar(card: Element, balance: number): void {
  const price = getItemPrice(card);
  if (price === null || price <= 0) return;

  const buyBtn = card.querySelector(".shop-item-card__order-cta");
  if (!buyBtn) return;

  card.querySelector(`[${PROGRESS_ATTR}]`)?.remove();

  buyBtn.insertAdjacentElement("beforebegin", buildProgressBar(balance, price));
}

export function enhanceShopItemCards(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  const balance = getUserStardust();
  if (balance === null) {
    waitForBalance();
    return;
  }

  document.querySelectorAll(".shop-item-card").forEach((card) => {
    injectProgressBar(card, balance);
  });
}

function waitForBalance(): void {
  const observer = new MutationObserver(() => {
    const balance = getUserStardust();
    if (balance === null) return;
    observer.disconnect();
    document.querySelectorAll(".shop-item-card").forEach((card) => {
      injectProgressBar(card, balance);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 10_000);
}
