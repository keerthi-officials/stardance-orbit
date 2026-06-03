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
  --card-bg: #ffffff !important;
  --card-border: transparent !important;
  background: #ffffff !important;
  border: none !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  color: #111827 !important;
  height: 100% !important;
  box-shadow: 0 4px 20px rgba(0,0,0,.06) !important;
}

.shop-item-card__image-wrap {
  border: none !important;
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

/* Stardust progress bar */

.sd-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  margin-top: 12px;
  padding: 12px;
  background:#fdf6f0;
  border-radius: 10px;
  border: 1px solid #e2d8cc;
}

.sd-progress__track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.sd-progress__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.4s ease, background 0.4s ease;
  min-width: 2px;
}

.sd-progress__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sd-progress__balance {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9ca3af;
  white-space: nowrap;
}

.sd-progress__status {
  font-size: 0.78rem;
  text-align: right;
  white-space: nowrap;
}

.sd-progress__status strong {
  font-weight: 700;
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

/* Goals panel */

#sd-goals-panel {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 20px;
  padding: 1.25rem 1.5rem 1.5rem;
  margin-bottom: 2rem;
}

.sd-goals__header {
  margin-bottom: 1rem;
}

.sd-goals__title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -.02em;
}

/* ── Chip row ── */

.sd-goals__chips {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .75rem;
  margin-bottom: 1rem;
}

.sd-goals__chip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: .65rem .9rem;
  border-radius: 12px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
}

.sd-goals__chip-label {
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .08em;
  color: rgba(255,255,255,.4);
  text-transform: uppercase;
}

.sd-goals__chip-value {
  font-size: .95rem;
  font-weight: 700;
  color: #fff;
}

/* ── Summary progress bar ── */

.sd-goals__summary-track-wrap {
  display: flex;
  align-items: center;
  gap: .75rem;
  margin-bottom: 1.25rem;
}

.sd-goals__summary-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  overflow: hidden;
}

.sd-goals__summary-fill {
  height: 100%;
  border-radius: 999px;
  transition: width .5s ease, background .5s ease;
  min-width: 3px;
}

.sd-goals__summary-pct {
  font-size: .8rem;
  font-weight: 700;
  color: rgba(255,255,255,.5);
  white-space: nowrap;
  min-width: 2.5rem;
  text-align: right;
}

/* ── Items grid ── */

.sd-goals__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: .75rem;
}

.sd-goals__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: .85rem;
  padding: .75rem;
  border-radius: 14px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  transition: border-color .2s ease, background .2s ease;
}

.sd-goals__item:hover {
  border-color: rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
}

.sd-goals__img {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 10px;
  background: rgba(255,255,255,.07);
  flex-shrink: 0;
  padding: 4px;
}

.sd-goals__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sd-goals__name {
  font-size: .85rem;
  font-weight: 700;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.sd-goals__name:hover {
  text-decoration: underline;
}

.sd-goals__mini-track {
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  overflow: hidden;
}

.sd-goals__mini-fill {
  height: 100%;
  border-radius: 999px;
  transition: width .4s ease;
  min-width: 2px;
}

.sd-goals__item-status {
  font-size: .72rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sd-goals__item-status strong {
  font-weight: 800;
}

/* Remove button */

.sd-goals__remove-wrap {
  position: absolute;
  top: .5rem;
  right: .5rem;
}

.sd-goals__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255,255,255,.1);
  border: none;
  cursor: pointer;
  font-size: .75rem;
  color: rgba(255,255,255,.5);
  line-height: 1;
  padding: 0;
  transition: background .15s ease, color .15s ease;
}

.sd-goals__remove:hover {
  background: #fc5c65;
  color: #fff;
}

.sd-goals__empty {
  color: rgba(255,255,255,.4);
  font-size: .875rem;
  text-align: center;
  padding: 1.5rem 0;
  grid-column: 1 / -1;
}

/* ── Responsive ── */

@media (max-width: 768px) {
  .sd-goals__chips {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .sd-goals__chips {
    grid-template-columns: repeat(2, 1fr);
  }

  .sd-goals__grid {
    grid-template-columns: 1fr;
  }
}

.sd-stardust-icon {
  width: 14 px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 4px;
}

.sd-progress__status strong,
.sd-goals__chip-value {
  align-items: center;
  gap: 4px;
}
`;

export function injectShopStyles(): void {
  if (document.getElementById(SHOP_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = SHOP_STYLE_ID;
  style.textContent = SHOP_CSS;
  document.head.appendChild(style);
}
