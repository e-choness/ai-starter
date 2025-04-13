// components/Landing.js
import { useRealTime } from '../composables/useRealTime.js';
import { useHistory } from '../composables/useHistory.js';
import { useConfigs } from '../composables/useConfigs.js';
import Agents from './Agents.js';
import Chats from './Chats.js';

export default {
  name: 'Landing',
  components: { Agents, Chats },
  props: {
    channelName: {
      type: String,
      default: null,
    },
  },
  template: `
    <div class="min-h-screen transition-colors duration-300" :class="darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'">
      <!-- Tabs -->
      <div class="bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-4">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors"
              :class="activeTab === tab ? 'bg-purple-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600'"
            >
              {{ tab }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Hero Section -->
      <header class="py-20 bg-gradient-to-b from-purple-600 to-indigo-600 dark:from-purple-800 dark:to-indigo-800 text-center">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-4xl sm:text-5xl font-extrabold mb-6">Welcome to the Template</h2>
          <p class="text-lg sm:text-xl mb-8 text-gray-200">A powerful starting point for real-time collaboration apps with multi-user sync and database persistence.</p>
          <button @click="activeTab = 'Chats'" class="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all">
            Start Chatting
          </button>
        </div>
      </header>

      <!-- Tab Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <agents v-if="activeTab === 'Agents'" />
        <chats v-if="activeTab === 'Chats'" />
      </main>

      <!-- Features Section -->
      <section class="py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 class="text-3xl font-bold mb-8 text-center">Key Features</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
              <h4 class="text-xl font-semibold mb-4">{{ feature.title }}</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  setup(props) {
    console.log('Landing.js setup called');
    const { env } = useConfigs();
    const { connect, disconnect, userUuid, displayName, channelName, isConnected, connectionStatus, on } = useRealTime();
    const { gatherLocalHistory } = useHistory();
    const router = VueRouter.useRouter();

    const darkMode = Vue.ref(false);
    const activeTab = Vue.ref('Chats');
    const tabs = ['Agents', 'Chats'];
    const sessionReady = Vue.ref(false);
    const errorMessage = Vue.ref('');

    const features = [
      {
        title: 'Real-Time Collaboration',
        description: 'Sync instantly with multiple users using Socket.IO for seamless communication.',
      },
      {
        title: 'Database Persistence',
        description: 'Store and retrieve data dynamically with MongoDB, supporting any entity type.',
      },
      {
        title: 'Customizable Template',
        description: 'Extend this open-source template to build your own collaborative applications.',
      },
    ];

    function toggleDarkMode() {
      darkMode.value = !darkMode.value;
    }

    function copyLink() {
      const link = `${env.value.API_URL}/${channelName.value}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).catch(err => {
          console.error('Clipboard API error:', err);
          errorMessage.value = 'Failed to copy link.';
        });
      } else {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = link;
        tempInput.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          errorMessage.value = 'Failed to copy link.';
        } finally {
          document.body.removeChild(tempInput);
        }
      }
    }

    function isValidChannelName(name) {
      if (!name || typeof name !== 'string') return false;
      return /^[a-z0-9 _-]+$/.test(name);
    }

    function handleVisibilityChange() {
      if (!document.hidden && !isConnected.value && channelName.value && displayName.value) {
        if (!isValidChannelName(channelName.value)) {
          console.error('Invalid channel name on reconnect.');
          return;
        }
        connect(channelName.value, displayName.value);
      }
    }

    const connectionStatusClass = Vue.computed(() => {
      if (connectionStatus.value === 'connected') return 'bg-green-500';
      if (connectionStatus.value === 'connecting') return 'bg-yellow-500';
      return 'bg-gray-500';
    });

    Vue.onMounted(() => {
      console.log('Landing.js mounted');
      document.addEventListener('visibilitychange', handleVisibilityChange);
      if (props.channelName && isValidChannelName(props.channelName)) {
        channelName.value = props.channelName;
        displayName.value = `User ${Math.floor(Math.random() * 1000)}`;
        connect(props.channelName, displayName.value);
        sessionReady.value = true;
      } else {
        channelName.value = uuidv4();
        displayName.value = `User ${Math.floor(Math.random() * 1000)}`;
        if (isValidChannelName(channelName.value)) {
          router.push(`/${channelName.value}`);
          connect(channelName.value, displayName.value);
          sessionReady.value = true;
        } else {
          console.error('Generated invalid channel name.');
        }
      }
    });

    Vue.onUnmounted(() => {
      console.log('Landing.js unmounted');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    });

    return {
      darkMode,
      toggleDarkMode,
      activeTab,
      tabs,
      features,
      copyLink,
      sessionReady,
      errorMessage,
      connectionStatusClass,
    };
  },
};