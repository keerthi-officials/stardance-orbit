# Stardance Orbit
A Chrome extension that enhances the [Stardance](https://stardance.hackclub.com) experience with UI improvements, quality-of-life features, and productivity tools.

## Features

### Shop Page
- **Orders button** - quick access to your order history from the shop topbar
- **Rearranged Layout** - categories on top, shop updates below instead of the original side by side layout
- **Progress bars on item cards** - each card shows your current stardust vs. the item price, how much more you need, and estimated hours-to-earn
- **Wishlist star improvements** -  bug fix so removing/adding a wishlist item reloads the current page instead of redirecting

### Goal Tracking (Wishlist Panel)
- Replaces the default wishlist section with a richer goals panel
- **Actual vs. Projected tabs** - switch between your current balance and an estimated future balance calculated from your active projects
- **Cumulative vs. Individual mode** - cumulative allocates your balance across goals in priority order; individual shows your progress toward each item independently
- **Per-item quantity** - set how many of each item you want (up to x30), price and progress update accordingly
- **Drag to reorder** - drag items to set priority, order is saved locally
- **Summary bar** - shows total goals, balance, stardust remaining, and estimated hours to earn it
- **Mini progress bars** per item, coded green / orange / red based on how close you are

### Project Page
- **Inline devlog composer** - post devlogs directly on the project page without opening a modal; includes a template picker (see templates below)
- **Inline devlog editing** - edit devlogs in place instead of being redirected to a separate edit page
- **Ship button moved** - relocated to the project banner; floating action buttons removed
- **Stardust prediction panel** - estimates your payout range based on four scored factors:
  - **Storytelling** - devlog count and how many have images or videos
  - **Originality** — estimated at average (voters judge this subjectively)
  - **Technicality** - Github link presence and devlog trail depth
  - **Usability** - whether a demo URL is detected on the project
  - Shows a low / mid / high stardust range, an overall quality score bar

### Home page
- **Devlog template picker** - same template selector available in devlog composer
- **Feed filter** — filter the home feed by **Everyone** (default), **Following** (only posts from people you follow), or **Mine** (only your own posts).

### Devlog Templates
Five built-in templates available in the composer on both the project page and home page:
- 🔥 Just shipped something
- 🐛 Fought a bug (and won/lost)
- 🎉 Project milestone
- 😤 Rant + how I fixed it
- ✨ What I added

### Focus Mode
- **Focus mode toggle** - hides the nav, sidebar, and other distracting elements, centering content in a clean 720px column
- Available on both project pages and the home feed
- State persists across sessions

### Devlog Feed
- **Collapse long devlogs** - long devlog bodies collapse to 3 lines with a "show more / show less" toggle
- Togglable from the extension popup

### Project List (Profile Page)
- **Grid / List view toggle** - switch your projects list between grid and list layout, preference saved; togglable from the extension popup
- **Sort projects** - sort by last updated, most devlogs, most time logged, or alphabetically

### Quick Search (`Ctrl+K`)
- Command palette overlay with keyboard navigation
- Page tiles for Home, Rate, Missions, Shop, Resources, My Projects, and My Profile
- Your own projects listed with hours and devlog counts
- Full site search powered by Stardance's global search
- Arrow keys to navigate, Enter to open, Esc to close

### Keyboard Shortcuts
- `Alt+1` through `Alt+9` — jump to your first 9 projects
- `Alt+H` — Home feed
- `Alt+R` — Rate projects
- `Alt+M` — Missions
- `Alt+D` — Shop
- `Alt+E` — Resources / Guides
- `Alt+P` — My Projects

A small toast notification appears at the bottom of the screen when a shortcut navigates you somewhere.

### Word Count
- live word count and estimated reading time shown in the devlog composer as you type
- Per-devlog word count badge shown next to the time logged on each feed card

### Draft Autosave
- Devlog composer content is automatically saved to localStorage as you type
- On returning to a project, a banner offers to restore or discard the saved draft
- Draft is cleared automatically on successful submit
- Note: only text is saved, file attachments are not

### Themes
7 built-in themes selectable from the popup:
- **Default** — the original Stardance dark theme
- **Rosé Pine** — muted purples and warm tones
- **Catppuccin Latte** — light pastel theme
- **Dark+** — deeper, near-black dark theme
- **Pastel** — soft light theme with warm pinks
- **Neon** — dark background with bright cyan accents
- **High Contrast** — black background with yellow accents

Themes apply live on the page without a refresh.

### Custom Theme Builder
- Set your own **Background**, **Surface**, **Accent**, **Text**, and **Border** colors via color pickers in the popup
- **Light mode toggle** for custom themes
- All CSS variables are derived automatically from your chosen colors (darkened/lightened variants, alpha layers, etc.)
- Applies live on the page

### Font Customizer
- Set separate fonts for **Headings** and **Body** text, and adjust the global **font size** (85% - 130%)
- 35+ font options loaded from Google Fonts, organized into sans-serif, serif, and monospace groups:

  **Sans-serif:** Inter, DM Sans, Geist, Outfit, Plus Jakarta Sans, Nunito, Poppins, Sora, Figtree, Bricolage Grotesque, Space Grotesk, Manrope, Lexend, Raleway, Rubik, Work Sans, Quicksand, Cabin, Comfortaa, Josefin Sans, Righteous, Orbitron

  **Serif:** Georgia, Merriweather, Lora, Playfair Display, DM Serif Display, EB Garamond, Crimson Pro

  **Monospace:** JetBrains Mono, Fira Code, Source Code Pro, Cascadia Code, IBM Plex Mono, Geist Mono
- Changes apply live; fonts load from Google Fonts on demand
- Reset to site default with one click

## Installation
 
**Load unpacked (Developer Mode)**
 
1. Download the extension files from [Releases](https://github.com/keerthi-officials/stardance-orbit/releases)
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** in the top-right corner
4. Click **Load unpacked**
5. Select the extracted extension folder

## Notes
- The stardust prediction is an estimate based on signals visible on the page. Actual payouts depend on voter ratings, particularly the originality factor which can't be measured automatically.
- The projected balance in the goals panel fetches each of your projects individually and sums their mid-range stardust estimates.
- Draft autosaves stores text only, file attachments are not saved