<script setup lang="ts">
import { computed } from 'vue';

// 1. PROPS
// Komponen ini menerima 'modelValue' untuk v-model dan daftar opsi.
const props = defineProps({
  // 'modelValue' adalah nama prop standar untuk v-model
  modelValue: {
    type: Number,
    required: true
  },
  // Opsi yang akan ditampilkan di dropdown, bisa di-override oleh parent
  options: {
    type: Array as () => number[],
    default: () => [5, 10, 20, 50]
  }
});

// 2. EMITS
// 'update:modelValue' adalah event standar yang harus di-emit untuk v-model
const emit = defineEmits(['update:modelValue']);

// 3. COMPUTED PROPERTY UNTUK V-MODEL
// Ini adalah cara elegan untuk membuat v-model bekerja pada props.
// 'get' akan membaca nilai dari prop.
// 'set' akan meng-emit event saat nilai diubah dari template.
const selectedSize = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: number) {
    // Memberitahu parent tentang nilai baru
    emit('update:modelValue', newValue);
  }
});
</script>

<template>
  <div class="flex items-center">
    <label
        for="items-per-page"
        class="text-sm font-medium text-gray-700"
    >
      Tampilkan:
    </label>
    <select
        id="items-per-page"
        v-model.number="selectedSize"
        class="ml-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    >
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <span class="ml-2 text-sm text-gray-700">item</span>
  </div>
</template>