<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  addFileApiPrestasiSiswa,
  deleteFileApiPrestasiSiswa,
  getApiPrestasiSiswa,
  getDownloadFileApiPrestasiSiswa,
  updateFileApiPrestasiSiswa
} from "@/modules/admin/services/prestasi-siswa.service.ts";
import {useTahunStore} from "@/core/stores/tahun.strore.ts";
import FilterBpopp from "@/modules/admin/components/FilterBpopp.vue";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline';
import {useFilterAdminBosStore} from "@/modules/admin/stores/admin.bos.store.ts"; // Atau dari 24/solid jika Anda ingin ikon yang diisi

const tahunStore = useTahunStore();
const filterAdminBosStore = useFilterAdminBosStore()

const tableData = ref<any[]>([]);


const tableColumns = [
  {key: 'lembaga', label: 'Satuan Lembaga'},
  {key: 'kecamatan', label: 'kecamatan'},
  {key: 'kabupaten', label: 'kabupaten'},
  {key: 'provinsi', label: 'provinsi'},
  {key: 'nasional', label: 'nasional'},
  {key: 'internasional', label: 'internasional'},
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
    if(needResetPagination) resetPagination();
    const response = await getApiPrestasiSiswa({
      search : filterAdminBosStore.search,
      tahun_id : filterAdminBosStore.tahun,
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
    await  getDownloadFileApiPrestasiSiswa(item.id, item.name_file );
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
    await  deleteFileApiPrestasiSiswa(item.id );
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
      await updateFileApiPrestasiSiswa(item.id, formData);
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
    <h1 class="text-2xl font-bold text-gray-800">Prestasi Siswa</h1>
  </div>
  <FilterBpopp class="mb-4" @submit="fetchData"></FilterBpopp>
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
      <template #cell(kecamatan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.kecamatan.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.kecamatan, 'kecamatan')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item.kecamatan, 'kecamatan')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`kecamatan${item.kecamatan.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`kecamatan${item.kecamatan.id}`" @change="(event : Event) => handleUpload(event, item.kecamatan, 'kecamatan', `kecamatan${item.kecamatan.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(kabupaten)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.kabupaten.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.kabupaten, 'kabupaten')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item.kabupaten, 'kabupaten')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`kabupaten${item.kabupaten.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`kabupaten${item.kabupaten.id}`" @change="(event : Event) => handleUpload(event, item.kabupaten, 'kabupaten', `kabupaten${item.kabupaten.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(provinsi)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.provinsi.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.provinsi, 'provinsi')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item.provinsi, 'provinsi')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`provinsi${item.provinsi.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`provinsi${item.provinsi.id}`" @change="(event : Event) => handleUpload(event, item.provinsi, 'provinsi', `provinsi${item.provinsi.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(nasional)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.nasional.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.nasional, 'nasional')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item.nasional, 'nasional')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`nasional${item.nasional.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`nasional${item.nasional.id}`" @change="(event : Event) => handleUpload(event, item.nasional, 'nasional', `nasional${item.nasional.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(internasional)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{ item.internasional.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.internasional, 'internasional')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item.internasional, 'internasional')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`internasional${item.internasional.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input type="file" class="hidden" :id="`internasional${item.internasional.id}`" @change="(event : Event) => handleUpload(event, item.internasional, 'internasional', `internasional${item.internasional.id}`)"/>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
