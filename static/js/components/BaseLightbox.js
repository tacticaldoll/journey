export default {
  name: 'BaseLightbox',
  props: {
    isOpen: { type: Boolean, required: true }
  },
  emits: ['update:isOpen'],
  template: `
    <v-dialog 
      :model-value="isOpen" 
      @update:model-value="$emit('update:isOpen', $event)" 
      width="auto"
      transition="fade-transition"
      content-class="lightbox-dialog"
    >
      <div class="lightbox-content" @click="$emit('update:isOpen', false)">
        <!-- Close Button (Outside/Above the injected content) -->
        <v-btn 
          icon="mdi-close"
          size="small"
          variant="flat" 
          class="lightbox-close-btn"
          @click.stop="$emit('update:isOpen', false)"
        >
        </v-btn>

        <!-- Slot for injecting Image or Content markup -->
        <slot></slot>
      </div>
    </v-dialog>
  `
};
