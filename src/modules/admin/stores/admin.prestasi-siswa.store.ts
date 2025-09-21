import { defineStore } from "pinia";
import type {TahunInterface} from "@/core/interfaces/tahun.interface.ts";


export const useFilterAdminPrestasiSiswaStore = defineStore("FilterAdminPrestasiSiswa", {
  state: () => ({
    search: '' as string,
    tahun : null as number | null,
    tahunList : [] as TahunInterface[]
  }),
  actions: {
    setSearch(value : string) {
      this.search = value
    },
    setTahun(value : number) {
      this.tahun = value;
    },
    setTahunList(value : any[]) {
      this.tahunList = value;
    },
    resetFilter(){
      this.search = '';
      this.tahun = null;
    }
  },
});
