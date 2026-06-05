import { injectGoalsStyles } from "~/shop-goals-styles";

const GOALS_PANEL_ID = "sd-goals-panel";
const ACCORDION_KEY = "sd_goals_accordion";
const GOALS_TAB_KEY = "sd_goals_tab";
const GOALS_MODE_KEY = "sd_goals_cummode";
const PROJ_CACHE_KEY = "sd_projected_balance";
const PROJ_CACHE_TTL = 5 * 60 * 1000;
const STARDUST_PER_HOUR = 10;

const STARDUST_ICON = `<img src="https://stardance.hackclub.com/assets/icons/stardust-18e809ef.png" alt="Stardust" class="sd-stardust-icon" />`;

type GoalsTab = "actual" | "projected";
type GoalsMode = "cumulative" | "individual";

export interface WishlistItem {
  name: string;
  href: string;
  imgSrc: string;
  imgAlt: string;
  price: number;
  needed: number;
  removeFormHtml: string;
}

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

function formatHours(stardust: number): string {
  return `${(stardust / STARDUST_PER_HOUR).toFixed(1)}h`;
}

function getProgressColor(balance: number, price: number): string {
  if (balance >= price) return "#48bb78";
  if (balance >= price * 0.8) return "#ed8936";
  return "#fc5c65";
}

