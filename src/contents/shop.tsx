import { injectShopStyles } from "~shop-styles";

const ORDERS_BTN_ID = "sd-orders-btn";

export function enhanceShopPage(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  injectShopStyles();
  addOrdersButton();
  reorderShopSections();
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
