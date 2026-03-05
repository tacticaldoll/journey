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

  return {
    hydrateImages
  };
}
