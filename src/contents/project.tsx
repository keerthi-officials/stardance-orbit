function getProjectId(): string | null {
  return window.location.pathname.match(/\/projects\/(\d+)/)?.[1] ?? null;
}

function isDevlogComposer(composer: Element | null): boolean {
  if (!composer) return false;
  const form = composer.querySelector(".feed-composer__form");
  if (!form) return false;

  if (form.querySelector('textarea[name="post_devlog[body]"]')) return true;

  const action = form.getAttribute("action") ?? "";
  if (!action.includes("/devlogs")) return false;

  const projectId = getProjectId();
  return projectId ? action.includes(`/projects/${projectId}/devlogs`) : true;
}


function removeCompleteInfoLink(actionsNav: Element | null): void {
  actionsNav?.querySelector('a.action-btn[href*="complete=true"]')?.remove();
}


function moveShipButton(
  actionsNav: Element | null,
  heroBanner: Element | null,
): void {
  if (!actionsNav || !heroBanner) return;
  if (heroBanner.querySelector("[data-su-hero-ship]")) return;

  const shipBtn = [...actionsNav.querySelectorAll(".action-btn")].find((b) =>
    b.textContent?.includes("Ship your project"),
  ) as HTMLElement | undefined;
  if (!shipBtn) return;

  shipBtn.setAttribute("data-su-hero-ship", "true");
  shipBtn.classList.add("su-hero-ship");

  const banner = heroBanner as HTMLElement;
  if (getComputedStyle(banner).position === "static") {
    banner.style.position = "relative";
  }

  banner.appendChild(shipBtn);
}


export function enhanceProjectPage(): void {
  const projectMain = document.querySelector(".app-layout__main");
  if (!projectMain) return;

  const actionsNav = projectMain.querySelector(".project-show__actions");
  const heroBanner = projectMain.querySelector(".project-show__banner");
  const feedSection = projectMain.querySelector(".project-show__feed");

  if (!heroBanner || !feedSection) return;

  removeCompleteInfoLink(actionsNav);
  moveShipButton(actionsNav, heroBanner);

  actionsNav?.remove();
}
