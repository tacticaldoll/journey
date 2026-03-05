/**
 * useTheme.js
 * Composable for managing theme personality, mode (light/dark), 
 * and global interactive state (blob cursor, scroll).
 */
const { ref, watch, onMounted, onUnmounted, nextTick } = Vue;

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

        // Sync Dynamic Mesh Colors to CSS Variables
        nextTick(() => {
            const themeObj = theme.themes.value[newThemeName];
            if (themeObj && themeObj.colors) {
                const { mesh1, mesh2 } = themeObj.colors;
                document.documentElement.style.setProperty('--mesh-c1', mesh1);
                document.documentElement.style.setProperty('--mesh-c2', mesh2);
            }
        });
    }, { immediate: true });

    // v3.0 Radical Interactive Logic
    const blobX = ref(0);
    const blobY = ref(0);
    const scrollY = ref(0);

    const handleMouseMove = (e) => {
        blobX.value = e.clientX;
        blobY.value = e.clientY;
    };

    const handleScroll = () => {
        scrollY.value = window.scrollY;
    };

    onMounted(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        currentPersonality,
        isDark,
        personalities,
        blobX,
        blobY,
        scrollY
    };
}
