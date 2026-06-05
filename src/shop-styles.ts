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
  flex: 0 0 280px !important;
}

.shop-item-card {
  --card-bg: transparent !important;
  --card-border: transparent !important;
  background: var(--sd-surface) !important;
  border-color: var(--sd-border) !important;
  color: var(--sd-text) !important;
  border: 1px solid rgba(255,255,255,.08) !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  height: 100% !important;
  box-shadow: none !important;
  transition: border-color .2s ease, background .2s ease !important;
}

.shop-item-card:hover {
  border-color: var(--sd-border-hover) !important;
  background: var(--sd-surface-hover) !important;
}

.shop-item-card__image-wrap {
  border: none !important;
  border-bottom: 1px solid rgba(255,255,255,.07) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 180px !important;
  padding: 20px !important;
  background: rgba(255,255,255,.04) !important;
}

.shop-item-card__image {
  max-width: 100% !important;
  max-height: 140px !important;
  object-fit: contain !important;
  opacity: .92 !important;
}

.shop-item-card__body {
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  padding: 14px !important;
  flex: 1 !important;
}

.shop-item-card__title {
  color: var(--sd-text) !important;  
  font-size: .9rem !important;
  line-height: 1.35 !important;
  font-weight: 700 !important;
  margin: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.shop-item-card__description {
  color: var(--sd-text-muted) !important;
  font-size: .78rem !important;
  line-height: 1.5 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.shop-item-card__hours {
  color: var(--sd-text-faint) !important;
  font-size: .75rem !important;
  font-weight: 600 !important;
}

/* Star button */

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
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: absolute !important;
  transition:
    transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.18s ease,
    background 0.18s ease !important;
}
 
.shop-item-card__star:hover {
  transform: scale(1.18) !important;
  box-shadow: 0 4px 18px rgba(0,0,0,.22) !important;
  background: #fffbe6 !important;
}
 
.shop-item-card__star:active {
  transform: scale(0.88) !important;
  transition: transform 0.08s ease !important;
}
 
.shop-item-card__star svg {
  transition:
    color 0.22s ease,
    filter 0.22s ease,
    transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  color: #d1d5db !important;
  pointer-events: none !important;
}
 
.shop-item-card__star.sd-star--active svg {
  color: #FBBF24 !important;
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.65)) !important;
}
 
@keyframes sd-star-pop {
  0%   { transform: scale(1) rotate(0deg); }
  30%  { transform: scale(1.5) rotate(-15deg); }
  60%  { transform: scale(0.82) rotate(8deg); }
  80%  { transform: scale(1.15) rotate(-3deg); }
  100% { transform: scale(1) rotate(0deg); }
}
 
.shop-item-card__star.sd-star--pop svg {
  animation: sd-star-pop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
}
 
/* Burst particles */

.sd-burst {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 0 !important;
  height: 0 !important;
  pointer-events: none !important;
  z-index: 100 !important;
}
 
.sd-burst__p {
  position: absolute !important;
  width: 6px !important;
  height: 6px !important;
  border-radius: 50% !important;
  transform: translate(-50%, -50%) !important;
  pointer-events: none !important;
}
 
@keyframes sd-burst-fade {
  0%   { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
}

.shop-item-card__order-cta {
  margin-top: auto !important;
  width: 100% !important;
  border-radius: 10px !important;
  background: rgba(255,255,255,.1) !important;
  border: 1px solid rgba(255,255,255,.12) !important;
  color: #fff !important;
  font-weight: 700 !important;
  font-size: .82rem !important;
  transition: background .15s ease !important;
}

.shop-item-card__order-cta:hover {
  background: rgba(255,255,255,.16) !important;
}

.shop-hub__items-grid,
.shop-hub__items-list {
  gap: 16px !important;
}

.shop-item-card__order-cta:disabled,
.shop-item-card__order-cta[disabled],
.shop-item-card__order-cta[aria-disabled="true"] {
  cursor: not-allowed !important;
  opacity: .35 !important;
  background: rgba(255,255,255,.05) !important;
  border-color: rgba(255,255,255,.08) !important;
  color: rgba(255,255,255,.4) !important;
  pointer-events: auto !important;
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
  background: rgba(255,255,255,.05);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.08);
}

.sd-progress__balance {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255,255,255,.4);
  white-space: nowrap;
}

.sd-progress__status {
  font-size: 0.78rem;
  text-align: right;
  white-space: nowrap;
  color: rgba(255,255,255,.55);
}

.sd-progress__status strong {
  font-weight: 700;
  color: #fff;
}

.sd-progress__track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,.1);
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

/* Shared stardust icon */

.sd-stardust-icon {
  width: 14px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 4px;
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
