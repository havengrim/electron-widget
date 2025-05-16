<template>
  <div class="flex min-h-screen">
    <div v-if="loading" class="w-full flex items-center justify-center min-h-screen bg-white">
      <Spinner />
    </div>

    <template v-else>
      <Sidebar />
      <div class="flex-1 p-6">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Spinner from './components/Spinner.vue';

const loading = ref(true);

onMounted(() => {

  setTimeout(() => {
    loading.value = false;
  }, 4000);
});
</script>
