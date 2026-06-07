import rosePineCSS from "./themes/rose-pine.css?raw";
import catppuccinLatteCSS from "./themes/catppuccin-latte.css?raw";
import darkPlusCSS from "./themes/dark-plus.css?raw";
import pastelCSS from "./themes/pastel.css?raw";
import neonCSS from "./themes/neon.css?raw";
import highContrastCSS from "./themes/high-contrast.css?raw";

export const THEME_STORAGE_KEY = "sd-orbit-theme";
export const CUSTOM_THEME_STORAGE_KEY = "sd-orbit-custom-theme";
export const THEME_STYLE_ID = "sd-orbit-theme-style";

export interface ThemeMeta {
  id: string;
  label: string;
  swatch: [string, string];
  css: string;
  preset?: true;
  light?: true;
}

export interface CustomThemeVars {
  bg: string;
  surface: string;
  accent: string;
  text: string;
  border: string;
  isLight?: boolean;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "default",
    label: "Default",
    swatch: ["#13131f", "#6366f1"],
    css: "",
    preset: true,
  },
  {
    id: "rose-pine",
    label: "Rosé Pine",
    swatch: ["#191724", "#c4a7e7"],
    css: rosePineCSS,
    preset: true,
  },
  {
    id: "catppuccin-latte",
    label: "Catppuccin Latte",
    swatch: ["#eff1f5", "#8839ef"],
    css: catppuccinLatteCSS,
    preset: true,
    light: true,
  },
  {
    id: "dark-plus",
    label: "Dark+",
    swatch: ["#0d0d0d", "#6366f1"],
    css: darkPlusCSS,
    preset: true,
  },
  {
    id: "pastel",
    label: "Pastel",
    swatch: ["#fdf6f0", "#e07a8f"],
    css: pastelCSS,
    preset: true,
    light: true,
  },
  {
    id: "neon",
    label: "Neon",
    swatch: ["#080810", "#00ffcc"],
    css: neonCSS,
    preset: true,
  },
  {
    id: "high-contrast",
    label: "High Contrast",
    swatch: ["#000000", "#ffff00"],
    css: highContrastCSS,
    preset: true,
  },
];

export const CUSTOM_THEME_ID = "custom";

export function buildCustomCSS(vars: CustomThemeVars): string {
  const isDark = !vars.isLight;
  return `
html.sd-orbit-theme-custom {
  color-scheme: ${isDark ? "dark" : "light"};
  --color-bg: ${vars.bg};
  --color-bg-2: ${darken(vars.bg, 0.04)};
  --color-body-text: ${vars.text};
  --color-text-body: ${vars.text};
  --color-text-header: ${vars.text};
  --color-text-muted: ${withAlpha(vars.text, 0.55)};
  --color-space-bg: ${vars.bg};
  --color-space-bg-2: ${darken(vars.bg, 0.04)};
  --color-space-surface: ${vars.surface};
  --color-space-border: ${vars.border};
  --color-space-text: ${vars.text};
  --color-space-text-muted: ${withAlpha(vars.text, 0.55)};
  --color-space-card: ${withAlpha(vars.bg, 0.94)};
  --color-space-accent: ${vars.accent};
  --color-space-accent-soft: ${withAlpha(vars.accent, 0.14)};
  --color-brand-highlight: ${vars.accent};
  --color-brand-highlight-faint: ${withAlpha(vars.accent, 0.08)};
  --color-brand-highlight-soft: ${withAlpha(vars.accent, 0.2)};
  --color-overlay-light: ${withAlpha(vars.text, 0.06)};
  --color-overlay-light-soft: ${withAlpha(vars.text, 0.03)};
  --color-set-1-bg: ${darken(vars.bg, 0.06)};
  --color-set-2-bg: ${vars.bg};
  --color-set-3-bg: ${lighten(vars.bg, 0.03)};
  --color-set-4-bg: ${vars.surface};
  --shadow: 0 0 2px 1px ${withAlpha(isDark ? "#000" : vars.text, 0.2)};
  --sd-surface: ${withAlpha(isDark ? "#fff" : "#000", 0.04)};
  --sd-surface-hover: ${withAlpha(isDark ? "#fff" : "#000", 0.08)};
  --sd-border: ${vars.border};
  --sd-border-hover: ${vars.accent};
  --sd-text: ${vars.text};
  --sd-text-muted: ${withAlpha(vars.text, 0.5)};
  --sd-text-faint: ${withAlpha(vars.text, 0.25)};
  --sd-title: ${vars.text};
  --sd-text-pct: ${vars.accent};
  --sd-fill: ${vars.accent};
}`.trim();
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const n = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16,
  );
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 - amount;
  return rgbToHex(r * f, g * f, b * f);
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

function withAlpha(hex: string, alpha: number): string {
  try {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return hex;
  }
}

export function getThemeById(id: string): ThemeMeta | undefined {
  return THEMES.find((t) => t.id === id);
}

const ALL_THEME_CLASSES = [
  ...THEMES.filter((t) => t.id !== "default").map(
    (t) => `sd-orbit-theme-${t.id}`,
  ),
  "sd-orbit-theme-custom",
];

export function applyTheme(
  themeId: string,
  customCSS?: string,
  isCustomLight?: boolean,
): void {
  const root = document.documentElement;
  root.classList.remove(...ALL_THEME_CLASSES, "sd-orbit-light");

  let style = document.getElementById(
    THEME_STYLE_ID,
  ) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = THEME_STYLE_ID;
    document.head.appendChild(style);
  }

  if (themeId === CUSTOM_THEME_ID && customCSS) {
    root.classList.add("sd-orbit-theme-custom");
    style.textContent = customCSS;
    if (isCustomLight) root.classList.add("sd-orbit-light");
  } else {
    const theme = getThemeById(themeId) ?? THEMES[0];
    if (theme.id !== "default")
      root.classList.add(`sd-orbit-theme-${theme.id}`);
    style.textContent = theme.css;
    if (theme.light) root.classList.add("sd-orbit-light");
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {}
}

export function applyStoredTheme(): void {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.get(
      [THEME_STORAGE_KEY, CUSTOM_THEME_STORAGE_KEY],
      (result) => {
        try {
          const id = result[THEME_STORAGE_KEY] ?? "default";
          if (id === CUSTOM_THEME_ID) {
            const raw = result[CUSTOM_THEME_STORAGE_KEY];
            const vars: CustomThemeVars = raw ? JSON.parse(raw) : {};
            const css = raw ? buildCustomCSS(vars) : "";
            applyTheme(CUSTOM_THEME_ID, css, vars.isLight);
          } else {
            applyTheme(id);
          }
        } catch {
          applyTheme("default");
        }
      },
    );
  }
}