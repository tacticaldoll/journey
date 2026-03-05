import router from './router.js';
import { currentLocale, toggleLanguage, t } from './i18n.js';
import { useTheme } from './composables/useTheme.js';
import { formatT } from './utils/i18nHelper.js';
import AppHeader from './components/AppHeader.js';
import AppDrawer from './components/AppDrawer.js';

/**
 * App.js
 * Root Component of the Vue application.
 * 
 * Responsibilities:
 * 1. Orchestrates the global layout using modular components.
 * 2. Manages root-level theme and interactive states.
 */
export default {
  components: {
    AppHeader,
    AppDrawer
  },
  setup() {
    const {
      currentPersonality, isDark, personalities,
      blobX, blobY, scrollY
    } = useTheme();

    // Global Site Configuration (Injected from main.js)
    const siteConfig = Vue.inject('siteConfig', Vue.ref({ title: '', social: {}, menu: [] }));

    const copyrightText = Vue.computed(() => {
      return formatT('ui.copyright', {
        year: new Date().getFullYear(),
        title: siteConfig.value.title || ''
      });
    });

    const drawer = Vue.ref(false);

    return {
      currentPersonality, isDark, personalities,
      currentLocale, toggleLanguage, t,
      siteConfig, copyrightText,
      drawer,
      blobX, blobY, scrollY
    };
  },
  template: `
    <v-app :style="{ '--blob-x': blobX + 'px', '--blob-y': blobY + 'px', '--scroll-y': scrollY + 'px' }">
      <!-- v3.0 Radical Background Elements -->
      <div id="cursor-blob" :style="{ left: 'var(--blob-x)', top: 'var(--blob-y)' }"></div>
      <div class="parallax-text" :style="{ transform: 'translateY(calc(var(--scroll-y) * -0.2))', left: '10%', top: '20%' }">
        {{ siteConfig.title }}
      </div>
      <div class="parallax-text" :style="{ transform: 'translateY(calc(var(--scroll-y) * -0.5))', right: '5%', bottom: '10%' }">
        {{ t('menu.posts') }}
      </div>

      <!-- Modular Header -->
      <app-header
        :site-config="siteConfig"
        v-model:current-personality="currentPersonality"
        v-model:is-dark="isDark"
        :personalities="personalities"
        :current-locale="currentLocale"
        @toggle-language="toggleLanguage"
        @toggle-drawer="drawer = !drawer"
      ></app-header>

      <!-- Modular Drawer -->
      <app-drawer
        v-model="drawer"
        :personalities="personalities"
        v-model:current-personality="currentPersonality"
      ></app-drawer>

      <!-- Main Content Area with Entry Animation -->
      <v-main class="fade-up">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-main>

      <!-- Footer with Glassmorphism and Social Links -->
      <v-footer class="glass-panel text-center d-flex flex-column py-10 mt-10 fade-up" style="border-top: 1px solid var(--glass-border) !important; animation-delay: 0.5s;">
        
        <!-- Dynamic Custom Footer Component Hook -->
        <component :is="'custom-footer'" :site-config="siteConfig"></component>

        <div class="text-body-1 font-weight-bold mb-2 mt-4" style="font-family: var(--font-heading) !important;">
          {{ siteConfig.title }}
        </div>
        <div class="text-body-2 font-weight-medium opacity-70">
          {{ copyrightText }}
        </div>
      </v-footer>
    </v-app>
  `
};
