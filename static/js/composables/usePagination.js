/**
 * usePagination.js
 * Vue Composable to manage pagination state and logic.
 */
const { ref, computed } = Vue;
import { useScroll } from './useScroll.js';

export function usePagination(itemsRef, perPageConfig = 5) {
    const currentPage = ref(1);
    const perPage = ref(perPageConfig);
    const { scrollToTop } = useScroll();

    // Compute items for the current page
    const paginatedList = computed(() => {
        const items = itemsRef.value || [];
        const start = (currentPage.value - 1) * perPage.value;
        const end = start + perPage.value;
        return items.slice(start, end);
    });

    // Compute total pages
    const totalPages = computed(() => {
        const items = itemsRef.value || [];
        return Math.ceil(items.length / perPage.value);
    });

    const resetPagination = () => {
        currentPage.value = 1;
    };

    return {
        currentPage,
        perPage,
        paginatedList,
        totalPages,
        scrollToTop,
        resetPagination
    };
}
