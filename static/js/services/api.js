/**
 * api.js
 * Data service layer for fetching JSON output from Headless Hugo.
 */

/**
 * Universal internal helper to handle fetch requests, caching, and error logging.
 *
 * @param {string} url - Target endpoint.
 * @param {Object} config - { cache: boolean, storageKey: string }
 * @returns {Promise<{ data: Object|null, error: boolean }>}
 */
async function request(url, { cache = true, storageKey = null } = {}) {
    // 1. Check persistent cache if storageKey provided
    if (storageKey) {
        try {
            const cached = sessionStorage.getItem(storageKey);
            if (cached) return { error: false, data: JSON.parse(cached) };
        } catch (e) { /* silent fail on parse */ }
    }

    try {
        // 2. Execute fetch with optional cache buster
        const finalUrl = cache ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;
        const res = await fetch(finalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();

        // 3. Update persistent cache
        if (storageKey && data) {
            sessionStorage.setItem(storageKey, JSON.stringify(data));
        }

        return { error: false, data };
    } catch (err) {
        console.error(`[API] ${err.message} (${url})`);
        return { error: true, data: null };
    }
}

/**
 * Fetches the site-wide configuration from the root index.json.
 */
export async function fetchSiteData() {
    return request('/index.json');
}

/**
 * Fetches Hugo content JSON (posts, pages, taxonomies) from a given path.
 */
export async function fetchContentData(path) {
    const segments = (path || '/').split('/').filter(Boolean);
    const normalizedPath = segments.length > 0 ? `/${segments.join('/')}` : '';
    return request(`${normalizedPath}/index.json`);
}


/**
 * Fetches the search index JSON with session caching.
 */
export async function fetchSearchIndex() {
    return request('/search-index.json', { cache: false, storageKey: 'hugo-search-index' });
}
