<script setup lang="ts">
import {computed} from 'vue';

// Definisikan tipe data untuk props agar lebih aman
interface Column {
  key: string;
  label: string;
}

// Komponen menerima props untuk kolom, data, dan paginasi
const props = withDefaults(defineProps<{
  columns: Column[];
  data: any[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  // Deklarasi Tipe: Hanya sebutkan tipenya
  needColumnNumber: boolean;
}>(), {
  // Nilai Default Runtime: Didefinisikan di withDefaults
  needColumnNumber: true,
});

// Emit event saat halaman paginasi diubah
const emit = defineEmits(['update:currentPage']);

// Hitung total halaman untuk paginasi
const totalPages = computed(() => {
  if (props.totalItems === 0 || props.itemsPerPage === 0) return 1;
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

// Fungsi untuk berpindah halaman
function changePage(page: number | string) {
  if (typeof page === 'number') {
    if (page < 1 || page > totalPages.value) return;
    emit('update:currentPage', page);
  }
}

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = props.currentPage;

  // Kasus 1: Total halaman <= 5
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Kasus 2: Total halaman > 5
  if (current <= 3) {
    // Awal
    pages.push(1, 2, 3, "...", total);
  } else if (current > total - 3) {
    // Akhir
    pages.push(1, "...", total - 2, total - 1, total);
  } else {
    // Tengah
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
  }

  return pages;
});
</script>

<template>
  <div>
    <div class="overflow-x-auto border border-gray-200">
      <table class="min-w-full border-collapse border divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <slot name="header"></slot>
        <tr>
          <th
            v-if="needColumnNumber"
            scope="col"
              class="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            No.
          </th>
          <template
            v-for="col in columns"
            :key="col.key"
          >
            <th
              v-if="col.key != ''"
              scope="col"
              class="px-6 py-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ col.label }}
            </th>
          </template>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="data.length === 0">
          <td :colspan="columns.length + 1" class="px-6 py-10 border text-center text-gray-500">
            Tidak ada data untuk ditampilkan.
          </td>
        </tr>
        <tr v-else v-for="(item, itemIndex) in data" :key="item.id || itemIndex"
            class="hover:bg-gray-50">
          <td v-if="needColumnNumber" class="px-6 py-4 border whitespace-nowrap text-sm text-gray-500">
            {{ (currentPage - 1) * itemsPerPage + itemIndex + 1 }}
          </td>
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 border whitespace-nowrap text-sm">
            <slot :name="`cell(${col.key})`" :item="item" :value="item[col.key]" :index="itemIndex">
              <span class="text-gray-900">{{ item[col.key] }}</span>
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1 && data.length > 0"
         class="px-6 py-4 border-t flex items-center justify-between">
      <div class="text-sm text-gray-500">
        Menampilkan
        <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        sampai
        <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
        dari
        <span class="font-medium">{{ totalItems }}</span> pendaftar
      </div>
      <div class="flex space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out border-none rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sebelumnya
        </button>

        <template v-for="(page, index) in visiblePages" :key="index">
          <button
            v-if="page !== '...'"
            @click="changePage(page)"
            :class="[
        'px-3 py-1 text-sm font-medium transition-colors duration-200 ease-in-out border-none rounded',
        page === currentPage ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-gray-700 hover:bg-gray-100'
      ]"
          >
            {{ page }}
          </button>
          <span v-else class="px-3 py-1 text-sm font-medium text-gray-700">...</span>
        </template>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 text-sm font-medium text-gray-700 transition-colors duration-200 ease-in-out border-none rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</template>
