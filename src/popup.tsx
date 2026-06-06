import { useEffect, useState } from "react";
import "~/style.css";
import {
  THEMES,
  CUSTOM_THEME_ID,
  THEME_STORAGE_KEY,
  CUSTOM_THEME_STORAGE_KEY,
  buildCustomCSS,
  type ThemeMeta,
  type CustomThemeVars,
} from "~themes";
import { COLLAPSE_STORAGE_KEY } from "~contents/collapse-devlogs";
import { PROJECT_VIEW_STORAGE_KEY } from "~contents/project-view";
import {
  FONT_STORAGE_KEY,
  DEFAULT_FONT_SETTINGS,
  type FontSettings,
} from "~/font-customizer";
import { FontSelect } from "~components/font-select";
import { FeatureRow } from "~components/feature-row";

const STARDANCE_URL = "https://stardance.hackclub.com";

const DEFAULT_CUSTOM: CustomThemeVars = {
  bg: "#1a1a2e",
  surface: "#222240",
  accent: "#7c6af7",
  text: "#e8e8f0",
  border: "rgba(255,255,255,0.12)",
};

const COLOR_FIELDS: { key: keyof CustomThemeVars; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "accent", label: "Accent" },
  { key: "text", label: "Text" },
  { key: "border", label: "Border" },
];

