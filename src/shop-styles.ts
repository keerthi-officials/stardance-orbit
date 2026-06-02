export const SHOP_STYLE_ID = "sd-shop-style";

const SHOP_CSS = `
/* Layout */

.shop-hub {
  padding: 1.5rem clamp(0.75rem, 2vw, 2rem) 4rem !important;
}

.shop-hub__rail {
  display: none !important;
}

.shop-hub__layout {
  display: block !important;
}

.shop-hub__main {
  width: 100% !important;
  max-width: none !important;
  margin-top: 24px !important;
  margin-bottom: 32px !important;
}

/* Orders button */

#sd-orders-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  margin-right: 8px;
  margin-top: 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  background: #fff;
  color: #111827;
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
  transition: .2s ease;
}

#sd-orders-btn:hover {
  transform: translateY(-2px);
}

/* Updates & wishlist sections */

.discover-rail__heading {
  margin-bottom: 10px !important;
}

[aria-label="Shop updates"] {
  display: block !important;
  width: 100% !important;
  margin: 0 0 24px 0 !important;
}

.discover-rail__section--wishlist {
  display: block !important;
  width: 100% !important;
  margin: 0 0 32px 0 !important;
}

.discover-rail__section--wishlist .shop-goals__items {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
  gap: 16px !important;
}

.discover-rail__section--wishlist .shop-goals__item {
  width: 100% !important;
}

/* Category grid */

.shop-hub__category-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem !important;
  padding-top: 1rem !important;
  margin-top: 1rem !important;
  margin-bottom: 32px !important;
}

.shop-hub__category-tile {
  list-style: none;
}

.shop-hub__category-link {
  position: relative;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 1.75rem;
  border-radius: 24px !important;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,.05),
    rgba(255,255,255,.02)
  ) !important;
  border: 1px solid rgba(255,255,255,.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
  text-decoration: none !important;
  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.shop-hub__category-thumb {
  box-shadow: none !important;
}

.shop-hub__category-link:hover {
  transform: translateY(-6px);
  border-color: rgba(255,255,255,.2);
  box-shadow: 0 15px 40px rgba(0,0,0,.25);
}

.shop-hub__category-link::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at top,
    rgba(255,255,255,.08),
    transparent 60%
  );
  pointer-events: none;
}

.shop-hub__category-name {
  margin: 0 !important;
  font-size: 1.35rem !important;
  font-weight: 800 !important;
  letter-spacing: -.03em;
  color: white !important;
  text-align: center;
  text-shadow: 0 2px 12px rgba(0,0,0,.35);
}

/* Item cards */

.shop-hub__items-scroll {
  overflow: visible !important;
  mask-image: none !important;
  -webkit-mask-image: none !important;
}

.shop-hub__items-card {
  flex: 0 0 320px !important;
}

.shop-item-card {
  background: #ffffff !important;
  border: none !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  color: #111827 !important;
  height: 100% !important;
  box-shadow: 0 4px 20px rgba(0,0,0,.06) !important;
}

.shop-item-card__image-wrap {
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 240px !important;
  padding: 20px;
  background: #f8fafc;
}

.shop-item-card__image {
  max-width: 100%;
  max-height: 180px;
  object-fit: contain !important;
}

.shop-item-card__body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  flex: 1;
}

.shop-item-card__title {
  color: #111827 !important;
  font-size: 1.1rem !important;
  line-height: 1.3 !important;
  font-weight: 700 !important;
  margin: 0 !important;
}

.shop-item-card__description {
  color: #6b7280 !important;
  font-size: .92rem !important;
  line-height: 1.5 !important;
}

.shop-item-card__hours {
  color: #475569 !important;
  font-size: .9rem !important;
  font-weight: 600 !important;
}

.shop-item-card__star {
  top: 14px !important;
  right: 14px !important;
  z-index: 99 !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 999px !important;
  background: white !important;
  border: none !important;
  box-shadow: 0 2px 12px rgba(0,0,0,.15) !important;
}

.shop-item-card__order-cta {
  margin-top: auto !important;
  width: 100% !important;
  border-radius: 12px !important;
}

.shop-hub__items-grid,
.shop-hub__items-list {
  gap: 20px !important;
}

/* Scroll arrows */

.shop-hub__scroll-arrow {
  display: flex !important;
  align-items: center;
  justify-content: center;
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 52px !important;
  height: 52px !important;
  border-radius: 9999px !important;
  background: white !important;
  border: none !important;
  z-index: 99 !important;
  color: #111827 !important;
  box-shadow:
    0 4px 10px rgba(0,0,0,.08),
    0 12px 28px rgba(0,0,0,.15) !important;
}

.shop-hub__scroll-arrow[data-visible="false"] {
  opacity: 0 !important;
  pointer-events: none !important;
}

.shop-hub__scroll-arrow[data-visible="true"] {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.shop-hub__scroll-arrow--left  { left: 12px !important; }
.shop-hub__scroll-arrow--right { right: 12px !important; }

.shop-hub__scroll-arrow svg {
  stroke: currentColor !important;
  display: block !important;
  width: 22px !important;
  height: 22px !important;
}

/* Responsive */

@media (max-width: 1000px) {
  .shop-hub__category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .shop-hub__topbar-right { display: flex; gap: 10px; }
  .sidebar__nav-lock      { display: none !important; }
  .shop-hub__region       { flex: 1; }
  .shop-hub__region select { width: 100%; }

  .discover-rail__section--wishlist .shop-goals__items {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .shop-hub__category-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)) !important;
  }
}

@media (max-width: 700px) {
  .shop-hub__category-grid {
    grid-template-columns: 1fr;
    gap: 1rem !important;
  }
  .shop-hub__category-link {
    min-height: 200px;
    padding: 1.25rem;
  }
  .shop-hub__category-art  { height: 95px; }
  .shop-hub__category-name { font-size: 1.15rem !important; }
}

@media (max-width: 640px) {
  .shop-hub__category-grid {
    grid-template-columns: 1fr;
    gap: 1rem !important;
  }
}
`;

export function injectShopStyles(): void {
  if (document.getElementById(SHOP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SHOP_STYLE_ID;
  style.textContent = SHOP_CSS;
  document.head.appendChild(style);
}
