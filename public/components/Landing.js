// components/Landing.js
import { useRealTime } from '../composables/useRealTime.js';
import { useHistory } from '../composables/useHistory.js';
import { useModels } from '../composables/useModels.js';
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
    <div class="font-sans transition-colors duration-300">
      <!-- Tabs -->
      <div class="sticky top-0 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-1 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              class="py-4 px-4 text-sm font-medium transition-colors border-b-2"
              :class="activeTab === tab ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400' : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'"
            >
              {{ tab }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Landing Tab Content -->
      <div v-if="activeTab === 'Landing'">
        <!-- Hero Section -->
        <section class="relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
          <div class=" inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/5"></div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div class="text-center max-w-3xl mx-auto">
              <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                <span class="block">Intelligent apps for</span>
                <span class="block text-teal-600 dark:text-teal-400">hyperefficient operations</span>
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Create modern, AI-powered apps that turn scattered data into actionable insights and automate manual work—no coding required.
              </p>
              <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <button @click="activeTab = 'Agents'" class="px-8 py-3 text-base font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md shadow-md transition-all">
                  Build an Agent
                </button>
                <button @click="activeTab = 'Chat'" class="px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-all">
                  Start Chatting Now
                </button>
              </div>
            </div>
          </div>
          
          <!-- Device Mockups -->
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div class="flex justify-center">
              <div class="relative w-full max-w-5xl">
                <div class="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-xl transform rotate-1 scale-105"></div>
                <div class="relative flex justify-center items-end">
                  <div class="w-2/3 md:w-1/2 transform -translate-x-8 translate-y-4 z-10">
                    <div class="rounded-lg shadow-2xl overflow-hidden">
                      <img :src="agents1Img" alt="Desktop App" class="w-full h-auto" />
                    </div>
                  </div>
                  <div class="w-1/3 md:w-1/4 transform translate-x-8 -translate-y-4">
                    <div class="rounded-3xl shadow-2xl overflow-hidden">
                      <img :src="agents2Img" alt="Mobile App" class="w-full h-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Key Features Section (Card-Based) -->
        <section class="bg-white dark:bg-gray-800 py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Software made for modern operations</h2>
              <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Create intelligent apps that help you close deals in the field, manage customers, or track inventory.
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="(feature, index) in features.slice(0, 3)" :key="index" 
                class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 transition-all hover:shadow-md">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 mb-4 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Highlight Section 1 -->
        <section class="bg-gray-50 dark:bg-gray-900 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-12">
              <div class="lg:w-1/2 order-2 lg:order-1">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Real-Time Multi-User Collaboration</h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Connect multiple users seamlessly in shared channels for instant collaboration. The app uses Socket.IO to broadcast messages, user presence, and entity updates in real-time, ensuring everyone stays in sync.
                </p>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Each user joins a channel with a unique ID, and actions like sending messages, joining/leaving, or updating entities are instantly reflected across all clients.
                </p>
              </div>
              <div class="lg:w-1/2 order-1 lg:order-2">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-blue-500/30 rounded-xl transform rotate-3"></div>
                  <div class="relative rounded-xl overflow-hidden shadow-xl">
                    <img :src="agents1Img" alt="Real-Time Collaboration" class="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Highlight Section 2 -->
        <section class="bg-white dark:bg-gray-800 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-12">
              <div class="lg:w-1/2">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-teal-400/30 rounded-xl transform -rotate-3"></div>
                  <div class="relative rounded-xl overflow-hidden shadow-xl">
                    <img :src="agents2Img" alt="Customizable AI Agents" class="w-full h-auto" />
                  </div>
                </div>
              </div>
              <div class="lg:w-1/2">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Customizable AI Agents</h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Create and manage multiple AI agents, each tailored to specific tasks or personalities. Define unique system prompts, select from various LLM models, and customize avatars to differentiate agents.
                </p>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  The app supports a dynamic agent registry where users can add, edit, or delete agents via a modern UI. Agents persist in MongoDB, ensuring consistency across sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Highlight Section 3 -->
        <section class="bg-gray-50 dark:bg-gray-900 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-12">
              <div class="lg:w-1/2 order-2 lg:order-1">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Multi-LLM Model Support</h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Leverage a variety of leading AI models from providers like OpenAI, Anthropic, AzureAI, Mistral, Groq, Gemini, and xAI. The app abstracts provider-specific APIs into a unified interface for seamless integration.
                </p>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Users can select models per agent's needs, with streaming responses for real-time chat interactions.
                </p>
              </div>
              <div class="lg:w-1/2 order-1 lg:order-2">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-teal-400/30 to-blue-500/30 rounded-xl transform rotate-3"></div>
                  <div class="relative rounded-xl overflow-hidden shadow-xl">
                    <img :src="agents3Img" alt="Multi-LLM Model Support" class="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Highlight Section 4 -->
        <section class="bg-white dark:bg-gray-800 py-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row items-center gap-12">
              <div class="lg:w-1/2">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-teal-400/30 rounded-xl transform -rotate-3"></div>
                  <div class="relative rounded-xl overflow-hidden shadow-xl">
                    <img :src="agents4Img" alt="Single Node.js Codebase" class="w-full h-auto" />
                  </div>
                </div>
              </div>
              <div class="lg:w-1/2">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Single Node.js Codebase Deployment</h2>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Deploy the entire application with a unified Node.js codebase, streamlining development and scaling. The server integrates Express.js, Socket.IO, and MongoDB connectivity in one package.
                </p>
                <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Environment variables configure API keys, database connections, and ports, making deployment straightforward on platforms like Heroku, AWS, or Docker.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Final CTA Section -->
        <section class="bg-gray-50 dark:bg-gray-900 py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Build?</h2>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Jump into the Agents tab to create your first AI agent, or start chatting now to explore real-time collaboration.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button @click="activeTab = 'Agents'" class="px-8 py-3 text-base font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-md shadow-md transition-all">
                Create an Agent
              </button>
              <button @click="activeTab = 'Chat'" class="px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm transition-all">
                Start Chatting
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- Other Tab Content -->
      <main v-else class="max-w-8xl mx-auto px-4 py-2">
        <agents v-show="activeTab === 'Agents'" :darkMode="darkMode" />
        <chats v-show="activeTab === 'Chat'" :darkMode="darkMode" />
      </main>
    </div>
  `,
  setup(props) {
    console.log('Landing.js setup called');
    const { env } = useConfigs();
    const { connect, disconnect, userUuid, displayName, channelName, isConnected, on } = useRealTime();
    const { gatherLocalHistory } = useHistory();
    const { modelRegistry, fetchServerModels } = useModels();
    const router = VueRouter.useRouter();

    const agents1Img = Vue.computed(() => `/assets/aiagent1.jpg`);
    const agents2Img = Vue.computed(() => `/assets/aiagent2.jpg`);
    const agents3Img = Vue.computed(() => `/assets/aiagent3.jpg`);
    const agents4Img = Vue.computed(() => `/assets/aiagent4.jpg`);

    const activeTab = Vue.ref('Landing');
    const tabs = ['Landing', 'Agents', 'Chat'];
    const sessionReady = Vue.ref(false);
    const errorMessage = Vue.ref('');

    const features = [
      {
        title: 'Real-Time Collaboration',
        description: 'Sync instantly with multiple users using Socket.IO for seamless communication. Collaborate in seconds!',
      },
      {
        title: 'Database Persistence',
        description: 'Store and retrieve data dynamically with MongoDB, supporting any entity type. Expand new entity types easily.',
      },
      {
        title: 'Customizable Template',
        description: 'Extend this open-source template to build your own collaborative applications.',
      },
      {
        title: 'Tailwind CSS (Light and Dark)',
        description: 'Integrated light and dark modes.',
      },
      {
        title: 'Deploy and Run for Free',
        description: 'Lightweight to deploy to a single Web Service and free-tier Mongo Atlas cluster.',
      },
      {
        title: 'Fully Open Source (MIT)',
        description: 'Infinite free reuse, refactoring, and modification. Make it your own.',
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
      fetchServerModels();
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
      agents1Img,
      agents2Img,
      agents3Img,
      agents4Img,
      activeTab,
      tabs,
      features,
      copyLink,
      sessionReady,
      errorMessage,
    };
  },
};
