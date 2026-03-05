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
    item: { type: Object, required: true },
    isLast: { type: Boolean, default: false }
  },
  template: `
    <base-surface
      :to="item.url"
      :hover-lift="true"
      class="post-list-item-card"
    >
      <v-card-item class="pa-6">
        <!-- Result Title -->
        <v-card-title class="text-h6 text-primary font-weight-bold mb-1 pa-0" style="white-space: normal; line-height: 1.3;">
          {{ item.title }}
        </v-card-title>

        <!-- Result Summary & Meta -->
        <v-card-subtitle class="pa-0 mb-3">
          <div class="text-body-2 text-medium-emphasis line-clamp-2" style="white-space: normal;">
            {{ item.summary || t('ui.readMore') }}
          </div>
        </v-card-subtitle>

        <div class="d-flex align-center flex-wrap pt-1">
          <span v-if="item.date" class="text-caption mr-4 opacity-70 d-flex align-center">
            <v-icon size="x-small" class="mr-1">mdi-calendar</v-icon>{{ item.date }}
          </span>
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

