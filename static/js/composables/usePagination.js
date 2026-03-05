/**
 * usePagination.js
 * Vue Composable to manage pagination state and logic.
 */
const { ref, computed } = Vue;

export function usePagination(itemsRef, perPageConfig = 5) {
    const currentPage = ref(1);
    const perPage = ref(perPageConfig);

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

    // Scroll back to top after page change
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    };

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
