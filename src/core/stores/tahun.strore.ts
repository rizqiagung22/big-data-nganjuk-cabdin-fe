import { defineStore } from "pinia";
import {getApiTahun} from "@/core/services/global.service.ts";
import type {TahunInterface} from "@/core/interfaces/tahun.interface.ts";


export const useTahunStore = defineStore("tahun", {
  state: () => ({
    selected: null as number | null,
    data : [] as TahunInterface[]
  }),
  actions: {
    async fetchDataTahun() {
      const response = await getApiTahun();
      this.data = response.data.data
    },
    setSelected(value : number){
      this.selected = value;
    }
  },
});
