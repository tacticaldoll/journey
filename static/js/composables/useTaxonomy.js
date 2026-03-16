/**
 * useTaxonomy.js
 * Composable for managing taxonomy state and logic (Tags/Series).
 */
const { ref, computed } = Vue;
import { fetchContentData } from '../services/api.js';
import { useApi } from './useApi.js';
import { usePagination } from './usePagination.js';
import { usePageTitle } from './usePageTitle.js';

export function useTaxonomy() {
    const { setTitle } = usePageTitle();

    // 1. Initialize API Composable
    const { data: pageData, loading, error, execute: fetchContent } = useApi(fetchContentData);

    // 2. Integration with Pagination
    const listData = computed(() => pageData.value?.list || []);
    const { currentPage, totalPages, paginatedList, scrollToTop } = usePagination(listData, 10);

    const fetchData = async (currentPath) => {
        const result = await fetchContent(currentPath);

        if (!result.error && result.data) {
            currentPage.value = 1;
            setTitle(result.data.title);
        }
    };

    // Determine if we are in "Index Mode" (displaying all tags/series)
    const isIndexMode = computed(() => {
        const title = pageData.value?.title?.toLowerCase() || '';
        return title === 'tags' || title === 'series';
    });

    return {
        pageData,
        loading,
        error,
        currentPage,
        totalPages,
        paginatedList,
        scrollToTop,
        isIndexMode,
        fetchData
    };
}
