<template>
  <div v-if="authStore.isLoading" class="flex items-center justify-center h-screen bg-gray-100">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>
  </div>
  <div v-else class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card Login -->
      <div
          class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-purple-500/20">
        <!-- Header dengan animasi glow -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center relative overflow-hidden">
          <div class="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-purple-500/30 animate-pulse"></div>
          <div class="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-indigo-500/30 animate-pulse"></div>

          <div class="relative z-10">
            <div class="flex justify-center mb-3">
              <div class="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <ShieldCheckIcon class="h-8 w-8 text-white"/>
              </div>
            </div>
            <h1 class="text-2xl font-bold text-white">Admin Panel</h1>
            <p class="text-purple-100 mt-1">Sistem Cabang Dinas Pendidikan Nganjuk</p>
          </div>
        </div>

        <!-- Form -->
        <div class="p-6">
          <div class="space-y-5">
            <!-- Username Input -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-1">Username</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon class="h-5 w-5 text-gray-400"/>
                </div>
                <input
                    v-model="adminForm.username"
                    type="text"
                    placeholder="Masukkan username"
                    class="pl-10 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-gray-400 transition"
                    :class="{'border-red-500': errors.username}"
                >
              </div>
              <p v-if="errors.username" class="mt-1 text-sm text-red-400">{{ errors.username }}</p>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-sm font-medium text-gray-200 mb-1">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon class="h-5 w-5 text-gray-400"/>
                </div>
                <input
                    v-model="adminForm.password"
                    :type="showAdminPassword ? 'text' : 'password'"
                    placeholder="Masukkan password"
                    class="pl-10 w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white placeholder-gray-400 transition"
                    :class="{'border-red-500': errors.password}"
                >
                <button
                    type="button"
                    @click="showAdminPassword = !showAdminPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <EyeIcon v-if="showAdminPassword" class="h-5 w-5 text-gray-400 hover:text-gray-300"/>
                  <EyeSlashIcon v-else class="h-5 w-5 text-gray-400 hover:text-gray-300"/>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
            </div>


            <!-- Submit Button -->
            <button
                @click="handleLogin"
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 group"
                :disabled="isLoading"
            >
              <span class="group-hover:scale-105 transition-transform">
                Masuk
              </span>
              <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/10"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-transparent text-gray-400">Akses terbatas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Demo User:</h3>
        <p class="text-xs text-gray-600"><span class="font-medium">Username:</span> rizqi123</p>
        <p class="text-xs text-gray-600"><span class="font-medium">Password:</span> 123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {
  UserCircleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from '@heroicons/vue/24/outline'
import {useRouter} from "vue-router";
import {useAuthStore} from "../../../core/stores/auth.store.js";
import {loginService, userLoginService} from "../services/login.service.js";
import {useTahunStore} from "@/core/stores/tahun.strore.ts";

const router = useRouter()
const showAdminPassword = ref(false)
const isLoading = ref(false);

const authStore = useAuthStore()
const tahunStore = useTahunStore()

const adminForm = ref({
  username: '',
  password: '',
})

const errors = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    const deviceName = navigator.userAgent;
    const payload = {
      username: adminForm.value.username,
      password: adminForm.value.password,
      device_name: deviceName // <- Ini dia yang dikirim!
    }
    const response = await loginService(payload)
    authStore.updateToken(response.data.token)
    authStore.setUser(response.data.user)
    await tahunStore.fetchDataTahun();
    if(tahunStore.data.length > 0){
      tahunStore.setSelected(tahunStore.data[0].id)
    }
    handleNavigation(response.data.user.role)
  } catch (e) {
    errors.value.username = 'Username atau password Anda salah'
    errors.value.password = 'Username atau password Anda salah'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    try {
      authStore.setLoading(true)
      authStore.updateToken(authToken);
      const response = await userLoginService();
      authStore.setUser(response.data.user)
      await tahunStore.fetchDataTahun();
      if(tahunStore.data.length > 0){
        tahunStore.setSelected(tahunStore.data[0].id)
      }
      handleNavigation(response.data.user.role)
    } catch (error) {
      authStore.setLoading(false)
      console.error('Failed to log in:', error);
    }
  } else {
    authStore.setLoading(false)
  }
})

const handleNavigation = (role : string) => {
  if (role === 'superadmin') {
    router.replace('/super-admin')
  } else if (role === 'admin') {
    router.replace('/admin')
  } else if (role === 'user') {
    router.replace('/user')
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
