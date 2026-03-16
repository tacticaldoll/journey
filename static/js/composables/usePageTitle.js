/**
 * usePageTitle.js
 * Centralized composable for managing the browser document title.
 */
const { ref, inject } = Vue;

export function usePageTitle() {
    const siteConfig = inject('siteConfig');

    /**
     * Updates the document title with consistent formatting.
     * @param {string|null} pageTitle - The title of the current page.
     */
    const setTitle = (pageTitle = null) => {
        const siteTitle = siteConfig?.value?.title || '';
        if (pageTitle && pageTitle !== siteTitle) {
            document.title = `${pageTitle} | ${siteTitle}`;
        } else {
            document.title = siteTitle;
        }
    };

    return { setTitle };
}
