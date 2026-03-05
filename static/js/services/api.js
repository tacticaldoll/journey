/**
 * api.js
 * Data service layer for fetching JSON output from Headless Hugo.
 */

/**
 * Fetches the post data from a given path's index.json endpoint.
 *
 * @param {string} path - The router path (e.g. '/', '/posts/', '/categories/tech/')
 * @returns {Promise<{ data: Object|null, error: boolean }>}
 */
export async function fetchPostData(path) {
    try {
        // Sanitize path: remove .json, /index, and trailing slashes
        let cleanPath = path || '/';
        if (cleanPath.endsWith('.json')) cleanPath = cleanPath.slice(0, -5);
        if (cleanPath.endsWith('/index')) cleanPath = cleanPath.slice(0, -6);

        // Remove trailing slash except for root
        if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
            cleanPath = cleanPath.slice(0, -1);
        }

        // Generate endpoint: root becomes '/index.json', others become '/path/index.json'
        const endpoint = (cleanPath === '/' || cleanPath === '')
            ? '/index.json'
            : `/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}/index.json`;

        // Fetch with cache busting
        const res = await fetch(`${endpoint}?t=${Date.now()}`);

        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        return { error: false, data };
    } catch (err) {
        console.error("API fetch failed:", err);
        return { error: true, data: null };
    }
}

/**
 * Fetches the search index JSON, using sessionStorage for caching.
 * @returns {Promise<{ data: Array|null, error: boolean }>}
 */
export async function fetchSearchIndex() {
    const CACHE_KEY = 'hugo-search-index';
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            return { error: false, data: JSON.parse(cached) };
        }

        const res = await fetch('/search-index.json');
        if (!res.ok) throw new Error('Search index load failed');

        const data = await res.json();
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
        return { error: false, data };
    } catch (err) {
        console.error("Search index fetch failed:", err);
        return { error: true, data: null };
    }
}
