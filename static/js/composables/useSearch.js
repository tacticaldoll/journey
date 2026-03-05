/**
 * useSearch.js
 * Composable for managing Fuse.js search logic and index loading.
 */
const { ref, watch, onMounted } = Vue;
import { fetchSearchIndex } from '../services/api.js';

export function useSearch() {
    const searchQuery = ref('');
    const results = ref([]);
    const loadingIndex = ref(true);
    let fuse = null;

    const initFuse = (items) => {
        if (!window.Fuse) {
            console.warn("Fuse.js not found in global scope.");
            return;
        }

        fuse = new window.Fuse(items, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'series', weight: 0.6 },
                { name: 'tags', weight: 0.5 },
                { name: 'summary', weight: 0.3 }
            ],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true
        });
    };

    const loadSearchIndex = async () => {
        loadingIndex.value = true;
        const { data, error } = await fetchSearchIndex();

        if (!error && data) {
            initFuse(data);
        }
        loadingIndex.value = false;
    };

    // Real-time fuzzy search
    watch(searchQuery, (newQuery) => {
        if (!fuse || !newQuery.trim()) {
            results.value = [];
            return;
        }
        results.value = fuse.search(newQuery.trim());
    });

    return {
        searchQuery,
        results,
        loadingIndex,
        loadSearchIndex
    };
}
