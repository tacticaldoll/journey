import { t } from '../i18n.js';
import { slugify } from '../utils/slugify.js';
import BaseChip from './BaseChip.js';

export default {
  name: 'PostMeta',
  components: {
    BaseChip
  },
  props: {
    pageData: { type: Object, required: true }
  },
  template: `
    <div class="px-0 pb-2 pt-0 d-flex align-center flex-wrap postcard-meta">
      <v-card-subtitle class="pa-0 d-flex align-center flex-wrap mr-4" style="opacity: 1 !important;">
        <span v-if="pageData.author" class="mr-4">
          <span class="text-caption d-inline-flex align-center cursor-default">
            <v-icon start icon="mdi-account-edit-outline" size="small"></v-icon>
            {{ t('ui.author') }}: {{ pageData.author }}
          </span>
        </span>
        <span v-if="pageData.readingTime" class="mr-4">
          <span class="text-caption d-inline-flex align-center cursor-default">
            <v-icon start icon="mdi-clock-outline" size="small"></v-icon>
            {{ t('ui.readingTime', { min: pageData.readingTime }) }}
          </span>
        </span>
        <span v-if="pageData.wordCount" class="mr-4">
          <span class="text-caption d-inline-flex align-center cursor-default">
            <v-icon start icon="mdi-file-word-outline" size="small"></v-icon>
            {{ t('ui.words', { count: pageData.wordCount }) }}
          </span>
        </span>
      </v-card-subtitle>
      
      <div class="d-flex align-center flex-wrap">
        <span v-if="pageData.series && pageData.series.length" class="mr-2">
          <base-chip
            v-for="serie in pageData.series"
            :key="serie"
            type="series"
            :title="serie"
          ></base-chip>
        </span>
        <span v-if="pageData.tags && pageData.tags.length">
          <base-chip
            v-for="tag in pageData.tags"
            :key="tag"
            type="tag"
            :title="tag"
            size="small"
          ></base-chip>
        </span>
      </div>
    </div>
  `,
  setup() {
    return { t, slugify };
  }
};
