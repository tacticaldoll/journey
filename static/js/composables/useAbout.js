const { ref, inject, computed } = Vue;
import { fetchPostData } from '../services/api.js';
import { t } from '../i18n.js';

/**
 * useAbout.js
 * Composable encapsulating all data-fetching logic for AboutView.
 * Follows the same structural pattern as usePost.js.
 */
export function useAbout() {
    const pageData = ref({});
    const loading = ref(true);
    const error = ref(false);
    const siteConfig = inject('siteConfig', ref({ social: {} }));

    const displayTitle = computed(() => pageData.value.title || t('menu.about'));

    const fetchData = async () => {
        loading.value = true;
        error.value = false;
        const { data, error: fetchError } = await fetchPostData('/about/');
        if (fetchError || !data) {
            error.value = true;
        } else {
            pageData.value = data;
            document.title = `${displayTitle.value} | ${siteConfig.value.title || ''}`;
        }
        loading.value = false;
    };

    return { pageData, loading, error, displayTitle, siteConfig, fetchData };
}