function Popup() {
  const [isOnStardance, setIsOnStardance] = useState(false);

  const [collapseDevlogs, setCollapseDevlogs] = useState(false);
  const [projectListView, setProjectListView] = useState(false);

  const [activeTheme, setActiveTheme] = useState("rose-pine");
  const [customVars, setCustomVars] = useState<CustomThemeVars>(DEFAULT_CUSTOM);

  const [fontSettings, setFontSettings] = useState<FontSettings>(
    DEFAULT_FONT_SETTINGS,
  );

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        setIsOnStardance(tab.url.startsWith(STARDANCE_URL));
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.get(
      [
        THEME_STORAGE_KEY,
        CUSTOM_THEME_STORAGE_KEY,
        COLLAPSE_STORAGE_KEY,
        PROJECT_VIEW_STORAGE_KEY,
        FONT_STORAGE_KEY,
      ],
      (result) => {
        setActiveTheme(result[THEME_STORAGE_KEY] ?? "rose-pine");
        if (result[CUSTOM_THEME_STORAGE_KEY]) {
          setCustomVars(JSON.parse(result[CUSTOM_THEME_STORAGE_KEY]));
        }
        setCollapseDevlogs(result[COLLAPSE_STORAGE_KEY] ?? false);
        setProjectListView(result[PROJECT_VIEW_STORAGE_KEY] ?? false);
        if (result[FONT_STORAGE_KEY]) {
          setFontSettings({
            ...DEFAULT_FONT_SETTINGS,
            ...JSON.parse(result[FONT_STORAGE_KEY]),
          });
        }
      },
    );
  }, []);

  const applyThemeOnPage = (id: string, css?: string) => {
    if (!isOnStardance) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;
      chrome.scripting.executeScript({
        target: { tabId },
        func: (themeId: string, themeCSS: string, key: string) => {
          localStorage.setItem(key, themeId);
          const allClasses = document.documentElement.className
            .split(" ")
            .filter((c) => c.startsWith("sd-orbit-theme-"));
          document.documentElement.classList.remove(...allClasses);
          if (themeId !== "default") {
            document.documentElement.classList.add(`sd-orbit-theme-${themeId}`);
          }
          const STYLE_ID = "sd-orbit-theme-style";
          let style = document.getElementById(
            STYLE_ID,
          ) as HTMLStyleElement | null;
          if (!style) {
            style = document.createElement("style");
            style.id = STYLE_ID;
            document.head.appendChild(style);
          }
          style.textContent = themeCSS;
          window.dispatchEvent(
            new CustomEvent("sd-orbit:set-theme", { detail: themeId }),
          );
        },
        args: [id, css ?? "", THEME_STORAGE_KEY],
      });
    });
  };

  const handleThemeSelect = (theme: ThemeMeta) => {
    setActiveTheme(theme.id);
    chrome.storage.local.set({ [THEME_STORAGE_KEY]: theme.id });
    applyThemeOnPage(theme.id, theme.css);
  };

  const handleCustomApply = (vars: CustomThemeVars) => {
    setCustomVars(vars);
    setActiveTheme(CUSTOM_THEME_ID);
    const css = buildCustomCSS(vars);
    chrome.storage.local.set({
      [THEME_STORAGE_KEY]: CUSTOM_THEME_ID,
      [CUSTOM_THEME_STORAGE_KEY]: JSON.stringify(vars),
    });
    applyThemeOnPage(CUSTOM_THEME_ID, css);
  };

  const handleFontChange = (settings: FontSettings) => {
    setFontSettings(settings);
    chrome.storage.local.set({ [FONT_STORAGE_KEY]: JSON.stringify(settings) });
    if (!isOnStardance) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (!tabId) return;
      chrome.scripting.executeScript({
        target: { tabId },
        func: (raw: string, styleId: string) => {
          const s: { headingFont: string; bodyFont: string; fontSize: number } =
            JSON.parse(raw);
          let el = document.getElementById(styleId) as HTMLStyleElement | null;
          if (!el) {
            el = document.createElement("style");
            el.id = styleId;
            document.head.appendChild(el);
          }
          const isDefault =
            s.headingFont === "inherit" &&
            s.bodyFont === "inherit" &&
            s.fontSize === 1.0;
          if (isDefault) {
            el.textContent = "";
            return;
          }
          el.textContent = `
            :root { font-size: ${s.fontSize}rem !important; }
            ${s.bodyFont !== "inherit" ? `body,p,span,div,li,td,input,textarea,button,label{font-family:${s.bodyFont}!important;}` : ""}
            ${s.headingFont !== "inherit" ? `h1,h2,h3,h4,h5,h6,.feed-post-card__title,.profile-project-card__title,.shop-item-card__title,.shop-category__title,.sd-title,.sd-proj__title{font-family:${s.headingFont}!important;}` : ""}
          `.trim();
        },
        args: [JSON.stringify(settings), "sd-orbit-font-style"],
      });
    });
  };

  return (
    <div className="flex flex-col items-center w-[350px] p-6 gap-5 bg-gradient-to-br from-[#1f1f2e] via-[#2b2b3c] to-[#1f1f2e]">
      <div className="flex flex-col items-center gap-1.5">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M26.7399 21.3589C27.0063 20.826 27.2342 20.2706 27.42 19.6962C26.8064 19.9925 26.1214 20.2957 25.3955 20.575C23.7338 21.2143 21.8012 21.75 20 21.75C18.1443 21.75 16.5856 20.924 15.2121 20.1962L15.1489 20.1628C13.7061 19.3984 12.4525 18.75 11 18.75C9.47075 18.75 7.8681 19.2114 6.48538 19.8128C5.90368 20.0658 5.37262 20.3383 4.91416 20.6021C5.06347 20.9614 5.22973 21.3118 5.41196 21.6524C5.56707 21.5794 5.7256 21.5075 5.88714 21.4372C7.37859 20.7886 9.19261 20.25 11 20.25C12.8557 20.25 14.4144 21.076 15.7879 21.8038L15.8511 21.8372C17.2939 22.6016 18.5475 23.25 20 23.25C21.5355 23.25 23.2695 22.7857 24.8569 22.175C25.531 21.9157 26.1684 21.634 26.7399 21.3589ZM28 16C28 16.6053 27.9552 17.2002 27.8687 17.7815C27.0737 18.2136 26.0199 18.7276 24.8569 19.175C23.2695 19.7857 21.5355 20.25 20 20.25C18.5475 20.25 17.2939 19.6016 15.8511 18.8372L15.7879 18.8038C14.4144 18.076 12.8557 17.25 11 17.25C9.19261 17.25 7.37859 17.7886 5.88714 18.4372C5.36152 18.6658 4.86773 18.9117 4.4201 19.1588C4.14619 18.1523 4 17.0932 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM25.2674 23.6239C23.6349 24.2414 21.7551 24.75 20 24.75C18.1443 24.75 16.5856 23.924 15.2121 23.1962L15.1489 23.1628C13.7061 22.3984 12.4525 21.75 11 21.75C9.47075 21.75 7.8681 22.2114 6.48538 22.8128C6.39125 22.8537 6.29846 22.8952 6.20708 22.937C6.46602 23.3019 6.74483 23.6517 7.04195 23.9848C8.27104 23.5561 9.63744 23.25 11.0001 23.25C12.8557 23.25 14.4145 24.076 15.7879 24.8038L15.8511 24.8372C17.294 25.6016 18.5476 26.25 20.0001 26.25C20.9207 26.25 21.9128 26.0831 22.9019 25.8178C23.7856 25.1953 24.5815 24.4566 25.2674 23.6239ZM18.8824 27.6516C17.5056 27.4115 16.3007 26.773 15.2122 26.1962L15.149 26.1628C13.7061 25.3984 12.4525 24.75 11.0001 24.75C10.0922 24.75 9.15838 24.9126 8.26012 25.1706C10.3496 26.9359 13.0505 28 16 28C16.9936 28 17.959 27.8792 18.8824 27.6516Z"
            fill="currentColor"
          />
        </svg>
        <span className="text-2xl font-bold text-white">Stardance Orbit</span>
        <span className="text-xs text-white/40 text-center leading-relaxed px-4">
          Enhances the Stardance site with a better shop layout, devlog tools,
          and stardust tracking.
        </span>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">
          Features
        </p>
        <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] divide-y divide-white/[0.06] overflow-hidden">
          <FeatureRow
            id="toggle-collapse-devlogs"
            label="Collapse devlogs"
            description="Show 3 lines · tap to expand"
            checked={collapseDevlogs}
            onCheckedChange={(v) => {
              setCollapseDevlogs(v);
              chrome.storage.local.set({ [COLLAPSE_STORAGE_KEY]: v });
            }}
          />
          <FeatureRow
            id="toggle-project-list-view"
            label="Project list view"
            description="Switch projects from grid to list"
            checked={projectListView}
            onCheckedChange={(v) => {
              setProjectListView(v);
              chrome.storage.local.set({ [PROJECT_VIEW_STORAGE_KEY]: v });
            }}
          />
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-2">
        <p className="text-[10px] text-white/30 uppercase tracking-widest">
          Theme
        </p>
        <div className="grid grid-cols-2 gap-2 w-full">
          <div className="grid grid-cols-2 gap-2 w-full">
            {THEMES.map((theme) => {
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border justify-center transition-all duration-150 ${
                    isActive
                      ? "border-white/40 bg-white/10"
                      : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16]"
                  }`}
                >
                  <div className="w-6 h-6 rounded-md overflow-hidden flex shrink-0 border border-white/10">
                    <div
                      className="h-full flex-1"
                      style={{ background: theme.swatch[0] }}
                    />
                    <div
                      className="h-full flex-1"
                      style={{ background: theme.swatch[1] }}
                    />
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => {
                if (activeTheme !== CUSTOM_THEME_ID) {
                  setActiveTheme(CUSTOM_THEME_ID);
                }
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border justify-center transition-all duration-150 ${
                activeTheme === CUSTOM_THEME_ID
                  ? "border-white/40 bg-white/10"
                  : "border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16]"
              }`}
            >
              <div className="w-6 h-6 rounded-md overflow-hidden flex shrink-0 border border-white/10 items-center justify-center bg-white/[0.06]">
                <span className="text-white/60 text-[13px] leading-none">
                  ✦
                </span>
              </div>
            </button>
          </div>

          <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 flex flex-col gap-3">
            <span className="text-[10px] text-white/30 uppercase tracking-widest">
              Custom theme
            </span>
            <div className="w-full flex flex-col gap-2 px-1">
              {COLOR_FIELDS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-[12px] text-white/60 flex-1">
                    {label}
                  </span>
                  <label className="relative cursor-pointer">
                    <span
                      className="block w-7 h-7 rounded-lg border border-white/20 cursor-pointer"
                      style={{ background: customVars[key] }}
                    />
                    <input
                      type="color"
                      value={
                        customVars[key].startsWith("rgba")
                          ? "#888888"
                          : customVars[key]
                      }
                      onChange={(e) => {
                        const nextVars = {
                          ...customVars,
                          [key]: e.target.value,
                        };

                        setCustomVars(nextVars);
                        handleCustomApply(nextVars);
                      }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 flex flex-col gap-3">
          <div className="w-full flex flex-col gap-3 px-1">
            <FontSelect
              label="Headings"
              value={fontSettings.headingFont}
              onChange={(v) =>
                handleFontChange({ ...fontSettings, headingFont: v })
              }
            />
            <FontSelect
              label="Body"
              value={fontSettings.bodyFont}
              onChange={(v) =>
                handleFontChange({ ...fontSettings, bodyFont: v })
              }
            />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-white/60 shrink-0">Size</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min={0.85}
                  max={1.3}
                  step={0.05}
                  value={fontSettings.fontSize}
                  onChange={(e) =>
                    handleFontChange({
                      ...fontSettings,
                      fontSize: parseFloat(e.target.value),
                    })
                  }
                  className="flex-1 accent-white/60 cursor-pointer"
                />
                <span className="text-[11px] text-white/50 w-8 text-right shrink-0">
                  {Math.round(fontSettings.fontSize * 100)}%
                </span>
              </div>
            </div>
            <button
              onClick={() => handleFontChange(DEFAULT_FONT_SETTINGS)}
              className="text-[11px] text-white/30 hover:text-white/60 transition-colors text-left"
            >
              Reset to default
            </button>
          </div>
        </div>
        <p className="text-[10px] text-white/25 text-center leading-relaxed px-2">
          Changes apply live on the page. Some fonts load from Google Fonts.
        </p>

        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} keerthi, stardance orbit
        </span>
      </div>
    </div>
  );
}

export default Popup;
