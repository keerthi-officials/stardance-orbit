interface ProjectSignals {
  hours: number;
  devlogCount: number;
  devlogsWithMedia: number;
  hasDemo: boolean;
  hasGithub: boolean;
}

interface FactorScore {
  label: string;
  score: number;
  weight: number;
  note: string;
}

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

function scrapeProjectSignals(): ProjectSignals | null {
  let hours = 0;
  let devlogCount = 0;

  document.querySelectorAll(".project-show__stats-item").forEach((item) => {
    const num = item.querySelector(".project-show__stats-num");
    const label = item.querySelector(".project-show__stats-label");
    if (!num || !label) return;

    const labelText = label.textContent?.toLowerCase() ?? "";
    const value = parseFloat(num.textContent?.replace(/[^\d.]/g, "") ?? "");
    if (isNaN(value)) return;

    if (labelText.includes("hour")) hours = value;
    if (labelText.includes("devlog")) devlogCount = value;
  });

  let devlogsWithMedia = 0;
  document.querySelectorAll(".feed-post-card").forEach((card) => {
    const hasImg = card.querySelector(".feed-post-card__image") !== null;
    const hasVideo = card.querySelector(".feed-post-card__video") !== null;
    if (hasImg || hasVideo) devlogsWithMedia++;
  });

  let hasDemo = false;
  let hasGithub = false;

  const searchArea =
    document.querySelector(".project-show__panel") ??
    document.querySelector(".project-show__hero");

  searchArea?.querySelectorAll("a[href]").forEach((a) => {
    const href = (a as HTMLAnchorElement).href ?? "";
    if (
      href.includes("stardance.hackclub.com") ||
      href.startsWith("/") ||
      href.startsWith("#")
    )
      return;

    hasDemo = true;
    if (href.includes("github.com")) hasGithub = true;
  });

  if (hours === 0 && devlogCount === 0) return null;

  return { hours, devlogCount, devlogsWithMedia, hasDemo, hasGithub };
}

function scoreSignals(signals: ProjectSignals): FactorScore[] {
  const { devlogCount, devlogsWithMedia, hasDemo, hasGithub } = signals;

  const mediaRatio = devlogCount > 0 ? devlogsWithMedia / devlogCount : 0;
  const devlogScore = Math.min(1, devlogCount / 10);

  let technicalScore = Math.min(
    1,
    0.4 +
      (hasGithub ? 0.3 : 0) +
      (devlogCount >= 5 ? 0.2 : 0) +
      (devlogCount >= 10 ? 0.1 : 0),
  );

  return [
    {
      label: "Storytelling",
      score: devlogScore * 0.5 + mediaRatio * 0.5,
      weight: 0.25,
      note:
        devlogCount === 0
          ? "No devlogs yet — voters can't follow your journey"
          : devlogCount < 3
            ? `${devlogCount} devlog${devlogCount > 1 ? "s" : ""}, most with no media — add images/videos`
            : mediaRatio < 0.5
              ? `${devlogCount} devlogs but only ${devlogsWithMedia} have images/video`
              : `${devlogCount} devlogs, ${devlogsWithMedia} with media — great storytelling`,
    },
    {
      label: "Originality",
      score: 0.8,
      weight: 0.25,
      note: "Estimated at average - voters judge this subjectively",
    },
    {
      label: "Technical depth",
      score: technicalScore,
      weight: 0.25,
      note: !hasGithub
        ? "No public Github link found - link your repo"
        : devlogCount < 3
          ? "Few devlogs showing progress"
          : "Github linked + good devlog trail",
    },
    {
      label: "Usability",
      score: hasDemo ? 0.75 : 0.2,
      weight: 0.25,
      note: hasDemo
        ? "Demo URL detected — voters can try it directly"
        : "No demo URL found — add one so voters can try your project",
    },
  ];
}

function computeProjection(hours: number, factors: FactorScore[]) {
  const weightedScore = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const multiplier = 1 + weightedScore * 29;

  return {
    low: Math.round(hours * Math.max(1, multiplier * 0.5)),
    mid: Math.round(hours * multiplier),
    high: Math.round(hours * Math.min(30, multiplier * 1.5)),
    multiplier: Math.round(multiplier * 10) / 10,
  };
}

function buildProjectionPanel(
  signals: ProjectSignals,
  factors: FactorScore[],
): HTMLElement {
  const { hours } = signals;
  const proj = computeProjection(hours, factors);
  const overallScore = factors.reduce((s, f) => s + f.score * f.weight, 0);
  const overallColor = "#f4ebb9";

  const panel = document.createElement("div");
  panel.id = "sd-projection";
  panel.className = "sd-proj";
  panel.innerHTML = `
    <div class="sd-proj__header">
      <span class="sd-proj__title">
        <img src="https://stardance.hackclub.com/assets/icons/stardust-18e809ef.png" alt="Stardust" class="sd-stardust-icon" />
        Stardust Prediction
      </span>
      <span class="sd-proj__subtitle">${hours}h × ~${proj.multiplier}× multiplier</span>
    </div>
    <div class="sd-proj__estimate">
      <div class="sd-proj__range">
        <span class="sd-proj__range-low">${proj.low.toLocaleString()}</span>
        <span class="sd-proj__range-sep">–</span>
        <span class="sd-proj__range-high">${proj.high.toLocaleString()}</span>
        <img src="https://stardance.hackclub.com/assets/icons/stardust-18e809ef.png" alt="Stardust" class="sd-stardust-icon sd-proj__icon" />
      </div>
      <div class="sd-proj__mid-label">most likely ~<strong>${proj.mid.toLocaleString()}</strong></div>
    </div>
    <div class="sd-proj__overall-bar">
      <div class="sd-proj__overall-track">
        <div class="sd-proj__overall-fill" style="width:${Math.round(overallScore * 100)}%"></div>
      </div>
      <span class="sd-proj__overall-pct">${Math.round(overallScore * 100)}% quality score</span>
    </div>
    <p class="sd-proj__disclaimer">Prediction is an estimate based on observable signals. Actual payout depends on how voters rate your project.</p>
  `;

  return panel;
}

export function enhanceProjectionPanel(): void {
  if (!getProjectId() || document.getElementById("sd-projection")) return;

  const signals = scrapeProjectSignals();
  if (!signals) return;

  const factors = scoreSignals(signals);
  const panel = buildProjectionPanel(signals, factors);

  const projectArticle = document.querySelector("article.project-show");
  const feedSection = document.querySelector(".project-show__feed");
  const anchor = projectArticle ?? feedSection;
  if (!anchor) return;

  anchor.insertAdjacentElement(
    projectArticle ? "afterend" : "beforebegin",
    panel,
  );
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
  enhanceProjectionPanel();

  actionsNav?.remove();
}
