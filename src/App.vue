<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 p-6">
      <!-- Show the Spinner while data is loading -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-full">
        <Spinner />
      </div>

      <!-- Show content when loading is complete -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MazCard
          class="maz-rounded-2xl maz-border maz-border-gray-200  maz-p-6 hover:maz-shadow-xl transition-shadow duration-300" 
        >
          <div class="flex flex-col space-y-2">
            <div class="flex items-start justify-between">
              <p class="maz-text-sm maz-text-gray-500 ">Total Filled</p>
            </div>
            <h2 class="maz-text-3xl maz-font-bold maz-text-black ">
              {{ revenue !== null ? `${revenue.toLocaleString()}` : 'Loading...' }}
            </h2>
            <p class="maz-text-xs maz-text-green-500">+20.1% from last month</p>
          </div>
        </MazCard>

        <!-- You can add more MazCards here to make the layout dynamic -->
      </div>

      <!-- Show error message if data fetching fails -->
      <div v-if="error" class="text-red-500 text-center">
        <p>Error loading data. Please try again later.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Spinner from './components/Spinner.vue';  // Import the Spinner component

const revenue = ref<number | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null); // Added an error state to track errors

onMounted(async () => {
  try {
    const result = await window.api.fetchRevenue();
    if ('data' in result) {
      revenue.value = result.data;
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (err) {
    console.error('Failed to load revenue:', err);
    error.value = 'Failed to load revenue. Please try again later.';
  } finally {
    isLoading.value = false;  // Hide the spinner once data is loaded
  }
});
</script>
