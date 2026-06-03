import { injectShopStyles } from "~/shop-styles";

const ORDERS_BTN_ID = "sd-orders-btn";
const PROGRESS_ATTR = "data-sd-progress";
const GOALS_PANEL_ID = "sd-goals-panel";
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

function parseStardustNumber(text: string | null | undefined): number | null {
  if (!text) return null;
  const raw = text.replace(/[^\d.]/g, "").trim();
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

interface WishlistItem {
  name: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  price: number;
  needed: number;
  removeFormHtml: string;
}

function parseWishlistItems(balance: number): WishlistItem[] {
  const items: WishlistItem[] = [];

  document.querySelectorAll(".shop-goals__item").forEach((item) => {
    const link = item.querySelector<HTMLAnchorElement>(".shop-goals__link");
    const img = item.querySelector<HTMLImageElement>(".shop-goals__image");
    const nameEl = item.querySelector(".shop-goals__name");
    const textEl = item.querySelector(".shop-goals__progress-text");
    const form = item.querySelector("form");

    if (!link || !img || !nameEl || !textEl) return;

    const neededNum = parseStardustNumber(textEl.textContent);
    if (neededNum === null) return;

    items.push({
      name: nameEl.textContent?.trim() ?? "",
      href: link.getAttribute("href") ?? "#",
      imgSrc: img.src,
      imgAlt: img.alt,
      price: balance + neededNum,
      needed: neededNum,
      removeFormHtml: form?.outerHTML ?? "",
    });
  });

  return items;
}

function buildSummaryBar(balance: number, totalCost: number): HTMLElement {
  const pct = Math.min(100, totalCost > 0 ? (balance / totalCost) * 100 : 0);
  const color = getProgressColor(balance, totalCost);
  const canAffordAll = balance >= totalCost;
  const needed = Math.max(0, totalCost - balance);

  const wrap = document.createElement("div");
  wrap.className = "sd-goals__summary";

  const chips = document.createElement("div");
  chips.className = "sd-goals__chips";

  const makeChip = (label: string, value: string, accent?: string) => {
    const chip = document.createElement("div");
    chip.className = "sd-goals__chip";
    if (accent) chip.style.borderColor = accent;
    chip.innerHTML = `<span class="sd-goals__chip-label">${label}</span><span class="sd-goals__chip-value" style="${accent ? `color:${accent}` : ""}">${value}</span>`;
    return chip;
  };

  chips.appendChild(
    makeChip(
      "GOALS",
      `${document.querySelectorAll(".shop-goals__item").length}`,
    ),
  );
  chips.appendChild(
    makeChip("BALANCE", `${STARDUST_ICON} ${balance.toLocaleString()}`),
  );
  chips.appendChild(
    makeChip(
      "REMAINING",
      canAffordAll
        ? "All covered!"
        : `${STARDUST_ICON} ${needed.toLocaleString()}`,
      canAffordAll ? "#48bb78" : "#fc5c65",
    ),
  );
  chips.appendChild(
    makeChip(
      "TIME EST.",
      canAffordAll ? "—" : `~${formatHours(needed)}`,
      "#48bb78",
    ),
  );

  const trackWrap = document.createElement("div");
  trackWrap.className = "sd-goals__summary-track-wrap";

  const track = document.createElement("div");
  track.className = "sd-goals__summary-track";

  const fill = document.createElement("div");
  fill.className = "sd-goals__summary-fill";
  fill.style.width = `${pct}%`;
  fill.style.background = color;

  const pctLabel = document.createElement("span");
  pctLabel.className = "sd-goals__summary-pct";
  pctLabel.textContent = `${Math.round(pct)}%`;

  track.appendChild(fill);
  trackWrap.appendChild(track);
  trackWrap.appendChild(pctLabel);

  wrap.appendChild(chips);
  wrap.appendChild(trackWrap);

  return wrap;
}

function buildGoalItem(item: WishlistItem, balance: number): HTMLElement {
  const pct = Math.min(100, item.price > 0 ? (balance / item.price) * 100 : 0);
  const color = getProgressColor(balance, item.price);

  const el = document.createElement("div");
  el.className = "sd-goals__item";

  if (item.removeFormHtml) {
    const formWrap = document.createElement("div");
    formWrap.className = "sd-goals__remove-wrap";
    formWrap.innerHTML = item.removeFormHtml;
    const btn = formWrap.querySelector<HTMLButtonElement>(
      ".shop-goals__remove",
    );
    if (btn) btn.className = "sd-goals__remove";
    el.appendChild(formWrap);
  }

  const img = document.createElement("img");
  img.src = item.imgSrc;
  img.alt = item.imgAlt;
  img.className = "sd-goals__img";

  const info = document.createElement("div");
  info.className = "sd-goals__info";

  const name = document.createElement("a");
  name.href = item.href;
  name.className = "sd-goals__name";
  name.textContent = item.name;

  const miniTrack = document.createElement("div");
  miniTrack.className = "sd-goals__mini-track";

  const miniFill = document.createElement("div");
  miniFill.className = "sd-goals__mini-fill";
  miniFill.style.width = `${pct}%`;
  miniFill.style.background = color;

  miniTrack.appendChild(miniFill);

  const status = document.createElement("span");
  status.className = "sd-goals__item-status";
  status.style.color = color;

  if (item.needed <= 0) {
    status.textContent = "✓ You can afford this!";
  } else {
    status.innerHTML = `Need <strong>${STARDUST_ICON} ${item.needed.toLocaleString()}</strong> more · ${formatHours(item.needed)}`;
  }

  info.appendChild(name);
  info.appendChild(miniTrack);
  info.appendChild(status);

  el.appendChild(img);
  el.appendChild(info);

  return el;
}

function buildGoalsPanel(balance: number, items: WishlistItem[]): HTMLElement {
  const totalCost = items.reduce((sum, i) => sum + i.price, 0);

  const panel = document.createElement("div");
  panel.id = GOALS_PANEL_ID;
  panel.className = "sd-goals";

  const header = document.createElement("div");
  header.className = "sd-goals__header";
  header.innerHTML = `<span class="sd-goals__title">⭐ My Goal Items</span>`;

  const summary = buildSummaryBar(balance, totalCost);

  const grid = document.createElement("div");
  grid.className = "sd-goals__grid";

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "sd-goals__empty";
    empty.textContent =
      "No wishlist items yet. Star items in the shop to add them here.";
    grid.appendChild(empty);
  } else {
    items.forEach((item) => grid.appendChild(buildGoalItem(item, balance)));
  }

  panel.appendChild(header);
  panel.appendChild(summary);
  panel.appendChild(grid);

  return panel;
}

export function enhanceGoalsPanel(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  const container = document.querySelector<HTMLElement>(
    ".shop-goals__container",
  );
  if (!container) return;

  if (document.getElementById(GOALS_PANEL_ID)) return;

  const balance = getUserStardust();
  if (balance === null) {
    waitForBalanceForGoals();
    return;
  }

  const items = parseWishlistItems(balance);
  const panel = buildGoalsPanel(balance, items);

  container.replaceWith(panel);
}

function waitForBalanceForGoals(): void {
  const observer = new MutationObserver(() => {
    const balance = getUserStardust();
    if (balance === null) return;
    observer.disconnect();
    enhanceGoalsPanel();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 10_000);
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
