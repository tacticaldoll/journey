/**
 * TaxonomyView.js
 * Unified view for displaying Tag/Series indices or filtered article lists.
 */
const { watch, onMounted, computed } = Vue;
const { useRoute } = VueRouter;
import { useTaxonomy } from '../composables/useTaxonomy.js';
import TaxonomyList from '../components/TaxonomyList.js';
import PostListItem from '../components/PostListItem.js';
import StateFeedback from '../components/StateFeedback.js';
import BaseSurface from '../components/BaseSurface.js';
import BackButton from '../components/BackButton.js';
import PageHeader from '../components/PageHeader.js';
import AnimatedList from '../components/AnimatedList.js';
import PaginationControl from '../components/PaginationControl.js';
import { t } from '../i18n.js';

export default {
  components: {
    TaxonomyList,
    PostListItem,
    StateFeedback,
    BaseSurface,
    BackButton,
    PageHeader,
    AnimatedList,
    PaginationControl
  },
  props: {
    type: { type: String, required: true } // 'Tags' or 'Series'
  },
  template: `
    <v-container max-width="800" class="py-12 fade-up">
      <page-header :icon="headerIcon" :title="pageData.title"></page-header>

      <state-feedback :loading="loading" :error="error" skeleton-type="cards"></state-feedback>

      <template v-if="!loading && !error">
        <!-- Index Mode (Cloud) -->
        <base-surface v-if="isIndexMode && pageData.list" class="pa-0 overflow-hidden" :hover-lift="false">
          <div class="pa-8">
            <taxonomy-list 
              :items="pageData.list" 
              :type="normalizedType"
              :chip-icon="null"
            ></taxonomy-list>
          </div>
        </base-surface>

        <!-- Term Mode (Post List) -->
        <v-row v-else-if="pageData.list && pageData.list.length">
          <v-col class="px-8">
            <animated-list
              :items="paginatedList"
            >
              <template #default="{ item, index }">
                <post-list-item
                  :item="item"
                  :is-last="index === paginatedList.length - 1"
                ></post-list-item>
              </template>
            </animated-list>

            <!-- Pagination -->
            <pagination-control
              v-model="currentPage"
              :total-pages="totalPages"
              :total-visible="5"
              @change="scrollToTop"
            ></pagination-control>
          </v-col>
        </v-row>
      </template>

      <back-button></back-button>
    </v-container>
  `,
  setup(props) {
    const route = useRoute();
    const {
      pageData, loading, error, currentPage, totalPages, paginatedList, isIndexMode, fetchData, scrollToTop
    } = useTaxonomy(route.path, props.type);

    const normalizedType = computed(() => {
      return props.type.toLowerCase() === 'series' ? 'series' : 'tag';
    });

    const headerIcon = computed(() => {
      return normalizedType.value === 'series' ? 'mdi-bookshelf' : 'mdi-tag';
    });

    watch(() => route.path, (newPath) => {
      fetchData(newPath);
    });

    onMounted(() => fetchData(route.path));

    return {
      pageData, loading, error, currentPage, totalPages, paginatedList, isIndexMode, headerIcon, normalizedType, t, scrollToTop
    };
  }
};
