export default {
    name: 'PaginationControl',
    props: {
        modelValue: { type: Number, required: true },
        totalPages: { type: Number, required: true },
        totalVisible: { type: Number, default: 7 }
    },
    emits: ['update:modelValue', 'change'],
    template: `
    <div v-if="totalPages > 1" class="text-center mt-8">
      <v-pagination
        :model-value="modelValue"
        :length="totalPages"
        :total-visible="totalVisible"
        color="primary"
        @update:modelValue="$emit('update:modelValue', $event); $emit('change', $event)"
      ></v-pagination>
    </div>
  `
};
