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

function inlineDevlogComposer(
  projectMain: Element,
  actionsNav: Element | null,
  feedSection: Element | null,
): void {
  if (!feedSection) return;
  if (projectMain.querySelector(".su-inline-composer-shell")) return;

  const postBtn = [...(actionsNav?.querySelectorAll(".action-btn") ?? [])].find(
    (b) => b.textContent?.includes("Post a devlog"),
  );
  const modalMatch = postBtn
    ?.getAttribute("onclick")
    ?.match(/composer-modal-(\d+)/);
  const modalId = modalMatch ? `composer-modal-${modalMatch[1]}` : null;

  const composerDialog =
    (modalId ? document.getElementById(modalId) : null) ??
    [...document.querySelectorAll(".composer-modal")].find((d) =>
      isDevlogComposer(d.querySelector(".feed-composer")),
    ) ??
    null;

  const composerSection =
    composerDialog?.querySelector<Element>(".feed-composer") ??
    [...projectMain.querySelectorAll(".feed-composer")].find(
      isDevlogComposer,
    ) ??
    null;

  if (!composerSection) return;
  if (composerSection.getAttribute("data-su-inline-composer") === "true")
    return;

  composerSection.querySelector(".feed-composer__chips")?.remove();
  composerSection.setAttribute("data-su-inline-composer", "true");
  composerSection.classList.add("su-inline-composer");

  const shell = document.createElement("section");
  shell.className = "sd-shell";

  const header = document.createElement("div");
  header.className = "sd-header";

  const title = document.createElement("h2");
  title.className = "sd-title";
  title.textContent = "Post a devlog";

  header.appendChild(title);
  shell.appendChild(header);
  shell.appendChild(composerSection);

  feedSection.parentNode?.insertBefore(shell, feedSection);

  if (composerDialog) {
    composerDialog.removeAttribute("open");
    composerDialog.setAttribute("hidden", "hidden");
    composerDialog.setAttribute("aria-hidden", "true");
    (composerDialog as HTMLElement).style.display = "none";
    document.body.appendChild(composerDialog);
  }
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
  inlineDevlogComposer(projectMain, actionsNav, feedSection);

  actionsNav?.remove();
}
