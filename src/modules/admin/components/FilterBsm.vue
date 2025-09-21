<script setup lang="ts">
import {nextTick, onMounted, ref, watch} from 'vue';
import {useFilterAdminBsmStore} from "@/modules/admin/stores/admin.bsm.store.ts";
import {getApiTahun} from "@/core/services/global.service.ts";


const filterAdmin = useFilterAdminBsmStore()

const searchValue = ref<any>('')
const tahunValue = ref<any>(null)

onMounted(async () => {
  await fetchDataTahun();

  if(filterAdmin.tahun !== null) {
    tahunValue.value = filterAdmin.tahun;
    await nextTick()
    submitForm();
  }
})
const fetchDataTahun = async () => {
  try {
    const response = await getApiTahun();
    filterAdmin.setTahunList(response.data.data)
  } catch (error : any){
    console.log(error)
  }
}

const emit = defineEmits(['submit']);

const resetForm = () => {
  searchValue.value = '';
  tahunValue.value = null;
  filterAdmin.resetFilter()
}
const submitForm = () => {
  filterAdmin.setSearch(searchValue.value)
  filterAdmin.setTahun(tahunValue.value)
  emit('submit', true);
}

</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md mx-auto">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">Filter Data</h2>
    <div >

      <div class="mb-6 flex items-center">
        <label for="tahun" class="w-1/4 text-sm font-medium text-gray-700 pr-4">Tahun</label>
        <div class="w-3/4 relative">
          <input
            v-if="filterAdmin.tahunList.length == 0"
            type="text"
            id="tahun"
            placeholder="Tidak ada data tahun"
            disabled
            class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          />
          <select
            v-else
            v-model="tahunValue"
            id="tahun"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
          >
            <option
              v-for="item in filterAdmin.tahunList"
              :key="item.id"
              :value="item.id"
            >
              {{ item.tahun }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button
          @click="resetForm"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Reset
        </button>
        <button
          @click="submitForm"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
  </div>
</template>

<!--<div class="mb-4 flex items-center">-->
<!--<label for="search" class="w-1/4 text-sm font-medium text-gray-700 pr-4">Cari</label>-->
<!--<div class="w-3/4 relative rounded-md shadow-sm">-->
<!--  <input-->
<!--    v-model="searchValue"-->
<!--    type="text"-->
<!--    id="search"-->
<!--    placeholder="Cari..."-->
<!--    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"-->
<!--  />-->
<!--</div>-->
<!--</div>-->

