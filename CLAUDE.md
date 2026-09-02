# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for Rayla Digital Agency. Static, dependency-free: hand-written HTML/CSS/JS with no build step, no package manager, and no test suite. There is nothing to install, compile, or lint.

To preview, open `index.html` directly, or serve the folder (e.g. `python3 -m http.server 8000`) so that relative asset paths and the fonts/CDN links resolve as they do in production.

## Layout

- `index.html` — the entire site. It is a single long-scroll page; every "page" in the nav is an anchor to a `<section id="...">` (`#home`, `#brands`, `#about`, `#services`, `#process`, `#work`, `#team`, `#contact`). `pages/` exists but is empty — new content belongs as a section in `index.html` unless the user explicitly asks for a separate page.
- `css/style.css` — the only stylesheet, organised top-down: reset → design tokens in `:root` → base typography → section-by-section blocks in the same order as the markup → media queries.
- `js/script.js` — progressive enhancement only. Several independent `DOMContentLoaded` blocks, one per concern (header/nav, scroll reveal, values carousel, discovery modal + form validation). The page must remain usable if JS fails.
- `assests/images/` — all imagery. **The directory is misspelled ("assests") and paths depend on it; do not rename it.**
- `docs/` — currently empty placeholder files.

## Conventions

- **Design work always starts with the skills**: invoke the `frontend-design` skill (`/frontend-design`) *before* writing or reshaping any UI — new sections, layout, typography, spacing, components, or visual polish — and pair it with `rayla-brand-guidelines` so the result stays on-brand. This is not optional or only-for-big-changes; do it even for a single restyled block.
- **Design tokens**: colors, fonts, radii, and the `--space-*` scale are CSS custom properties in `:root`. Reference the variables; do not hardcode hex values. See the `rayla-brand-guidelines` skill in `.claude/skills/` for the palette and brand direction — consult it before any design or copy change.
- **JS style**: ES5-flavoured — `var`, `function` expressions, `Array.prototype.forEach.call` for NodeLists, and feature-detection fallbacks (`ResizeObserver`, `matchMedia.addListener`, `IntersectionObserver`). Match this; it is deliberate, not legacy drift.
- **Defensive guards**: each JS block bails early (`if (!header || !navToggle) return;`) when its markup is absent. Keep that pattern so removing a section can't break the rest of the page.
- **CSS-first behaviour**: the mobile menu is a checkbox hack (`#nav-toggle`) driven by CSS; JS only adds what CSS can't do (body scroll lock, auto-close, `--header-h` measurement). Don't reimplement toggles in JS.
- **Comment style**: sections in all three files open with a banner comment (`/* ===== NAME ===== */`, `<!-- ==== NAME ==== -->`) and explain *why* a decision was made. Continue this density.
- **Behaviour hooks**: modal wiring uses data attributes (`data-open-modal`, `data-close-modal`, `data-step`, `data-error-for`) rather than extra classes.

## External dependencies (CDN, loaded in `index.html`)

Google Fonts (Montserrat + Poppins), Font Awesome 6.5.1, and Web3Forms (`web3forms.com/client/script.js`) which handles contact/discovery-call form submission via a hidden `access_key` field. The discovery form validates client-side in `js/script.js` (`FIELD_RULES`) before handing off.

## Git

Commit messages in this repo are short, uppercase, and describe the visible change (e.g. `MORE CHANGES ON THE FAVICON LOGOS`). Work happens directly on `main`.
