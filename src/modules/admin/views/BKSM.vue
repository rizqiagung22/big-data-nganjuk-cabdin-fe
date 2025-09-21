<script setup lang="ts">

import {ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  deleteFileApiBksm,
  getApiBksm,
  getDownloadFileApiBksm,
  updateFileApiBksm
} from "@/modules/admin/services/bksm.service.ts";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline';
import {useFilterAdminBksmStore} from "@/modules/admin/stores/admin.bksm.store.ts";
import FilterBksm from "@/modules/admin/components/FilterBksm.vue";
import {useAuthStore} from "@/core/stores/auth.store.ts"; // Atau dari 24/solid jika Anda ingin ikon yang diisi

const filterAdmin = useFilterAdminBksmStore()
const userStore = useAuthStore()

const tableData = ref<any[]>([]);


const tableColumns = [
  {key: 'lembaga', label: 'Satuan Lembaga'},
  {key: 'file', label: 'File'},
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

const fetchData = async (needResetPagination = false) => {
  try {
    console.log(filterAdmin.search, filterAdmin.tahun)
    if(needResetPagination) resetPagination();
    const response = await getApiBksm({
      search : filterAdmin.search,
      tahun_id : filterAdmin.tahun,
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
  await fetchData();
});
// (Opsional) Watcher untuk mengubah jumlah item per halaman
watch(() => pagination.value.itemsPerPage, async(newLimit: any, oldLimit: any) => {
  // Jika limit berubah, kembali ke halaman 1 untuk menghindari kebingungan
  if (newLimit !== oldLimit) {
    pagination.value.currentPage = 1;
    await fetchData();
  }
});

const handleDownload = async (item : any, _ : string) => {
  try {
    await  getDownloadFileApiBksm(item.id, item.name_file );
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
    await  deleteFileApiBksm(item.id );
    await fetchData();
  } catch (error : any){
    if(error.status == 404){
      alert('Gagal mengahapus file. File tidak ditemukan.');
    } else {
      alert('Gagal mengahapus file. Silakan coba lagi.');
    }
  }
}

const handleUpload = async (event: Event, item : any, _ : string, idHtml : string) => {
  console.log("upload")
  try {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append('report_file', target.files[0]);
      await updateFileApiBksm(item.id, formData);
      await fetchData();
    }
  } catch (error : any){
    alert('Gagal upload file');
  }
  finally {
    const inputElement = document.getElementById(idHtml) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}


</script>

<template>
  <div class="mb-4">
    <h1 class="text-2xl font-bold text-gray-800">BKSM</h1>
    <p class="text-gray-600">Bantuan Khusus Siswa Miskin</p>
  </div>
  <FilterBksm class="mb-4" @submit="fetchData"></FilterBksm>
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
        <span class="text-gray-500">{{ item.jenjang }}</span>
      </template>
      <template #cell(file)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'pagu')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div v-if="userStore.user.role != 'user'" @click="handleRemove(item, 'pagu')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div v-if="userStore.user.role != 'user'"  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`item${item.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`item${item.id}`" @change="(event : Event) => handleUpload(event, item, 'item', `item${item.id}`)"/>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
