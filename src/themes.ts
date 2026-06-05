import rosePineCSS from "./themes/rose-pine.css?raw";
import catppuccinLatteCSS from "./themes/catppucin-latte.css?raw";

export const THEME_STORAGE_KEY = "sd-orbit-theme";
export const THEME_STYLE_ID = "sd-orbit-theme-style";

export interface ThemeMeta {
  id: string;
  label: string;
  swatch: [string, string];
  css: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "default",
    label: "Default",
    swatch: ["#13131f", "#6366f1"],
    css: "",
  },
  {
    id: "rose-pine",
    label: "Rosé Pine",
    swatch: ["#191724", "#c4a7e7"],
    css: rosePineCSS,
  },
  /**{
    id: "catppuccin-latte",
    label: "Catppuccin Latte",
    swatch: ["#eff1f5", "#8839ef"],
    css: catppuccinLatteCSS,
  }, */
];

export function getThemeById(id: string): ThemeMeta {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

const ALL_THEME_CLASSES = THEMES.filter((t) => t.id !== "default").map(
  (t) => `sd-orbit-theme-${t.id}`,
);

export function applyTheme(themeId: string): void {
  const theme = getThemeById(themeId);
  const root = document.documentElement;

  root.classList.remove(...ALL_THEME_CLASSES);
  if (theme.id !== "default") {
    root.classList.add(`sd-orbit-theme-${theme.id}`);
  }

  let style = document.getElementById(
    THEME_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = THEME_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = theme.css;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  } catch {}
}

export function applyStoredTheme(): void {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) ?? "default";
    applyTheme(stored);
  } catch {
    applyTheme("default");
  }
}

export function getStoredThemeId(): string {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) ?? "default";
  } catch {
    return "default";
  }
}
