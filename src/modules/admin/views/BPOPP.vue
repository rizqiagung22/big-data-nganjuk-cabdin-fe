<script setup lang="ts">

import {onMounted, ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  addFileApiBpopp,
  deleteFileApiBpopp,
  getApiBpopp,
  getDownloadFileApiBpopp, updateFileApiBpopp
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
    await fetchBpopp();
  } catch (error : any){
    if(error.status == 404){
      alert('Gagal mengahapus file. File tidak ditemukan.');
    } else {
      alert('Gagal mengahapus file. Silakan coba lagi.');
    }
  }
}

const handleUpload = async (event: Event, item : any, type : string, idHtml : string) => {
  try {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append('report_file', target.files[0]);
      await updateFileApiBpopp(item.laporan?.[type]?.id, formData);
      await fetchBpopp();
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
const handleUploadAdd = async (event: Event, item : any, type : string, idHtml : string) => {
  try {
    const target = event.target as HTMLInputElement;
    if(filterAdminBpoppStore.tahun){
      if (target.files && target.files.length > 0) {
        const formData = new FormData();
        formData.append('tahun_id', filterAdminBpoppStore.tahun.toString());
        formData.append('lembaga_id', item.lembaga.id);
        formData.append('jenis_laporan', type);
        formData.append('report_file', target.files[0]);
        await addFileApiBpopp(formData);
        await fetchBpopp();
      }
    }
  } catch (error : any){
    alert('Gagal menambahkan file');
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
              <label :for="`pagu${item.lembaga.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input v-if="item.laporan?.['pagu']" type="file" class="hidden" :id="`pagu${item.lembaga.id}`" @change="(event : Event) => handleUpload(event, item, 'pagu', `pagu${item.lembaga.id}`)"/>
              <input v-else type="file" class="hidden" :id="`pagu${item.lembaga.id}`" @change="(event : Event) => handleUploadAdd(event, item, 'pagu', `pagu${item.lembaga.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(rkas)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["rkas"]?.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'rkas')"  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item, 'rkas')"   class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`rkas${item.lembaga.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input v-if="item.laporan?.['rkas']" type="file" class="hidden" :id="`rkas${item.lembaga.id}`" @change="(event : Event) => handleUpload(event, item, 'rkas', `rkas${item.lembaga.id}`)"/>
              <input v-else type="file" class="hidden" :id="`rkas${item.lembaga.id}`" @change="(event : Event) => handleUploadAdd(event, item, 'rkas', `rkas${item.lembaga.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(realisasi)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["realisasi"]?.name_file  ?? ''}}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'realisasi')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div   @click="handleRemove(item, 'realisasi')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`realisasi${item.lembaga.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input v-if="item.laporan?.['realisasi']"  type="file" class="hidden" :id="`realisasi${item.lembaga.id}`" @change="(event : Event) => handleUpload(event, item, 'realisasi', `realisasi${item.lembaga.id}`)"/>
              <input v-else type="file" class="hidden" :id="`realisasi${item.lembaga.id}`" @change="(event : Event) => handleUploadAdd(event, item, 'realisasi', `realisasi${item.lembaga.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(usulan_per_bulan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["usulan per bulan"]?.name_file ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'usulan per bulan')" class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div   @click="handleRemove(item, 'usulan per bulan')" class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div  class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label  :for="`usulan_per_bulan${item.lembaga.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input v-if="item.laporan?.['usulan per bulan']"  type="file" class="hidden" :id="`usulan_per_bulan${item.lembaga.id}`" @change="(event : Event) => handleUpload(event, item, 'usulan per bulan', `usulan_per_bulan${item.lembaga.id}`)"/>
              <input v-else type="file" class="hidden" :id="`usulan_per_bulan${item.lembaga.id}`" @change="(event : Event) => handleUploadAdd(event, item, 'usulan per bulan', `usulan_per_bulan${item.lembaga.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(penyerapan_tiap_bulan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate">{{ item.laporan?.["penyerapan tiap bulan"]?.name_file  ?? '' }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item, 'penyerapan tiap bulan')"  class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5" />
            </div>
            <div @click="handleRemove(item, 'penyerapan tiap bulan')"  class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5" />
            </div>
            <div @click="handleDownload(item, 'penyerapan tiap bulan')" class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label  :for="`penyerapan_tiap_bulan${item.lembaga.id}`"> <CloudArrowUpIcon class="h-5 w-5"/> </label>
              <input v-if="item.laporan?.['penyerapan tiap bulan']"  type="file" class="hidden" :id="`penyerapan_tiap_bulan${item.lembaga.id}`" @change="(event : Event) => handleUpload(event, item, 'penyerapan tiap bulan', `penyerapan_tiap_bulan${item.lembaga.id}`)"/>
              <input v-else type="file" class="hidden" :id="`penyerapan_tiap_bulan${item.lembaga.id}`" @change="(event : Event) => handleUploadAdd(event, item, 'penyerapan tiap bulan', `penyerapan_tiap_bulan${item.lembaga.id}`)"/>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
