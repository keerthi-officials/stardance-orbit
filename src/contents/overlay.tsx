export function enhanceShopCards() {
  if (!window.location.pathname.startsWith("/shop")) return;

  const existing = document.getElementById("stardance-orbit-shop-style");
  if (existing) return;

  const style = document.createElement("style");
  style.id = "stardance-orbit-shop-style";

style.textContent = `
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
  font-size: 0.92rem !important;
  line-height: 1.5 !important;
}

.shop-item-card__hours {
  color: #475569 !important;
  font-size: 0.9rem !important;
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

.shop-hub__scroll-arrow[data-visible="false"] {
  opacity: 0 !important;
  pointer-events: none !important;
}

.shop-hub__scroll-arrow[data-visible="true"] {
  opacity: 1 !important;
  pointer-events: auto !important;
}

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

  box-shadow:
    0 4px 10px rgba(0,0,0,.08),
    0 12px 28px rgba(0,0,0,.15) !important;
}

.shop-hub__scroll-arrow--left {
  left: 12px !important;
}

.shop-hub__scroll-arrow--right {
  right: 12px !important;
}

.shop-hub__scroll-arrow {
  color: #111827 !important;
}

.shop-hub__scroll-arrow svg {
  stroke: currentColor !important;
  display: block !important;
  width: 22px !important;
  height: 22px !important;
}

.shop-hub__items-grid,
.shop-hub__items-list {
  gap: 20px !important;
}
`;

  document.head.appendChild(style);
}

import { useEffect } from "react";

export default function Overlay() {
  useEffect(() => {
    enhanceShopCards();
  }, []);

  return null;
}