function parseStardustNumber(text: string | null | undefined): number | null {
  if (!text) return null;
  const raw = text.replace(/[^\d.]/g, "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function getUserStardust(): number | null {
  const el = document.querySelector(".sidebar__user-balance-amount");
  if (!el) return null;
  const raw = el.textContent?.replace(/[^\d.]/g, "").trim();
  if (!raw) return null;
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

function scoreSignals(signals: ProjectSignals): FactorScore[] {
  const { devlogCount, devlogsWithMedia, hasDemo, hasGithub } = signals;
  const mediaRatio = devlogCount > 0 ? devlogsWithMedia / devlogCount : 0;
  const devlogScore = Math.min(1, devlogCount / 10);
  const technicalScore = Math.min(
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
          ? "No devlogs yet"
          : devlogCount < 3
            ? `${devlogCount} devlog(s), add images/videos`
            : `${devlogCount} devlogs, ${devlogsWithMedia} with media`,
    },
    {
      label: "Originality",
      score: 0.8,
      weight: 0.25,
      note: "Estimated at average",
    },
    {
      label: "Technical depth",
      score: technicalScore,
      weight: 0.25,
      note: !hasGithub ? "No public Github link found" : "Github linked",
    },
    {
      label: "Usability",
      score: hasDemo ? 0.75 : 0.2,
      weight: 0.25,
      note: hasDemo ? "Demo URL detected" : "No demo URL found",
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

function scrapeProjectSignalsFromDoc(doc: Document): ProjectSignals | null {
  let hours = 0;
  let devlogCount = 0;

  doc.querySelectorAll(".project-show__stats-item").forEach((item) => {
    const num = item.querySelector(".project-show__stats-num");
    const label = item.querySelector(".project-show__stats-label");
    if (!num || !label) return;
    const labelText = label.textContent?.toLowerCase() ?? "";
    const value = parseFloat(num.textContent?.replace(/[^\d.]/g, "") ?? "");
    if (isNaN(value)) return;
    if (labelText.includes("hour")) hours = value;
    if (labelText.includes("devlog")) devlogCount = value;
  });

  if (hours === 0) {
    doc
      .querySelectorAll(".profile-project-card__meta-item--time span")
      .forEach((el) => {
        const v = parseFloat(el.textContent?.replace(/[^\d.]/g, "") ?? "");
        if (!isNaN(v) && v > 0) hours = v;
      });
  }

  let devlogsWithMedia = 0;
  doc.querySelectorAll(".feed-post-card").forEach((card) => {
    if (
      card.querySelector(".feed-post-card__image") ||
      card.querySelector(".feed-post-card__video")
    )
      devlogsWithMedia++;
  });

  let hasDemo = false;
  let hasGithub = false;
  const searchArea =
    doc.querySelector(".project-show__panel") ??
    doc.querySelector(".project-show__hero");

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

function getProfileProjectsUrl(): string | null {
  const link = document.querySelector<HTMLAnchorElement>(
    '.sidebar__nav-link[data-slug="projects"]',
  );
  return link?.getAttribute("href") ?? null;
}

async function fetchProjectMids(): Promise<number> {
  try {
    const cached = localStorage.getItem(PROJ_CACHE_KEY);
    if (cached) {
      const { value, ts } = JSON.parse(cached);
      if (Date.now() - ts < PROJ_CACHE_TTL) return value;
    }
  } catch {}

  const profileUrl = getProfileProjectsUrl();
  if (!profileUrl) return 0;

  try {
    const profileRes = await fetch(profileUrl);
    const profileHtml = await profileRes.text();
    const profileDoc = new DOMParser().parseFromString(
      profileHtml,
      "text/html",
    );

    const projectLinks = [
      ...profileDoc.querySelectorAll<HTMLAnchorElement>(
        ".profile-project-card[href]",
      ),
    ]
      .map((a) => a.getAttribute("href"))
      .filter(
        (href): href is string =>
          !!href && /\/projects\/\d+/.test(href) && !href.includes("/new"),
      );

    const mids = await Promise.all(
      projectLinks.map(async (href) => {
        try {
          const res = await fetch(href);
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const signals = scrapeProjectSignalsFromDoc(doc);
          if (!signals || signals.hours === 0) return 0;
          const factors = scoreSignals(signals);
          return computeProjection(signals.hours, factors).mid;
        } catch {
          return 0;
        }
      }),
    );

    const total = mids.reduce((s, v) => s + v, 0);
    localStorage.setItem(
      PROJ_CACHE_KEY,
      JSON.stringify({ value: total, ts: Date.now() }),
    );
    return total;
  } catch {
    return 0;
  }
}

function renderMiniBar(
  fill: HTMLElement,
  pct: number,
  color: string,
  isProjected: boolean,
): void {
  fill.style.width = `${pct}%`;
  fill.style.background = isProjected
    ? `linear-gradient(90deg, ${color}, #818cf8)`
    : color;
  fill.style.opacity = isProjected ? "0.85" : "1";
}

function buildGoalItem(
  item: WishlistItem,
  balance: number,
  isProjected: boolean,
): HTMLElement {
  const pct = Math.min(100, item.price > 0 ? (balance / item.price) * 100 : 0);
  const color = getProgressColor(balance, item.price);
  const needed = Math.max(0, item.price - balance);

  const el = document.createElement("div");
  el.className = "sd-goals__item";

  if (item.removeFormHtml) {
    const formWrap = document.createElement("div");
    formWrap.className = "sd-goals__remove-wrap";
    formWrap.innerHTML = item.removeFormHtml;
    const btn = formWrap.querySelector<HTMLButtonElement>(
      ".shop-goals__remove",
    );
    if (btn) btn.className = "sd-goals__remove";
    el.appendChild(formWrap);
  }

  const img = document.createElement("img");
  img.src = item.imgSrc;
  img.alt = item.imgAlt;
  img.className = "sd-goals__img";

  const info = document.createElement("div");
  info.className = "sd-goals__info";

  const name = document.createElement("a");
  name.href = item.href;
  name.className = "sd-goals__name";
  name.textContent = item.name;

  const miniTrack = document.createElement("div");
  miniTrack.className = "sd-goals__mini-track";

  const miniFill = document.createElement("div");
  miniFill.className = "sd-goals__mini-fill";
  renderMiniBar(miniFill, pct, color, isProjected);
  miniTrack.appendChild(miniFill);

  const status = document.createElement("span");
  status.className =
    "sd-goals__item-status" +
    (isProjected ? " sd-goals__item-status--projected" : "");

  if (needed <= 0) {
    status.textContent = "✓ You can afford this!";
    status.style.color = "#48bb78";
  } else {
    status.innerHTML = `Need <strong>${STARDUST_ICON} ${needed.toLocaleString()}</strong> more · ${formatHours(needed)}`;
    status.style.color = color;
  }

  info.appendChild(name);
  info.appendChild(miniTrack);
  info.appendChild(status);
  el.appendChild(img);
  el.appendChild(info);

  return el;
}

function buildSummaryBar(
  balance: number,
  totalCost: number,
  isProjected: boolean,
  itemCount: number,
): HTMLElement {
  const pct = Math.min(100, totalCost > 0 ? (balance / totalCost) * 100 : 0);
  const color = isProjected ? "#818cf8" : getProgressColor(balance, totalCost);
  const canAffordAll = balance >= totalCost;
  const needed = Math.max(0, totalCost - balance);

  const wrap = document.createElement("div");
  wrap.className =
    "sd-goals__summary" + (isProjected ? " sd-goals__summary--projected" : "");

  const chips = document.createElement("div");
  chips.className = "sd-goals__chips";

  const makeChip = (label: string, value: string, accent?: string) => {
    const chip = document.createElement("div");
    chip.className = "sd-goals__chip";
    if (accent) chip.style.borderColor = accent;
    chip.innerHTML = `<span class="sd-goals__chip-label">${label}</span><span class="sd-goals__chip-value" style="${accent ? `color:${accent}` : ""}">${value}</span>`;
    return chip;
  };

  chips.appendChild(makeChip("GOALS", `${itemCount}`));
  chips.appendChild(
    makeChip(
      isProjected ? "PROJECTED" : "BALANCE",
      `${STARDUST_ICON} ${balance.toLocaleString()}`,
    ),
  );
  chips.appendChild(
    makeChip(
      "REMAINING",
      canAffordAll
        ? "All covered!"
        : `${STARDUST_ICON} ${needed.toLocaleString()}`,
      canAffordAll ? "#48bb78" : isProjected ? "#818cf8" : "#fc5c65",
    ),
  );
  chips.appendChild(
    makeChip(
      "TIME EST.",
      canAffordAll ? "—" : `~${formatHours(needed)}`,
      "#48bb78",
    ),
  );

  const trackWrap = document.createElement("div");
  trackWrap.className = "sd-goals__summary-track-wrap";

  const track = document.createElement("div");
  track.className = "sd-goals__summary-track";

  const fill = document.createElement("div");
  fill.className = "sd-goals__summary-fill";
  fill.style.width = `${pct}%`;
  fill.style.background = isProjected
    ? "linear-gradient(90deg, #6366f1, #818cf8)"
    : color;

  const pctLabel = document.createElement("span");
  pctLabel.className = "sd-goals__summary-pct";
  pctLabel.textContent = `${Math.round(pct)}%`;

  track.appendChild(fill);
  trackWrap.appendChild(track);
  trackWrap.appendChild(pctLabel);
  wrap.appendChild(chips);
  wrap.appendChild(trackWrap);

  return wrap;
}

function buildAccordion(
  items: WishlistItem[],
  balance: number,
  mode: GoalsMode,
  isProjected: boolean,
): HTMLElement {
  const saved = localStorage.getItem(ACCORDION_KEY);
  const isOpen = saved === null ? true : saved === "open";

  const wrap = document.createElement("div");
  wrap.className =
    "sd-goals__accordion" + (isOpen ? " sd-goals__accordion--open" : "");

  const header = document.createElement("button");
  header.className = "sd-goals__accordion-header";
  header.innerHTML = `<span>Goal Items</span><span class="sd-goals__accordion-arrow">${isOpen ? "▲" : "▼"}</span>`;

  const body = document.createElement("div");
  body.className = "sd-goals__accordion-body";

  function renderGrid(bal: number, m: GoalsMode, proj: boolean) {
    body.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "sd-goals__grid";

    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "sd-goals__empty";
      empty.textContent =
        "No wishlist items yet. Star items in the shop to add them here.";
      grid.appendChild(empty);
    } else {
      const sorted = [...items].sort((a, b) => b.price - a.price);

      if (m === "cumulative") {
        let remaining = bal;
        sorted.forEach((item) => {
          const itemBal = Math.min(remaining, item.price);
          grid.appendChild(buildGoalItem(item, itemBal, proj));
          remaining = Math.max(0, remaining - item.price);
        });
      } else {
        sorted.forEach((item) => {
          grid.appendChild(buildGoalItem(item, bal, proj));
        });
      }
    }

    body.appendChild(grid);
  }

  (wrap as any)._rerender = renderGrid;
  renderGrid(balance, mode, isProjected);

  header.addEventListener("click", () => {
    const opening = !wrap.classList.contains("sd-goals__accordion--open");
    wrap.classList.toggle("sd-goals__accordion--open", opening);
    wrap.querySelector(".sd-goals__accordion-arrow")!.textContent = opening
      ? "▲"
      : "▼";
    localStorage.setItem(ACCORDION_KEY, opening ? "open" : "closed");
  });

  wrap.appendChild(header);
  wrap.appendChild(body);
  return wrap;
}

function buildTabBar(onSwitch: (tab: GoalsTab) => void): HTMLElement {
  const saved = "actual" as GoalsTab;

  const wrap = document.createElement("div");
  wrap.className = "sd-goals__tabs";

  (["actual", "projected"] as GoalsTab[]).forEach((t) => {
    const btn = document.createElement("button");
    btn.className =
      "sd-goals__tab" + (saved === t ? " sd-goals__tab--active" : "");
    btn.dataset.tab = t;
    btn.textContent = t.charAt(0).toUpperCase() + t.slice(1);

    btn.addEventListener("click", () => {
      wrap
        .querySelectorAll(".sd-goals__tab")
        .forEach((b) => b.classList.remove("sd-goals__tab--active"));
      btn.classList.add("sd-goals__tab--active");
      localStorage.setItem(GOALS_TAB_KEY, t);
      onSwitch(t);
    });

    wrap.appendChild(btn);
  });

  return wrap;
}

function buildCumulativeToggle(
  onSwitch: (mode: GoalsMode) => void,
): HTMLElement {
  const saved = (localStorage.getItem(GOALS_MODE_KEY) ??
    "cumulative") as GoalsMode;

  const wrap = document.createElement("div");
  wrap.className = "sd-goals__cumtabs";

  (["cumulative", "individual"] as GoalsMode[]).forEach((mode) => {
    const btn = document.createElement("button");
    btn.className =
      "sd-goals__cumtab" + (saved === mode ? " sd-goals__cumtab--active" : "");
    btn.dataset.mode = mode;
    btn.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);

    btn.addEventListener("click", () => {
      wrap
        .querySelectorAll(".sd-goals__cumtab")
        .forEach((b) => b.classList.remove("sd-goals__cumtab--active"));
      btn.classList.add("sd-goals__cumtab--active");
      localStorage.setItem(GOALS_MODE_KEY, mode);
      onSwitch(mode);
    });

    wrap.appendChild(btn);
  });

  return wrap;
}

function buildGoalsPanel(balance: number, items: WishlistItem[]): HTMLElement {
  const totalCost = items.reduce((sum, i) => sum + i.price, 0);

  let currentTab = "actual" as GoalsTab;
  let currentMode = (localStorage.getItem(GOALS_MODE_KEY) ??
    "cumulative") as GoalsMode;
  let projectedBalance: number | null = null;
  let isLoadingProjected = false;

  const panel = document.createElement("div");
  panel.id = GOALS_PANEL_ID;
  panel.className = "sd-goals";

  const topRow = document.createElement("div");
  topRow.className = "sd-goals__toprow";
  topRow.innerHTML = `<span class="sd-goals__title">⭐ My Goal Items</span>`;

  const summaryWrap = document.createElement("div");
  summaryWrap.appendChild(
    buildSummaryBar(balance, totalCost, false, items.length),
  );

  const projLoader = document.createElement("div");
  projLoader.className = "sd-goals__proj-loader";
  projLoader.style.display = "none";
  projLoader.innerHTML = `<span class="sd-goals__proj-loader-dot"></span> Fetching project data…`;

  const accordion = buildAccordion(items, balance, currentMode, false);
  const rerender = (accordion as any)._rerender as (
    bal: number,
    mode: GoalsMode,
    proj: boolean,
  ) => void;

  function switchTab(tab: GoalsTab) {
    currentTab = tab;
    const isProj = tab === "projected";

    if (isProj) {
      if (projectedBalance !== null) {
        summaryWrap.innerHTML = "";
        summaryWrap.appendChild(
          buildSummaryBar(projectedBalance, totalCost, true, items.length),
        );
        rerender(projectedBalance, currentMode, true);
      } else if (!isLoadingProjected) {
        isLoadingProjected = true;
        projLoader.style.display = "flex";
        fetchProjectMids().then((bonus) => {
          projectedBalance = balance + bonus;
          projLoader.style.display = "none";
          isLoadingProjected = false;
          summaryWrap.innerHTML = "";
          summaryWrap.appendChild(
            buildSummaryBar(projectedBalance, totalCost, true, items.length),
          );
          rerender(projectedBalance, currentMode, true);
        });
      }
    } else {
      summaryWrap.innerHTML = "";
      summaryWrap.appendChild(
        buildSummaryBar(balance, totalCost, false, items.length),
      );
      rerender(balance, currentMode, false);
    }
  }

  function switchMode(mode: GoalsMode) {
    currentMode = mode;
    const isProj = currentTab === "projected";
    const bal =
      isProj && projectedBalance !== null ? projectedBalance : balance;
    rerender(bal, mode, isProj);
  }

  const tabs = buildTabBar(switchTab);
  topRow.appendChild(tabs);

  const cumWrap = document.createElement("div");
  cumWrap.className = "sd-goals__cumtabs-wrap";
  cumWrap.appendChild(buildCumulativeToggle(switchMode));

  panel.appendChild(topRow);
  panel.appendChild(summaryWrap);
  panel.appendChild(projLoader);
  panel.appendChild(cumWrap);
  panel.appendChild(accordion);

  return panel;
}

export function parseWishlistItems(balance: number): WishlistItem[] {
  const items: WishlistItem[] = [];

  document.querySelectorAll(".shop-goals__item").forEach((item) => {
    const link = item.querySelector<HTMLAnchorElement>(".shop-goals__link");
    const img = item.querySelector<HTMLImageElement>(".shop-goals__image");
    const nameEl = item.querySelector(".shop-goals__name");
    const textEl = item.querySelector(".shop-goals__progress-text");
    const form = item.querySelector("form");

    if (!link || !img || !nameEl || !textEl) return;

    const neededNum = parseStardustNumber(textEl.textContent);
    if (neededNum === null) return;

    items.push({
      name: nameEl.textContent?.trim() ?? "",
      href: link.getAttribute("href") ?? "#",
      imgSrc: img.src,
      imgAlt: img.alt,
      price: balance + neededNum,
      needed: neededNum,
      removeFormHtml: form?.outerHTML ?? "",
    });
  });

  return items;
}

export function enhanceGoalsPanel(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  const container = document.querySelector<HTMLElement>(
    ".shop-goals__container",
  );
  if (!container) return;

  if (document.getElementById(GOALS_PANEL_ID)) return;

  injectGoalsStyles();

  const balance = getUserStardust();
  if (balance === null) {
    waitForBalanceForGoals();
    return;
  }

  const items = parseWishlistItems(balance);
  const panel = buildGoalsPanel(balance, items);
  container.replaceWith(panel);

  enhanceGoalsRemoveButtons()
}

export function enhanceGoalsRemoveButtons(): void {
  if (!window.location.pathname.startsWith("/shop")) return;

  document
    .querySelectorAll<HTMLElement>(".sd-goals__remove-wrap form")
    .forEach((form) => {
      if (form.dataset.sdPatched) return;
      form.dataset.sdPatched = "1";

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const action = form.getAttribute("action") ?? "";
        const token =
          (form.querySelector("[name=authenticity_token]") as HTMLInputElement)
            ?.value ?? "";
        const method =
          (form.querySelector("[name=_method]") as HTMLInputElement)?.value ??
          "post";

        const goalItem = form.closest(".sd-goals__item");
        const itemHref =
          goalItem
            ?.querySelector<HTMLAnchorElement>(".sd-goals__name")
            ?.getAttribute("href") ?? "";
        const itemId = itemHref.split("/").pop();

        await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            _method: method,
            authenticity_token: token,
          }),
        });

        if (itemId) {
          localStorage.setItem(`sd_wishlist_${itemId}`, "false");
        }

        window.location.reload();
      });
    });
}

function waitForBalanceForGoals(): void {
  let settled = false;

  const observer = new MutationObserver(() => {
    if (settled) return;
    const balance = getUserStardust();
    if (balance === null) return;
    settled = true;
    observer.disconnect();
    enhanceGoalsPanel();
  });

  observer.observe(
    document.querySelector(".sidebar__user-balance-amount") ?? document.body,
    {
      characterData: true,
      childList: true,
      subtree: true,
    },
  );

  setTimeout(() => {
    if (!settled) observer.disconnect();
  }, 10_000);
}
