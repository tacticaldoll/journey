/**
 * useTaxonomy.js
 * Composable for managing taxonomy state and logic (Tags/Series).
 */
const { ref, computed, watch } = Vue;
import { fetchPostData } from '../services/api.js';
import { usePagination } from './usePagination.js';
import { t } from '../i18n.js';

export function useTaxonomy(initialPath, taxonomyType = 'Tags') {
    const pageData = ref({ title: '', list: [] });
    const loading = ref(true);
    const error = ref(false);

    // Use Pagination Composable
    const listData = computed(() => pageData.value.list || []);
    const { currentPage, totalPages, paginatedList } = usePagination(listData, 10);

    const fetchData = async (currentPath) => {
        loading.value = true;
        error.value = false;
        pageData.value = { title: '', list: [] }; // Reset state to prevent leakage

        const { data, error: fetchError } = await fetchPostData(currentPath);

        if (fetchError || !data) {
            error.value = true;
        } else {
            pageData.value = data;
            currentPage.value = 1;

            // Update Document Title
            const siteTitle = t('ui.siteTitle');
            document.title = `${pageData.value.title} | ${siteTitle}`;
        }
        loading.value = false;
    };

    // Determine if we are in "Index Mode" (displaying all tags/series)
    const isIndexMode = computed(() => {
        const title = pageData.value.title?.toLowerCase() || '';
        return title === 'tags' || title === 'series';
    });

    return {
        pageData,
        loading,
        error,
        currentPage,
        totalPages,
        paginatedList,
        isIndexMode,
        fetchData
    };
}
