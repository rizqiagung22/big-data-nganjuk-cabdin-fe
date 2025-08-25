<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  deleteFileApiBpopp,
  getApiBpopp,
  getDownloadFileApiBpopp
} from "@/modules/admin/services/admin.service.ts";
import {useTahunStore} from "@/core/stores/tahun.strore.ts";
import FilterBpopp from "@/modules/admin/components/FilterBpopp.vue";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline';
import {useFilterAdminBpoppStore} from "@/modules/admin/stores/admin.bpopp.store.ts"; // Atau dari 24/solid jika Anda ingin ikon yang diisi

const tahunStore = useTahunStore();
const filterAdminBpoppStore = useFilterAdminBpoppStore()

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
const resetPagination = () => {
  pagination.value = {
    currentPage: 1,
    itemsPerPage: 10, // Anda bisa mengubah ini
    totalItems: 0,
  }
}

const fetchBpopp = async (needResetPagination = false) => {
  try {
    if(needResetPagination) resetPagination();
    const response = await getApiBpopp({
      search : filterAdminBpoppStore.search,
      tahun_id : filterAdminBpoppStore.tahun,
      page: pagination.value.currentPage,
      size : pagination.value.itemsPerPage,
    });
    tableData.value = [...response.data.data.data];
    pagination.value.totalItems = response.data.data.total;
  } catch (error: any) {
    console.log(error)
    tableData.value = [];
    resetPagination();

  }
}
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

const handleDownload = async (item : any, type : string) => {
  try {
    await  getDownloadFileApiBpopp(item.laporan?.[type]?.id, item.laporan?.[type]?.name_file );
  } catch (error : any){
    if(error.status == 404){
      alert('Gagal mengunduh file. File tidak ditemukan.');
    } else {
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  }
}

const handleRemove = async (item : any, type : string) => {
  try {
    await  deleteFileApiBpopp(item.laporan?.[type]?.id );
  } catch (error : any){
    if(error.status == 404){
      alert('Gagal mengunduh file. File tidak ditemukan.');
    } else {
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  }
}

</script>

<template>
  <div class="mb-4">
    <h1 class="text-2xl font-bold text-gray-800">BPOPP</h1>
    <p class="text-gray-600">Kelola data Bantuan Penunjang Operasinal Penyelenggaran Pendidikan</p>
  </div>
  <FilterBpopp class="mb-4" @submit="fetchBpopp"></FilterBpopp>
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
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.laporan?.["pagu"]?.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'pagu')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item, 'pagu')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <CloudArrowUpIcon class="h-5 w-5" />
            </div>
          </div>
        </div>
      </template>
      <template #cell(rkas)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["rkas"]?.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item, 'rkas')"   class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <CloudArrowUpIcon class="h-5 w-5" />
            </div>
          </div>
        </div>
      </template>
      <template #cell(realisasi)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["realisasi"]?.name_file  ?? ''}}</span>
          <div class="flex gap-2">
            <div  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div   @click="handleRemove(item, 'realisasi')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <CloudArrowUpIcon class="h-5 w-5" />
            </div>
          </div>
        </div>
      </template>
      <template #cell(usulan_per_bulan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["usulan per bulan"]?.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div   @click="handleRemove(item, 'usulan per bulan')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <CloudArrowUpIcon class="h-5 w-5" />
            </div>
          </div>
        </div>
      </template>
      <template #cell(penyerapan_tiap_bulan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["penyerapan tiap bulan"]?.name_file  ?? '' }}</span>
          <div class="flex gap-2">
            <div  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item, 'penyerapan tiap bulan')"  class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <CloudArrowUpIcon class="h-5 w-5" />
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
