const { onMounted } = Vue;
import StateFeedback from '../components/StateFeedback.js';
import BaseSurface from '../components/BaseSurface.js';
import SocialLinks from '../components/SocialLinks.js';
import BackButton from '../components/BackButton.js';
import PageHeader from '../components/PageHeader.js';
import { t } from '../i18n.js';
import { useAbout } from '../composables/useAbout.js';

export default {
  components: {
    StateFeedback,
    BaseSurface,
    SocialLinks,
    BackButton,
    PageHeader
  },
  template: `
    <v-container max-width="800" class="py-12 fade-up">
      <page-header icon="mdi-information-outline" :title="displayTitle"></page-header>

      <state-feedback :loading="loading" :error="error" skeleton-type="article"></state-feedback>

      <base-surface v-if="!loading && !error" :hover-lift="false" class="pa-0 overflow-hidden">
        <v-img
          v-if="pageData.image"
          :src="pageData.image"
          class="bg-grey-lighten-2"
          max-height="400"
          cover
        ></v-img>

        <div class="pa-8">
          <!-- About Content -->
          <v-card-text class="text-body-1 pa-0 pb-6">
            <div v-html="pageData.content" class="markdown-body" id="about-content"></div>
          </v-card-text>

          <div class="pt-0">
            <component :is="'about-custom'" :page-data="pageData" :site-config="siteConfig"></component>
          </div>
        </div>
      </base-surface>

      <back-button></back-button>
    </v-container>
  `,
  setup() {
    const { pageData, displayTitle, loading, error, siteConfig, fetchData } = useAbout();

    onMounted(fetchData);

    return { pageData, displayTitle, loading, error, t, siteConfig };
  }
};
