/**
 * AppDrawer.js
 * Mobile navigation drawer component.
 */
import { t } from '../i18n.js';

export default {
  props: {
    modelValue: { type: Boolean, required: true },
    personalities: { type: Array, required: true },
    currentPersonality: { type: String, required: true }
  },
  emits: ['update:modelValue', 'update:currentPersonality'],
  setup(props, { emit }) {
    const handlePersonalityChange = (id) => {
      emit('update:currentPersonality', id);
      emit('update:modelValue', false);
    };

    const closeDrawer = () => emit('update:modelValue', false);

    return { handlePersonalityChange, closeDrawer, t };
  },
  template: `
    <v-navigation-drawer 
      :model-value="modelValue" 
      @update:model-value="$emit('update:modelValue', $event)"
      temporary 
      class="glass-panel"
    >
      <v-list class="mt-4">
        <v-list-item to="/" exact prepend-icon="mdi-home" :title="t('menu.home')" @click="closeDrawer"></v-list-item>
        <v-list-item to="/series/" prepend-icon="mdi-bookshelf" :title="t('menu.series')" @click="closeDrawer"></v-list-item>
        <v-list-item to="/tags/" prepend-icon="mdi-tag-multiple" :title="t('menu.tags')" @click="closeDrawer"></v-list-item>
        <v-list-item to="/about/" prepend-icon="mdi-information-outline" :title="t('menu.about')" @click="closeDrawer"></v-list-item>
      </v-list>
      <v-divider class="my-4"></v-divider>
      <v-list>
        <!-- Personality Selector in Drawer -->
        <v-list-group value="Themes">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" prepend-icon="mdi-palette" title="Theme Style"></v-list-item>
          </template>
          <v-list-item 
            v-for="p in personalities" 
            :key="p.id" 
            @click="handlePersonalityChange(p.id)"
            :active="currentPersonality === p.id"
            color="primary"
          >
            <template v-slot:prepend><v-icon :icon="p.icon"></v-icon></template>
            <v-list-item-title class="font-weight-medium">{{ p.name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  `
};
