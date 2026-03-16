import { t } from '../i18n.js';

export default {
    name: 'BackButton',
    template: `
    <div class="mt-8">
      <v-btn prepend-icon="mdi-arrow-left" variant="text" color="primary" @click="$router.go(-1)">
        {{ t('ui.goBack') }}
      </v-btn>
    </div>
  `,
    setup() {
        return { t };
    }
};
