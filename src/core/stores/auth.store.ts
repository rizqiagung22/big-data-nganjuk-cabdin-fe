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
      this.user.avatar = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
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
