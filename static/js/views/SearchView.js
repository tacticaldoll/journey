/**
 * SearchView.js
 * Independent search view component.
 *
 * Responsibilities:
 * 1. Loads the static search index from `/search-index.json` on initialization.
 * 2. Instantiates Fuse.js for high-speed fuzzy searching.
 * 3. Binds a Vuetify v-text-field for keyword input and real-time filtering.
 * 4. Displays filtered results in a clickable list.
 */
const { onMounted, computed } = Vue;
import { t } from '../i18n.js';
import PostListItem from '../components/PostListItem.js';
import BaseSurface from '../components/BaseSurface.js';
import BackButton from '../components/BackButton.js';
import PageHeader from '../components/PageHeader.js';
import AnimatedList from '../components/AnimatedList.js';
import { useSearch } from '../composables/useSearch.js';

export default {
  components: {
    PostListItem,
    BaseSurface,
    BackButton,
    PageHeader,
    AnimatedList
  },
  template: `
    <v-container max-width="800" class="py-12 fade-up">
      <page-header icon="mdi-magnify" :title="t('menu.search')"></page-header>

      <!-- Search Input Field -->
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        :label="t('ui.searchHint')"
        variant="outlined"
        clearable
        :loading="loadingIndex"
        class="mb-6 rounded-xl"
        hide-details
      ></v-text-field>

      <!-- Search Results Area -->
      <template v-if="searchQuery && !loadingIndex">

        <!-- No matching results -->
        <base-surface v-if="flatResults.length === 0" class="pa-8 text-center" :hover-lift="false">
          <v-icon size="large" class="mb-2">mdi-flask-empty-outline</v-icon>
          <br>
          {{ t('ui.noResults') }} "{{ searchQuery }}"
        </base-surface>

        <!-- Matching results found: Display list -->
        <animated-list
          v-else
          :items="flatResults"
          :delay-step="0.05"
        >
          <template #default="{ item, index }">
            <post-list-item
              :item="item"
            ></post-list-item>
          </template>
        </animated-list>
      </template>

      <!-- Search Hint -->
      <v-alert
        v-if="!searchQuery && !loadingIndex"
        icon="mdi-information"
        text="Enter keywords above to start searching."
        variant="tonal"
        color="info"
      ></v-alert>

      <back-button></back-button>

    </v-container>
  `,
  setup() {
    const { searchQuery, results, loadingIndex, loadSearchIndex } = useSearch();

    // Unwrap Fuse.js { item, score } wrapper objects into plain post objects
    const flatResults = computed(() => results.value.map(r => r.item));

    onMounted(() => {
      loadSearchIndex();
      // document.title is handled by useSearch composable
    });

    return { searchQuery, flatResults, loadingIndex, t };
  }
};
