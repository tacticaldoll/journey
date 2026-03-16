/**
 * useContentHydration.js
 * Composable for handling DOM hydration of Markdown content rendered via v-html.
 * 
 * Responsibilities:
 * 1. Finds images within the rendered content and applies premium styling.
 * 2. Wraps images in a container for shadow and overflow control.
 * 3. Binds click events to trigger the lightbox.
 */
const { nextTick } = Vue;

export function useContentHydration() {
  /**
   * Hydrates images within a specific container.
   * @param {string} containerId - The ID of the container element holding the v-html content.
   * @param {Function} onImageClick - Callback function triggered when an image is clicked.
   */
  const hydrateImages = (containerId, onImageClick) => {
    nextTick(() => {
      const contentDiv = document.getElementById(containerId);
      if (!contentDiv) return;

      const images = contentDiv.querySelectorAll('.markdown-body img:not([data-lightbox-bound="true"])');
      images.forEach(img => {
        img.setAttribute('data-lightbox-bound', 'true');

        // Create wrapper for premium aesthetic
        const wrapper = document.createElement('div');
        wrapper.className = 'markdown-image-wrapper';

        // Insert wrapper before img and move img inside
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Apply premium interaction classes
        img.classList.add('cursor-pointer', 'img-hover-zoom');

        if (onImageClick) {
          img.addEventListener('click', () => onImageClick(img.src));
        }
      });
    });
  };

  /**
   * Hydrates mermaid diagrams within a specific container.
   * @param {string} containerId - The ID of the container element holding the v-html content.
   * @param {Function} onMermaidClick - Callback function triggered when a diagram is clicked.
   */
  const hydrateMermaid = (containerId, onMermaidClick) => {
    nextTick(() => {
      const contentDiv = document.getElementById(containerId);
      if (!contentDiv) return;

      if (window.mermaid) {
        // Detect dark mode from the document root (Standard Antigravity/Vuetify pattern)
        const isDark = document.documentElement.classList.contains('v-theme--dark') || 
                       document.body.classList.contains('v-theme--dark');
        
        // Configure mermaid for premium look
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-body)',
          // Fix for vuetify/shadow DOM issues if they arise
          dompurifyConfig: {
            ADD_TAGS: ['foreignObject']
          }
        });

        const elements = contentDiv.querySelectorAll('.mermaid');
        if (elements.length > 0) {
          // Explicitly re-run init on all mermaid elements
          // Using unique IDs if possible, but mermaid.init supports list
          mermaid.init(undefined, elements);
          
          if (onMermaidClick) {
            elements.forEach(el => {
              el.style.cursor = 'zoom-in';
              el.addEventListener('click', () => {
                onMermaidClick(el.innerHTML);
              });
            });
          }
        }
      }
    });
  };

  return {
    hydrateImages,
    hydrateMermaid
  };
}
