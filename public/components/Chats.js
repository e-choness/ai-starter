// components/Chats.js
import { useGlobal } from '../composables/useGlobal.js';
import { useHistory } from '../composables/useHistory.js';
import { useRealTime } from '../composables/useRealTime.js';

export default {
  name: 'Chats',
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div class="flex h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <!-- Chat Sessions Sidebar -->
      <div class="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            @click="addChatSession"
            class="w-full py-2 px-4 bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
          >
            New Chat Session
          </button>
        </div>
        <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div
            v-for="session in entities.chatSessions"
            :key="session.id"
            class="p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
            :class="{ 'bg-blue-50 dark:bg-blue-900': activeSessionId === session.id }"
          >
            <input
              v-model="session.data.name"
              type="text"
              class="bg-transparent text-gray-900 dark:text-white flex-1 outline-none font-medium"
              @blur="updateChatSession(session)"
              @click.stop
            />
            <button @click.stop="editSessionName(session)" class="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400">
              <i class="pi pi-pencil"></i>
            </button>
          </div>
          <div v-if="!entities.chatSessions.length" class="p-4 text-gray-500 dark:text-gray-400 text-center">
            No chat sessions yet. Create one to start chatting.
          </div>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="w-2/3 flex flex-col">
        <!-- Agent Selector -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-gray-900">
          <select
            v-model="selectedAgentId"
            class="p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none transition-all w-full sm:w-1/2"
          >
            <option value="">Select an Agent</option>
            <option v-for="agent in entities.agents" :key="agent.id" :value="agent.id">
              {{ agent.data.name }}
            </option>
          </select>
        </div>

        <!-- Messages -->
        <div class="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div
            v-for="chat in activeChats"
            :key="chat.id"
            class="mb-6 p-4 rounded-lg shadow-sm"
            :class="chat.data.isResponse ? 'bg-blue-100 dark:bg-blue-800 ml-12' : 'bg-gray-100 dark:bg-gray-700 mr-12'"
          >
            <div class="flex items-center gap-3 mb-2">
              <img
                v-if="chat.data.isResponse && getAgent(chat.data.agentId)?.data?.imageUrl"
                :src="getAgent(chat.data.agentId).data.imageUrl"
                class="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                alt="Agent Avatar"
              />
              <span class="font-semibold" :class="darkMode ? 'text-white' : 'text-gray-900'">
                {{ chat.data.isResponse ? getAgent(chat.data.agentId)?.data?.name || 'Agent' : 'You' }}
              </span>
            </div>
            <p class="text-sm" :class="darkMode ? 'text-gray-200' : 'text-gray-800'">{{ chat.data.text }}</p>
            <span class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{{ formatTime(chat.timestamp) }}</span>
          </div>
          <div v-if="!activeChats.length" class="text-gray-500 dark:text-gray-400 text-center py-12">
            No messages in this session. Select an agent and start chatting!
          </div>
        </div>

        <!-- Message Input -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div class="flex gap-3">
            <textarea
              v-model="draft"
              rows="2"
              class="flex-1 p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:outline-none transition-all resize-none"
              placeholder="Type a message..."
              @keypress.enter.prevent="sendMessage"
            ></textarea>
            <button
              @click="sendMessage"
              class="py-2 px-4 bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              :disabled="!draft.trim() || !selectedAgentId || isSending"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    console.log('Chats.js setup called');
    const { entities } = useGlobal();
    const { addEntity, updateEntity } = useHistory();
    const { triggerLLM, userUuid } = useRealTime();
    const activeSessionId = Vue.ref(null);
    const selectedAgentId = Vue.ref('');
    const draft = Vue.ref('');
    const isSending = Vue.ref(false);

    const activeChats = Vue.computed(() => {
      if (!activeSessionId.value) return [];
      return entities.value.chats.filter(chat => chat.data.chatSession === activeSessionId.value)
        .sort((a, b) => a.timestamp - b.timestamp);
    });

    function addChatSession() {
      console.log('addChatSession called');
      const id = addEntity('chatSessions', { name: `Session ${entities.value.chatSessions.length + 1}` });
      activeSessionId.value = id;
    }

    function updateChatSession(session) {
      console.log('updateChatSession called for session:', session.id);
      updateEntity('chatSessions', session.id, { name: session.data.name });
    }

    function editSessionName(session) {
      // Focus handled by input click
    }

    function sendMessage() {
      if (!draft.value.trim() || !selectedAgentId.value || isSending.value) return;
      console.log('sendMessage triggered with draft:', draft.value, 'selectedAgentId:', selectedAgentId.value);

      isSending.value = true;
      const sessionId = activeSessionId.value;
      if (!sessionId) {
        isSending.value = false;
        return;
      }

      // Add user message
      console.log('Adding user message for sessionId:', sessionId);
      const userChatId = addEntity('chats', {
        chatSession: sessionId,
        text: draft.value,
        isResponse: false,
      });

      // Add response placeholder
      console.log('Adding response placeholder for sessionId:', sessionId);
      const responseChatId = addEntity('chats', {
        chatSession: sessionId,
        text: '',
        isResponse: true,
        agentId: selectedAgentId.value,
        isStreaming: true,
      });

      // Trigger LLM
      const agent = entities.value.agents.find(a => a.id === selectedAgentId.value);
      if (agent) {
        console.log('Triggering LLM for responseChatId:', responseChatId);
        triggerLLM(
          'chats',
          responseChatId,
          { provider: 'openai', name: 'gpt-4', model: 'gpt-4' },
          0.7,
          agent.data.systemPrompt || 'You are a helpful assistant.',
          draft.value,
          [],
          false
        );
      }

      draft.value = '';
      isSending.value = false;
    }

    function getAgent(agentId) {
      return entities.value.agents.find(a => a.id === agentId);
    }

    function formatTime(timestamp) {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    Vue.onMounted(() => {
      console.log('Chats.js mounted');
    });

    Vue.onUnmounted(() => {
      console.log('Chats.js unmounted');
    });

    Vue.watch(
      () => entities.value.chatSessions,
      (sessions) => {
        if (sessions.length && !activeSessionId.value) {
          activeSessionId.value = sessions[0].id;
        }
      },
      { immediate: true }
    );

    return {
      entities,
      activeSessionId,
      selectedAgentId,
      draft,
      isSending,
      activeChats,
      addChatSession,
      updateChatSession,
      editSessionName,
      sendMessage,
      getAgent,
      formatTime,
    };
  },
};