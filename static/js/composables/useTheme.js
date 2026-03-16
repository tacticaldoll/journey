/**
 * useTheme.js
 * Composable for managing theme personality, mode (light/dark),
 * and global interactive state (blob cursor, scroll).
 */
import { applyMermaidTheme } from '../utils/mermaidTheme.js';

const { ref, watch, nextTick } = Vue;

export function useTheme() {
    const theme = Vuetify.useTheme();

    // Resolve initial state from the current global theme name
    const initialTheme = theme.global.name.value; // e.g., 'vibrant-light'
    const [initialPersonality, initialMode] = initialTheme.split('-');

    const currentPersonality = ref(initialPersonality || 'vibrant');
    const isDark = ref(initialMode === 'dark');

    const personalities = [
        { id: 'vibrant', name: 'Vibrant', icon: 'mdi-palette' },
        { id: 'sunset', name: 'Sunset', icon: 'mdi-weather-sunset' },
        { id: 'forest', name: 'Forest', icon: 'mdi-tree' },
        { id: 'ocean', name: 'Ocean', icon: 'mdi-waves' },
        { id: 'nordic', name: 'Nordic', icon: 'mdi-snowflake' },
        { id: 'espresso', name: 'Espresso', icon: 'mdi-coffee' }
    ];

    // Watch for personality or mode changes to update Vuetify theme and sync to localStorage
    watch([currentPersonality, isDark], () => {
        const modeSuffix = isDark.value ? 'dark' : 'light';
        const newThemeName = `${currentPersonality.value}-${modeSuffix}`;

        theme.global.name.value = newThemeName;
        localStorage.setItem('user-theme', newThemeName);

        // Sync HTML class for CSS overrides
        const root = document.documentElement;
        root.classList.remove('v-theme--light', 'v-theme--dark');
        root.classList.add(`v-theme--${modeSuffix}`);

        // Sync Dynamic Mesh Colors to CSS Variables
        nextTick(() => {
            const themeObj = theme.themes.value[newThemeName];
            if (themeObj && themeObj.colors) {
                const { mesh1, mesh2, primary, secondary, background, surface } = themeObj.colors;
                document.documentElement.style.setProperty('--mesh-c1', mesh1);
                document.documentElement.style.setProperty('--mesh-c2', mesh2);
                document.documentElement.style.setProperty('--v-theme-primary', primary);
                document.documentElement.style.setProperty('--v-theme-secondary', secondary);

                // Sync Mermaid diagram colors with the active theme
                applyMermaidTheme({ primary, secondary, background, surface, dark: isDark.value });
            }
        });
    }, { immediate: true });

    return {
        currentPersonality,
        isDark,
        personalities
    };
}
