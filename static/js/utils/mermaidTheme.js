/**
 * mermaidTheme.js
 * Utility for syncing Mermaid diagram themeVariables with Journey's Vuetify theme.
 * Reads Journey color tokens and maps them to Mermaid's base theme variables,
 * then re-renders all diagrams on the page.
 */

/**
 * Convert a hex color to a hex with specified opacity (for background tints).
 * @param {string} hex - e.g. '#7C3AED'
 * @param {number} alpha - 0 to 1
 * @returns {string} 8-char hex e.g. '#7C3AED1A'
 */
function hexWithAlpha(hex, alpha) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

/**
 * Apply Journey theme colors to Mermaid and re-render all diagrams.
 * @param {object} colors - { primary, secondary, background, surface }
 * @param {boolean} dark  - whether the current mode is dark
 */
export function applyMermaidTheme({ primary, secondary, background, surface, dark }) {
  if (typeof mermaid === 'undefined') return;

  const textColor = dark ? '#e2e8f0' : '#1e293b';
  const mutedText = dark ? '#94a3b8' : '#64748b';
  const borderColor = dark
    ? hexWithAlpha(primary, 0.5)
    : hexWithAlpha(primary, 0.6);

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      // --- Node fills & borders ---
      primaryColor: hexWithAlpha(primary, 0.12),
      primaryBorderColor: borderColor,
      primaryTextColor: textColor,

      secondaryColor: hexWithAlpha(secondary, 0.10),
      secondaryBorderColor: hexWithAlpha(secondary, 0.4),
      secondaryTextColor: textColor,

      tertiaryColor: background,
      tertiaryBorderColor: hexWithAlpha(primary, 0.2),
      tertiaryTextColor: textColor,

      // --- Backgrounds ---
      background: background,
      mainBkg: surface,
      nodeBorder: borderColor,
      clusterBkg: hexWithAlpha(primary, 0.06),
      clusterBorder: borderColor,

      // --- Text & labels ---
      titleColor: textColor,
      textColor: textColor,
      labelTextColor: textColor,
      edgeLabelBackground: surface,
      attributeBackgroundColorEven: surface,
      attributeBackgroundColorOdd: background,

      // --- Lines ---
      lineColor: dark ? hexWithAlpha(primary, 0.7) : primary,

      // --- Git graph / pie / etc. brand colors ---
      git0: primary,
      git1: secondary,
      git2: hexWithAlpha(primary, 0.6),
      git3: hexWithAlpha(secondary, 0.6),

      // --- Sequence diagram ---
      actorBkg: surface,
      actorBorder: borderColor,
      actorTextColor: textColor,
      actorLineColor: borderColor,
      signalColor: textColor,
      signalTextColor: textColor,
      noteBkgColor: hexWithAlpha(secondary, 0.12),
      noteBorderColor: hexWithAlpha(secondary, 0.4),
      noteTextColor: textColor,
      activationBkgColor: hexWithAlpha(primary, 0.12),
      activationBorderColor: borderColor,

      // --- Gantt ---
      taskBkgColor: hexWithAlpha(primary, 0.15),
      taskBorderColor: borderColor,
      taskTextColor: textColor,
      gridColor: mutedText,
      fillType0: hexWithAlpha(primary, 0.12),
      fillType1: hexWithAlpha(secondary, 0.12),

      // --- Font ---
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: '15px',
    },
  });

  // Re-render: restore original source and call mermaid.run()
  const nodes = document.querySelectorAll('.mermaid');
  if (!nodes.length) return;

  nodes.forEach((el) => {
    const original = el.dataset.original;
    if (original) {
      el.removeAttribute('data-processed');
      el.innerHTML = original;
    }
  });

  mermaid.run({ nodes });
}
