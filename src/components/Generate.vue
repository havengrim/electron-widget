<template>
  <div class="p-6 space-y-6 ml-20">
    <!-- Header -->
    <div class="flex flex-wrap justify-between items-center gap-4">
    <h2 class="text-2xl font-bold">Performance Ratings</h2>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end w-full">
      <!-- Search Type -->
      <MazSelect
        v-model="searchType"
        label="Search By"
        :options="searchOptions"
        class="w-full"
      />

      <!-- Search Input -->
      <MazInput
        v-model="searchTerm"
        :placeholder="`Search by ${searchType}`"
        @keyup.enter="performSearch"
        class="w-full"
      />

      <!-- Year Range -->
      <div class="flex items-end gap-2 w-full">
        <MazSelect
          v-model="startYear"
          label="From"
          :options="yearOptions"
          class="w-full"
        />
        <span class="text-lg">-</span>
        <MazSelect
          v-model="endYear"
          label="To"
          :options="yearOptions"
          class="w-full"
        />
      </div>

      <!-- Search Button -->
      <MazBtn
        @click="performSearch"
        color="primary"
        class="w-full h-[42px]"
      >
        Search
      </MazBtn>
    </div>
  </div>

    <!-- Main content -->
    <div v-if="!isLoading" class="flex gap-6">
      <!-- Results panel -->
      <div class="w-1/2 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Employees ({{ filteredPersons.length }})</h3>
          <button v-if="searchApplied" @click="clearSearch" class="text-red-500 text-sm">Clear</button>
        </div>

        <div v-if="filteredPersons.length === 0" class="text-center text-gray-500">
          No results found.
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(person, idx) in filteredPersons"
            :key="idx"
            @click="selectPerson(person.idNo)"
            class="border p-3 rounded cursor-pointer hover:bg-gray-50"
            :class="{ 'bg-blue-100': selectedPerson?.idNo === person.idNo }"
          >
            <div class="font-medium">{{ person.lastName }}, {{ person.firstName }}</div>
            <div class="text-sm text-gray-500">ID: {{ person.idNo }} | {{ person.division }}</div>
            <div class="text-sm mt-1" :class="getRatingClass(person.adjectivalAverage)">
              {{ person.adjectivalAverage }}
            </div>
          </div>
        </div>
      </div>

      <!-- Details panel -->
      <div v-if="selectedPerson" class="w-1/2 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Performance Report</h3>
          <MazBtn @click="generateReport" color="black" size="sm" class="bg-green-500 text-white px-3 py-1 rounded text-sm">
           <File class="h-4 w-4"/> Generate Report
          </MazBtn>
        </div>

        <div class="border rounded p-4 space-y-2">
          <div class="font-bold text-lg">
            {{ selectedPerson.lastName }}, {{ selectedPerson.firstName }} {{ selectedPerson.middleName }}
          </div>
          <div class="text-sm">
            <div><strong>ID:</strong> {{ selectedPerson.idNo }}</div>
            <div><strong>Division:</strong> {{ selectedPerson.division }}</div>
            <div><strong>Status:</strong> {{ selectedPerson.statusOfEmployment }}</div>
            <div><strong>Years:</strong> {{ personYears.join(', ') }}</div>
          </div>

          <div class="flex gap-4 mt-4">
            <div class="flex flex-col items-center">
              <div class="text-gray-600 text-sm">Average Rating</div>
              <div class="text-xl font-bold">{{ averageRating }}</div>
            </div>
            <div class="flex flex-col items-center">
              <div class="text-gray-600 text-sm">Latest Rating</div>
              <div class="text-lg font-bold" :class="getRatingClass(latestRating)">
                {{ latestRating }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div>
          <div class="flex gap-2 border-b">
            <button
              class="px-4 py-2"
              :class="{ 'border-b-2 border-blue-500 font-bold': activeTab === 'table' }"
              @click="activeTab = 'table'"
            >Table View</button>
            <button
              class="px-4 py-2"
              :class="{ 'border-b-2 border-blue-500 font-bold': activeTab === 'distribution' }"
              @click="activeTab = 'distribution'"
            >Distribution</button>
          </div>

          <!-- Table View -->
          <div v-if="activeTab === 'table'" class="mt-4">
            <table class="min-w-full table-auto border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="p-2 border">Year</th>
                  <th class="p-2 border">First Sem</th>
                  <th class="p-2 border">Second Sem</th>
                  <th class="p-2 border">Average</th>
                  <th class="p-2 border">Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in personData" :key="index" class="hover:bg-gray-50">
                  <td class="p-2 border">{{ entry.year }}</td>
                  <td class="p-2 border">{{ entry.firstSem }}</td>
                  <td class="p-2 border">{{ entry.secondSem }}</td>
                  <td class="p-2 border">{{ entry.average }}</td>
                  <td class="p-2 border">
                    <span :class="['px-2 py-1 rounded text-white', getRatingClass(entry.adjectivalAverage)]">
                      {{ entry.adjectivalAverage }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Distribution View -->
          <div v-if="activeTab === 'distribution'" class="space-y-4 mt-4">
            <div v-for="(dist, index) in ratingDistribution" :key="index">
              <div class="flex justify-between items-center mb-1">
                <span>{{ dist.rating }}</span>
                <span>{{ dist.count }} ({{ Math.round(dist.percentage) }}%)</span>
              </div>
              <div class="w-full bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  :class="['h-2', getRatingClass(dist.rating)]"
                  :style="{ width: `${dist.percentage}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="w-1/2 flex items-center justify-center text-gray-400">
        Select an employee to view details
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-10">
      Loading performance data...
    </div>
  </div>
</template>

<script setup lang="ts">
import { MazInput } from 'maz-ui/components'
import { ref, computed, watch } from 'vue'
import { File } from 'lucide-vue-next'
// Mock data (replace with API logic)
const persons = ref([
  {
    idNo: '001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    middleName: 'M.',
    division: 'Finance',
    statusOfEmployment: 'Permanent',
    adjectivalAverage: 'Outstanding',
    data: [
      { year: 2022, firstSem: 4.5, secondSem: 4.6, average: 4.55, adjectivalAverage: 'Outstanding' }
    ]
  },
  // ... more mock entries
])

const isLoading = ref(false)
const searchType = ref('name')
const searchTerm = ref('')
const searchApplied = ref(false)
const startYear = ref('all')
const endYear = ref('all')
const selectedPerson = ref<any>(null)
const activeTab = ref('table')

const years = Array.from({ length: 10 }, (_, i) => 2025 - i)

const performSearch = () => {
  searchApplied.value = true
}

const clearSearch = () => {
  searchTerm.value = ''
  searchApplied.value = false
}

const filteredPersons = computed(() => {
  let results = persons.value

  if (searchTerm.value && searchApplied.value) {
    const term = searchTerm.value.toLowerCase()
    results = results.filter((person) => {
      if (searchType.value === 'name') {
        return (
          person.firstName.toLowerCase().includes(term) ||
          person.lastName.toLowerCase().includes(term)
        )
      } else if (searchType.value === 'id') {
        return person.idNo.toLowerCase().includes(term)
      } else if (searchType.value === 'division') {
        return person.division.toLowerCase().includes(term)
      }
      return true
    })
  }

  return results
})

const selectPerson = (idNo: string) => {
  selectedPerson.value = persons.value.find((p) => p.idNo === idNo)
}

const personData = computed(() => selectedPerson.value?.data || [])

const personYears = computed(() => personData.value.map((e) => e.year))
const averageRating = computed(() =>
  (personData.value.reduce((sum, e) => sum + e.average, 0) / personData.value.length).toFixed(2)
)
const latestRating = computed(() => personData.value[personData.value.length - 1]?.adjectivalAverage || '')

const ratingDistribution = computed(() => {
  const counts: Record<string, number> = {}
  personData.value.forEach((entry) => {
    counts[entry.adjectivalAverage] = (counts[entry.adjectivalAverage] || 0) + 1
  })

  const total = personData.value.length
  return Object.entries(counts).map(([rating, count]) => ({
    rating,
    count,
    percentage: (count / total) * 100
  }))
})

const getRatingClass = (rating: string) => {
  switch (rating) {
    case 'Outstanding':
      return 'bg-green-500'
    case 'Very Satisfactory':
      return 'bg-blue-500'
    case 'Satisfactory':
      return 'bg-yellow-500'
    case 'Unsatisfactory':
      return 'bg-orange-500'
    case 'Poor':
      return 'bg-red-500'
    default:
      return 'bg-gray-400'
  }
}

const generateReport = () => {
  alert(`Generating report for ${selectedPerson.value?.firstName}`)
}





const yearOptions = [
  { label: 'From', value: 'all' },
  ...years.map(year => ({ label: year.toString(), value: year }))
]

const searchOptions = [
  { label: 'Name', value: 'name' },
  { label: 'ID', value: 'id' },
  { label: 'Division', value: 'division' }
]
</script>
