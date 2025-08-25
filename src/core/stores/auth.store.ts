import { type UserDetail } from "@/core/interfaces/auth.interface";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: {} as UserDetail,
    authToken: "" as string | undefined,
    isLoading : true,
  }),
  actions: {
    async login() {
      try {
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    setUser(params : UserDetail) {
      this.user = {...params}
    },

    logout() {
      this.authToken = undefined;
      localStorage.removeItem('auth_token');
      this.isAuthenticated = false;
    },

    updateToken(token: string) {
      this.authToken = token;
      this.isAuthenticated = true;
      localStorage.setItem('auth_token', token);
    },
    setLoading(value : boolean){
      this.isLoading = value;
    }
  },
});
