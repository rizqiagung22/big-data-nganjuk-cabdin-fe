<template>
  <aside
      class="
      bg-gradient-to-b from-blue-800 to-blue-900 text-white transition-all duration-300 ease-in-out shadow-xl"
      :class="isCollapsed ? 'w-20' : 'w-64'"
  >
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div
          class="flex items-center justify-center p-4 border-b border-blue-700/50 transition-all duration-300"
          :class="isCollapsed ? 'h-16' : 'h-20'"
      >
        <div v-if="!isCollapsed" class="flex items-center space-x-3">
          <div class="bg-white p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-md font-bold tracking-wide">CABDIN NGANJUK</span>
        </div>
        <div v-else class="p-2 bg-white/10 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 overflow-y-visible overflow-x-visible py-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-900">
        <ul class="space-y-1 px-2">
          <li v-for="(item, index) in menuItems" :key="item.name">
            <router-link
                :to="item.path"
                @click="handleItemClick(item)"
                @mouseenter="hoveredItem = index"
                @mouseleave="hoveredItem = null"
                class="flex items-center p-3 rounded-lg transition-all duration-200 group"
                :class="{
                'bg-blue-700/80 shadow-md': item.isActive,
                'hover:bg-blue-700/50': !item.isActive,
                'pl-3': !isCollapsed,
                'justify-center': isCollapsed
              }"
            >
              <div class="relative">
                <component
                    :is="item.icon"
                    class="h-4 w-4 transition-transform duration-200"
                    :class="{
                    'text-blue-300': item.isActive,
                    'group-hover:scale-110': !isCollapsed,
                    'scale-110': (hoveredItem === index || item.isActive) && isCollapsed
                  }"
                />
                <span
                    v-if="isCollapsed && (hoveredItem === index)"
                    class="absolute left-full ml-3 px-2 py-1 text-xs font-medium text-white bg-blue-900 rounded-md shadow-lg whitespace-nowrap z-50"
                >
                  {{ item.name }}
                </span>
              </div>
              <span
                  v-if="!isCollapsed"
                  class="ml-3 transition-all duration-200 text-sm"
                  :class="{
                  'font-medium': item.isActive,
                  'group-hover:translate-x-1': !item.isActive
                }"
              >
                {{ item.name }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Collapse Button -->
      <div class="p-4 border-t border-blue-700/50">
        <button
            @click="$emit('toggle')"
            class="flex items-center justify-center w-full p-2 rounded-lg transition-all duration-200 hover:bg-blue-700/50 group"
            :class="{
            'justify-center': isCollapsed,
            'justify-between': !isCollapsed
          }"
        >
          <div class="flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 transition-transform duration-300"
                :class="{
                'rotate-180': isCollapsed,
                'group-hover:scale-110': !isCollapsed
              }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span v-if="!isCollapsed" class="ml-2 text-sm">Sembunyikan Menu</span>
          </div>
          <kbd
              v-if="!isCollapsed"
              class="ml-2 px-1.5 py-0.5 text-xs bg-white/10 rounded border border-white/20"
          >
            ⌘+M
          </kbd>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ChartBarIcon,
  CalendarIcon,
  CreditCardIcon,
  CircleStackIcon,
    ClipboardIcon
} from '@heroicons/vue/24/outline';
import {ref, watch} from 'vue';
import {useRoute} from "vue-router";
import {useAuthStore} from "@/core/stores/auth.store.ts";

const props = defineProps({
  isCollapsed: Boolean
});
const route = useRoute();
const hoveredItem = ref<any>(null);
const authStore = useAuthStore()
// Data menu items dengan reactive active state


const menuItems = ref();

watch(()=> authStore.user.role, (value : string) => {
  console.log(value, )
  if(value && value === 'superadmin'){
    menuItems.value = [
      {
        name: 'BPOPP',
        path: '/super-admin/bpopp',
        icon: HomeIcon,
        isActive: true
      },
      {
        name: 'BOS',
        path: '/super-admin/bos',
        icon: UsersIcon,
        isActive: false
      },
      {
        name: 'Asset',
        path: '/super-admin/asset',
        icon: ClipboardIcon,
        isActive: false
      },
      {
        name: 'Prestasi Siswa',
        path: '/super-admin/prestasi-siswa',
        icon: ClipboardDocumentListIcon,
        isActive: false
      },
      {
        name: 'PIP',
        path: '/super-admin/pip',
        icon: CreditCardIcon,
        isActive: false
      },
      {
        name: 'Data Siswa',
        path: '/super-admin/data-siswa',
        icon: DocumentTextIcon,
        isActive: false
      },
      {
        name: 'Data Guru dan Tenaga Pendidikan',
        path: '/super-admin/data-guru-dan-tenaga-pendidikan',
        icon: CalendarIcon,
        isActive: false
      }
    ]
  }
  else if(value && value === 'admin'){
    menuItems.value = [
      {
        name: 'BPOPP',
        path: '/admin/bpopp',
        icon: HomeIcon,
        isActive: true
      },
      {
        name: 'BOS',
        path: '/admin/bos',
        icon: UsersIcon,
        isActive: false
      },
      {
        name: 'Asset',
        path: '/admin/asset',
        icon: ClipboardIcon,
        isActive: false
      },
      {
        name: 'Prestasi Siswa',
        path: '/admin/prestasi-siswa',
        icon: ClipboardDocumentListIcon,
        isActive: false
      },
      {
        name: 'PIP',
        path: '/admin/pip',
        icon: CreditCardIcon,
        isActive: false
      },
      {
        name: 'Data Siswa',
        path: '/admin/data-siswa',
        icon: DocumentTextIcon,
        isActive: false
      },
      {
        name: 'Data Guru dan Tenaga Pendidikan',
        path: '/admin/data-guru-dan-tenaga-pendidikan',
        icon: CalendarIcon,
        isActive: false
      }
    ]
  }
  else if(value && value === 'user'){
    menuItems.value = [
      {
        name: 'BPOPP',
        path: '/user/bpopp',
        icon: HomeIcon,
        isActive: true
      },
      {
        name: 'BOS',
        path: '/user/bos',
        icon: UsersIcon,
        isActive: false
      },
      {
        name: 'Asset',
        path: '/user/asset',
        icon: ClipboardIcon,
        isActive: false
      },
      {
        name: 'Prestasi Siswa',
        path: '/user/prestasi-siswa',
        icon: ClipboardDocumentListIcon,
        isActive: false
      },
      {
        name: 'PIP',
        path: '/user/pip',
        icon: CreditCardIcon,
        isActive: false
      },
      {
        name: 'Data Siswa',
        path: '/user/data-siswa',
        icon: DocumentTextIcon,
        isActive: false
      },
      {
        name: 'Data Guru dan Tenaga Pendidikan',
        path: '/user/data-guru-dan-tenaga-pendidikan',
        icon: CalendarIcon,
        isActive: false
      }
    ]
  }
}, {immediate:true})


// Fungsi untuk update active item
const updateActiveItem = (currentPath : any) => {
  menuItems.value.forEach((item: any) => {
    item.isActive = item.path === currentPath;
  });
};

// Set active item berdasarkan route saat ini
updateActiveItem(route.path);

// Watch perubahan route
watch(() => route.path, (newPath) => {
  updateActiveItem(newPath);
});

// Handler untuk klik manual (jika diperlukan)
const handleItemClick = (clickedItem : any) => {
  menuItems.value.forEach((item: any) => {
    item.isActive = item.path === clickedItem.path;
  });
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
</style>
