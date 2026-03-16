/**
 * useHome.js
 * Composable for managing landing page data and state.
 */
const { ref, onMounted, inject, computed } = Vue;
import { fetchContentData } from '../services/api.js';
import { useApi } from './useApi.js';
import { usePagination } from './usePagination.js';
import { usePageTitle } from './usePageTitle.js';
export function useHome() {
    const siteConfig = inject('siteConfig', ref({}));
    const { setTitle } = usePageTitle();
    
    // 1. Initialize API Composable
    const { data: pageData, loading, error, execute: fetchContent } = useApi(fetchContentData);

    // 2. Derive posts from content data
    const posts = computed(() => pageData.value?.posts || []);

    // 3. Integration with Pagination
    const {
        currentPage,
        totalPages,
        paginatedList: paginatedPosts,
        scrollToTop
    } = usePagination(posts, siteConfig.value.paginate || 5);

    const fetchData = async () => {
        await fetchContent('/');
        setTitle(); // Home page title
    };

    onMounted(fetchData);

    return {
        posts,
        paginatedPosts,
        loading,
        error,
        currentPage,
        totalPages,
        scrollToTop,
        siteConfig
    };
}
