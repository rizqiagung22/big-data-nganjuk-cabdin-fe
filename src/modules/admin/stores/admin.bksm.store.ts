import { defineStore } from "pinia";


export const useFilterAdminBksmStore = defineStore("FilterAdminBksm", {
  state: () => ({
    search: '' as string,
    tahun : null as number | null
  }),
  actions: {
    setSearch(value : string) {
      this.search = value
    },
    setTahun(value : number) {
      this.tahun = value;
    },
    resetFilter(){
      this.search = '';
      this.tahun = null;
    }
  },
});
