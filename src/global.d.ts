import DataTable from "@/core/components/DataTable.vue"

// Pendefinisan tipe untuk global components pada folder src/core/components
declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    DataTable: typeof DataTable
  }
}

// Pendefinisan tipe untuk window.variables
declare global {
  interface Window {
    variables: {
      API_URL: string
    }
  }
}
