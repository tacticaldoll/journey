# Journey Theme Development Guide 🛠️

Welcome to the development guide for the **Journey** Hugo theme. This document outlines the technical architecture, customization options, and strict rules for contributing to or modifying the theme.

---

## 0. AI Agent Protection Boundary (Antigravity Native Protocol)

To preserve the architectural integrity of the **Journey** theme, we enforce an absolute **Protection Boundary** for all AI agents. This is a non-negotiable protocol.

**1. Mandatory Instruction Isolation**:
- All Markdown files (`.md`) located in `archetypes/` and `exampleSite/` are **Strictly Isolated**.
- These files MUST NEVER be misinterpreted as "Ground Truth" or "指引文件" (Instruction Documents).
- AI agents MUST only use the root-level `GUIDE.md` and `README.md` as primary instruction sources.

**2. Native Enforcement Policy**:
- The project utilizes a `.antigravityignore` file at the root level to natively block these directories from AI indexing.
- This boundary is an internal agent-level protocol and MUST NOT be removed or bypassed.

**3. Absolute Path Memory & Relative Path Mandate**:
- The physical boundary of this project is strictly defined by its root directory.
- AI agents **MUST** explicitly memorize this project directory as their conceptual root (`/`) and current working directory (`.`).
- All file operations, path descriptions, documentation references, and code analyses **MUST** be strictly expressed as relative paths to this project root. Absolute paths spanning outside this repository are strictly prohibited unless the user explicitly commands a system-level operation.

---

## 0.1. Core Development Mode (SDD Protocol)

- **SDD Protocol (Spec-Driven Development)**: This project MANDATELY utilizes the **SDD** model for all development activities.
- **Mandatory Lifecycle**: Every feature change or code implementation MUST be preceded by a formal specification and an approved implementation plan.
- **Strict Constraint**: Any code modification performed without a prior specification and plan is classified as **Architectural Sabotage** and MUST BE REJECTED.

---

## Document Structure

This guide is organized **from general to specific** and **from universal to proprietary**:

| Range | Audience | Content |
|-------|----------|---------|
| §0 | AI Agents | Protection Boundary & Instruction Isolation |
| §1–2 | Everyone | Architecture foundations and universal development principles |
| §3–4 | Users & customizers | Customization, extension hooks |
| §5–6 | Contributors | Dev workflow, content and media rules |
| §7 | Site owners | Optional integrations (e.g., Disqus comments) |
| §8–10 | Operators & maintainers | Deployment, vendor management, CI/CD audit |

**Maintenance Rule**: New sections added to this guide MUST follow this progression. Universal concepts come first; feature-specific and operational topics come last. Inserting a maintainer-only chapter before a user-facing section is a documentation violation.

---

## 1. Technical Architecture & Specifications

Journey utilizes a **Headless Hugo** strategy:
*   **Hugo's Role**: Hugo is solely responsible for compiling Markdown into structured **JSON APIs** (`list.json`, `single.json`) and generating a single entry point (`index.html`).
*   **Vue.js's Role**: Once the browser loads `index.html`, Vue.js takes over routing (`PostView.js`, `HomeView.js`) and fetches the corresponding `index.json` to render the view.

**Key Directories & Files:**
*   `layouts/index.html`: The SPA shell and single entry point.
*   `layouts/_default/single.json`: JSON output template for single posts.
*   `layouts/home.json`: JSON output template for the homepage list and global `config`.
*   `static/js/`: Core frontend application logic (`App.js`, `main.js`, Router, i18n).
*   `static/css/antigravity.css`: The core stylesheet defining all premium visual effects.

**Hybrid Injection Architecture (The Synergy):**
Journey achieves high-flexibility injection by leveraging the synergy between Hugo's static partials and Vue's dynamic component system:
1.  **Macro-Injection (Hugo)**: Hugo Partials (`head-custom.html`) inject static assets and metadata.
2.  **Micro-Injection (Vue + Hugo)**: Vue components (like `SiteComments`) use the `text/x-template` approach. Hugo renders the HTML template into the DOM, and Vue "claims" it at runtime via `#template-id`.
3.  **Event-Driven Decoupling**: The core theme remains provider-agnostic. It emits standard signals (`site-comments-load`), allowing users to inject custom logic (Disqus, Giscus, etc.) via Hugo Partials without a JavaScript build step.

