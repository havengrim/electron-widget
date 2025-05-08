<template>
  <div class="flex min-h-screen">
    <Sidebar />

    <div class="flex-1 p-6 ml-20">
      <div v-if="isLoading" class="flex items-center justify-center min-h-full">
        <Spinner />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Filled Card -->
        <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 hover:maz-shadow-xl transition-shadow duration-300">
          <div class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer">
            <Users class="w-6 h-6 text-green-600" />
          </div>
          <div class="flex flex-col space-y-2">
            <p class="maz-text-sm maz-text-gray-500">Total Filled</p>
            <h2 class="maz-text-3xl font-semibold maz-text-black">
              {{ filled !== null ? filled.toLocaleString() : 'Loading...' }}
            </h2>
            <p class="maz-text-xs maz-text-green-500">+12.4% from last month</p>
          </div>
        </MazCard>

        <!-- Unfilled Card -->
        <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 hover:maz-shadow-xl transition-shadow duration-300">
          <div class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer">
            <UserX class="w-6 h-6 text-yellow-500" />
          </div>
          <div class="flex flex-col space-y-2">
            <p class="maz-text-sm maz-text-gray-500">Total Unfilled</p>
            <h2 class="maz-text-3xl font-semibold maz-text-black">
              {{ unfilled !== null ? unfilled.toLocaleString() : 'Loading...' }}
            </h2>
            <p class="maz-text-xs maz-text-yellow-500">-3.1% from last month</p>
          </div>
        </MazCard>

        <!-- Total Card -->
        <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 hover:maz-shadow-xl transition-shadow duration-300">
          <div class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer">
            <BarChart2 class="w-6 h-6 text-blue-600" />
          </div>
          <div class="flex flex-col space-y-2">
            <p class="maz-text-sm maz-text-gray-500">Overall Total</p>
            <h2 class="maz-text-3xl font-semibold maz-text-black">
              {{ total !== null ? total.toLocaleString() : 'Loading...' }}
            </h2>
            <p class="maz-text-xs maz-text-blue-500">+9.8% overall growth</p>
          </div>
        </MazCard>

        <!-- Employment Type Select Card -->
        <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 hover:maz-shadow-xl transition-shadow duration-300">
          <div class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChartPie class="w-6 h-6 text-yellow-600" />
          </div>
          <div class="flex flex-col space-y-2">
            <!-- MazSelect Component -->
            <MazSelect
              v-model="selectedValue"
              label="Select Employment Type"
              :options="employmentTypes"
              class=""
            />
            <p class="maz-text-black font-semibold ">Total for {{ selectedValue }}: {{ employmentTypeTotal[selectedValue] !== undefined ? employmentTypeTotal[selectedValue] : 'Loading...' }}</p>
          </div>
        </MazCard>
      </div>

      <div v-if="error" class="text-red-500 text-center mt-4">
        <p>Error loading data. Please try again later.</p>
      </div>

      <SumarryTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Spinner from './components/Spinner.vue';
import SumarryTable from './components/SummaryTable.vue';
import { Users, UserX, BarChart2, ChartPie } from 'lucide-vue-next';
const selectedValue = ref('Permanent');
// Data variables
const filled = ref<number | null>(null);
const unfilled = ref<number | null>(null);
const total = ref<number | null>(null);
const employmentTypeTotal = ref<Record<string, number>>({});
const employmentTypes = ['Permanent', 'Contractual', 'COS', 'Coterminous', 'Casual']; // Employment types
const isLoading = ref(true);
const error = ref<string | null>(null);

// Fetch data on mounted
onMounted(async () => {
  try {
    const result = await window.api.fetchRevenue();
    console.log('Fetched result:', result);
    if ('filled' in result && 'unfilled' in result && 'total' in result) {
      filled.value = result.filled;
      unfilled.value = result.unfilled;
      total.value = result.total;

      employmentTypeTotal.value = {
        Permanent: result.permanent,
        Contractual: result.contractual,
        COS: result.cos,
        Coterminous: result.coterminous,
        Casual: result.casual,
      };
    } else {
      throw new Error('Unexpected format');
    }
  } catch (err) {
    console.error('Failed to load data:', err);
    error.value = 'Failed to load data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
});
</script>
