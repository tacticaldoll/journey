/**
 * usePost.js
 * Composable for managing single post/page data fetching and metadata.
 */
const { ref, watch, onMounted, inject } = Vue;
import { fetchPostData } from '../services/api.js';
import { t } from '../i18n.js';

export function usePost(routePath) {
    const pageData = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const siteConfig = inject('siteConfig', ref({}));

    const fetchData = async (path) => {
        loading.value = true;
        error.value = false;

        const { data, error: fetchError } = await fetchPostData(path);

        if (fetchError || !data) {
            error.value = true;
        } else {
            pageData.value = data;

            // Update Document Title
            const siteTitle = siteConfig.value.title || '';
            if (pageData.value.title) {
                document.title = `${pageData.value.title} | ${siteTitle}`;
            }
        }

        loading.value = false;

        // Standardized scroll behavior on load
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

    return {
        pageData,
        loading,
        error,
        fetchData
    };
}
