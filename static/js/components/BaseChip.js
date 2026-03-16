const { ref, computed } = Vue;
import { slugify } from '../utils/slugify.js';

export default {
    name: 'BaseChip',
    props: {
        type: { type: String, required: true, validator: v => ['tag', 'series'].includes(v) },
        title: { type: String, required: true },
        icon: { type: String, default: null },
        to: { type: String, default: null },
        size: { type: String, default: null }
    },
    template: `
    <v-chip
      v-bind="chipProps"
      :to="targetUrl"
      :ripple="false"
      @click="handleClick"
    >
      <v-icon start :icon="displayIcon" :size="type === 'tag' ? 'x-small' : 'small'"></v-icon>
      {{ type === 'tag' ? '#' + title : title }}
      <slot name="append"></slot>
    </v-chip>
  `,
    setup(props, { emit }) {
        const chipProps = computed(() => {
            const isSeries = props.type === 'series';
            return {
                size: props.size || 'small',
                color: isSeries ? 'secondary' : 'primary',
                variant: 'tonal',
                class: isSeries ? 'font-weight-bold px-3' : 'font-weight-medium'
            };
        });

        const displayIcon = computed(() => {
            if (props.icon) return props.icon;
            return props.type === 'series' ? 'mdi-bookshelf' : 'mdi-tag-outline';
        });

        const targetUrl = computed(() => {
            if (props.to) return props.to;
            const prefix = props.type === 'series' ? '/series/' : '/tags/';
            return prefix + slugify(props.title) + '/';
        });

        const handleClick = (e) => {
            if (!props.to) {
                emit('chip-click', { type: props.type, title: props.title, url: targetUrl.value });
            }
        };

        return { chipProps, displayIcon, targetUrl, handleClick };
    }
};
