<template>
  <div class="flex justify-end mb-4">

    <MazBtn
      :loading="loading"
      class="bg-blue-500 text-white py-2 px-4 rounded text-xs"
      @click="downloadReport"
      size="sm"
      color="black"
    >
      Export Data
      <CloudDownload class="h-5 w-6" />
    </MazBtn>
  </div>

    <MazTabs>
    <MazTabsBar :items="tabs" />

    <MazTabsContent>
      <MazTabsContentItem :tab="1" class="maz-py-4">
        <MazTable
          size="sm"
          v-model="selectedIds"
          v-model:search-query="searchQuery"
          v-model:page="page"
          v-model:page-size="pageSize"
          search
          pagination
          sortable
          selectable
          hoverable
          selected-key="id"
          :headers="tableHeaders"
          :rows="filteredEmployees"
          class="mt-5"
        >
          <template #cell-IDNumber="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-completeName="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-division="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-section="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-employmentStatus="{ value }">
            <MazBadge color="primary" outline>{{ value }}</MazBadge>
          </template>
        </MazTable>
      </MazTabsContentItem>
      <MazTabsContentItem :tab="2" class="maz-py-4">
         <MazTable
          size="sm"
          v-model="selectedIds"
          v-model:search-query="searchQuery"
          v-model:page="page"
          v-model:page-size="pageSize"
          search
          pagination
          sortable
          selectable
          hoverable
          selected-key="id"
          :headers="tableHeaders"
          :rows="filteredEmployees"
          class="mt-5"
        >
          <template #cell-IDNumber="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-completeName="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-division="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-section="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-employmentStatus="{ value }">
            <MazBadge color="primary" outline>{{ value }}</MazBadge>
          </template>
        </MazTable>
      </MazTabsContentItem>
    </MazTabsContent>
  </MazTabs>
  
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import MazTable from 'maz-ui/components/MazTable'
import MazBtn from 'maz-ui/components/MazBtn'
import MazBadge from 'maz-ui/components/MazBadge'
import { useToast } from 'maz-ui'
import { CloudDownload } from 'lucide-vue-next'
 const tabs: MazTabsBarItem[] = [
    { label: 'Filled', disabled: false },
    { label: 'Unfilled', disabled: false},
  ]
const toast = useToast()

const selectedIds = ref([])
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(10)
const employees = ref([])
const loading = ref(false)

const tableHeaders = [
  { label: 'ID', key: 'IDNumber', align: 'center', width: '2rem', sortable: false },
  { label: 'Complete Name', key: 'completeName' },
  // { label: 'Division', key: 'division' },
  { label: 'Section', key: 'section' },
  { label: 'Employment Status', key: 'employmentStatus' }
]

const filteredEmployees = computed(() => {
  if (!searchQuery.value) return employees.value

  return employees.value.filter(employee =>
    tableHeaders.some(header => {
      const value = employee[header.key]
      if (!value) return false
      return String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  )
})

const fetchEmployees = async () => {
  try {
    if (window.api) {
      const data = await window.api.fetchEmployees()
      employees.value = data.map(employee => ({
        IDNumber: employee['ID Number'],
        completeName: employee['Complete Name'],
        division: employee['Division'],
        section: employee['Section'],
        employmentStatus: employee['Employment Status'],
        'Item Code': employee['Item Code'],
        'Fund Source': employee['Fund Source']
      }))
    } else {
      toast.error('Electron API is not available.')
    }
  } catch (error) {
    toast.error('Error fetching employees.')
    console.error(error)
  }
}

onMounted(() => {
  if (window.api) fetchEmployees()
  else toast.error('Electron API is not available.')
})

const downloadReport = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate delay

    const headers = [
      ...tableHeaders.map(h => h.label),
      'Item Code',
      'Fund Source'
    ]

    const rows = filteredEmployees.value.map(employee => {
      return [
        ...tableHeaders.map(header => {
          const value = employee[header.key] || ''

          if (header.key === 'IDNumber') {
            return `'${value}`
          }

          if (header.key === 'completeName') {
            return `"${value}"`
          }

          return value
        }),
        employee['Item Code'] || '',
        employee['Fund Source'] || ''
      ]
    })

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

    if (window.api?.saveFile) {
      const filePath = await window.api.saveFile(csvContent, 'employee_report.csv')
      if (filePath) {
        toast.info('Report saved successfully', { position: 'bottom-right' })
      } else {
        toast.danger('Save operation was cancelled.', { position: 'bottom-right' })
      }
    } else {
      toast.error('Save function is not available.', { position: 'bottom-right' })
    }
  } catch (error) {
    toast.error('Failed to save report', { position: 'bottom-right', timeout: 2000 })
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>
