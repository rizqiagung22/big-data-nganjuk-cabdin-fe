<script setup lang="ts">

import {ref} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
const tableData = ref<any[]>([]);
const tableColumns = [
  {key: 'lembaga', label: 'Nama Lembaga'},
  {key: 'pagu', label: 'Pagu'},
  {key: 'rkas', label: 'RKAS'},
  {key: 'realisasi', label: 'Realisasi'},
  {key: 'usulan_per_bulan', label: 'Usulan Per Bulan'},
  {key: 'penyerapan_tiap_bulan', label: 'Penyerapan Tiap Bulan'},
];
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10, // Anda bisa mengubah ini
  totalItems: 0,
});

</script>

<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-800">BPOPP</h1>
    <p class="text-gray-600">Kelola data Bantuan Penunjang Operasinal Penyelenggaran Pendidikan</p>
  </div>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Table Header -->
    <!-- Table -->
    <PageSizeSelector class="my-4 flex justify-end px-2" v-model="pagination.itemsPerPage"/>
    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :total-items="pagination.totalItems"
      :items-per-page="pagination.itemsPerPage"
      v-model:currentPage="pagination.currentPage"
    >
      <template #cell(lembaga)="">
        <div></div>
      </template>
      <template #cell(pagu)="">
        <div></div>
      </template>
      <template #cell(rkas)="">
        <div></div>
      </template>
      <template #cell(realisasi)="">
        <div></div>
      </template>
      <template #cell(usulan_per_bulan)="">
        <div></div>
      </template>
      <template #cell(penyerapan_tiap_bulan)="">
        <div></div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
