export function navigateTo(href: string): void {
  const turbo = (window as any).Turbo;
  if (turbo?.visit) {
    turbo.visit(href);
  } else {
    window.location.href = href;
  }
}

export function getOwnUsername(): string | null {
  const link = document.querySelector<HTMLAnchorElement>(
    'a[data-slug="projects"][href*="/projects"]',
  );
  if (link) {
    const m = link.getAttribute("href")?.match(/^\/@([^/]+)/);
    if (m) return m[1];
  }
  const avatarLink = document.querySelector<HTMLAnchorElement>(
    '.sidebar__nav-link[href^="/@"]',
  );
  if (avatarLink) {
    const m = avatarLink.getAttribute("href")?.match(/^\/@([^/]+)/);
    if (m) return m[1];
  }
  return null;
}

export function getOwnAvatarSrc(): string | null {
  return (
    document.querySelector<HTMLImageElement>(
      'a[data-slug="projects"] .sidebar__nav-avatar',
    )?.src ?? null
  );
}

export interface OwnProject {
  title: string;
  href: string;
  devlogs: number;
  hours: number;
  description: string;
}

let _projectCache: OwnProject[] | null = null;
let _projectFetchPromise: Promise<OwnProject[]> | null = null;

function scrapeProjectsFromDoc(doc: Document): OwnProject[] {
  const projects: OwnProject[] = [];
  doc
    .querySelectorAll<HTMLAnchorElement>("a.profile-project-card")
    .forEach((card) => {
      const href = card.getAttribute("href") ?? "";
      if (href === "/projects/new") return;

      const title =
        card
          .querySelector(".profile-project-card__title")
          ?.textContent?.trim() ?? "";
      const description =
        card
          .querySelector(".profile-project-card__description")
          ?.textContent?.trim() ?? "";

      let hours = 0;
      let devlogs = 0;
      card
        .querySelectorAll(".profile-project-card__meta-item")
        .forEach((item) => {
          const text = item.textContent?.trim() ?? "";
          const numMatch = text.match(/^(\d+(?:\.\d+)?)/);
          const val = numMatch ? parseFloat(numMatch[1]) : 0;
          if (
            item.classList.contains("profile-project-card__meta-item--time")
          ) {
            hours = val;
          } else {
            devlogs = val;
          }
        });

      projects.push({ title, href, devlogs, hours, description });
    });
  return projects;
}

export async function fetchOwnProjects(): Promise<OwnProject[]> {
  if (_projectCache) return _projectCache;
  if (_projectFetchPromise) return _projectFetchPromise;

  _projectFetchPromise = (async () => {
    const link = document.querySelector<HTMLAnchorElement>(
      '.sidebar__nav-link[data-slug="projects"]',
    );
    const profileUrl = link?.getAttribute("href");
    if (!profileUrl) return [];
    try {
      const res = await fetch(profileUrl, { headers: { Accept: "text/html" } });
      if (!res.ok) return [];
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const projects = scrapeProjectsFromDoc(doc);
      _projectCache = projects;
      return projects;
    } catch {
      return [];
    }
  })();

  return _projectFetchPromise;
}

export function prefetchProjects(): void {
  setTimeout(() => fetchOwnProjects(), 1200);
}

export interface PageShortcut {
  label: string;
  icon: string;
  href: string;
  subtitle: string;
  altKey: string;
}

export const PAGE_SHORTCUTS: PageShortcut[] = [
  {
    label: "Home",
    icon: "🏠",
    href: "/home",
    subtitle: "Your feed",
    altKey: "h",
  },
  {
    label: "Rate",
    icon: "⭐",
    href: "/rate/new",
    subtitle: "Rate projects",
    altKey: "v",
  },
  {
    label: "Missions",
    icon: "🎯",
    href: "/missions",
    subtitle: "Complete missions",
    altKey: "m",
  },
  {
    label: "Shop",
    icon: "🛒",
    href: "/shop",
    subtitle: "Spend stardust",
    altKey: "d",
  },
  {
    label: "Resources",
    icon: "📚",
    href: "/guides",
    subtitle: "Guides & links",
    altKey: "e",
  },
];
