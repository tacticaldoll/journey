export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    icon: { type: String, required: true }
  },
  template: `
    <h1 class="text-h3 font-weight-bold mb-8 px-8 text-primary"
        style="line-height: 1.3; font-family: var(--font-heading) !important; letter-spacing: -1px !important;">
      <v-icon class="mr-2">{{ icon }}</v-icon>
      {{ title }}
    </h1>
  `
};
