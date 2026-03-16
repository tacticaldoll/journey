const { ref, inject, computed } = Vue;
import { fetchContentData } from '../services/api.js';
import { useApi } from './useApi.js';
import { usePageTitle } from './usePageTitle.js';
import { t } from '../i18n.js';

export function useAbout() {
    const siteConfig = inject('siteConfig', ref({ social: {} }));
    const { setTitle } = usePageTitle();

    // 1. Initialize API Composable
    const { data: pageData, loading, error, execute: fetchContent } = useApi(fetchContentData);

    const displayTitle = computed(() => pageData.value?.title || t('menu.about'));

    const fetchData = async () => {
        await fetchContent('/about/');
        setTitle(displayTitle.value);
    };

    return { pageData, loading, error, displayTitle, siteConfig, fetchData };
}
