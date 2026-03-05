---
name: Journey Architecture Standards
description: The absolute foundational architectural and coding rules for the Journey theme (Vue SPA + Hugo Headless).
---

# Journey Theme Core Architecture Standards 🏛️

**CRITICAL MANDATE**: Any AI agent modifying code, resolving bugs, or executing workflows in the `journey` project MUST verify their actions against this SKILL document. This document defines the "Single Source of Truth" (SSOT) and the hard boundaries for the project's native Antigravity SSD protocol.

## 1. Governance & Boundary Calibration
*   **SDD (Spec-Driven Development)**: The ONLY permitted development lifecycle. You MUST propose an `implementation_plan.md` and get user approval before writing code.
*   **Protection Boundary**: Your conceptual root (`/`) and current working directory (`.`) is ALWAYS the physical root directory of this project (`/Users/bozheng/Documents/tttt/journey`). All operations must use relative paths from here. You MUST NOT reference files in `exampleSite/` or `archetypes/` as your instructions; they are isolated demo content.
*   **English-First Policy**: All overarching architecture and code logic explanations MUST be in English.

## 2. Zero External Dependencies & SSOT
*   **Core Principle**: The theme architecture MUST function in an air-gapped environment. 
*   **SSOT Validation**: You MUST NEVER hardcode `http://` or `https://` URLs for public CDN links (e.g., `unpkg.com`, `fonts.googleapis.com`) inside HTML templates like `layouts/index.html`.
*   **Workflow Integration**: All external dependencies MUST be managed centrally via `data/vendor.json`. To add a new dependency, edit the `.json` file and instruct the user to execute the `/vendor-sync` slash command to download it to `static/vendor/`.
*   **Directory Immutability**: Manual edits inside the `static/vendor/` directory are STRICTLY PROHIBITED.

## 3. Vue CDN Enterprise SOLID & DRY Enforcement (No Build Step)
The project utilizes Vue.js via CDN (local bundled) as a Single Page Application without any build tools. You MUST strictly enforce these modular boundaries:

*   **Architecture Layout**:
    *   `static/js/components/`: Independent UI blocks.
    *   `static/js/composables/`: Vue Composition API hooks (MANDATORY for all state/event logic).
    *   `static/js/services/`: API Data services (MANDATORY for all fetch/network logic).
    *   `static/js/utils/`: Pure JavaScript helper functions.
*   **Hard Prohibitions (Zero Tolerance)**:
    *   **NO `fetch()` in Views**: All JSON data MUST be retrieved via `services/api.js`.
    *   **NO Path Hacking**: Manually constructing `/index.json` URLs is prohibited. Use the `api.js` abstraction.
    *   **NO `window` Events in Views**: `addEventListener` for scroll, mouse, or resize MUST reside inside a Composable (e.g., `useTheme.js`).
    *   **NO Monolithic Views**: If a view exceeds 200 lines, you MUST extract logic into Composables or child Components.
    *   **NO Build Tools**: Standard ES6 Modules only. No `.vue` files.
*   **Formatting**: A strict **2-space indentation** is mandated for all `.js` files and HTML templates within `static/js/`.

## 4. Linux-First Line Endings
*   **Core Principle**: The repository demands 100% Linux-First (LF) line endings (`\n`) for cross-platform compatibility.
*   **Validation**: Windows `CRLF` formats (`\r\n`) are prohibited. Before finalizing text file edits, ensure your output does not introduce CRLF characters.

## 5. Visual Readability & Rendering Priority
- **Readable > Animated**: Text legibility MUST always take precedence over complex animations.
- **2D Over 3D**: Complex 3D transforms that cause text blurring or layout shifts are STRICTLY PROHIBITED. All core hover effects MUST use 2D transitions (`transform: translateY`, `scale`).
- **Antialiasing**: Use `-webkit-font-smoothing: antialiased` globally to preserve stroke weights during transitions.

## 6. Tiered Interaction Model
- **Tier A (Navigation Focus)**: Standalone elements like `TaxonomyChip` (in TagCloud) or large `PostCard` MAY use "Lift" effects (shadow + translation) to emphasize depth and importance.
- **Tier B (Content Integrity Focus)**: Nested elements like chips inside subtitles or card text MUST remain "Stable". Interactive feedback MUST be limited to background/color changes only to prevent layout shifts.
- **Shadow Isolation**: In tight containers, `--shadow-*` variables MUST be neutralized (`none`) locally to prevent sub-pixel rendering jitter.

## 7. Geometric & Design Regularity
- **The Corner Radius System**: To maintain a premium, rhythmic aesthetic, all elements MUST adhere to the systemic radius variables:
    - `--radius-lg` (32px): For primary content containers (`BaseSurface`), main cards, and skeleton loaders.
    - `--radius-md` (16px): For interactive elements (Buttons, Chips, Inputs, Menus).
    - `--radius-sm` (8px): For micro-elements or internal layout blocks.
- **Surface-First Philosophy**: All distinct list items or search results MUST be encapsulated in a `BaseSurface` component to ensure consistent elevation, glassmorphism, and hover lifted states.
- **Perfect Alignment**: Content inside cards (images, headers) MUST use clipping or matching geometry to ensure no radius gaps are visible at the 32px scale.

