/**
 * AppHeader.js
 * Navigation bar component for the application.
 */
import { t } from '../i18n.js';

export default {
  props: {
    siteConfig: { type: Object, required: true },
    currentPersonality: { type: String, required: true },
    isDark: { type: Boolean, required: true },
    personalities: { type: Array, required: true },
    currentLocale: { type: String, required: true }
  },
  emits: ['update:currentPersonality', 'update:isDark', 'toggle-language', 'toggle-drawer'],
  setup(props, { emit }) {
    const handlePersonalityChange = (id) => emit('update:currentPersonality', id);
    const toggleDarkMode = () => emit('update:isDark', !props.isDark);
    const toggleLanguage = () => emit('toggle-language');
    const toggleDrawer = () => emit('toggle-drawer');

    return {
      handlePersonalityChange,
      toggleDarkMode,
      toggleLanguage,
      toggleDrawer,
      t
    };
  },
  template: `
    <v-app-bar 
      flat 
      class="glass-panel px-md-10 sticky-nav" 
      style="top: 0;"
    >
      <!-- Mobile Hamburger Menu -->
      <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="toggleDrawer"></v-app-bar-nav-icon>

      <v-app-bar-title 
        class="font-weight-black text-h5 primary--text cursor-pointer" 
        @click="$router.push('/')"
        style="font-family: var(--font-heading) !important;"
      >
        {{ siteConfig.title || '' }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation Buttons -->
      <div class="hidden-sm-and-down">
        <v-btn to="/" variant="text" class="font-weight-bold">{{ t('menu.home') }}</v-btn>
        <v-btn to="/series/" variant="text" class="font-weight-bold">{{ t('menu.series') }}</v-btn>
        <v-btn to="/tags/" variant="text" class="font-weight-bold">{{ t('menu.tags') }}</v-btn>
        <v-btn to="/about/" variant="text" class="font-weight-bold">{{ t('menu.about') }}</v-btn>
      </div>
      
      <v-divider vertical class="mx-2 my-auto hidden-sm-and-down" style="height: 24px"></v-divider>

      <!-- Language Switcher -->
      <v-btn variant="text" @click="toggleLanguage" class="font-weight-bold mx-1" title="Switch Language">
        <v-icon start>mdi-translate</v-icon>
        {{ currentLocale === 'en' ? 'EN' : '繁' }}
      </v-btn>

      <v-divider vertical class="mx-2 my-auto" style="height: 24px"></v-divider>

      <!-- Personality Selector Menu (Desktop Only) -->
      <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" :title="'Switch color scheme: ' + currentPersonality" class="hidden-sm-and-down">
            <v-icon>mdi-palette-outline</v-icon>
          </v-btn>
        </template>
        <v-list class="glass-panel">
          <v-list-item 
            v-for="p in personalities" 
            :key="p.id" 
            @click="handlePersonalityChange(p.id)"
            :active="currentPersonality === p.id"
            color="primary"
          >
            <template v-slot:prepend>
              <v-icon :icon="p.icon"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">{{ p.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Light/Dark Mode Toggle -->
      <v-btn icon @click="toggleDarkMode" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <v-icon>{{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <v-btn icon to="/search">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>
  `
};
