<template>
  <header class="bg-white shadow-sm z-10 sticky top-0">
    <div class="flex items-center justify-between px-6 py-4">
      <!-- Left Section -->
      <div class="flex items-center">
        <button
            @click="$emit('toggle-sidebar')"
            class="mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 transform hover:scale-105"
            aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">


        <!-- Search Button (Mobile) -->
        <button
            @click="toggleSearch"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-full hover:bg-gray-100"
            aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        <!-- User Dropdown -->
        <div class="relative">
          <button
              @click="toggleUserDropdown"
              class="flex items-center space-x-2 focus:outline-none group"
              aria-label="User menu"
          >
            <div class="relative">
              <img
                  :src="user?.gender == 'L' ? '../../../src/core/assets/laki_laki.png' : '../../../src/core/assets/perempuan.png'"
                  alt="User"
                  class="h-8 w-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
              >
              <span
                  v-if="user?.isOnline"
                  class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"
              ></span>
            </div>
            <span class="hidden md:inline-block font-medium text-gray-700">{{ user?.name }}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-gray-500 transition-transform duration-200"
                :class="{ 'transform rotate-180': isUserDropdownOpen }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <transition name="dropdown">
            <div
                v-if="isUserDropdownOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-100"
            >
              <div class="px-4 py-3 border-b">
                <p class="text-sm font-medium text-gray-800">{{ user?.username }}</p>
                <p class="text-xs mt-1">
                  <span class="inline-flex items-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    {{ user?.role }}
                  </span>
                </p>
              </div>
              <div class="border-t border-gray-100"></div>
              <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center"
                  @click="logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </a>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Mobile Search (Full Width) -->
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useAuthStore} from "@/core/stores/auth.store.js";
import {useRouter} from "vue-router";

defineProps({
  user: Object,
  isSidebarCollapsed: Boolean
});
const authStore = useAuthStore()
const router = useRouter()

const emit = defineEmits(['toggle-sidebar', 'logout']);

// State
const isUserDropdownOpen = ref(false);
const isNotificationsOpen = ref(false);
const isSearchOpen = ref(false);
// const isSearchFocused = ref(false);
// const searchQuery = ref('');
const darkMode = ref(false);

// Sample notifications data
// const notifications = ref([
//   {
//     id: 1,
//     title: 'New registration',
//     message: 'A new student has registered for the program',
//     time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
//     type: 'success',
//     unread: true
//   },
//   {
//     id: 2,
//     title: 'Payment received',
//     message: 'Payment for registration #12345 has been completed',
//     time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
//     type: 'success',
//     unread: true
//   },
//   {
//     id: 3,
//     title: 'Document verification needed',
//     message: '3 documents require your verification',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
//     type: 'warning',
//     unread: true
//   },
//   {
//     id: 4,
//     title: 'System update',
//     message: 'New version 2.3.0 is available',
//     time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
//     type: 'info',
//     unread: false
//   }
// ]);

// Computed
// const unreadNotifications = computed(() => {
//   return notifications.value.filter(n => n.unread).length;
// });

// Methods
const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
  if (isUserDropdownOpen.value) {
    isNotificationsOpen.value = false;
  }
};



// const toggleNotifications = () => {
//   isNotificationsOpen.value = !isNotificationsOpen.value;
//   if (isNotificationsOpen.value) {
//     isUserDropdownOpen.value = false;
//   }
// };


const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

// const clearSearch = () => {
//   searchQuery.value = '';
// };

// const markAllAsRead = () => {
//   notifications.value.forEach(n => n.unread = false);
// };

// const handleNotificationClick = (notification : any) => {
//   notification.unread = false;
//   // Handle notification click logic here
//   console.log('Notification clicked:', notification);
//   isNotificationsOpen.value = false;
// };

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const logout = () => {
  router.replace('/login');
  authStore.logout()
};

</script>

<style scoped>
/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>



