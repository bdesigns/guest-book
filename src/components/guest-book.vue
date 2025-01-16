<template>
    <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Guestbook</h1>
      <form @submit.prevent="addEntry" class="mb-4">
        <input v-model="name" type="text" placeholder="Your Name" class="border p-2 w-full mb-2" required />
        <textarea v-model="message" placeholder="Your Message" class="border p-2 w-full mb-2" required></textarea>
        <button type="submit" class="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
      
      <ul class="mt-4">
        <li v-for="entry in entries" :key="entry.id" class="border-b py-2 flex justify-between items-start">
          <span><strong>{{ entry.name }}</strong>: {{ entry.message }}</span>
          <button @click="deleteEntry(entry.id)" class="text-red-500 ml-4 text-right">Delete</button>
        </li>
      </ul>
    </div>
  </template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const name = ref('');
    const message = ref('');
    const entries = ref([]);

    const fetchEntries = async () => {
      const response = await fetch('/api/entries');
      entries.value = await response.json();
    };

    const addEntry = async () => {
      const newEntry = { id: Date.now().toString(), name: name.value, message: message.value };
      await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      entries.value.push(newEntry);
      name.value = '';
      message.value = '';
    };

    const deleteEntry = async (id) => {
      await fetch(`/api/entries/${id}`, { method: 'DELETE' });
      entries.value = entries.value.filter(entry => entry.id !== id);
    };

    onMounted(fetchEntries);

    return { name, message, entries, addEntry, deleteEntry };
  },
};
</script>

<style scoped>
/* Add any additional styles here */
</style>