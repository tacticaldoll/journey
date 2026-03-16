/**
 * usePost.js
 * Composable for managing single post/page data fetching and metadata.
 */
const { } = Vue; // No direct Vue hooks used in this wrapper
import { fetchContentData } from '../services/api.js';
import { useApi } from './useApi.js';
import { usePageTitle } from './usePageTitle.js';
import { useScroll } from './useScroll.js';

export function usePost() {
    const { setTitle } = usePageTitle();
    const { scrollToTop } = useScroll();

    // 1. Initialize API Composable
    const { data: pageData, loading, error, execute: fetchContent } = useApi(fetchContentData);

    const fetchData = async (path) => {
        const result = await fetchContent(path);

        if (!result.error && result.data) {
            setTitle(result.data.title);
        }

        // Standardized scroll behavior on load
        scrollToTop();
    };

    return {
        pageData,
        loading,
        error,
        fetchData
    };
}
