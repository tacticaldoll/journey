const { ref, computed } = Vue;
import { t } from '../i18n.js';
import TaxonomyChip from './TaxonomyChip.js';

/**
 * TaxonomyList.js
 * A generic component for displaying a collection of taxonomy terms (Tags, Series, etc.).
 * 
 * Responsibilities:
 * 1. Provides a filterable list of taxonomy items.
 * 2. Renders items using TaxonomyChip.
 * 3. Handles sorting and filtering logic.
 */
export default {
  name: 'TaxonomyList',
  components: {
    TaxonomyChip
  },
  props: {
    items: { type: Array, default: () => [] },
    type: { type: String, required: true }, // 'tag' or 'series'
    chipIcon: { type: String, default: null }
  },
  template: `
    <div class="taxonomy-list-container">
      <!-- Filter Bar -->
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        :label="t('ui.searchHint')"
        variant="outlined"
        clearable
        class="mb-8 rounded-xl"
        hide-details
        density="comfortable"
      ></v-text-field>

      <!-- Filtered Content -->
      <v-fade-transition hide-on-leave>
        <div v-if="filteredItems.length > 0" class="d-flex flex-wrap justify-center" key="results">
          <div
            v-for="(item, index) in filteredItems"
            :key="item.url || item.title || index"
            class="fade-up ma-2"
            :style="{ animationDelay: (index * 0.03) + 's' }"
          >
            <taxonomy-chip 
              :item="item" 
              :type="type" 
              :icon="chipIcon"
            ></taxonomy-chip>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 opacity-60" key="empty">
          <v-icon size="64" class="mb-4">mdi-filter-variant-remove</v-icon>
          <div class="text-h6 font-weight-bold">
            {{ t('ui.noResults') }} "{{ searchQuery }}"
          </div>
        </div>
      </v-fade-transition>
    </div>
  `,
  setup(props) {
    const searchQuery = ref('');

    const filteredItems = computed(() => {
      const query = searchQuery.value?.toLowerCase().trim();
      const items = Array.isArray(props.items) ? props.items : [];

      const sorted = [...items].sort((a, b) => (b.count || 0) - (a.count || 0));

      if (!query) return sorted;

      return sorted.filter(item =>
        item.title?.toLowerCase().includes(query)
      );
    });

    return { searchQuery, filteredItems, t };
  }
};
