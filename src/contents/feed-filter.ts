const FILTER_BAR_ID = "sd-feed-filter";
const FILTER_STYLE_ID = "sd-feed-filter-style";
const FILTER_STORAGE_KEY = "sd-feed-filter-active";
const FOLLOWING_CACHE_KEY = "sd-following-cache";
const FOLLOWING_CACHE_TTL = 5 * 60 * 1000;
const FOLLOWING_FEED_ID = "sd-following-feed";
const MINE_FEED_ID = "sd-mine-feed";
const BASE = "https://stardance.hackclub.com";

type FilterTab = "everyone" | "following" | "mine";

let _activeFilter: FilterTab = "everyone";
let _followingFeedBuilt = false;
let _mineFeedBuilt = false;

function getOwnSlug(): string | null {
  const link = document.querySelector<HTMLAnchorElement>(
    '.sidebar__nav-link[data-slug="projects"]',
  );
  const href = link?.getAttribute("href");
  if (!href) return null;
  return href.replace(/\/projects$/, "");
}

async function fetchDoc(path: string): Promise<Document | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Accept: "text/html" },
      credentials: "include",
    });
    if (!res.ok) return null;
    return new DOMParser().parseFromString(await res.text(), "text/html");
  } catch {
    return null;
  }
}

async function fetchFollowingSlugs(): Promise<string[]> {
  try {
    const cached = localStorage.getItem(FOLLOWING_CACHE_KEY);
    if (cached) {
      const { slugs, ts } = JSON.parse(cached);
      if (Date.now() - ts < FOLLOWING_CACHE_TTL) return slugs;
    }
  } catch {}

  const mySlug = getOwnSlug();
  if (!mySlug) return [];

  const doc = await fetchDoc(`${mySlug}/following`);
  if (!doc) return [];

  const slugs: string[] = [];
  doc.querySelectorAll<HTMLAnchorElement>("a[href^='/@']").forEach((a) => {
    const href = a.getAttribute("href")!;
    if (/^\/@[^/]+$/.test(href) && !slugs.includes(href)) {
      slugs.push(href);
    }
  });

  try {
    localStorage.setItem(
      FOLLOWING_CACHE_KEY,
      JSON.stringify({ slugs, ts: Date.now() }),
    );
  } catch {}

  return slugs;
}

interface Card {
  datetime: string;
  outerHTML: string;
}

async function fetchCardsForSlug(slug: string): Promise<Card[]> {
  const doc = await fetchDoc(slug);
  if (!doc) return [];

  const cards: Card[] = [];
  doc
    .querySelectorAll<HTMLElement>(
      "turbo-frame.profile-feed-page .feed-post-card",
    )
    .forEach((el) => {
      const dt =
        el
          .querySelector("time.feed-post-card__time")
          ?.getAttribute("datetime") ?? "";
      if (dt) cards.push({ datetime: dt, outerHTML: el.outerHTML });
    });
  return cards;
}

function injectStyles(): void {
  if (document.getElementById(FILTER_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = FILTER_STYLE_ID;
  style.textContent = `
    #${FILTER_BAR_ID} {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 0 6px;
      margin-bottom: 4px;
    }
    .sd-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 14px;
      font-size: 12.5px;
      font-weight: 500;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      background: transparent;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      transition: color 0.15s, background 0.15s, border-color 0.15s;
      font-family: inherit;
      line-height: 1.6;
      white-space: nowrap;
    }
    .sd-filter-btn:hover {
      color: rgba(255,255,255,0.85);
      background: rgba(255,255,255,0.06);
    }
    .sd-filter-btn--active {
      color: #fff;
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.3);
    }
    .sd-filter-status {
      font-size: 11.5px;
      color: rgba(255,255,255,0.35);
      margin-left: 4px;
      display: none;
      align-items: center;
      gap: 6px;
    }
    .sd-filter-status--on { display: inline-flex; }
    .sd-filter-spinner {
      width: 10px; height: 10px;
      border: 1.5px solid rgba(255,255,255,0.15);
      border-top-color: rgba(255,255,255,0.5);
      border-radius: 50%;
      animation: sd-spin 0.7s linear infinite;
    }
    @keyframes sd-spin { to { transform: rotate(360deg); } }
    #${FOLLOWING_FEED_ID}, #${MINE_FEED_ID} {
      display: none;
      flex-direction: column;
    }
    #${FOLLOWING_FEED_ID}.sd-vfeed--on, #${MINE_FEED_ID}.sd-vfeed--on {
      display: flex;
    }
    .sd-vfeed-empty {
      padding: 48px 20px;
      text-align: center;
      font-size: 14px;
      color: rgba(255,255,255,0.4);
      line-height: 1.6;
    }
    .sd-vfeed-empty strong {
      display: block;
      font-size: 15px;
      margin-bottom: 6px;
      color: rgba(255,255,255,0.7);
    }
    #${FOLLOWING_FEED_ID} .feed-post-card,
    #${MINE_FEED_ID} .feed-post-card {
      margin-bottom: 24px;
    }
  `;
  document.head.appendChild(style);
}

function showStatus(
  statusEl: HTMLElement,
  spinnerEl: HTMLElement,
  text: string,
): void {
  statusEl.classList.add("sd-filter-status--on");
  spinnerEl.style.display = "block";
  (statusEl.childNodes[1] as Text).textContent = " " + text;
}

function hideStatus(statusEl: HTMLElement): void {
  statusEl.classList.remove("sd-filter-status--on");
}

function getRealFeed(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    ".feed-home__frame, turbo-frame.feed-home__feed",
  );
}

async function buildFollowingFeed(
  container: HTMLElement,
  statusEl: HTMLElement,
  spinnerEl: HTMLElement,
): Promise<void> {
  if (_followingFeedBuilt) return;
  _followingFeedBuilt = true;
  container.innerHTML = "";

  showStatus(statusEl, spinnerEl, "Loading who you follow…");
  const slugs = await fetchFollowingSlugs();

  if (slugs.length === 0) {
    hideStatus(statusEl);
    container.innerHTML = `<div class="sd-vfeed-empty"><strong>Not following anyone yet</strong>Follow people on Stardance to see their devlogs here.</div>`;
    return;
  }

  let done = 0;
  showStatus(statusEl, spinnerEl, `Fetching devlogs… (0 / ${slugs.length})`);

  const results = await Promise.all(
    slugs.map(async (slug) => {
      const cards = await fetchCardsForSlug(slug);
      done++;
      showStatus(
        statusEl,
        spinnerEl,
        `Fetching devlogs… (${done} / ${slugs.length})`,
      );
      return cards;
    }),
  );

  hideStatus(statusEl);

  const all: Card[] = results
    .flat()
    .sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
    );

  if (all.length === 0) {
    container.innerHTML = `<div class="sd-vfeed-empty"><strong>Nothing here yet</strong>The people you follow haven't posted any devlogs.</div>`;
    return;
  }

  all.forEach(({ outerHTML }) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = outerHTML;
    const card = wrap.firstElementChild;
    if (card) container.appendChild(card);
  });
}

