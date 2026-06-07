export const FONT_STORAGE_KEY = "sd-orbit-font";
export const FONT_STYLE_ID = "sd-orbit-font-style";

export interface FontSettings {
  headingFont: string;
  bodyFont: string;
  fontSize: number;
}

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  headingFont: "inherit",
  bodyFont: "inherit",
  fontSize: 1.0,
};

export const FONT_PRESETS: { id: string; label: string; google?: string }[] = [
  { id: "inherit", label: "Site Default" },
  {
    id: "'Inter', sans-serif",
    label: "Inter",
    google: "Inter:wght@400;500;600;700",
  },
  {
    id: "'DM Sans', sans-serif",
    label: "DM Sans",
    google: "DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700",
  },
  {
    id: "'Geist', sans-serif",
    label: "Geist",
    google: "Geist:wght@400;500;600;700",
  },
  {
    id: "'Outfit', sans-serif",
    label: "Outfit",
    google: "Outfit:wght@400;500;600;700",
  },
  {
    id: "'Plus Jakarta Sans', sans-serif",
    label: "Plus Jakarta Sans",
    google: "Plus+Jakarta+Sans:wght@400;500;600;700",
  },
  {
    id: "'Nunito', sans-serif",
    label: "Nunito",
    google: "Nunito:wght@400;500;600;700",
  },
  {
    id: "'Poppins', sans-serif",
    label: "Poppins",
    google: "Poppins:wght@400;500;600;700",
  },
  {
    id: "'Sora', sans-serif",
    label: "Sora",
    google: "Sora:wght@400;500;600;700",
  },
  {
    id: "'Figtree', sans-serif",
    label: "Figtree",
    google: "Figtree:wght@400;500;600;700",
  },
  {
    id: "'Bricolage Grotesque', sans-serif",
    label: "Bricolage Grotesque",
    google: "Bricolage+Grotesque:wght@400;500;600;700",
  },
  {
    id: "'Space Grotesk', sans-serif",
    label: "Space Grotesk",
    google: "Space+Grotesk:wght@400;500;600;700",
  },
  {
    id: "'Manrope', sans-serif",
    label: "Manrope",
    google: "Manrope:wght@400;500;600;700",
  },
  {
    id: "'Lexend', sans-serif",
    label: "Lexend",
    google: "Lexend:wght@400;500;600;700",
  },
  {
    id: "'Raleway', sans-serif",
    label: "Raleway",
    google: "Raleway:wght@400;500;600;700",
  },
  {
    id: "'Rubik', sans-serif",
    label: "Rubik",
    google: "Rubik:wght@400;500;600;700",
  },
  {
    id: "'Work Sans', sans-serif",
    label: "Work Sans",
    google: "Work+Sans:wght@400;500;600;700",
  },
  {
    id: "'Quicksand', sans-serif",
    label: "Quicksand",
    google: "Quicksand:wght@400;500;600;700",
  },
  { id: "Georgia, serif", label: "Georgia" },
  {
    id: "'Merriweather', serif",
    label: "Merriweather",
    google: "Merriweather:wght@400;700",
  },
  { id: "'Lora', serif", label: "Lora", google: "Lora:wght@400;500;600;700" },
  {
    id: "'Playfair Display', serif",
    label: "Playfair Display",
    google: "Playfair+Display:wght@400;500;600;700",
  },
  {
    id: "'DM Serif Display', serif",
    label: "DM Serif Display",
    google: "DM+Serif+Display:ital,wght@0,400;1,400",
  },
  {
    id: "'EB Garamond', serif",
    label: "EB Garamond",
    google: "EB+Garamond:wght@400;500;600;700",
  },
  {
    id: "'Crimson Pro', serif",
    label: "Crimson Pro",
    google: "Crimson+Pro:wght@400;500;600;700",
  },
  {
    id: "'JetBrains Mono', monospace",
    label: "JetBrains Mono",
    google: "JetBrains+Mono:wght@400;500;600",
  },
  {
    id: "'Fira Code', monospace",
    label: "Fira Code",
    google: "Fira+Code:wght@400;500;600",
  },
  {
    id: "'Source Code Pro', monospace",
    label: "Source Code Pro",
    google: "Source+Code+Pro:wght@400;500;600",
  },
  {
    id: "'Cascadia Code', monospace",
    label: "Cascadia Code",
    google: "Cascadia+Code",
  },
  {
    id: "'IBM Plex Mono', monospace",
    label: "IBM Plex Mono",
    google: "IBM+Plex+Mono:wght@400;500;600",
  },
  {
    id: "'Geist Mono', monospace",
    label: "Geist Mono",
    google: "Geist+Mono:wght@400;500;600",
  },
  {
    id: "'Cabin', sans-serif",
    label: "Cabin",
    google: "Cabin:wght@400;500;600;700",
  },
  {
    id: "'Comfortaa', cursive",
    label: "Comfortaa",
    google: "Comfortaa:wght@400;500;600;700",
  },
  {
    id: "'Josefin Sans', sans-serif",
    label: "Josefin Sans",
    google: "Josefin+Sans:wght@400;600;700",
  },
  { id: "'Righteous', cursive", label: "Righteous", google: "Righteous" },
  {
    id: "'Orbitron', sans-serif",
    label: "Orbitron",
    google: "Orbitron:wght@400;500;600;700",
  },
];

const GOOGLE_FONTS_MAP: Record<string, string> = {};
for (const p of FONT_PRESETS) {
  if (p.google) GOOGLE_FONTS_MAP[p.id] = p.google;
}

function loadGoogleFont(fontFamily: string): void {
  const query = GOOGLE_FONTS_MAP[fontFamily];
  if (!query) return;
  const id = `sd-gfont-${query.split(":")[0].replace(/\+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  document.head.appendChild(link);
}

export function applyFontSettings(settings: FontSettings): void {
  loadGoogleFont(settings.headingFont);
  loadGoogleFont(settings.bodyFont);

  let style = document.getElementById(FONT_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = FONT_STYLE_ID;
    document.head.appendChild(style);
  }

  const scale = settings.fontSize;
  const isDefault =
    settings.headingFont === "inherit" &&
    settings.bodyFont === "inherit" &&
    scale === 1.0;

  if (isDefault) {
    style.textContent = "";
    return;
  }

  style.textContent = `
    :root { font-size: ${scale}rem !important; }
    ${
      settings.bodyFont !== "inherit"
        ? `
    body, p, span, div, li, td, input, textarea, button, label {
      font-family: ${settings.bodyFont} !important;
    }`
        : ""
    }
    ${
      settings.headingFont !== "inherit"
        ? `
    h1, h2, h3, h4, h5, h6,
    .feed-post-card__title, .profile-project-card__title,
    .shop-item-card__title, .shop-category__title,
    .sd-title, .sd-proj__title {
      font-family: ${settings.headingFont} !important;
    }`
        : ""
    }
  `.trim();
}

export function applyStoredFontSettings(): void {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    chrome.storage.local.get(FONT_STORAGE_KEY, (result) => {
      try {
        const raw = result[FONT_STORAGE_KEY];
        const settings: FontSettings = raw
          ? { ...DEFAULT_FONT_SETTINGS, ...JSON.parse(raw) }
          : DEFAULT_FONT_SETTINGS;
        applyFontSettings(settings);
      } catch {
        applyFontSettings(DEFAULT_FONT_SETTINGS);
      }
    });
  }
}

export function getStoredFontSettings(): FontSettings {
  return DEFAULT_FONT_SETTINGS;
}
