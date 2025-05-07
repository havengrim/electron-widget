<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MazCard
          class="maz-rounded-2xl maz-shadow-lg maz-border maz-border-gray-200 maz-bg-white maz-p-6 hover:maz-shadow-xl transition-shadow duration-300"
        >
          <div class="flex flex-col space-y-2">
            <div class="flex items-start justify-between">
              <p class="maz-text-sm maz-text-gray-500">Total Revenue</p>
            </div>
            <h2 class="maz-text-3xl maz-font-bold maz-text-black">
              {{ revenue !== null ? `$${revenue.toLocaleString()}` : 'Loading...' }}
            </h2>
            <p class="maz-text-xs maz-text-green-500">+20.1% from last month</p>
          </div>
        </MazCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Sidebar from './components/Sidebar.vue';

const revenue = ref<number | null>(null);

onMounted(async () => {
  const result = await window.api.fetchRevenue();
  if ('data' in result) {
    revenue.value = result.data;
  } else {
    console.error('Failed to load revenue:', result.error);
  }
});
</script>