<!-- Search Bar (Desktop) -->
<!--<div class="hidden md:flex items-center relative">-->
<!--<input-->
<!--    v-model="searchQuery"-->
<!--    type="text"-->
<!--    placeholder="Search..."-->
<!--    class="pl-10 pr-4 py-2 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"-->
<!--    @focus="isSearchFocused = true"-->
<!--    @blur="isSearchFocused = false"-->
<!--&gt;-->
<!--<div class="absolute left-3 text-gray-400">-->
<!--  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />-->
<!--  </svg>-->
<!--</div>-->
<!--<transition name="fade">-->
<!--  <button-->
<!--      v-if="searchQuery"-->
<!--      @click="clearSearch"-->
<!--      class="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"-->
<!--      aria-label="Clear search"-->
<!--  >-->
<!--    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />-->
<!--    </svg>-->
<!--  </button>-->
<!--</transition>-->
<!--</div>-->

<!--&lt;!&ndash; Notifications &ndash;&gt;-->
<!--<div class="relative">-->
<!--<button-->
<!--    @click="toggleNotifications"-->
<!--    class="p-2 text-gray-500 hover:text-gray-700 relative transition-colors duration-200 rounded-full hover:bg-gray-100"-->
<!--    aria-label="Notifications"-->
<!--&gt;-->
<!--  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />-->
<!--  </svg>-->
<!--  <span-->
<!--      v-if="unreadNotifications"-->
<!--      class="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"-->
<!--  ></span>-->
<!--</button>-->

<!--&lt;!&ndash; Notifications Dropdown &ndash;&gt;-->
<!--<transition name="dropdown">-->
<!--  <div-->
<!--      v-if="isNotificationsOpen"-->
<!--      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-100"-->
<!--  >-->
<!--    <div class="px-4 py-3 border-b flex justify-between items-center">-->
<!--      <h3 class="text-sm font-semibold text-gray-800">Notifications</h3>-->
<!--      <button-->
<!--          @click="markAllAsRead"-->
<!--          class="text-xs text-blue-600 hover:text-blue-800"-->
<!--      >-->
<!--        Mark all as read-->
<!--      </button>-->
<!--    </div>-->
<!--    <div class="max-h-96 overflow-y-auto">-->
<!--      <template v-if="notifications.length > 0">-->
<!--        <a-->
<!--            v-for="(notification, index) in notifications"-->
<!--            :key="index"-->
<!--            href="#"-->
<!--            class="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"-->
<!--            :class="{ 'bg-blue-50': notification.unread }"-->
<!--            @click.prevent="handleNotificationClick(notification)"-->
<!--        >-->
<!--          <div class="flex items-start">-->
<!--            <div-->
<!--                class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"-->
<!--                :class="notification.type === 'success' ? 'bg-green-100 text-green-600' :-->
<!--                               notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :-->
<!--                               'bg-blue-100 text-blue-600'"-->
<!--            >-->
<!--              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                <path v-if="notification.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />-->
<!--                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />-->
<!--              </svg>-->
<!--            </div>-->
<!--            <div class="ml-3">-->
<!--              <p class="font-medium text-gray-800">{{ notification.title }}</p>-->
<!--              <p class="text-gray-600">{{ notification.message }}</p>-->
<!--              <p class="text-xs text-gray-400 mt-1">{{ (notification.time) }}</p>-->
<!--            </div>-->
<!--            <span-->
<!--                v-if="notification.unread"-->
<!--                class="ml-auto h-2 w-2 rounded-full bg-blue-500"-->
<!--            ></span>-->
<!--          </div>-->
<!--        </a>-->
<!--      </template>-->
<!--      <div v-else class="px-4 py-6 text-center">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />-->
<!--        </svg>-->
<!--        <p class="mt-2 text-sm text-gray-500">No new notifications</p>-->
<!--      </div>-->
<!--    </div>-->
<!--    <a href="#" class="block px-4 py-2 text-sm text-center text-blue-600 hover:bg-gray-50 border-t">-->
<!--      View all notifications-->
<!--    </a>-->
<!--  </div>-->
<!--</transition>-->
<!--</div>-->

<!--<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center">-->
<!--  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />-->
<!--  </svg>-->
<!--  Profil Saya-->
<!--</a>-->
<!--<a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center">-->
<!--  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />-->
<!--    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />-->
<!--  </svg>-->
<!--  Pengaturan-->
<!--</a>-->
<!-- -->
