<template>
  <div v-if="authStore.isLoading" class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>
  </div>
  <div
      v-else-if="authStore.isAuthenticated && authStore.user && authStore.user?.role === 'superadmin'"
      class="flex h-screen bg-gray-100">
  <!-- Sidebar -->
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle="isSidebarCollapsed = !isSidebarCollapsed" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header
          :user="currentUser"
          :is-sidebar-collapsed="isSidebarCollapsed"
          @toggle-sidebar="isSidebarCollapsed = !isSidebarCollapsed"
      />

      <!-- Main Content -->
      <main   class="flex-1 overflow-y-auto p-6 bg-gray-50">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <Teleport v-else to="body">
    <Transition name="modal-fade">
      <div
          v-if="isModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          @click.self="closeModal"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all text-center p-6 sm:p-8">

          <!-- Ikon untuk feedback visual -->
          <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldExclamationIcon class="h-10 w-10 text-red-600" aria-hidden="true" />
          </div>

          <!-- Tombol Close di pojok kanan atas -->
          <button
              @click="closeModal"
              class="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>

          <!-- Konten Teks -->
          <div class="mt-4">
            <h3 class="text-xl font-semibold text-gray-900">Akses Ditolak</h3>
            <p class="mt-2 text-sm text-gray-600">
              Maaf, Anda tidak memiliki izin yang cukup untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah sebuah kesalahan.
            </p>
          </div>

          <!-- Tombol Aksi Utama -->
          <div class="mt-6">
            <button
                @click="closeModal"
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm transition-colors"
            >
              Kembali ke Halaman Awal
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import { ShieldExclamationIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/core/stores/auth.store.ts";
import {userLoginService} from "../../login/services/login.service.js";
import Sidebar from "@/modules/layout/Sidebar.vue";
import Header from "@/modules/layout/Header.vue";

const authStore = useAuthStore()
const router = useRouter()
// State untuk mengontrol visibilitas modal
const isModalOpen = ref(true); // Set ke true untuk menampilkan secara default saat development
const closeModal = () => {
  authStore.logout();
  router.replace('/login')
};

const isSidebarCollapsed = ref(true);

const currentUser = {
  name: 'Super Admin',
  email: 'superadmin@',
  role: 'Super Admin',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
};

onMounted(async () => {
  const authToken = localStorage.getItem('auth_token');
  if (authToken && !authStore.isAuthenticated) {
    try {
      authStore.setLoading(true);
      authStore.updateToken(authToken);
      const response = await userLoginService();
      authStore.setUser(response.data.user);
    } catch (error) {
      console.error('Failed to log in:', error);
    } finally {
      authStore.setLoading(false);
    }
  } else {
    authStore.setLoading(false);
  }
});
</script>

<style scoped>
.modal-fade-enter-active .transform,
.modal-fade-leave-active .transform {
  transition: all 0.3s ease;
}

.modal-fade-enter-from .transform,
.modal-fade-leave-to .transform {
  transform: scale(0.95);
}
</style>
