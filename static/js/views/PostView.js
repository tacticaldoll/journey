/**
 * PostView.js
 * Catch-all View component for displaying single posts, pages, or taxonomy lists.
 *
 * Responsibilities:
 * 1. Watches for URL changes (Vue Router's $route.path).
 * 2. Maps the current URL to its JSON endpoint (e.g., `/posts/mypost/` -> `/posts/mypost/index.json`).
 * 3. Fetches data from the Headless Hugo server.
 * 4. Renders the HTML content from the JSON using `v-html`.
 * 5. Dynamically updates the browser document title for SEO and tab identification.
 */
const { ref, watch, onMounted } = Vue;
const { useRoute } = VueRouter;
import StateFeedback from '../components/StateFeedback.js';
import PostMeta from '../components/PostMeta.js';
import ImageLightbox from '../components/ImageLightbox.js';
import ContentLightbox from '../components/ContentLightbox.js';
import BaseSurface from '../components/BaseSurface.js';
import BackButton from '../components/BackButton.js';
import PageHeader from '../components/PageHeader.js';
import { usePost } from '../composables/usePost.js';
import { useContentHydration } from '../composables/useContentHydration.js';


export default {
  components: {
    StateFeedback,
    PostMeta,
    ImageLightbox,
    ContentLightbox,
    BaseSurface,
    BackButton,
    PageHeader
  },
  template: `
    <v-container max-width="800" class="py-12 fade-up">

      <page-header icon="mdi-file-document-outline" :title="pageData?.title || ''"></page-header>

      <state-feedback :loading="loading" :error="error" skeleton-type="article"></state-feedback>

      <!-- Pure Single Content Renderer -->
      <base-surface v-if="!loading && !error" :hover-lift="false" class="pa-0 overflow-hidden">

        <!-- Featured Image (Edge-to-edge) -->
        <v-img
          v-if="pageData.image"
          :src="pageData.image"
          max-height="450"
          cover
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
          </template>
        </v-img>

        <!-- Content Area (Padded) -->
        <div class="pa-8">
          <!-- Post Information (Date/Tags) -->
          <div class="py-0">
            <post-meta :page-data="pageData"></post-meta>
            <v-divider class="mb-8"></v-divider>
          </div>

          <!-- Markdown HTML Content -->
          <v-card-text v-if="pageData.content" class="text-body-1 pb-10" id="hugo-content">
            <div v-html="pageData.content" class="markdown-body"></div>
          </v-card-text>

          <!-- Comments Hook (Only for articles with content) -->
          <div class="pt-0" v-if="pageData.content">
            <component :is="'site-comments'"
              :key="currentRoute"
              :page-identifier="currentRoute"
            ></component>
          </div>
        </div>

      </base-surface>

      <back-button></back-button>

      <!-- Universal Image Lightbox -->
      <image-lightbox v-model:isOpen="lightboxOpen" :image-src="lightboxSrc"></image-lightbox>

      <!-- HTML Content Lightbox (For Mermaids, etc) -->
      <content-lightbox v-model:isOpen="contentLightboxOpen" :content="lightboxHtmlContent"></content-lightbox>
    </v-container>
  `,
  setup() {
    const route = useRoute();

    // Use Post Composable
    const { pageData, loading, error, fetchData } = usePost();

    // Use Content Hydration Composable
    const { hydrateImages, hydrateMermaid } = useContentHydration();

    // Lightbox Logic
    const lightboxOpen = ref(false);
    const lightboxSrc = ref('');
    const contentLightboxOpen = ref(false);
    const lightboxHtmlContent = ref('');

    const openLightbox = (src) => {
      lightboxSrc.value = src;
      lightboxOpen.value = true;
    };

    const openContentLightbox = (html) => {
      lightboxHtmlContent.value = html;
      contentLightboxOpen.value = true;
    };

    // Route Awareness
    watch(() => route.path, (newPath) => fetchData(newPath));

    // Content Hydration Trigger
    watch(() => pageData.value?.content, () => {
      if (pageData.value?.content) {
        hydrateImages('hugo-content', openLightbox);
        hydrateMermaid('hugo-content', openContentLightbox);
      }
    });

    onMounted(() => fetchData(route.path));

    const currentRoute = Vue.computed(() => route.path);

    return {
      pageData, loading, error,
      lightboxOpen, lightboxSrc,
      contentLightboxOpen, lightboxHtmlContent,
      currentRoute
    };
  }
};
