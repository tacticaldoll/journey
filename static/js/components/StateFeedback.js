import { t } from '../i18n.js';

export default {
  name: 'StateFeedback',
  props: {
    loading: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    skeletonType: { type: String, default: 'article' } // 'article' or 'cards'
  },
  template: `
    <div>
      <template v-if="loading">
        <template v-if="skeletonType === 'cards'">
          <div class="post-list-feed">
            <v-card v-for="i in 3" :key="i" class="rounded-3xl overflow-hidden glass-panel" elevation="0">

              <div class="d-flex flex-column flex-md-row">
                <v-skeleton-loader width="400" height="225" type="image" class="flex-shrink-0"></v-skeleton-loader>
                <div class="flex-grow-1 pa-7">
                  <v-skeleton-loader type="heading" class="mb-4"></v-skeleton-loader>
                  <v-skeleton-loader type="subtitle" class="mb-4"></v-skeleton-loader>
                  <v-skeleton-loader type="text, text" class="mb-4"></v-skeleton-loader>
                  <v-skeleton-loader type="chip" class="mt-auto"></v-skeleton-loader>
                </div>
              </div>
            </v-card>
          </div>
        </template>
        <template v-else>
          <v-skeleton-loader type="heading" class="mb-4"></v-skeleton-loader>
          <v-skeleton-loader type="subtitle" class="mb-4"></v-skeleton-loader>
          <v-skeleton-loader type="paragraph, paragraph, paragraph"></v-skeleton-loader>
        </template>
      </template>

      <v-alert
        v-else-if="error"
        type="error"
        :title="t('ui.loadingFailed')"
        :text="t('ui.notFoundText')"
        variant="tonal"
        class="mt-4"
      >
        <template v-slot:append>
          <v-btn color="error" variant="text" to="/">{{ t('ui.backToHome') }}</v-btn>
        </template>
      </v-alert>
    </div>
  `,
  setup() {
    return { t };
  }
};
