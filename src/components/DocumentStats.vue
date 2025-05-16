<template>
  <div class="grid gap-4 md:grid-cols-3">
    <MazCard
      v-for="(stat, index) in stats"
      :key="index"
      class="p-4 border !shadow-none"
    >
      <div class="flex items-center justify-between pb-2">
        <h3 class="text-sm font-medium">{{ stat.title }}</h3>
        <component :is="stat.icon" :class="['h-5 w-5', stat.color]" />
      </div>
      <div class="text-2xl font-bold">{{ stat.count }}</div>
      <p class="text-xs text-gray-500">{{ stat.description }}</p>
    </MazCard>
  </div>

    <MazTable
    size="sm"
    v-model="selectedIds"
    v-model:search-query="searchQuery"
    v-model:page="page"
    v-model:page-size="pageSize"
    search
    pagination
    color="secondary"
    sortable
    selectable
    hoverable
    background-even
    selected-key="id"
    :headers="headers"
    :rows="documentsWithIndex"
  >
    <template #cell-index="{ value }">
      <span class="maz-text-base">{{ value }}</span>
    </template>

    <template #cell-status="{ value }">
      <MazBadge
        :color="value === 'completed' ? 'success' : value === 'pending' ? 'warning' : value === 'in-progress' ? 'info' : 'gray'"
      >
        {{ value }}
      </MazBadge>
    </template>

    <template #cell-documents="{ row }">
      <div class="flex gap-1">
        <MazBadge v-if="row.moaContract" color="primary" outline>MOA</MazBadge>
        <MazBadge v-if="row.pds" color="primary" outline>PDS</MazBadge>
        <MazBadge v-if="row.drugTest" color="primary" outline>Drug Test</MazBadge>
      </div>
    </template>

    <template #actions="{ row }">
      <div>
          <Ellipsis class="text-gray-500"/>
      </div>
    </template>
  </MazTable>

</template>

<script setup lang="ts">
import { Clock, FileText, CheckCircle } from 'lucide-vue-next'

const { pending, inProgress, completed } = defineProps<{
  pending: number
  completed: number
  inProgress: number
}>()

const stats = [
  {
    title: 'Pending Documents',
    count: pending,
    icon: Clock,
    color: 'text-yellow-500',
    description: 'Documents awaiting processing',
  },
  {
    title: 'In Progress',
    count: inProgress,
    icon: FileText,
    color: 'text-blue-500',
    description: 'Documents currently being processed',
  },
  {
    title: 'Completed',
    count: completed,
    icon: CheckCircle,
    color: 'text-green-500',
    description: 'Documents fully processed',
  },
]

import { ref, computed } from 'vue'
import MazTable from 'maz-ui/components/MazTable'
import MazBadge from 'maz-ui/components/MazBadge'
import MazBtn from 'maz-ui/components/MazBtn'
import { Ellipsis } from 'lucide-vue-next';
import type { DocumentData } from '../lib/types'

const selectedIds = ref<string[]>([])
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(5)

const headers = [
  { label: '#', key: 'index', align: 'center' as const, width: '2rem', sortable: false },
  { label: 'Name', key: 'name' },
  { label: 'Position', key: 'position' },
  { label: 'Office', key: 'office' },
  { label: 'Date Received', key: 'dateReceived' },
  { label: 'Engagement Period', key: 'engagementPeriod' },
  { label: 'Status', key: 'status', align: 'center' as const },
  { label: 'Documents', key: 'documents', align: 'center' as const },
]


const documents = ref<DocumentData[]>([
  {
    id: '1',
    drn: 'DRN001',
    name: 'John Doe',
    position: 'Analyst',
    office: 'DSWD Central',
    dateReceived: '2025-05-01',
    startDate: '2025-05-05',
    endDate: '2025-06-05',
    status: 'pending',
    moaContract: true,
    pds: false,
    drugTest: true,
  },
  {
    id: '2',
    drn: 'DRN002',
    name: 'Jane Smith',
    position: 'HR Officer',
    office: 'DSWD NCR',
    dateReceived: '2025-04-20',
    startDate: '2025-05-01',
    endDate: '2025-06-01',
    status: 'in-progress',
    moaContract: true,
    pds: true,
    drugTest: true,
  },
  {
    id: '3',
    drn: 'DRN003',
    name: 'Carlos Santos',
    position: 'IT Specialist',
    office: 'DSWD Region IV-A',
    dateReceived: '2025-03-10',
    startDate: '2025-04-01',
    endDate: '2025-07-01',
    status: 'completed',
    moaContract: true,
    pds: true,
    drugTest: false,
  },
])

const documentsWithIndex = computed(() =>
  documents.value.map((doc, i) => ({
    ...doc,
    index: i + 1,
    engagementPeriod: `${doc.startDate} - ${doc.endDate}`,
  }))
)
</script>