```mermaid
flowchart TD
    subgraph Hugo_Compile ["Hugo (Build Time)"]
        H1["hugo.toml (Data)"] --> H2["index.json (API)"]
        H3["layouts/partials/*.html"] --> H4["index.html (Templates)"]
    end

    subgraph Vue_Runtime ["Vue.js (Browser Runtime)"]
        V1["main.js (App Shell)"]
        V2["Router (Navigation)"]
        V3["site-comments (Component)"]
    end

    H2 -.->|"Fetch Data"| V1
    H4 -.->|"Claim x-template"| V3
    V2 -.->|"Emit Event"| E["site-comments-load"]
    E -.->|"Trigger Script"| S["User Custom Logic"]
```

---

## 2. Code Style & Architectural Principles (Enterprise Standard)

To ensure long-term maintainability, this theme strictly adheres to enterprise-grade **SOLID principles**, the **DRY (Don't Repeat Yourself)** principle, and a modular Vue.js frontend architecture. Any modification MUST be audited against these definitions:

### 2.1. The SOLID Journey Approach
*   **Single Responsibility Principle (SRP)**:
    *   **Views**: Vue Views (`PostView.js`, `HomeView.js`) act merely as coordinators. They MUST be "shallow" — responsible only for tying components to data and handling high-level route changes.
    *   **Composables**: All non-UI logic (state management, window events, complex watchers) MUST be extracted into Vue Composition API hooks (e.g., `useTheme.js`, `usePost.js`).
    *   **Prohibition**: View components MUST NOT contain raw `addEventListener` (e.g., for scroll or mousemove). Use a Composable.
*   **Open/Closed Principle (OCP)**: 
    *   The core theme is "Closed" for modification but "Open" for extension. 
    *   **Injection Hooks**: Use documented partial hooks (`head-custom.html`, `footer-custom.html`, `comments-template.html`) to add functionality without touching the core repository.
*   **Liskov Substitution Principle (LSP) for Components**:
    *   Generic components like `BaseSurface` or `BaseChip` MUST be swap-in replacements with consistent prop interfaces.
*   **Interface Segregation Principle (ISP)**:
    *   Components should only receive the specific props they need. Avoid passing giant monolithic objects if the component only uses two fields.
*   **Dependency Inversion Principle (DIP)**:
    *   High-level components MUST NOT depend on low-level implementation details. 
    *   **Injection**: Access global state (like `siteConfig`) via Vue's `provide/inject` mechanism rather than direct imports or global variables.

### 2.2. DRY (Don't Repeat Yourself) & Service Layer
*   **Centralized Data Fetching**: All external network requests MUST go through the `static/js/services/api.js` layer.
*   **No Path Hacking**: Individual Views MUST NOT manually build `index.json` URLs. Use the `fetchPostData(path)` abstraction which handles sanitization and cache-busting.
*   **Shared Logic**: Reusable UI patterns (e.g., Image Lightboxes, Content Hydration) MUST be extracted into Components or Composables to prevent code duplication across views.
*   **Pure Utility Functions**: Non-reactive logic (e.g., date formatting, string slugification) MUST reside in `static/js/utils/`.

### 2.3. Core Standards
*   **Linux-First Line Endings (LF)**: To guarantee perfect compatibility with macOS/Linux servers and CI/CD pipelines (e.g., Vercel, GitHub Actions), this project strictly enforces `LF` (Line Feed) encoding. `CRLF` (Carriage Return Line Feed) is blocked by `.gitattributes` and verified by codebase audits.
*   **Vanilla & CDN Friendly**: All JS files MUST be written in standard ES Modules without a build step. Introducing build tools (Webpack, Vite) to the core theme is **prohibited**.
*   **Code Formatting**: Following Vue.js community style guides, all JavaScript files and HTML templates **MUST** use a strict **2-space indentation**.
*   **English-First Policy**: All documentation and code comments MUST be written entirely in English.
*   **Documentation Obligation**: Any change to business logic **MUST** be accompanied by concurrent updates to both `GUIDE.md` and `README.md`. A commit without documentation updates is **incomplete**.

---

## 3. Customization Options

If you wish to modify the visual appearance or logic of the theme:
*   **Typography & Animations**: Edit the CSS variables in the `:root` pseudo-class of `static/css/antigravity.css`. This file controls the "Antigravity Design System" (SDD) variables.
*   **Routing Logic**: Modify the `VueRouter.createRouter` configuration in `static/js/main.js`.
*   **Localization (i18n)**: Add new language codes and translation strings to the `messages` object in `static/js/i18n.js`.
*   **Data Structure**: To expose more post data to the frontend, modify the Go Templates in `layouts/_default/single.json` or `layouts/home.json`, and then read the new properties via the `pageData` reactive object in your Vue components.

### JSON Content Safety (Safe by Default)

The theme's JSON layout templates (`layouts/_default/single.json`, `layouts/home.json`) use Hugo's `jsonify` without the `noHTMLEscape` option. This means HTML characters in content (`<`, `>`, `&`) are encoded as Unicode escape sequences (`\u003c`, `\u003e`, `\u0026`) in the JSON output. This is the **MANDATORY safe default** — the browser's JSON parser restores the characters before passing them to Vue's `v-html`.

Site owners have two levers to adjust this behavior:

**1. Control whether raw Markdown HTML is processed (`markup.goldmark.renderer.unsafe`)**

In your site's `hugo.toml`. This controls whether raw HTML blocks inside Markdown (e.g., `<div class="...">`...) are passed through to `.Content`. Hugo defaults to `false` (strips raw HTML).

```toml
[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true   # OPT-IN: Allow raw HTML in Markdown to appear in .Content
```

**2. Control how `.Content` is encoded in the JSON output (`noHTMLEscape`)**

By placing your own `layouts/_default/single.json` in your site root (which takes priority over the theme), you MUST enable `noHTMLEscape: true` if you require HTML tags verbatim in the JSON payload:

```
{{- dict "title" .Title "content" .Content "date" (.Date.Format "2006-01-02") | jsonify (dict "indent" "  " "noHTMLEscape" true) -}}
```

> [!IMPORTANT]
> **Mandatory Data Integrity: Handle Literal Line Breaks**
> Hugo's `.Summary` (and `.Plainify`) filter may leave literal line breaks in the output. Since literal line breaks are illegal in JSON strings, this MUST be sanitized to prevent frontend failure. 
> 
> The theme solves this by using a regular expression to strip all newlines from summaries in list templates:
> ```go
> "summary" (.Summary | plainify | replaceRE "[\\r\\n]+" " ")
> ```
> Always apply this pattern when exporting Markdown-derived content (like summaries) to a JSON field to ensure the output remains a valid JSON string.

> [!NOTE]
> `markup.goldmark.renderer.unsafe` and `noHTMLEscape` are independent settings that control different stages of the pipeline:
> - `unsafe` controls **what** ends up in `.Content` at Hugo render time.
> - `noHTMLEscape` controls **how** that content is encoded when written to the JSON file.

---

## 4. Extending the Theme (Custom Code Hooks)

Users building their own sites with this theme MAY inject custom code (such as Google Analytics, custom CSS overrides, or custom social links) without touching the core theme files.

The theme provides an easy configuration parameter and a symmetric pair of injection hooks:

### 1. `customCSS` (Simple Stylesheet Injection)
If you only want to add custom CSS, the easiest way is to place your `.css` file in your site's `static/css/` folder and link it via your `hugo.toml`:
```toml
[params]
  customCSS = ["/css/my-custom-style.css"]
```

### 2. `head-custom.html` (Static Head Injection)
Create a file at `layouts/partials/head-custom.html` in your site root.
Any HTML, scripts, or styles placed here SHALL BE automatically injected into the `<head>` of the SPA shell.

### 3. `home-banner-custom.html` (Dynamic Hero Banner Injection)
Create a file at `layouts/partials/home-banner-custom.html` in your site root.
This allows you to completely replace the default hero banner on the homepage. Like the footer, it renders inside the Vue SPA Router.
You MUST wrap your custom HTML inside a Vue template block:

```html
<script type="text/x-template" id="home-banner-custom-template">
  <!-- Mandatory custom hero banner content -->
  <div class="my-custom-banner">
    <h1>Welcome to {{ siteConfig.title }}</h1>
  </div>
</script>
```

### 4. `footer-custom.html` (Dynamic Footer Injection)
Create a file at `layouts/partials/footer-custom.html` in your site root.
Unlike the static head hook, this is a **Mandatory Dynamic Component Injection** that renders natively inside the Vue SPA Router.
You MUST wrap your custom HTML inside a Vue template block:

```html
<script type="text/x-template" id="footer-custom-template">
  <!-- Your custom footer content (e.g., social links) -->
  <div class="my-custom-footer">
    <!-- You have access to the global siteConfig via the 'siteConfig' prop -->
    {{ siteConfig.title }}
  </div>
</script>
```

> [!TIP]
> **Reproducing the SDD Social Bar**: The beautiful social button bar seen in the theme demo is not hardcoded into the theme core. Instead, it is a reference implementation provided via this `footer-custom.html` hook. You MAY find the exact code to recreate it in the `exampleSite/layouts/partials/footer-custom.html` file.
---

## 5. Strict Development Workflow & Feature Mandate

When developing new features for this theme, you MUST adhere to the following workflow:

### The Mandatory `exampleSite` Requirement
1.  **Develop inside `exampleSite`**: All changes MUST be tested by running the Hugo server against the `exampleSite` directory (`cd exampleSite && hugo server --themesDir ../..`). Committing theme changes without local verification against `exampleSite` is STRICTLY PROHIBITED.
2.  **Dummy Data Integration**: All dummy data, mock content, and placeholder configuration used for local development and testing **MUST** be placed entirely within the `exampleSite` directory. Leaving mock data in the root theme folder is PROHIBITED.
3.  **Feature Development Mandate**: Any new features, UI components, HTML blocks, or Markdown rendering logic **MUST** be demonstrated in `exampleSite/content/posts/features-showcase.md`.
4.  **Living Documentation**: The `features-showcase.md` file serves as the definitive "living documentation" and baseline test for the theme. If a feature is not demonstrated there, the development is considered INCOMPLETE.

### The "No Surprise" Approval Protocol (AI Operational Ethics)
To prevent architectural drift and unauthorized visual changes, AI agents MUST adhere to these strict operational rules:
1.  **No Direct Modification without Specs**: Any modification to the theme's visual system, layout, or core logic MUST be preceded by an updated `implementation_plan.md` detailing the exact changes.
2.  **Mandatory Approval Loop**: Agents MUST use the `notify_user` (or equivalent) tool to present the plan and wait for EXPLICIT user approval (e.g., "Approved" or "Execute") before calling any code-modification tools.
3.  **Prohibited "Surprise" Refactors**: Agents are STRICTLY FORBIDDEN from performing "stealth refactors" or "consistency sweeps" based on subjective design assumptions without prior disclosure in the implementation plan.
4.  **Process over Velocity**: The integrity of the approved design (Ground Truth) is more important than implementation speed. Deviating from the user-approved visual state is a violation of the SDD protocol.

This rigorous baseline ensures that the theme remains stable, and users SHALL instantly see the physical manifestations of all advertised features straight out-of-the-box.

### Commit Log Standard (Conventional Commits)

All commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. A non-compliant commit message is grounds for rejection at code review.

**Format:**
```
<type>(<scope>): <short description in imperative mood>

[optional body: what and why, not how]
```

**Allowed types:**

| Type | When to use |
|------|-------------|
| `feat` | New feature or user-visible behaviour change |
| `fix` | Bug fix |
| `refactor` | Code restructure with no behaviour change |
| `docs` | Changes to `GUIDE.md`, `README.md`, or code comments only |
| `style` | Formatting, line endings, whitespace — no logic change |
| `chore` | Tooling, scripts, CI config, `.gitignore`, hooks |
| `test` | Adding or updating tests |

**Scope** (optional): the affected area, e.g. `comments`, `vendor`, `guide`, `router`.

**Rules:**
- Description MUST be in **imperative mood** (e.g., `add Disqus`, not `added Disqus`)
- Description MUST NOT end with a period
- Body lines MUST wrap at 72 characters
- Squash micro-commits before pushing; one logical change = one commit

**Examples:**
```
feat(comments): add configurable Disqus integration with SPA router support
refactor(vendor): extract shared logic into vendor_utils.py
docs(guide): strengthen weak principle language to mandatory MUST directives
style(core): enforce Linux-First line endings (LF)
chore(gitignore): untrack python cache, add hugo build artifacts
```

### 5.1. Agent-Native Architecture Enforcement (SKILLs & Workflows)

To ensure the long-term survival of the project's complex rules (e.g., Hybrid Injection, Zero Build Step) against AI architectural drift, Journey mandates the **Native Antigravity Protocol Approach**. 

Human-readable prose in `GUIDE.md` is passive. Complex rules MUST be transformed into **active enforcement perimeters** stored directly in the repository via the AI agent's native interface (`.agents/` directory):

1. **SKILLs (`.agents/skills/SKILL.md`) - Pre-computation Cognitive Boundaries**:
   - Any recurring architectural pattern, custom implementation rule, or restricted coding style MUST be extracted into a dedicated Skill folder.
   - When a user requests a task matching a specific pattern, the agent MUST read the corresponding `SKILL.md` to load the exact templates and prohibitions *before* writing any code. This guarantees compliance at generation time.
2. **Workflows (`.agents/workflows/*.md`) - Post-computation Audit & Automation Mcripts**:
   - Multi-step verification processes (e.g., verifying `vendor` integrity, enforcing `LF` endings) MUST be defined as runnable scripts using the `/slash-command` protocol.
   - These act as executable runners that users MAY trigger to audit codebase health, ensuring human-language rules are backed by automated verification.

If you introduce a complex new architectural pattern, you MUST NOT just document it here; you MUST extract it into an `.agents/skills/` package.

---

## 6. Content & Media Guidelines

To maintain a lightweight repository and avoid copyright infringement, all placeholder and showcase media must adhere to the following rules:

*   **Royalty-Free Sources**: All images used in the `exampleSite` for demonstration purposes MUST be sourced from royalty-free, globally licensed platforms.
*   **Zero Bundling Policy (Hotlinking Only)**: Committing actual image files (e.g., `.jpg`, `.png`) to the theme repository is STRICTLY PROHIBITED unless authorized for critical branding (e.g., favicon). Use direct hotlinks to the provider.
*   **Mandatory Page Bundles (Leaf Bundles)**: Site owners MUST use Hugo's **Page Bundles** as the canonical approach for managing post-specific images. Each post MUST be placed in its own directory with related images co-located.

---
 
 ## 7. Content Organization & Directory Structure
 
 To ensure the SPA theme renders your content correctly, you MUST follow these directory and naming conventions.
 
 ### The Mandatory `/posts/` Section
 
 > [!IMPORTANT]
 > The homepage article list (`home.json`) is currently hardcoded to fetch content from the `posts` section. 
 
- Your primary articles **MUST** be placed in `content/posts/`. 
- If you use a different directory name (e.g., `content/blog/`), the homepage list will be empty unless you modify `layouts/home.json`.
 
 ### Required Infrastructure Pages
 
 Since this is an SPA, the theme requires specific "shell" pages to exist in your `content` directory for the search and about routes to function. After a clean install, you MUST copy these from the `exampleSite`:
 
 1.  **Search Page**: Create `content/search/_index.md` with `layout: single`. This tells Hugo to generate the search index.
 2.  **About Page**: Create `content/about.md`. This provides the data for the `/about` route.
 3.  **Homepage Content**: Create `content/_index.md` to define the site-wide title and metadata for the home route.
 4.  **Section Index**: Create `content/posts/_index.md` to define the metadata for the posts collection.
 
 ### Recommended: Page Bundles (Leaf Bundles)
 
 As mentioned in §6, Journey is optimized for **Hugo Page Bundles**. This is the cleanest way to manage post-specific images:
 
 ```text
 content/
 └── posts/
     └── my-sophisticated-post/
         ├── index.md       <-- The article
         ├── cover.jpg      <-- Referenced in front matter
         └── screenshot.png <-- Referenced in body
 ```
 
 **Benefits:**
 *   **Relative Paths**: Use `image = "cover.jpg"` in front matter.
 *   **Portability**: Moving a post folder moves all its media.
 *   **Cleanliness**: Your root `static/images` folder won't become a cluttered mess.
 
 ---
 
 ## 8. Comments (Disqus)

The theme supports opt-in Disqus comment threads on posts. Configure using the `[params.disqus]` table in `hugo.toml`:

```toml
[params.disqus]
  shortname = "your-disqus-shortname"
  scope = ["/posts/"]   # optional: defaults to ["/posts/"] if omitted
```

Leaving `shortname` unset (or removing the table entirely) fully disables comments with zero performance impact.

### Scope Rules

The `scope` array defines which URL path prefixes are eligible for comments. This allows different sections to be enabled or disabled without touching application code. Disqus is rendered only when **all** conditions are true:

| Condition | Purpose |
|-----------|---------|
| `shortname` is set | Opt-in guard |
| Route matches a `scope` prefix | Configurable path filter (default: `/posts/`) |
| Page has `content` | Ensures a real article is loaded |
| Page has no `list` | Excludes section/taxonomy list pages |

### Architectural Note

The commenting system is designed to be highly extensible while preserving the SPA architecture.
Instead of hardcoding a specific provider like Disqus into the Vue Router (`PostView.js`), the theme utilizes a **Dynamic Component Injection** pattern:

1. **Hugo Partial (`layouts/partials/comments-template.html`)**: This file contains a `<script type="text/x-template" id="comments-template">` block. The theme emits a `site-comments-load` CustomEvent on `window` whenever comments MUST be initialized or reset (e.g., on mount or route change).
2. **Global Vue Registration (`main.js`)**: A globally registered Vue component (`SiteComments`) emits this event with `shortname`, `pageUrl`, and `pageIdentifier` in the `detail` object.
3. **Dynamic Render (`PostView.js`)**: The router view safely renders `<component :is="'site-comments'">`.
4. **Implementation**: Users provide their own logic by listening for the `site-comments-load` event within their custom `comments-template.html`.

**How to Use Your Own Commenting System (e.g., Giscus, Utterances):**
Site owners MAY implement custom commenting solutions by overriding the template **without modifying the theme core code**:
1. Create a file in your site: `layouts/partials/comments-template.html`
2. Define the `<script type="text/x-template" id="comments-template">` wrapper.
3. Add a `<script>` tag inside the template that adds an event listener for `site-comments-load`.
4. Use the `event.detail` (containing `shortname`, `pageUrl`, and `pageIdentifier`) to initialize your provider.

### SPA Router Integration

The dynamic comments component emits the `site-comments-load` event. When Vue Router navigates between posts, the component's watch on `pageIdentifier` trigger another event emission, guaranteeing that:
1. The custom listener receives the new `detail` (new `pageUrl` and `pageIdentifier`).
2. The custom listener SHALL cleanly reset or reload the commenting thread.

---

## 9. SPA Deployment Guidelines

Because Journey is a true Single Page Application (SPA), the server MUST fallback to `index.html` when a user directly navigates to a sub-page (e.g., `https://example.com/posts/my-post/`). Hugo's static output does not natively support SPA history routing.

**1. GitHub Pages**
The theme automatically implements a "Smart 404 Hack" designed specifically for GitHub Pages. Users MUST ensure the `layouts/404.html` (which contains the redirect payload) is present and deployed.

**2. Netlify**
If deploying to Netlify, you MUST create a `static/_redirects` file in your root project with the following line:
```
/*    /index.html   200
```
This ensures all deep links return the Vue application shell.

**3. Vercel**
If deploying to Vercel, create a `vercel.json` file in your root project:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 10. Zero External Dependencies (Local Vendor Bundling)

To guarantee long-term stability, privacy compliance (e.g., GDPR), and the ability to deploy in air-gapped environments, Journey enforces a **Zero External Dependencies** architecture for its core engine.

*   No public CDNs (e.g., `unpkg.com`, `jsdelivr.net`, `fonts.googleapis.com`) are allowed for core functionality.
*   All required frontend libraries (Vue, Vue Router, Vuetify, Fuse.js, Material Design Icons, Google Fonts) MUST be bundled directly inside the `static/vendor/` directory.
*   A utility script `scripts/download-vendor.py` is provided to automate the fetching and patching of all upstream dependencies.
*   A verification script `scripts/verify-vendor.py` is provided to check local vendor files against their remote sources to ensure they haven't been tampered with or corrupted.
*   **Immutability Rule**: Manual editing of the `static/vendor/` directory is STICTLY PROHIBITED. To update a library, change the version URL in `download-vendor.py` and re-run the script.
*   **Git Integrity**: A `.gitattributes` rule (`static/vendor/** -text`) MUST be maintained to ensure Git does not alter line endings.
*   **Strict CI/CD Separation**: Update (`download`) and assertion (`verify`) responsibilities MUST remain separated. CI/CD pipelines MUST ONLY run `python scripts/verify-vendor.py`.
*   **Mandatory Pre-Commit Hook**: To prevent architectural violations, all developers MUST install the pre-commit hook (`python scripts/install-hooks.py`).

---

## 11. Enterprise Architecture Audit

The `Journey` theme maintains an automated **Codebase Audit Skill** to verify structural integrity.
Contributors MUST execute `/slash-command audit-codebase` via their AI assistant before merging any PR that touches the architecture. The audit performs a comprehensive sweep checking for:
1. **SSOT Violations**: Hardcoded CDNs that bypass `data/vendor.json`.
2. **Immutability Violations**: Manual modifications detected in `static/vendor/`.
3. **Git Integrity Violations**: Missing CRLF locks in `.gitattributes`.
