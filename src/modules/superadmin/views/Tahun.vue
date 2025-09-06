<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";
import PageSizeSelector from "../../../core/components/PageSizeSelector.vue";
import DataTable from "../../../core/components/DataTable.vue";
import {
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {getApiTahunPagination} from "@/core/services/global.service.ts";
import {
  deleteApiTahun,
  postApiTahun, updateApiTahun,
} from "@/modules/superadmin/services/superadmin.service.ts";

const selectedItem = ref<any>(null)
const tableData = ref<any[]>([]);


const tableColumns = [
  {key: 'tahun', label: 'Tahun'},
  {key: 'action', label: 'Action'},
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

const fetchTahun = async (needResetPagination = false) => {
  try {
    if(needResetPagination) resetPagination();
    const response = await getApiTahunPagination({
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
  await fetchTahun();
});
// (Opsional) Watcher untuk mengubah jumlah item per halaman
watch(() => pagination.value.itemsPerPage, async(newLimit: any, oldLimit: any) => {
  // Jika limit berubah, kembali ke halaman 1 untuk menghindari kebingungan
  if (newLimit !== oldLimit) {
    pagination.value.currentPage = 1;
    await fetchTahun();
  }
});
onMounted(async () => {
  await fetchTahun();
})
const handleUpdate = (item : any) =>{
  selectedItem.value = item;
  selectedYear.value = item.tahun;
}
const handleRemove = async (item : any) =>{
  try {
    await deleteApiTahun(item.id)
    selectedYear.value = new Date().getFullYear().toString();
    await fetchTahun(true);
    alert('Berhasil menghapus tahun.');
  } catch (error: any){
    alert('Gagal menghapus tahun.');
  }
}
const handleAddTahun = async  () => {
  try {
    await postApiTahun({
      tahun : selectedYear.value
    })
    selectedYear.value = new Date().getFullYear().toString();
    await fetchTahun(true);
    alert('Berhasil menambahkan tahun.');
  } catch (error: any){
    alert('Gagal menambahkan tahun.');
  }
}

const handleUpdateTahun = async  () => {
  try {
    await updateApiTahun({
      tahun : selectedYear.value.toString()
    }, selectedItem.value.id)
    selectedYear.value = new Date().getFullYear().toString();
    await fetchTahun(true);
    selectedItem.value = null
    alert('Berhasil memperbarui tahun.');
  } catch (error: any){
    alert('Gagal memperbarui tahun.');
  }
}
const selectedYear = ref(new Date().getFullYear().toString()); // Menggunakan objek Date
const minYear = 2000;
const maxYear = 2030;

// Menggunakan computed property untuk membuat array rentang yang dinonaktifkan
const disabledYearRange = computed(() => [
  { to: minYear - 1 }, // Menonaktifkan semua tahun sebelum minYear
  { from: maxYear + 1 }, // Menonaktifkan semua tahun setelah maxYear
]);
</script>

<template>
  <div class="mb-4">
    <h1 class="text-2xl font-bold text-gray-800">Tahun</h1>
  </div>
  <div v-if="selectedItem" class="bg-white px-5 py-4 my-5">
    <div class="mb-4">
      <label for="datepicker">Pilih Tahun:</label>
      <VueDatePicker
        id="datepicker"
        v-model="selectedYear"
        :min-year="minYear"
        :max-year="maxYear"
        :disabled-year-range="disabledYearRange"
        year-picker
      />
    </div>
    <div class="flex justify-end">
      <button @click="handleUpdateTahun" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
        Update
      </button>
    </div>
  </div>
  <div v-else class="bg-white px-5 py-4 my-5">
    <div class="mb-4">
      <label for="datepicker">Pilih Tahun:</label>
      <VueDatePicker
        id="datepicker"
        v-model="selectedYear"
        :min-year="minYear"
        :max-year="maxYear"
        :disabled-year-range="disabledYearRange"
        year-picker
      />
    </div>
    <div class="flex justify-end">
      <button @click="handleAddTahun" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
        Tambah
      </button>
    </div>
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
      <template #cell(action)="{item}">
        <div class="flex items-center gap-2">
          <PencilSquareIcon class="h-5 w-5 hover:cursor-pointer hover:text-blue-500" @click="handleUpdate(item)" />
          <TrashIcon class="h-5 w-5 hover:cursor-pointer hover:text-red-500" @click="handleRemove(item)" />
        </div>
        </template>
    </DataTable>
  </div>
</template>

<style scoped>

</style>
