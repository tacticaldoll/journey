/**
 * SocialLinks.js
 * Renders social media buttons based on site configuration.
 */
import { t } from '../i18n.js';

export default {
  props: {
    siteConfig: { type: Object, required: true },
    variant: { type: String, default: 'full' } // 'full' or 'compact'
  },
  setup(props) {
    const socialLinks = Vue.computed(() => {
      const social = props.siteConfig.social || {};
      return Object.entries(social).filter(([_, url]) => url && url.trim() !== '');
    });

    return { socialLinks, t };
  },
  template: `
    <div class="social-links-container d-flex flex-wrap align-center" :class="{ 'justify-center': variant === 'full' }">
      <template v-for="([platform, url]) in socialLinks" :key="platform">
        <v-btn
          :icon="'mdi-' + platform"
          :variant="variant === 'full' ? 'tonal' : 'text'"
          :color="variant === 'full' ? 'primary' : 'primary'"
          :class="variant === 'full' ? 'mx-2 my-2 elevation-2 rounded-xl' : 'mr-2'"
          :size="variant === 'full' ? 'large' : 'default'"
          :href="url"
          target="_blank"
          :title="platform"
          class="transition-all hover-scale"
        >
          <v-icon :size="variant === 'full' ? 28 : 24">mdi-{{ platform }}</v-icon>
        </v-btn>
      </template>
    </div>
  `
};
