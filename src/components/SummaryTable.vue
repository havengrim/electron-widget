<template>
                <div class="flex justify-between">
                  <span class="font-semibold text-xl">Employee Table</span>
              
                  <!-- Download Button with Loading Spinner -->
                  <MazBtn
                :loading="loading"
                class="bg-blue-500 text-white py-2 px-4 rounded mb-4"
                @click="downloadReport"
                >
                Download Report
                <Download class="h-5 w-6"/>
                </MazBtn>
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
                  :headers="tableHeaders"
                  :rows="filteredEmployees"
                >
                  <template #cell-ID Number="{ value }">
                    <span>{{ value }}</span>
                  </template>
                  <template #cell-Complete Name="{ value }">
                    <span>{{ value }}</span>
                  </template>
                  <template #cell-Division="{ value }">
                    <span>{{ value }}</span>
                  </template>
                  <template #cell-Section="{ value }">
                    <span>{{ value }}</span>
                  </template>
                  <template #cell-Employment Status="{ value }">
                    <span class="text-black">{{ value }}</span>
                  </template>
                </MazTable>
              </template>
              
              <script lang="ts" setup>
              import { ref, onMounted, computed } from 'vue'
              import MazTable from 'maz-ui/components/MazTable'
              import { useToast } from 'maz-ui' // Import useToast
              import { Download } from 'lucide-vue-next';
              const toast = useToast() // Initialize toast
              
              const selectedIds = ref([])
              const searchQuery = ref('')
              const page = ref(1)
              const pageSize = ref(10)
              const employees = ref([])
              const loading = ref(false)
              
              const tableHeaders = [
                { label: 'ID', key: 'ID Number', align: 'center', width: '2rem', sortable: false },
                { label: 'Complete Name', key: 'Complete Name' },
                { label: 'Division', key: 'Division' },
                { label: 'Section', key: 'Section' },
                { label: 'Employment Status', key: 'Employment Status' }
              ]
              
              const filteredEmployees = computed(() => {
                if (!searchQuery.value) return employees.value

                return employees.value.filter(employee =>
                  tableHeaders.some(header => {
                    const value = employee[header.key]
                    if (!value) return false

                    // Special handling for ID Number (preserve exact match like "03-1358")
                    if (header.key === 'ID Number') {
                        return `="${value}"`
                      }

                    // General case
                    return String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
                  })
                )
              })


              
              const fetchEmployees = async () => {
                try {
                  if (window.api) {
                    const data = await window.api.fetchEmployees()
                    employees.value = data.map(employee => ({
                      'ID Number': employee['ID Number'],
                      'Complete Name': employee['Complete Name'],
                      'Division': employee['Division'],
                      'Section': employee['Section'],
                      'Employment Status': employee['Employment Status'],
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

                  // Add 'Item Code' and 'Fund Source' to the headers for the CSV export
                  const headers = [
                    ...tableHeaders.map(h => h.label),
                    'Item Code', // Add Item Code header
                    'Fund Source' // Add Fund Source header
                  ]

                  // Map the rows and include 'Item Code' and 'Fund Source' for export
                  const rows = filteredEmployees.value.map(employee => {
                    return [
                      ...tableHeaders.map(header => {
                        const value = employee[header.key] || ''

                        // Special handling for 'ID Number' to preserve formatting in Excel
                        if (header.key === 'ID Number') {
                          return `'${value}` // Prefix ID number with a single quote to avoid auto-formatting
                        }

                        if (header.key === 'Complete Name') {
                          const fullName = employee['Complete Name']
                          return fullName ? `"${fullName}"` : '' // Wrap in quotes to ensure it's treated as one field
                        }

                        // General case
                        return value
                      }),
                      employee['Item Code'] || '', // Include Item Code
                      employee['Fund Source'] || '' // Include Fund Source
                    ]
                  })

                  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

                  // Save the file
                  if (window.api?.saveFile) {
                    const filePath = await window.api.saveFile(csvContent, 'employee_report.csv')

                    if (filePath) {
                      toast.success('Report saved successfully', {
                        position: 'bottom-right',
                      })
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
              