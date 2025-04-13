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
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div class="min-h-screen transition-colors duration-300">
      <!-- Tabs -->
      <div class="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-6">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="py-4 text-sm font-medium transition-colors border-b-2"
              :class="activeTab === tab ? 'border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'"
            >
              {{ tab }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Landing Tab Content -->
      <div v-if="activeTab === 'Landing'" class="py-12">
        <!-- Hero Section -->
        <header class="relative py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white overflow-hidden">
          <div class="absolute inset-0 bg-black opacity-20 dark:opacity-40"></div> <!-- Subtle overlay -->
          <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl sm:text-5xl font-extrabold mb-4 font-sans">Build Smarter with TemplateApp</h2>
            <p class="text-lg sm:text-xl mb-8 text-gray-100 font-light">
              A sleek starting point for real-time collaboration apps with multi-user sync and database persistence.
            </p>
            <button @click="activeTab = 'Chat'" class="px-6 py-3 bg-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 text-blue-600 hover:bg-gray-100 rounded-lg font-semibold transition-all shadow-md">
              Start Chatting Now
            </button>
          </div>
        </header>

        <!-- Key Features Section -->
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-900">
          <h3 class="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Key Features</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="feature in features" :key="feature.title" class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h4 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{{ feature.title }}</h4>
              <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
            </div>
          </div>
        </section>

        <!-- Call to Action Section -->
        <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center bg-gray-50 dark:bg-gray-900">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Ready to Build?</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Jump into the Agents tab to create your first AI agent, or start chatting now to explore real-time collaboration.
          </p>
          <div class="flex justify-center gap-4">
            <button @click="activeTab = 'Agents'" class="px-6 py-3 bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-semibold transition-all">
              Create an Agent
            </button>
            <button @click="activeTab = 'Chat'" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-gray-900 hover:bg-gray-300 rounded-lg font-semibold transition-all">
              Start Chatting
            </button>
          </div>
        </section>
      </div>

      <!-- Other Tab Content -->
      <main v-else class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <agents v-if="activeTab === 'Agents'" :darkMode="darkMode" />
        <chats v-if="activeTab === 'Chat'" :darkMode="darkMode" />
      </main>
    </div>
  `,
  setup(props) {
    console.log('Landing.js setup called');
    const { env } = useConfigs();
    const { connect, disconnect, userUuid, displayName, channelName, isConnected, on } = useRealTime();
    const { gatherLocalHistory } = useHistory();
    const router = VueRouter.useRouter();

    const activeTab = Vue.ref('Landing');
    const tabs = ['Landing', 'Agents', 'Chat'];
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
      activeTab,
      tabs,
      features,
      copyLink,
      sessionReady,
      errorMessage,
    };
  },
};