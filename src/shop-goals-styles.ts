export const GOALS_STYLE_ID = "sd-goals-style";

const GOALS_CSS = `
/* Goals panel wrapper */

#sd-goals-panel {
  background: var(--sd-surface) !important;
  border: 1px solid var(--sd-border) !important;
  border-radius: 20px;
  padding: 1.25rem 1.5rem 1.5rem;
  margin-bottom: 2rem;
}

/* Top row: title + tabs */

.sd-goals__toprow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.sd-goals__title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--sd-title) !important;
  letter-spacing: -.02em;
}

/* Actual / Projected tabs */

.sd-goals__tabs {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 3px;
}

.sd-goals__tab {
  padding: 5px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,.5);
  font-size: .8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.sd-goals__tab--active {
  background: white;
  color: #111827;
}

.sd-goals__tab--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}

/* Chip row */

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
  color: var(--sd-text-muted) !important;
  text-transform: uppercase;
}

.sd-goals__chip-value {
  font-size: .95rem;
  font-weight: 700;
  color: var(--sd-text) !important;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Summary progress bar */

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
  background: var(--sd-border) !important;
  overflow: hidden;
}

.sd-goals__summary--projected .sd-goals__summary-track {
  background: rgba(99,102,241,.15);
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

/* Projected loader */

.sd-goals__proj-loader {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .8rem;
  color: rgba(255,255,255,.5);
  margin-bottom: .75rem;
}

@keyframes sd-loader-pulse {
  0%, 100% { opacity: .3; transform: scale(.8); }
  50%       { opacity: 1;  transform: scale(1.1); }
}

.sd-goals__proj-loader-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #818cf8;
  animation: sd-loader-pulse 1s ease-in-out infinite;
}

/* Cumulative / Individual toggle */

.sd-goals__cumtabs-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.sd-goals__cumtabs {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,.08);
  border-radius: 10px;
  padding: 3px;
}

.sd-goals__cumtab {
  padding: 5px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,.5);
  font-size: .8rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease, color .15s ease;
}

.sd-goals__cumtab--active {
  background: white;
  color: #111827;
}

/* Accordion */

.sd-goals__accordion {
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 14px;
  overflow: hidden;
}

.sd-goals__accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  background: rgba(255,255,255,.05);
  border: none;
  color: var(--sd-text) !important;
  font-size: .95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s ease;
  letter-spacing: -.01em;
}

.sd-goals__accordion-header:hover {
  background: rgba(255,255,255,.09);
}

.sd-goals__accordion-arrow {
  font-size: .7rem;
  opacity: .6;
}

.sd-goals__accordion-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s cubic-bezier(0.4, 0, 0.2, 1), padding .3s ease;
  padding: 0 .75rem;
}

.sd-goals__accordion--open .sd-goals__accordion-body {
  max-height: 2000px;
  padding: .75rem;
}

/* Items grid */

.sd-goals__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: .75rem;
}

.sd-goals__accordion .sd-goals__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: .75rem;
}

.sd-goals__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .75rem;
  border-radius: 14px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  transition: border-color .2s ease, background .2s ease;
  cursor: default;
}

.sd-goals__item:hover {
  border-color: rgba(255,255,255,.18);
  background: rgba(255,255,255,.08);
}

/* Drag handle */

.sd-goals__drag-handle {
  display: flex;
  align-items: center;
  padding: 0 2px;
  cursor: grab;
  color: var(--sd-text, #fff);
  flex-shrink: 0;
  opacity: 0.5;
  transition: opacity .15s;
}

.sd-goals__drag-handle:hover {
  opacity: 1;
}

.sd-goals__drag-handle:active {
  cursor: grabbing;
}

.sd-goals__item--dragging {
  opacity: 0.35;
}

.sd-goals__item--over {
  outline: 1px dashed rgba(255,255,255,0.3);
  background: rgba(255,255,255,.06) !important;
}

/* Quantity counter */

.sd-goals__qty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.sd-goals__qty-btn {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background .1s;
  flex-shrink: 0;
}

.sd-goals__qty-btn:hover {
  background: rgba(255,255,255,0.14);
}

.sd-goals__qty-badge {
  font-size: 10px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgba(255,255,255,0.45);
  min-width: 18px;
  text-align: center;
  line-height: 1;
}

/* Item image */

.sd-goals__img {
  width: 48px;
  height: 48px;
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
  color: var(--sd-text) !important;
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
  background: var(--sd-border) !important;
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

.sd-goals__item-status--projected {
  font-style: italic;
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

/* Responsive */

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
`;

export function injectGoalsStyles(): void {
  if (document.getElementById(GOALS_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = GOALS_STYLE_ID;
  style.textContent = GOALS_CSS;
  document.head.appendChild(style);
}
