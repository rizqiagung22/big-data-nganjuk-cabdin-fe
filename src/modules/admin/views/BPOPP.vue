<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {getApiBpopp} from "@/modules/admin/services/admin.service.ts";
import {useTahunStore} from "@/core/stores/tahun.strore.ts";

const tahunStore = useTahunStore();
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

const fetchBpopp = async () => {
  try {
    const response = await getApiBpopp({
      tahun_id : 1,
      page: pagination.value.currentPage,
      size : pagination.value.itemsPerPage,
    });
    tableData.value = [...response.data.data.data];
    pagination.value.totalItems = response.data.data.total;
  } catch (error: any) {
    console.log(error)
  }
}
onMounted(async () => {
  await tahunStore.fetchDataTahun();
  if (tahunStore.data.length > 0) {
    tahunStore.setSelected(tahunStore.data[0].id)
    await fetchBpopp();
  }
})
watch(() => pagination.value.currentPage, async () => {
  await fetchBpopp();
});

// (Opsional) Watcher untuk mengubah jumlah item per halaman
watch(() => pagination.value.itemsPerPage, async(newLimit: any, oldLimit: any) => {
  // Jika limit berubah, kembali ke halaman 1 untuk menghindari kebingungan
  if (newLimit !== oldLimit) {
    pagination.value.currentPage = 1;
    await fetchBpopp();
  }
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
      <template #cell(lembaga)="{item}">
        <span class="text-gray-500">{{ item.lembaga.nama }}</span>
      </template>
      <template #cell(pagu)="{item}">
        <span class="text-gray-500">{{ item.laporan["pagu"].name_file }}</span>
      </template>
      <template #cell(rkas)="{item}">
        <span class="text-gray-500">{{ item.laporan["rkas"].name_file }}</span>
      </template>
      <template #cell(realisasi)="{item}">
        <span class="text-gray-500">{{ item.laporan["realisasi"].name_file }}</span>
      </template>
      <template #cell(usulan_per_bulan)="{item}">
        <span class="text-gray-500">{{ item.laporan["usulan per bulan"].name_file }}</span>
      </template>
      <template #cell(penyerapan_tiap_bulan)="{item}">
        <span class="text-gray-500">{{ item.laporan["penyerapan tiap bulan"].name_file }}</span>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
