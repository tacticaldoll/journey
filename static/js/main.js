/**
 * main.js
 * Main entry point of the application.
 * Responsible for initializing Vue, registering Vuetify plugins, and mounting the Vue Router and Root component.
 */
const { createApp } = Vue;
const { createVuetify } = Vuetify;

import router from './router.js';
import App from './App.js';
import { fetchSiteData } from './services/api.js';
import { themeConfig } from './config/themes.js';

// Read stored theme from localStorage, default to vibrant-light
const savedTheme = localStorage.getItem('user-theme') || 'vibrant-light';

// Initialize Vuetify instance (Define 6 Personalities x 2 Modes = 12 Themes)
const vuetify = createVuetify({
    theme: {
        defaultTheme: savedTheme,
        themes: themeConfig
    }
});

// Dynamic component factories for Hugo-injected templates
const createDynamicComponent = (id, props = []) => ({
    template: `#${id}`,
    props: props.reduce((acc, p) => ({ ...acc, [p]: { type: Object, default: () => ({}) } }), {})
});

const SiteComments = {
    template: '#comments-template',
    props: {
        pageUrl: { type: String, default: '' },
        pageIdentifier: { type: String, default: '' }
    },
    setup(props) {
        const emitLoadEvent = () => {
            Vue.nextTick(() => {
                const event = new CustomEvent('site-comments-load', {
                    detail: {
                        pageUrl: props.pageUrl || window.location.href,
                        pageIdentifier: props.pageIdentifier || window.location.pathname
                    }
                });
                window.dispatchEvent(event);
            });
        };

        Vue.onMounted(emitLoadEvent);
        Vue.watch(() => props.pageIdentifier, emitLoadEvent);

        return {};
    }
};

const CustomFooter = createDynamicComponent('footer-custom-template', ['siteConfig']);
const CustomHomeBanner = createDynamicComponent('home-banner-custom-template', ['siteConfig']);
const CustomAbout = createDynamicComponent('about-custom-template', ['pageData', 'siteConfig']);


// Create Vue application instance
const app = createApp({
    setup() {
        const siteConfig = Vue.ref({ title: '', social: {}, menu: [] });

        const hideLoadingGuide = () => {
            const guide = document.getElementById('loading-guide');
            if (guide) {
                guide.classList.add('loading-guide-hidden');
                setTimeout(() => guide.remove(), 800);
            }
        };

        Vue.onMounted(async () => {
            const { data, error } = await fetchSiteData();
            if (!error && data && data.config) {
                Object.assign(siteConfig.value, data.config);
            }
            hideLoadingGuide();
        });

        Vue.provide('siteConfig', siteConfig);
    },
    render: () => Vue.h(App)
});

// Register global components
app.component('site-comments', SiteComments);
app.component('custom-footer', CustomFooter);
app.component('custom-home-banner', CustomHomeBanner);
app.component('about-custom', CustomAbout);

// Register plugin dependencies
app.use(router);
app.use(vuetify);

// Mount to the #app node in the DOM
app.mount('#app');
