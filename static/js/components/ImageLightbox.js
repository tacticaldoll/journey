import BaseLightbox from './BaseLightbox.js';

export default {
  name: 'ImageLightbox',
  components: {
    BaseLightbox
  },
  props: {
    isOpen: { type: Boolean, required: true },
    imageSrc: { type: String, required: true }
  },
  emits: ['update:isOpen'],
  template: `
    <base-lightbox 
      :is-open="isOpen" 
      @update:is-open="$emit('update:isOpen', $event)"
    >
      <div class="position-relative" @click.stop>
        <img 
          :src="imageSrc" 
          class="lightbox-image" 
          alt="Lightbox Image"
        />
      </div>
    </base-lightbox>
  `
};
