import BaseChip from './BaseChip.js';
import BaseSurface from './BaseSurface.js';
import { t } from '../i18n.js';

export default {
  name: 'PostCard',
  components: {
    BaseChip,
    BaseSurface
  },
  props: {
    item: { type: Object, required: true }
  },
  template: `
    <base-surface 
      class="post-list-item" 
      :to="item.url" 
    >
      <div class="post-card-inner">
        <!-- Featured Thumbnail: Force high-quality aspect ratio for vertical order -->
        <v-img
          v-if="item.image"
          :src="item.image"
          cover
          class="flex-shrink-0 post-card-featured"
        ></v-img>

        <div class="d-flex flex-column flex-grow-1 min-width-0">
          <v-card-item class="pa-8 pb-0">
            <v-card-title 
              class="font-weight-black text-primary mb-1 post-card-title" 
            >
              {{ item.title }}
            </v-card-title>
            
            <div class="d-flex align-center flex-wrap mb-2">
              <v-card-subtitle class="pa-0 d-flex align-center mr-4">
                <span v-if="item.date && item.date !== '0001-01-01'" class="d-flex align-center text-caption font-weight-bold">
                  <v-icon size="small" color="primary" class="mr-1">mdi-calendar-blank</v-icon>
                  {{ item.date }}
                </span>
              </v-card-subtitle>
              <base-chip 
                v-if="item.series && item.series.length" 
                type="series" 
                :title="item.series[0]" 
                @click.stop
              ></base-chip>
            </div>
          </v-card-item>

          <v-card-text class="pa-8 pt-2 pb-6 flex-grow-1 text-body-1 text-medium-emphasis">
            {{ item.summary || item.description || t('ui.readMore') }}
          </v-card-text>

          <div class="pa-8 pt-0 d-flex flex-wrap align-center" v-if="item.tags && item.tags.length">
            <!-- Tags (Small & Subtle) -->
              <base-chip
                v-for="tag in item.tags.slice(0, 5)"
                :key="tag"
                type="tag"
                :title="tag"
                size="small"
                @click.stop
              ></base-chip>
          </div>
        </div>
      </div>
    </base-surface>
  `,
  setup() {
    return { t };
  }
};
