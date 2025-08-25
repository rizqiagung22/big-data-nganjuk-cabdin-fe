import { defineStore } from "pinia";

interface ErrorState {
  title: string;
  message: string;
}

export const useErrorStore = defineStore("error", {
  state: () => ({
    title: "",
    message: "",
    isShown: false,
  }),

  actions: {
    setError(err: ErrorState) {
      this.title = err.title;
      this.message = err.message;
      this.isShown = true;
    },
    clearError() {
      this.title = "";
      this.message = "";
      this.isShown = false;
    },
  },
});
