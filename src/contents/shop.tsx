import { injectShopStyles } from "~/shop-styles";

const ORDERS_BTN_ID = "sd-orders-btn";
const PROGRESS_ATTR = "data-sd-progress";
const STARDUST_PER_HOUR = 10;

export function enhanceShopPage(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  injectShopStyles();
  addOrdersButton();
  reorderShopSections();
  enhanceShopItemCards();
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

function getUserStardust(): number | null {
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
  balanceSpan.textContent = `✦ ${balance.toLocaleString()} / ${price.toLocaleString()}`;

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
