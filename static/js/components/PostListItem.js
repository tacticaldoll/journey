/**
 * PostListItem.js
 * Atomic component for rendering a single post/article entry in a collection list.
 * 
 * Used by: SearchView, TagsView, SeriesView.
 * Aligns with the premium visual style of the Search interface.
 */
import BaseChip from './BaseChip.js';
import BaseSurface from './BaseSurface.js';
import { t } from '../i18n.js';

export default {
  components: {
    BaseChip,
    BaseSurface
  },
  props: {
    item: { type: Object, required: true }
  },
  template: `
    <base-surface
      :to="item.url"
    >
      <v-card-item class="pa-6">
        <!-- Result Title -->
        <v-card-title class="text-h6 text-primary font-weight-bold mb-1">
          {{ item.title }}
        </v-card-title>

        <!-- Result Summary -->
        <v-card-text class="pa-0 mb-3 text-body-2 text-medium-emphasis">
          {{ item.description || item.summary || t('ui.readMore') }}
        </v-card-text>

        <!-- Result Meta -->
        <div class="d-flex align-center flex-wrap pt-1">
          <v-card-subtitle class="pa-0 mr-4 d-flex align-center">
            <span v-if="item.date && item.date !== '0001-01-01'" class="text-caption font-weight-bold d-flex align-center">
              <v-icon size="x-small" color="primary" class="mr-1">mdi-calendar-blank</v-icon>{{ item.date }}
            </span>
          </v-card-subtitle>
          <base-chip
            v-if="item.series && item.series.length"
            type="series"
            :title="item.series[0]"
            size="small"
          ></base-chip>
          <base-chip
            v-for="tag in item.tags"
            :key="tag"
            type="tag"
            :title="tag"
            size="small"
          ></base-chip>
        </div>
      </v-card-item>
    </base-surface>
  `,
  setup() {
    return { t };
  }
};

