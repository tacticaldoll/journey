export default {
  name: 'ImageLightbox',
  props: {
    isOpen: { type: Boolean, required: true },
    imageSrc: { type: String, required: true }
  },
  emits: ['update:isOpen'],
  template: `
    <v-dialog :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" max-width="1200" width="100%" transition="dialog-transition">
      <div class="d-flex align-center justify-center" style="width: 100%; height: 100%;" @click="$emit('update:isOpen', false)">
        <div class="position-relative d-flex align-center justify-center" style="width: 100%;">
          <v-btn 
            icon
            size="small"
            variant="flat" 
            class="position-absolute bg-black text-white" 
            style="top: 8px; right: 8px; z-index: 10; opacity: 0.7;"
            @click.stop="$emit('update:isOpen', false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <img :src="imageSrc" @click.stop style="width: 100%; max-height: 90vh; object-fit: contain; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);" />
        </div>
      </div>
    </v-dialog>
  `
};
