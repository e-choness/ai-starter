// components/Agents.js
import { useGlobal } from '../composables/useGlobal.js';
import { useHistory } from '../composables/useHistory.js';

export default {
  name: 'Agents',
  template: `
    <div class="p-4">
      <!-- Add Agent Button -->
      <div class="mb-6">
        <button @click="openEditModal()" class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
          Add Agent
        </button>
      </div>

      <!-- Agents List -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="agent in entities.agents"
          :key="agent.id"
          class="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between"
        >
          <div>
            <input
              v-model="agent.data.name"
              type="text"
              class="w-full p-2 mb-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
              @input="validateEditName(agent)"
              @blur="updateAgent(agent)"
              :class="{ 'border-red-500': editErrors[agent.id] }"
            />
            <textarea
              v-model="agent.data.description"
              class="w-full p-2 mb-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
              rows="3"
              @blur="updateAgent(agent)"
            ></textarea>
            <input
              v-model="agent.data.imageUrl"
              type="text"
              class="w-full p-2 mb-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Image URL (optional)"
              @blur="updateAgent(agent)"
            />
          </div>
          <button
            @click="openEditModal(agent)"
            class="mt-2 py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg self-start"
          >
            Edit Prompts
          </button>
          <button
            @click="removeAgent(agent.id)"
            class="mt-2 py-1 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg self-end"
          >
            Delete
          </button>
        </div>
        <div v-if="!entities.agents.length" class="col-span-full text-center text-gray-600 dark:text-gray-400">
          No agents created yet.
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 class="text-lg font-semibold text-purple-400 mb-4">{{ editingAgent ? 'Edit Agent' : 'Add Agent' }}</h2>
          <div class="space-y-4">
            <input
              v-model="agentName"
              @input="validateName"
              type="text"
              class="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Agent name (letters, numbers, underscores only, no spaces)"
              :class="{ 'border-red-500': nameError }"
            />
            <span v-if="nameError" class="text-red-500 text-sm">{{ nameError }}</span>
            <textarea
              v-model="agentDescription"
              class="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none h-24"
              placeholder="Description..."
            ></textarea>
            <input
              v-model="agentImageUrl"
              type="text"
              class="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
              placeholder="Image URL for avatar... (optional)"
            />
            <div>
              <h3 class="text-gray-600 dark:text-gray-300 mb-2">System Prompts</h3>
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-gray-300 dark:bg-gray-900">
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Type</th>
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Content</th>
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prompt, index) in systemPrompts" :key="prompt.id" class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors">
                    <td class="py-2 px-4">
                      <select v-model="prompt.type" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-1 w-full">
                        <option value="text">Text</option>
                      </select>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="openPromptModal('system', index, prompt.content)" class="py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        Edit
                      </button>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="removePrompt('system', index)" class="text-red-400 hover:text-red-300">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button @click="addPrompt('system')" class="mt-2 py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Add System Prompt
              </button>
            </div>
            <div>
              <h3 class="text-gray-600 dark:text-gray-300 mb-2">User Prompts</h3>
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-gray-300 dark:bg-gray-900">
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Type</th>
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Content</th>
                    <th class="py-2 px-4 text-gray-900 dark:text-gray-200 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prompt, index) in userPrompts" :key="prompt.id" class="border-b border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors">
                    <td class="py-2 px-4">
                      <select v-model="prompt.type" class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-1 w-full">
                        <option value="text">Text</option>
                      </select>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="openPromptModal('user', index, prompt.content)" class="py-1 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                        Edit
                      </button>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="removePrompt('user', index)" class="text-red-400 hover:text-red-300">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button @click="addPrompt('user')" class="mt-2 py-1 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
                Add User Prompt
              </button>
            </div>
          </div>
          <div class="mt-4 flex gap-2 justify-end">
            <button @click="closeModal" class="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Cancel</button>
            <button @click="saveAgent" class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Save</button>
          </div>
        </div>
      </div>

      <!-- Prompt Editing Modal -->
      <div v-if="isPromptModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
          <h2 class="text-lg font-semibold text-purple-400 mb-4">Edit Prompt</h2>
          <textarea
            v-model="promptContent"
            class="w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:outline-none h-64"
            placeholder="Enter prompt text..."
          ></textarea>
          <div class="mt-4 flex gap-2 justify-end">
            <button @click="closePromptModal" class="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">Cancel</button>
            <button @click="savePrompt" class="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { entities } = useGlobal();
    const { addEntity, updateEntity, removeEntity } = useHistory();
    const agentName = Vue.ref('');
    const agentDescription = Vue.ref('');
    const agentImageUrl = Vue.ref('');
    const systemPrompts = Vue.ref([]);
    const userPrompts = Vue.ref([]);
    const nameError = Vue.ref('');
    const editErrors = Vue.ref({});
    const isModalOpen = Vue.ref(false);
    const isPromptModalOpen = Vue.ref(false);
    const editingAgent = Vue.ref(null);
    const agentId = Vue.ref('');
    const promptType = Vue.ref('');
    const promptIndex = Vue.ref(null);
    const promptContent = Vue.ref('');

    function validateName() {
      if (!/^[a-zA-Z0-9_]+$/.test(agentName.value)) {
        nameError.value = 'Name must contain only letters, numbers, or underscores, no spaces.';
      } else {
        nameError.value = '';
      }
    }

    function validateEditName(agent) {
      if (!/^[a-zA-Z0-9_]+$/.test(agent.data.name)) {
        editErrors.value[agent.id] = 'Invalid name';
      } else {
        delete editErrors.value[agent.id];
      }
    }

    function openEditModal(agent = null) {
      if (agent) {
        editingAgent.value = agent;
        agentId.value = agent.id;
        agentName.value = agent.data.name;
        agentDescription.value = agent.data.description;
        agentImageUrl.value = agent.data.imageUrl || '';
        systemPrompts.value = agent.data.systemPrompts ? [...agent.data.systemPrompts] : [];
        userPrompts.value = agent.data.userPrompts ? [...agent.data.userPrompts] : [];
      } else {
        editingAgent.value = null;
        agentId.value = uuidv4();
        agentName.value = '';
        agentDescription.value = '';
        agentImageUrl.value = '';
        systemPrompts.value = [];
        userPrompts.value = [];
      }
      isModalOpen.value = true;
      validateName();
    }

    function closeModal() {
      isModalOpen.value = false;
      editingAgent.value = null;
    }

    function addPrompt(type) {
      const prompts = type === 'system' ? systemPrompts : userPrompts;
      prompts.value.push({ id: uuidv4(), type: 'text', content: '' });
    }

    function removePrompt(type, index) {
      const prompts = type === 'system' ? systemPrompts : userPrompts;
      prompts.value.splice(index, 1);
    }

    function openPromptModal(type, index, content) {
      promptType.value = type;
      promptIndex.value = index;
      promptContent.value = content || '';
      isPromptModalOpen.value = true;
    }

    function closePromptModal() {
      isPromptModalOpen.value = false;
      promptType.value = '';
      promptIndex.value = null;
      promptContent.value = '';
    }

    function savePrompt() {
      if (promptType.value && promptIndex.value !== null) {
        const prompts = promptType.value === 'system' ? systemPrompts : userPrompts;
        prompts.value[promptIndex.value] = { ...prompts.value[promptIndex.value], content: promptContent.value };
      }
      closePromptModal();
    }

    function addAgent() {
      if (nameError.value || !agentName.value.trim()) return;
      addEntity('agents', {
        name: agentName.value,
        description: agentDescription.value,
        imageUrl: agentImageUrl.value,
        systemPrompts: systemPrompts.value,
        userPrompts: userPrompts.value,
      });
      closeModal();
    }

    function updateAgent(agent) {
      if (editErrors.value[agent.id]) return;
      updateEntity('agents', agent.id, {
        name: agent.data.name,
        description: agent.data.description,
        imageUrl: agent.data.imageUrl,
        systemPrompts: agent.data.systemPrompts,
        userPrompts: agent.data.userPrompts,
      });
    }

    function saveAgent() {
      if (nameError.value) return;
      if (editingAgent.value) {
        updateEntity('agents', agentId.value, {
          name: agentName.value,
          description: agentDescription.value,
          imageUrl: agentImageUrl.value,
          systemPrompts: systemPrompts.value,
          userPrompts: userPrompts.value,
        });
      } else {
        addAgent();
      }
      closeModal();
    }

    function removeAgent(id) {
      removeEntity('agents', id);
    }

    return {
      entities,
      agentName,
      agentDescription,
      agentImageUrl,
      systemPrompts,
      userPrompts,
      nameError,
      editErrors,
      isModalOpen,
      isPromptModalOpen,
      editingAgent,
      agentId,
      promptType,
      promptIndex,
      promptContent,
      validateName,
      validateEditName,
      openEditModal,
      closeModal,
      addPrompt,
      removePrompt,
      openPromptModal,
      closePromptModal,
      savePrompt,
      addAgent,
      updateAgent,
      saveAgent,
      removeAgent,
    };
  },
};