// App.js
import { useRealTime } from './composables/useRealTime.js';
import router from '../router/index.js';

export default {
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navigation Bar -->
      <nav class="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-12 items-center">
            <div class="flex items-center">
              <!-- Logo -->
              <router-link to="/" class="flex-shrink-0 flex items-center text-purple-400 font-semibold text-xl tracking-tight">
                TemplateApp
              </router-link>

              <!-- Desktop Menu -->
              <div class="hidden sm:ml-6 sm:flex sm:space-x-6">
                <router-link
                  to="/"
                  class="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md"
                  :class="{ 'bg-gray-700 text-purple-400': $route.path === '/' || $route.name === 'landingWithChannel' }"
                >
                  Home
                </router-link>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="flex sm:hidden items-center space-x-2">
              <!-- Hamburger Menu -->
              <button @click="toggleMenu" type="button" class="text-gray-300 hover:text-purple-400 p-2 rounded-md">
                <span class="sr-only">Open main menu</span>
                <svg v-if="!menuOpen" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg v-else class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div class="sm:hidden" v-show="menuOpen">
          <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
            <router-link
              to="/"
              class="block px-3 py-2 text-base font-medium text-gray-300 hover:text-purple-400 hover:bg-gray-700 rounded-md"
              :class="{ 'bg-gray-700 text-purple-400': $route.path === '/' || $route.name === 'landingWithChannel' }"
            >
              Home
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>
  `,
  setup() {
    console.log('App.js setup called');
    const menuOpen = Vue.ref(false);

    function toggleMenu() {
      menuOpen.value = !menuOpen.value;
    }

    Vue.onMounted(() => {
      console.log('App.js mounted');
    });

    Vue.onUnmounted(() => {
      console.log('App.js unmounted');
    });

    return {
      menuOpen,
      toggleMenu,
    };
  },
};