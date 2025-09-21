<script setup lang="ts">

import {ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  addFileApiBos,
  deleteFileApiBos,
  getApiBos,
  getDownloadFileApiBos,
  updateFileApiBos
} from "@/modules/admin/services/admin.service.ts";
import {
  ArrowDownTrayIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/vue/24/outline';
import FilterBos from "@/modules/admin/components/FilterBos.vue";
import {useFilterAdminBosStore} from "@/modules/admin/stores/admin.bos.store.ts"; // Atau dari 24/solid jika Anda ingin ikon yang diisi

const filterAdmin = useFilterAdminBosStore()
const tableData = ref<any[]>([]);


const tableColumns = [
  {key: 'lembaga', label: 'Lembaga'},
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

const fetchData = async (needResetPagination = false) => {
  try {
    if(needResetPagination) resetPagination();
    const response = await getApiBos({
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

const handleDownload = async (item : any, type : string) => {
  try {
    await  getDownloadFileApiBos(item.laporan?.[type]?.id, item.laporan?.[type]?.name_file );
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
    await  deleteFileApiBos(item.laporan?.[type]?.id );
    await fetchData();
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
      await updateFileApiBos(item.laporan?.[type]?.id, formData);
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
const handleUploadAdd = async (event: Event, item : any, type : string, idHtml : string) => {
  try {
    const target = event.target as HTMLInputElement;
    if(filterAdmin.tahun){
      if (target.files && target.files.length > 0) {
        const formData = new FormData();
        formData.append('tahun_id', filterAdmin.tahun.toString());
        formData.append('lembaga_id', item.lembaga.id);
        formData.append('jenis_laporan', type);
        formData.append('report_file', target.files[0]);
        await addFileApiBos(formData);
        await fetchData();
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
    <h1 class="text-2xl font-bold text-gray-800">BOS</h1>
    <p class="text-gray-600">Bantuan Operasional Sekolah</p>
  </div>
  <FilterBos class="mb-4" @submit="fetchData"></FilterBos>
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
