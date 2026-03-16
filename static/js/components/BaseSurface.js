/**
 * BaseSurface.js
 * The architectural foundation for all content containers in the Antigravity system.
 * 
 * Responsibilities:
 * 1. Encapsulates glassmorphism, border-radius, and depth logic.
 * 2. Unifies hover interactions (hoverLift).
 * 3. Provides a Single Source of Truth for content surfaces.
 */
export default {
  name: 'BaseSurface',
  props: {
    // If provided, the card becomes a link
    to: { type: String, default: null },
    // Enable the standard Antigravity lift+shadow animation
    hoverLift: { type: Boolean, default: true },
    // Custom elevation if needed (default 0 for glass style)
    elevation: { type: [Number, String], default: 0 },
    // Surface color (usually 'surface')
    color: { type: String, default: 'surface' },
    // Custom padding classes
    padding: { type: String, default: '' },
    // Ensure overflow is hidden for image radius flushing
    overflowHidden: { type: Boolean, default: true }
  },
  template: `
    <v-card
      :to="to"
      :elevation="elevation"
      :color="color"
      class="base-surface base-surface-root"
      :class="[
        hoverLift ? 'v-card--hover-lift' : 'glass-panel',
        padding
      ]"
    >
      <slot></slot>
    </v-card>
  `
};