async function buildMineFeed(
  container: HTMLElement,
  statusEl: HTMLElement,
  spinnerEl: HTMLElement,
): Promise<void> {
  if (_mineFeedBuilt) return;
  _mineFeedBuilt = true;
  container.innerHTML = "";

  const mySlug = getOwnSlug();
  if (!mySlug) {
    container.innerHTML = `<div class="sd-vfeed-empty"><strong>Couldn't detect your profile</strong>Try reloading the page.</div>`;
    return;
  }

  showStatus(statusEl, spinnerEl, "Fetching your devlogs…");
  const cards = await fetchCardsForSlug(mySlug);
  hideStatus(statusEl);

  if (cards.length === 0) {
    container.innerHTML = `<div class="sd-vfeed-empty"><strong>No devlogs found</strong>Couldn't load your devlogs.</div>`;
    return;
  }

  cards.forEach(({ outerHTML }) => {
    const wrap = document.createElement("div");
    wrap.innerHTML = outerHTML;
    const card = wrap.firstElementChild;
    if (card) container.appendChild(card);
  });
}

function applyFilter(
  filter: FilterTab,
  statusEl: HTMLElement,
  spinnerEl: HTMLElement,
  followingContainer: HTMLElement,
  mineContainer: HTMLElement,
): void {
  _activeFilter = filter;
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
  } catch {}

  document
    .getElementById(FILTER_BAR_ID)
    ?.querySelectorAll<HTMLButtonElement>(".sd-filter-btn")
    .forEach((btn) => {
      btn.classList.toggle(
        "sd-filter-btn--active",
        btn.dataset.filter === filter,
      );
    });

  followingContainer.classList.remove("sd-vfeed--on");
  mineContainer.classList.remove("sd-vfeed--on");

  const realFeed = getRealFeed();

  if (filter === "everyone") {
    if (realFeed) realFeed.style.display = "";
    hideStatus(statusEl);
  } else if (filter === "following") {
    if (realFeed) realFeed.style.display = "none";
    followingContainer.classList.add("sd-vfeed--on");
    buildFollowingFeed(followingContainer, statusEl, spinnerEl);
  } else if (filter === "mine") {
    if (realFeed) realFeed.style.display = "none";
    mineContainer.classList.add("sd-vfeed--on");
    buildMineFeed(mineContainer, statusEl, spinnerEl);
  }
}

function injectBar(): void {
  if (!window.location.pathname.startsWith("/home")) return;
  if (document.getElementById(FILTER_BAR_ID)) return;

  const composer = document.querySelector<HTMLElement>(
    ".feed-home > .feed-composer",
  );
  if (!composer) return;

  injectStyles();

  try {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY) as FilterTab | null;
    if (saved) _activeFilter = saved;
  } catch {}

  const statusEl = document.createElement("span");
  statusEl.className = "sd-filter-status";
  const spinnerEl = document.createElement("span");
  spinnerEl.className = "sd-filter-spinner";
  statusEl.appendChild(spinnerEl);
  statusEl.appendChild(document.createTextNode(""));

  const followingContainer = document.createElement("div");
  followingContainer.id = FOLLOWING_FEED_ID;

  const mineContainer = document.createElement("div");
  mineContainer.id = MINE_FEED_ID;

  const bar = document.createElement("div");
  bar.id = FILTER_BAR_ID;

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "everyone", label: "Everyone" },
    { id: "following", label: "Following" },
    { id: "mine", label: "Mine" },
  ];

  tabs.forEach(({ id, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "sd-filter-btn" + (id === _activeFilter ? " sd-filter-btn--active" : "");
    btn.dataset.filter = id;
    btn.textContent = label;
    btn.addEventListener("click", () => {
      applyFilter(id, statusEl, spinnerEl, followingContainer, mineContainer);
    });
    bar.appendChild(btn);
  });

  bar.appendChild(statusEl);
  composer.after(bar);

  const realFeed = getRealFeed() ?? composer.parentElement!;
  realFeed.after(mineContainer);
  realFeed.after(followingContainer);

  if (_activeFilter !== "everyone") {
    applyFilter(
      _activeFilter,
      statusEl,
      spinnerEl,
      followingContainer,
      mineContainer,
    );
  }
}

export function enhanceFeedFilter(): void {
  if (!window.location.pathname.startsWith("/home")) return;
  injectBar();
}
