/**
 * router.js
 * Handles SPA routing and view switching (based on Vue Router).
 * 
 * Uses createWebHistory for History API based navigation.
 * Configured routes:
 * - '/' -> HomeView (fetches homepage article list)
 * - '/search' -> SearchView (implements full-site search)
 * - '/:slug(.*)' -> Catch-all route (fetches posts/categories/tags dynamically)
 */
const { createRouter, createWebHistory } = VueRouter;

import HomeView from './views/HomeView.js';
import PostView from './views/PostView.js';
import SearchView from './views/SearchView.js';
import TaxonomyView from './views/TaxonomyView.js';
import AboutView from './views/AboutView.js';
import { useScroll } from './composables/useScroll.js';

const { scrollToTop } = useScroll();

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/search',
        name: 'Search',
        component: SearchView
    },
    {
        path: '/tags/:slug*',
        name: 'Tags',
        component: TaxonomyView,
        props: { type: 'Tags' }
    },
    {
        path: '/series/:slug*',
        name: 'Series',
        component: TaxonomyView,
        props: { type: 'Series' }
    },
    {
        path: '/about/:path*',
        name: 'About',
        component: AboutView
    },
    {
        // Capture all URLs not defined above (e.g., /posts/hello)
        // Handled by PostView, which fetches the corresponding JSON from Hugo.
        path: '/:slug(.*)',
        name: 'Post',
        component: PostView
    }
];

const router = createRouter({
    // Use HTML5 History mode to avoid '#' in the URL
    history: createWebHistory(),
    routes
});

// Global Scroll & Title Update for SEO
router.afterEach((to) => {
    // Standardized scroll behavior on navigation
    scrollToTop();

    // Vue Router doesn't guarantee the view is mounted yet,
    // so we wait for the next tick to allow the View component to set the state if needed.
    Vue.nextTick(() => {
        const baseTitle = document.title.split(' - ')[0] || '';
        // Detailed logic can be added here once we have a central page state,
        // but for now, we ensure the base title is preserved.
    });
});

export default router;

