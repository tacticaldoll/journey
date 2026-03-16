/**
 * useScroll.js
 * Vue Composable for managing scroll behavior within the Fixed-Viewport Architecture.
 * Targets the .v-application container for all scroll operations.
 */
export function useScroll() {
  /**
   * Scrolls the main application container to the top.
   * @param {Object} options - Scroll options (e.g., { behavior: 'smooth' }).
   */
  const scrollToTop = (options = { top: 0, behavior: 'auto' }) => {
    // In Fixed-Viewport Model, the scrollable element is .v-application (Vuetify root)
    const scrollContainer = document.querySelector('.v-application');
    if (scrollContainer) {
      scrollContainer.scrollTo(options);
    } else {
      // Fallback if searched before Vuetify mount
      window.scrollTo(options);
    }
  };

  return {
    scrollToTop
  };
}
