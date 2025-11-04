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
import {getApiBos} from "@/modules/admin/services/admin.service.ts";
import {
  deleteFileApiAsset,
  deleteFileApiAssetSertifikatAndScan,
  getApiAsset,
  getDownloadFileApiAsset,
  getDownloadFileApiAssetSertifikatAndScan,
  updateFileApiAsset,
  updateFileApiAssetSertifikatAndScan
} from "@/modules/admin/services/asset.service.ts"; // Atau dari 24/solid jika Anda ingin ikon yang diisi

const filterAdmin = useFilterAdminBksmStore()

const tableData = ref<any[]>([]);


const tableColumns = [
  {key: '', label: ''},
  // tw 1
  {key: 'bm_bos_tw_1', label: 'BOS'},
  {key: 'bm_bpopp_tw_1', label: 'BPOPP'},
  {key: 'bm_bantuan_pemerintah_tw_1', label: 'Bantuan Pemerintah'},
  {key: 'bm_pm_tw_1', label: 'Partisipasi Masyarakat'},
  // tw 2
  {key: 'bm_bos_tw_2', label: 'BOS'},
  {key: 'bm_bpopp_tw_2', label: 'BPOPP'},
  {key: 'bm_bantuan_pemerintah_tw_2', label: 'Bantuan Pemerintah'},
  {key: 'bm_pm_tw_2', label: 'Partisipasi Masyarakat'},
  // tw 3
  {key: 'bm_bos_tw_3', label: 'BOS'},
  {key: 'bm_bpopp_tw_3', label: 'BPOPP'},
  {key: 'bm_bantuan_pemerintah_tw_3', label: 'Bantuan Pemerintah'},
  {key: 'bm_pm_tw_3', label: 'Partisipasi Masyarakat'},
  // tw 4
  {key: 'bm_bos_tw_4', label: 'BOS'},
  {key: 'bm_bpopp_tw_4', label: 'BPOPP'},
  {key: 'bm_bantuan_pemerintah_tw_4', label: 'Bantuan Pemerintah'},
  {key: 'bm_pm_tw_4', label: 'Partisipasi Masyarakat'},
  // asset tanah
  {key: 'scan', label: 'SCAN'},
  {key: 'sertifikat', label: 'Sertifikat'},
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

    if (needResetPagination) resetPagination();
    const response = await getApiAsset({
      search: filterAdmin.search,
      tahun_id: filterAdmin.tahun,
      page: pagination.value.currentPage,
      size: pagination.value.itemsPerPage,
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
watch(() => pagination.value.itemsPerPage, async (newLimit: any, oldLimit: any) => {
  // Jika limit berubah, kembali ke halaman 1 untuk menghindari kebingungan
  if (newLimit !== oldLimit) {
    pagination.value.currentPage = 1;
    await fetchData();
  }
});

const handleDownload = async (item: any, type: string) => {
  try {
    await getDownloadFileApiAsset(item, type);
  } catch (error: any) {
    if (error.status == 404) {
      alert('Gagal mengunduh file. File tidak ditemukan.');
    } else {
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  }
}

const handleRemove = async (item: any, type: string) => {
  try {
    await deleteFileApiAsset(item.id, type);
    await fetchData();
  } catch (error: any) {
    if (error.status == 404) {
      alert('Gagal mengahapus file. File tidak ditemukan.');
    } else {
      alert('Gagal mengahapus file. Silakan coba lagi.');
    }
  }
}

const handleUpload = async (event: Event, item: any, type: string, idHtml: string) => {
  console.log("upload")
  try {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append('report_file', target.files[0]);
      formData.append('type', type);
      await updateFileApiAsset(item.id, formData);
      await fetchData();
    }
  } catch (error: any) {
    alert('Gagal upload file');
  } finally {
    const inputElement = document.getElementById(idHtml) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}

const handleDownloadSertifikatAndScan = async (item: any, type: string) => {
  try {
    await getDownloadFileApiAssetSertifikatAndScan(item, type);
  } catch (error: any) {
    if (error.status == 404) {
      alert('Gagal mengunduh file. File tidak ditemukan.');
    } else {
      alert('Gagal mengunduh file. Silakan coba lagi.');
    }
  }
}

const handleRemoveSertifikatAndScan = async (item: any, type: string) => {
  try {
    await deleteFileApiAssetSertifikatAndScan(item.id, type);
    await fetchData();
  } catch (error: any) {
    if (error.status == 404) {
      alert('Gagal mengahapus file. File tidak ditemukan.');
    } else {
      alert('Gagal mengahapus file. Silakan coba lagi.');
    }
  }
}

const handleUploadSertifikatAndScan = async (event: Event, item: any, type: string, idHtml: string) => {
  console.log("upload")
  try {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const formData = new FormData();
      formData.append('report_file', target.files[0]);
      formData.append('type', type);
      await updateFileApiAssetSertifikatAndScan(item.id, formData);
      await fetchData();
    }
  } catch (error: any) {
    alert('Gagal upload file');
  } finally {
    const inputElement = document.getElementById(idHtml) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
  }
}



</script>

<template>
  <div class="mb-4">
    <h1 class="text-2xl font-bold text-gray-800">Asset</h1>
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
      :need-column-number="false"
      v-model:currentPage="pagination.currentPage"
    >

      <template v-slot:header>
        <tr>
          <th
            rowspan="2"
            class="border min-w-[350px] px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            Data Pengurusan Barang Sekolah
          </th>
          <th colspan="4"
              class="border px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="flex justify-center items-center">
              <span>Belanja Modal Asset Triwulan 1</span>
            </div>
          </th>
          <th colspan="4"
              class="border px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="flex justify-center items-center">
              <span>Belanja Modal Asset Triwulan 2</span>
            </div>
          </th>
          <th colspan="4"
              class="border px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="flex justify-center items-center">
              <span>Belanja Modal Asset Triwulan 3</span>
            </div>
          </th>
          <th colspan="4"
              class="border px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="flex justify-center items-center">
              <span>Belanja Modal Asset Triwulan 4</span>
            </div>
          </th>
          <th colspan="4"
              class="border px-6 py-8 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div class="flex justify-center items-center">
              <span>Asset Tanah</span>
            </div>
          </th>
        </tr>
      </template>
      <template #cell(bm_bos_tw_1)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal1.bos_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal1, 'bos')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal1, 'bos')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bos${item.belanja_modal.belanja_modal1.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bos${item.belanja_modal.belanja_modal1.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal1, 'bos', `bos${item.belanja_modal.belanja_modal1.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bpopp_tw_1)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal1.bpopp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal1, 'bpopp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal1, 'bpopp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bpopp${item.belanja_modal.belanja_modal1.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bpopp${item.belanja_modal.belanja_modal1.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal1, 'bpopp', `bpopp${item.belanja_modal.belanja_modal1.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bantuan_pemerintah_tw_1)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal1.bp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal1, 'bp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal1, 'bp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bp${item.belanja_modal.belanja_modal1.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bp${item.belanja_modal.belanja_modal1.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal1, 'bp', `bp${item.belanja_modal.belanja_modal1.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_pm_tw_1)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal1.pm_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal1, 'pm')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal1, 'pm')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`pm${item.belanja_modal.belanja_modal1.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`pm${item.belanja_modal.belanja_modal1.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal1, 'pm', `pm${item.belanja_modal.belanja_modal1.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <!--    tw  2 -->
      <template #cell(bm_bos_tw_2)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal2.bos_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal2, 'bos')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal2, 'bos')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bos${item.belanja_modal.belanja_modal2.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bos${item.belanja_modal.belanja_modal2.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal2, 'bos', `bos${item.belanja_modal.belanja_modal2.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bpopp_tw_2)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal2.bpopp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal2, 'bpopp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal2, 'bpopp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bpopp${item.belanja_modal.belanja_modal2.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bpopp${item.belanja_modal.belanja_modal2.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal2, 'bpopp', `bpopp${item.belanja_modal.belanja_modal2.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bantuan_pemerintah_tw_2)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal2.bp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal2, 'bp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal2, 'bp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bp${item.belanja_modal.belanja_modal2.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bp${item.belanja_modal.belanja_modal2.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal2, 'bp', `bp${item.belanja_modal.belanja_modal2.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_pm_tw_2)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal2.pm_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal2, 'pm')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal2, 'pm')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`pm${item.belanja_modal.belanja_modal2.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`pm${item.belanja_modal.belanja_modal2.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal2, 'pm', `pm${item.belanja_modal.belanja_modal2.id}`)"/>
            </div>
          </div>
        </div>
      </template>

      <!--    tw  3 -->
      <template #cell(bm_bos_tw_3)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal3.bos_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal3, 'bos')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal3, 'bos')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bos${item.belanja_modal.belanja_modal3.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bos${item.belanja_modal.belanja_modal3.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal3, 'bos', `bos${item.belanja_modal.belanja_modal3.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bpopp_tw_3)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal3.bpopp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal3, 'bpopp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal3, 'bpopp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bpopp${item.belanja_modal.belanja_modal3.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bpopp${item.belanja_modal.belanja_modal3.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal3, 'bpopp', `bpopp${item.belanja_modal.belanja_modal3.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bantuan_pemerintah_tw_3)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal3.bp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal3, 'bp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal3, 'bp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bp${item.belanja_modal.belanja_modal3.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bp${item.belanja_modal.belanja_modal3.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal3, 'bp', `bp${item.belanja_modal.belanja_modal3.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_pm_tw_3)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal3.pm_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal3, 'pm')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal3, 'pm')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`pm${item.belanja_modal.belanja_modal3.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`pm${item.belanja_modal.belanja_modal3.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal3, 'pm', `pm${item.belanja_modal.belanja_modal3.id}`)"/>
            </div>
          </div>
        </div>
      </template>

      <!--    tw  4 -->
      <template #cell(bm_bos_tw_4)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal4.bos_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal4, 'bos')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal4, 'bos')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bos${item.belanja_modal.belanja_modal4.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bos${item.belanja_modal.belanja_modal4.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal4, 'bos', `bos${item.belanja_modal.belanja_modal4.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bpopp_tw_4)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal4.bpopp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal4, 'bpopp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal4, 'bpopp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bpopp${item.belanja_modal.belanja_modal4.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bpopp${item.belanja_modal.belanja_modal4.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal4, 'bpopp', `bpopp${item.belanja_modal.belanja_modal4.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_bantuan_pemerintah_tw_4)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal4.bp_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal4, 'bp')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal4, 'bp')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`bp${item.belanja_modal.belanja_modal4.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`bp${item.belanja_modal.belanja_modal4.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal4, 'bp', `bp${item.belanja_modal.belanja_modal4.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(bm_pm_tw_4)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.belanja_modal4.pm_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownload(item.belanja_modal.belanja_modal4, 'pm')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemove(item.belanja_modal.belanja_modal4, 'pm')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`pm${item.belanja_modal.belanja_modal4.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`pm${item.belanja_modal.belanja_modal4.id}`"
                     @change="(event : Event) => handleUpload(event, item.belanja_modal.belanja_modal4, 'pm', `pm${item.belanja_modal.belanja_modal4.id}`)"/>
            </div>
          </div>
        </div>
      </template>

      <!--    tw  5 -->
      <template #cell(sertifikat)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.sertifikat_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownloadSertifikatAndScan(item.belanja_modal, 'sertifikat')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemoveSertifikatAndScan(item.belanja_modal, 'sertifikat')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`sertifikat${item.belanja_modal.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`sertifikat${item.belanja_modal.id}`"
                     @change="(event : Event) => handleUploadSertifikatAndScan(event, item.belanja_modal, 'sertifikat', `sertifikat${item.belanja_modal.id}`)"/>
            </div>
          </div>
        </div>
      </template>
      <template #cell(scan)="{item}">
        <div class="flex items-center space-x-2">
          <span class="text-gray-500 w-[80px] truncate w-[80px] truncate">{{
              item.belanja_modal.scan_name_file ?? ''
            }}</span>
          <div class="flex gap-2">
            <div @click="handleDownloadSertifikatAndScan(item.belanja_modal, 'scan')"
                 class="text-gray-400 hover:text-green-500 transition-colors" title="Download">
              <ArrowDownTrayIcon class="h-5 w-5"/>
            </div>
            <div @click="handleRemoveSertifikatAndScan(item.belanja_modal, 'scan')"
                 class="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <TrashIcon class="h-5 w-5"/>
            </div>
            <div class="text-gray-400 hover:text-blue-500 transition-colors" title="Upload">
              <label :for="`scan${item.belanja_modal.id}`">
                <CloudArrowUpIcon class="h-5 w-5"/>
              </label>
              <input type="file" class="hidden" :id="`scan${item.belanja_modal.id}`"
                     @change="(event : Event) => handleUploadSertifikatAndScan(event, item.belanja_modal, 'scan', `scan${item.belanja_modal.id}`)"/>
            </div>
          </div>
        </div>
      </template>

    </DataTable>
  </div>
</template>

<style scoped>

</style>
