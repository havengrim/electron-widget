<template>
  <div class="flex min-h-screen">
    <div class="flex-1 p-6">
      <div class="ml-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Filled Card -->
          <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 duration-300 !shadow-none">
            <div class="absolute top-6 right-6 text-gray-400">
              <Users class="w-6 h-6 text-green-600" />
            </div>
            <div class="flex flex-col space-y-2">
              <p class="maz-text-sm maz-text-gray-500">Total Filled</p>
              <h2 class="maz-text-3xl font-semibold maz-text-black">
                <span v-if="!loading">{{ filled.toLocaleString() }}</span>
                <div v-else class="h-8 w-24 bg-gray-300 rounded"></div>
              </h2>
              <p class="maz-text-xs maz-text-green-500">
                <span v-if="!loading">+12.4% from last month</span>
                <div v-else class="h-4 w-20 bg-gray-200 rounded"></div>
              </p>
            </div>
          </MazCard>

          <!-- Unfilled Card -->
          <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 duration-300 !shadow-none">
            <div class="absolute top-6 right-6 text-gray-400">
              <UserX class="w-6 h-6 text-yellow-500" />
            </div>
            <div class="flex flex-col space-y-2">
              <p class="maz-text-sm maz-text-gray-500">Total Unfilled</p>
              <h2 class="maz-text-3xl font-semibold maz-text-black">
                <span v-if="!loading">{{ unfilled.toLocaleString() }}</span>
                <div v-else class="h-8 w-24 bg-gray-300 rounded"></div>
              </h2>
              <p class="maz-text-xs maz-text-yellow-500">
                <span v-if="!loading">-3.1% from last month</span>
                <div v-else class="h-4 w-20 bg-gray-200 rounded"></div>
              </p>
            </div>
          </MazCard>

          <!-- Total Card -->
          <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 duration-300 !shadow-none">
            <div class="absolute top-6 right-6 text-gray-400">
              <BarChart2 class="w-6 h-6 text-blue-600" />
            </div>
            <div class="flex flex-col space-y-2">
              <p class="maz-text-sm maz-text-gray-500">Overall Total</p>
              <h2 class="maz-text-3xl font-semibold maz-text-black">
                <span v-if="!loading">{{ total.toLocaleString() }}</span>
                <div v-else class="h-8 w-24 bg-gray-300 rounded"></div>
              </h2>
              <p class="maz-text-xs maz-text-blue-500">
                <span v-if="!loading">+9.8% overall growth</span>
                <div v-else class="h-4 w-20 bg-gray-200 rounded"></div>
              </p>
            </div>
          </MazCard>

          <!-- Employment Type Select Card -->
          <MazCard class="relative maz-rounded-2xl maz-border maz-border-gray-200 maz-p-6 duration-300 !shadow-none">

            <div class="flex flex-col space-y-2">
              <div v-if="!loading">
                <MazSelect
                  v-model="selectedValue"
                  label="Select Employment Type"
                  :options="employmentTypes"
                />
              </div>
              <div v-else class="h-10 bg-gray-200 rounded w-full mb-2"></div>

              <p class="maz-text-black font-semibold">
                <span v-if="!loading">
                  Total for {{ selectedValue }}: {{ employmentTypeTotal[selectedValue] }}
                </span>
                <div v-else class="h-6 w-32 bg-gray-300 rounded"></div>
              </p>
            </div>
          </MazCard>
        </div>

        <!-- Table Placeholder -->
        <div v-if="loading" class="space-y-4 mt-20">
          <div class="h-6 w-40 bg-gray-300 rounded"></div>
          <div class="bg-white shadow-md rounded-lg overflow-hidden">
            <div class="grid grid-cols-5 gap-4 p-4">
              <div class="h-4 bg-gray-200 rounded col-span-1"></div>
              <div class="h-4 bg-gray-200 rounded col-span-1"></div>
              <div class="h-4 bg-gray-200 rounded col-span-1"></div>
              <div class="h-4 bg-gray-200 rounded col-span-1"></div>
              <div class="h-4 bg-gray-200 rounded col-span-1"></div>
            </div>
            <div class="divide-y">
              <div v-for="i in 6" :key="i" class="grid grid-cols-5 gap-4 p-4">
                <div class="h-4 bg-gray-100 rounded col-span-1"></div>
                <div class="h-4 bg-gray-100 rounded col-span-1"></div>
                <div class="h-4 bg-gray-100 rounded col-span-1"></div>
                <div class="h-4 bg-gray-100 rounded col-span-1"></div>
                <div class="h-4 bg-gray-100 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actual Table -->
        <SumarryTable v-else />
        <div v-if="error" class="text-red-500 text-center mt-4">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Users, UserX, BarChart2, ChartPie } from 'lucide-vue-next';
import SumarryTable from './SummaryTable.vue';

const filled = ref<number>(0);
const unfilled = ref<number>(0);
const total = ref<number>(0);
const employmentTypeTotal = ref<Record<string, number>>({});
const employmentTypes = ['Permanent', 'Contractual', 'COS', 'Coterminous', 'Casual'];
const selectedValue = ref('Permanent');
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const result = await window.api.fetchRevenue();

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
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load data.';
  } finally {
    loading.value = false;
  }
});
</script>
