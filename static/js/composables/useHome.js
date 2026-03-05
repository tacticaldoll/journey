/**
 * useHome.js
 * Composable for managing landing page data and state.
 */
const { ref, onMounted, inject } = Vue;
import { fetchPostData } from '../services/api.js';
import { usePagination } from './usePagination.js';
import { t } from '../i18n.js';

export function useHome() {
    const posts = ref([]);
    const loading = ref(true);
    const siteConfig = inject('siteConfig', ref({}));

    // Integration with Pagination
    const {
        currentPage,
        totalPages,
        paginatedList: paginatedPosts,
        scrollToTop
    } = usePagination(posts, siteConfig.value.paginate || 5);

    const fetchData = async () => {
        loading.value = true;
        const { data, error } = await fetchPostData('/');
        if (!error && data && data.posts) {
            posts.value = data.posts;
        } else {
            posts.value = [];
        }
        loading.value = false;

        // Set home page title
        document.title = `${t('ui.siteTitle')}`;
    };

    onMounted(fetchData);

    return {
        posts,
        paginatedPosts,
        loading,
        currentPage,
        totalPages,
        scrollToTop,
        siteConfig
    };
}
