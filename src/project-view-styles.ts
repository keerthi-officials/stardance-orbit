export const TOOLBAR_ID = "sd-proj-toolbar";
export const SORT_ID = "sd-proj-sort-select";

export const PROJECT_VIEW_CSS = `
  #${TOOLBAR_ID} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
  }

  #${TOOLBAR_ID} .sd-toolbar-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  #${TOOLBAR_ID} .sd-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 8px;
    border: 1px solid var(--sd-border);
    background: var(--sd-surface);
    color: var(--sd-text-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    line-height: 1;
    white-space: nowrap;
    font-family: inherit;
  }

  #${TOOLBAR_ID} .sd-pill:hover,
  #${TOOLBAR_ID} .sd-pill.active {
    background: var(--sd-surface-hover);
    color: var(--sd-text);
    border-color: var(--sd-border-hover);
  }

  .sd-sort-wrap {
    position: relative;
  }

  #${SORT_ID} {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    font-size: 12px;
    z-index: 2;
  }

  .sd-sort-face {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 8px;
    border: 1px solid var(--sd-border);
    background: var(--sd-surface);
    color: var(--sd-text-muted);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    user-select: none;
  }

  .sd-sort-wrap:hover .sd-sort-face,
  .sd-sort-wrap:focus-within .sd-sort-face {
    background: var(--sd-surface-hover);
    color: var(--sd-text);
    border-color: var(--sd-border-hover);
  }

  .project-list.sd-list-view {
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
  }

  .project-list.sd-list-view .project-list__item {
    width: 100% !important;
  }

  .project-list.sd-list-view .profile-project-card {
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 10px 14px !important;
    border-radius: 12px !important;
    background: var(--sd-surface);
    border: 1px solid var(--sd-border);
    text-decoration: none !important;
    transition: background 0.15s, border-color 0.15s;
  }

  .project-list.sd-list-view .profile-project-card:hover {
    background: var(--sd-surface-hover);
    border-color: var(--sd-border-hover);
  }

  .project-list.sd-list-view .profile-project-card__banner {
    width: 44px !important;
    height: 44px !important;
    min-width: 44px !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
  }

  .project-list.sd-list-view .profile-project-card__banner-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  .project-list.sd-list-view .profile-project-card__body {
    flex: 1 !important;
    min-width: 0 !important;
    padding: 0 !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
  }

  .project-list.sd-list-view .profile-project-card__header {
    flex: 1 !important;
    min-width: 0 !important;
  }

  .project-list.sd-list-view .profile-project-card__title {
    font-size: 14px !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    margin: 0 !important;
    color: var(--sd-title);
    font-weight: 600;
  }

  .project-list.sd-list-view .profile-project-card__description {
    display: none !important;
  }

  .project-list.sd-list-view .profile-project-card__meta {
    display: flex !important;
    flex-direction: row !important;
    gap: 10px !important;
    margin: 2px 0 0 !important;
    padding: 0 !important;
  }

  .project-list.sd-list-view .profile-project-card__meta-item {
    display: flex !important;
    align-items: center !important;
    gap: 4px !important;
    font-size: 11px !important;
    color: var(--sd-text-muted);
  }

  .project-list.sd-list-view .profile-project-card__meta-icon {
    width: 11px !important;
    height: 11px !important;
  }

  .project-list.sd-list-view .profile-project-card__footer {
    flex-shrink: 0 !important;
  }

  .project-list.sd-list-view .profile-project-card__updated {
    font-size: 11px !important;
    color: var(--sd-text-muted);
    white-space: nowrap !important;
    margin: 0 !important;
  }
`;
