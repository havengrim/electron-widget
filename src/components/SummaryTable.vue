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
    <MazTabsBar :items="tabs" class="!shadow-none border" />
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
          :loading="isLoading"
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
            <MazBadge :color="getStatusColor(value)">{{ value }}</MazBadge>
          </template>
             <template #cell-entryDate="{ value }">
             <span class="">{{ formatDate(value) }}</span>
          </template>
           <template #cell-SG="{ value }">
            <span>{{ value }}</span>
          </template>
            <template #cell-salary="{ value }">
            <span class="">{{ formatToPeso(value) }}</span>
          </template>

          <template #cell-actions="{ row }">
            <MazBtn size="xs" color="info" @click="openDetailsDialogEmployee(row)">
              <Eye class="h-4 w-4" />
            </MazBtn>
          </template>
        </MazTable>

      <MazDialog v-model="showDetailsDialogEmployee"   class="w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[60vw] h-[80vh]">
        <template #header>
          <div class="flex items-start justify-between px-5 py-2">
            <div>
              <div class="text-lg font-semibold">Employee Details</div>
              <p class="text-sm text-gray-500 mt-1">Complete information about the employee</p>
            </div>
            <MazBtn
              size="xs"
              color="transparent"
              @click="showDetailsDialogEmployee = false"
              class="text-gray-500 hover:text-gray-800"
            >
              <span class="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </MazBtn>
          </div>
          <div class="p-4">
              <MazTabs>
            <MazTabsBar :items="employeeTabs" class="!shadow-none border" />
            <MazTabsContent>
  
              <MazTabsContentItem :tab="1" class="maz-py-4">
                <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Employee ID</h3>
                      <p>{{ selectedEmployee['IDNumber'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Complete Name</h3>
                      <p>{{ selectedEmployee['completeName'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Employement Status</h3>
                      <p>{{ selectedEmployee['employmentStatus'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Division</h3>
                      <p>{{ selectedEmployee['division'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date Created</h3>
                      <p>{{ selectedEmployee['DATE OF CREATION OF POSITION\n \n (DD-MMM-YYYY)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Position Title</h3>
                      <p>{{ selectedEmployee['POSITION TITLE'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Position Level</h3>
                      <p>{{ selectedEmployee['POSITION LEVEL'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Salary Grade</h3>
                      <p>{{ selectedEmployee['SG'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Step Increment</h3>
                      <p>{{ selectedEmployee['STEP INCREMENT'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Monthly Salary</h3>
                      <p>{{ selectedEmployee['MONTHLY SALARY'] ? formatToPeso(selectedEmployee['MONTHLY SALARY']) : 'N/A' }}</p>
                    </div>
                  </div>
                </div>

              </MazTabsContentItem>
                 <MazTabsContentItem :tab="2" class="maz-py-4">
                  <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Designation</h3>
                      <p>{{ selectedEmployee['DESIGNATION \n (AS APPROPRIATE)\n \n BASED ON SO/RSO'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date of Designation</h3>
                      <p>{{ selectedEmployee['DATE OF DESIGNATION\n  \n  (DD-MMM-YYYY)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Special Order No.</h3>
                      <p>{{ selectedEmployee['SPECIAL ORDER NO.'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Office Assignment</h3>
                      <p>{{ selectedEmployee['OFFICE/BUREAU/SERVICE/ PROGRAM (Plantilla Assignment based on PSIPOP)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Fund Source</h3>
                      <p>{{ selectedEmployee['Fund Source'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Classification</h3>
                      <p>{{ selectedEmployee['CLASSIFICATION OF EMPLOYMENT (PERMANENT, COTERMINOUS, CASUAL, CONTRACTUAL, CONTRACT OF SERVICE, JOB ORDER)'] || 'N/A' }}</p>
                    </div>
                      <div>
                      <h3 class="font-medium text-muted-foreground">Status</h3>
                      <MazBadge color="black">{{ selectedEmployee['STATUS\n \n (FILLED, UNFILLED)'] || 'N/A' }}</MazBadge>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Mode of Accession</h3>
                      <p>{{ selectedEmployee['MODE OF ACCESSION (FOR PERMANENT AND COTERMINOUS ONLY)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date Filled</h3>
                      <p>{{ formatDate(selectedEmployee['DATE FILLED UP\n \n (DD-MMM-YYYY)']) }}</p>

                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date of Original Appointment</h3>
                      <p>{{ formatDate(selectedEmployee['DATE OF ORIGINAL APPOINTMENT\n \n (DD-MMM-YYYY)']) }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date of Last Promotion</h3>
                      <p>{{ formatDate(selectedEmployee['DATE OF LAST PROMOTION\n \n (DD-MMM-YYYY)']) }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Entry Date in DSWD</h3>
                      <p>{{ formatDate(selectedEmployee['ENTRY DATE IN DSWD (FIRST DAY IN SERVICE)\n \n (DD-MMM-YYYY)']) }}</p>
                    </div>
                  </div>
                </div>
              </MazTabsContentItem>

                 <MazTabsContentItem :tab="3" class="maz-py-4">
                <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Complete Name</h3>
                      <p>{{ selectedEmployee['COMPLETE NAME (CRUZ, JUAN PEREZ)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Last Name</h3>
                      <p>{{ selectedEmployee['LASTNAME\n (CRUZ)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">First Name</h3>
                      <p>{{ selectedEmployee['FIRST NAME\n (JUAN)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Middle Name</h3>
                      <p>{{ selectedEmployee['MIDDLE NAME\n (PEREZ)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Extension</h3>
                      <p>{{ selectedEmployee['EXT.'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Gender</h3>
                      <p>{{ selectedEmployee['GENDER'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Date of Birth</h3>
                        <p>{{ formatDate(selectedEmployee['DATE OF BIRTH\n \n (DD-MMM-YYYY)']) }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Age</h3>
                      <p>{{ selectedEmployee['AGE'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Civil Status</h3>
                      <p>{{ selectedEmployee['CIVIL STATUS'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Citizenship</h3>
                      <p>{{ selectedEmployee['CITIZENSHIP'] || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

              </MazTabsContentItem>

                <MazTabsContentItem :tab="4" class="maz-py-4">
                <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Highest Education</h3>
                      <p>{{ selectedEmployee['HIGHEST EDUCATION COMPLETED'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Primary Degree</h3>
                      <p>{{ selectedEmployee['DEGREE AND COURSE\n (1st Course/Vocational)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Secondary Degree</h3>
                      <p>{{ selectedEmployee['DEGREE AND COURSE\n (2nd Course)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Masters/Doctoral</h3>
                      <p>{{ selectedEmployee['MASTERS OR DOCTORAL DEGREE (Specify)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Other Courses</h3>
                      <p>{{ selectedEmployee['OTHER COURSE/S'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Eligibility</h3>
                      <p>{{ selectedEmployee['ELIGIBILITY\n (CS and other Eligibilities)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">License</h3>
                      <p>{{ selectedEmployee['LICENSE\n (RA 1080-LET, RN,RS,ETC)'] || 'N/A' }}</p>
                    </div>
                      <div>
                      <h3 class="font-medium text-muted-foreground">Highest Eligibility</h3>
                      <p>{{ selectedEmployee['HIGHEST LEVEL OF ELIGIBILITY (1ST AND 2ND LEVEL ONLY)'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Public Social Worker</h3>
                      <p>{{ selectedEmployee['PUBLIC SOCIAL WORKER'] || 'N/A' }}</p>
                    </div>
                      <div>
                      <h3 class="font-medium text-muted-foreground">Public Health Worker</h3>
                      <p>{{ selectedEmployee['PUBLIC HEALTH WORKER'] || 'N/A' }}</p>
                    </div>
                  </div>
                </div>

              </MazTabsContentItem>

               <MazTabsContentItem :tab="5" class="maz-py-4">
                <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Employee ID</h3>
                      <p>{{ selectedEmployee['EMPLOYEE ID NUMBER'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Contact Number</h3>
                      <p>{{ selectedEmployee['ACTIVE CONTACT NOS.'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Email</h3>
                      <p>{{ selectedEmployee['ACTIVE AND WORKING EMAIL ADDRESS'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Residential Address</h3>
                      <p>{{ selectedEmployee['RESIDENTIAL ADDRESS'] || 'N/A' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Permanent Address</h3>
                      <p>{{ selectedEmployee['PERMANENT ADDRESS'] || 'N/A' }}</p>
                    </div>
                    
                  </div>
                </div>

              </MazTabsContentItem>

               <MazTabsContentItem :tab="6" class="maz-py-4">
                <div v-if="selectedEmployee" class="grid gap-4 py-4 border-2 p-2 mt-4 rounded-md">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                      <h3 class="font-medium text-muted-foreground">Solo Parent</h3>
                      <p>{{ selectedEmployee['INDICATE WHETHER SOLO PARENT'] || 'NO' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Senior Citizen</h3>
                      <p>{{ selectedEmployee['INDICATE WHETHER SENIOR CITIZEN'] || 'NO' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">PWD</h3>
                      <p>{{ selectedEmployee['INDICATE WHETHER PWD'] || 'NO' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Indigenous</h3>
                      <p>{{ selectedEmployee['INDICATE WHETHER MEMBER OF INDIGENOUS GROUP'] || 'NO' }}</p>
                    </div>
                    <div>
                      <h3 class="font-medium text-muted-foreground">Secretariat</h3>
                      <p>{{ selectedEmployee['SECRETARIAT'] || 'N/A' }}</p>
                    </div>
                    
                  </div>
                </div>

              </MazTabsContentItem>



              
            </MazTabsContent>
            
        </MazTabs>
          </div>
          
        </template>

      </MazDialog>


      </MazTabsContentItem>

      <!-- Unfilled Employees Tab -->
      <MazTabsContentItem :tab="2" class="maz-py-4">
        <MazTable
          size="sm"
          v-model:search-query="searchQuery"
          v-model:page="page"
          v-model:page-size="pageSize"
          search
          pagination
          sortable
          hoverable
          :headers="unfilledTableHeaders"
          :rows="unfilledEmployees"
          class="mt-5"
        >
          <template #cell-IDNumber="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-completeName="{ value }">
            <span>{{ value }}</span>
          </template>
          <template #cell-employmentStatus="{ value }">
          <MazBadge :color="getStatusColor(value)">{{ value }}</MazBadge>
        </template>
          <template #cell-dateVacated="{ value }">
            <span>{{ new Date(value).toLocaleDateString() }}</span>
          </template>
          <template #cell-actions="{ row }">
            <MazBtn size="xs" color="info" @click="openDetailsDialog(row)">
              <Eye class="h-4 w-4" />
            </MazBtn>
          </template>
        </MazTable>

        
        <MazDialog v-model="showDetailsDialog" max-width="600px">
          <template #header>
            <div class="flex items-start justify-between px-5 py-2">
              <div>
                <div class="text-lg font-semibold">Vacant Position Details</div>
                <p class="text-sm text-gray-500 mt-1">Complete information about the vacant position</p>
              </div>
              <MazBtn
                size="xs"
                color="transparent"
                @click="showDetailsDialog = false"
                class="text-gray-500 hover:text-gray-800"
              >
                <span class="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </MazBtn>
            </div>
          </template>

          <div v-if="selectedVacancy" class="grid gap-4 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h3 class="font-medium text-muted-foreground">Item Code</h3>
                <p>{{ selectedVacancy.IDNumber }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Position Title</h3>
                <p>{{ selectedVacancy.completeName }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Division</h3>
                <p>{{ selectedVacancy.division }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Section</h3>
                <p>{{ selectedVacancy.section }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Salary Grade</h3>
                <p>{{ selectedVacancy.sg }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Fund Source</h3>
                <p>{{ selectedVacancy.fundSource }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Incumbent</h3>
                <p>{{ selectedVacancy.incumbent }}</p>
              </div>
              <div>
                <h3 class="font-medium text-muted-foreground">Date Vacated</h3>
                <p>{{ new Date(selectedVacancy.dateVacated).toLocaleDateString() }}</p>
              </div>
              <div class="md:col-span-2">
                <h3 class="font-medium text-muted-foreground">Remarks</h3>
                <div class="bg-gray-100 p-4">
                  <p>{{ selectedVacancy.remarks }}</p>
                </div>
              </div>
            </div>
          </div>
        </MazDialog>
      </MazTabsContentItem>

      <!-- Placeholder for Tab 3 -->
      <MazTabsContentItem :tab="3" class="maz-py-4">
        Tab 3
      </MazTabsContentItem>
    </MazTabsContent>
  </MazTabs>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed} from 'vue'
import MazTable from 'maz-ui/components/MazTable'
import MazBtn from 'maz-ui/components/MazBtn'
import MazBadge from 'maz-ui/components/MazBadge'
import type { MazTabsBarItem } from 'maz-ui/components/MazTabs'

import { useToast } from 'maz-ui'
import { CloudDownload, Eye } from 'lucide-vue-next'
import { formatToPeso, formatDate } from '../helper/formatters'
import { color } from 'chart.js/helpers'
 const tabs: MazTabsBarItem[] = [
    { label: 'Filled', disabled: false },
    { label: 'Unfilled', disabled: false},
  ]

  const employeeTabs: MazTabsBarItem [] = [
        { label: 'Position', disabled: false },
        { label: 'Employment', disabled: false },
        { label: 'Personal', disabled: false },
        { label: 'Education', disabled: false },
        { label: 'Contact', disabled: false },
        { label: 'Other', disabled: false },
  ]
const toast = useToast()

const getStatusColor = (status: string) => {
  const statusStr = String(status).toLowerCase();

  switch (statusStr) {
    case 'permanent':
      return 'info'; // Blue
    case 'coterminous':
      return 'primary'; // Primary color (can be changed)
    case 'casual':
      return 'warning'; // Yellow
    case 'contractual':
      return 'warning'; // Yellow
    case 'contract of service':
      return 'success'; // Green
    case 'job order':
      return 'success'; // Green
    default:
      return 'secondary'; // Default gray color
  }
};



const selectedIds = ref([])
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(10)
const employees = ref([])
const unfilledEmployees = ref([]);
const loading = ref(false)

const tableHeaders = [
  { label: 'ID', key: 'IDNumber', align: 'center', width: '2rem', sortable: false },
  { label: 'Complete Name', key: 'completeName' },
  { label: 'Section', key: 'section' },
  { label: 'Employment Status', key: 'employmentStatus' },
  { label: 'Start Date', key: 'entryDate',  value: (row: any) => formatDate(row.entryDate)},
  { label: 'SG', key: 'salaryGrade'},
  { label: "Salary", key: 'salary'},
  { label: 'Actions', key: 'actions', align: 'center', sortable: false}
]

const unfilledTableHeaders = [
  { label: 'Item Code', key: 'IDNumber' },
  { label: 'Position Title', key: 'completeName' },
  // { label: 'Section', key: 'section' },
  { label: 'Employment Status', key: 'employmentStatus' },
  { label: 'Date Vacated', key: 'dateVacated' },
  { label: 'Actions', key: 'actions', align: 'center', sortable: false}
]

const showDetailsDialogEmployee = ref(false)
const selectedEmployee = ref(null);

const openDetailsDialogEmployee = (row) => {
  console.log('Selected Employee:', row); // Check if row contains correct data
  selectedEmployee.value = row;
  showDetailsDialogEmployee.value = true;
}


const showDetailsDialog = ref(false)
const selectedVacancy = ref(null)

const openDetailsDialog = (row) => {
  selectedVacancy.value = row
  showDetailsDialog.value = true
}


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
      const data = await window.api.fetchEmployees();
      console.log('Fetched Employees:', data);
      employees.value = data.map(employee => ({
        ...employee,
        IDNumber: employee['EMPLOYEE ID NUMBER'], // Matches employee ID number
        completeName: employee['COMPLETE NAME (CRUZ, JUAN PEREZ)'],
        division: employee['DIVISION'], // Matches division
        section: employee['SECTION/UNIT'], // Matches section/unit
        employmentStatus: employee['CLASSIFICATION OF EMPLOYMENT (PERMANENT, COTERMINOUS, CASUAL, CONTRACTUAL, CONTRACT OF SERVICE, JOB ORDER)'], // Matches employment status
        'Item Code': employee['ITEM NUMBER\n \n (ALL STATUS OF EMPLOYMENT)'], // Matches item code
        'Fund Source': employee['FUND SOURCE FOR CONTRACTUAL, CONTRACT OF SERVICE AND JOB ORDER (BASED ON CREATION)'],
        'DateOriginal': employee['DATE OF ORIGINAL APPOINTMENT\n \n (DD-MMM-YYYY)'],
        'entryDate': employee['ENTRY DATE IN DSWD (FIRST DAY IN SERVICE)\n \n (DD-MMM-YYYY)'],
        'salaryGrade': employee['SG'],
        'salary':employee['MONTHLY SALARY'],
        'position': employee['POSITION TITLE']

      }));
    } else {
      toast.error('Electron API is not available.');
    }
  } catch (error) {
    toast.error('Error fetching employees.');
    console.error(error);
  }
};


const fetchUnfilledEmployees = async () => {
  try {
    if (window.api) {
      const data = await window.api.fetchUnfilled()
      unfilledEmployees.value = data.map(employee => ({
        IDNumber: employee.item_code,
        completeName: employee.position_title,
        section: employee.section_unit,
        division: employee.division,
        employmentStatus: employee.employment_status,
        sg: employee.sg,
        fundSource: employee.fund_source,
        incumbent: employee.former_incumbent,
        dateVacated: employee.date_vacated,
        remarks: employee.remarks___status_of_vacant_position
      }))
    } else {
      toast.error('Electron API is not available.')
    }
  } catch (error) {
    toast.error('Error fetching unfilled employees.')
    console.error(error)
  }
}
const isLoading = ref(true)

onMounted(async () => {
  if (window.api) {
    try {
      isLoading.value = true
      await Promise.all([
        fetchEmployees(),
        fetchUnfilledEmployees()
      ])
    } catch (error) {
      toast.error('Error fetching employee data.')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  } else {
    toast.error('Electron API is not available.')
    isLoading.value = false
  }
})



const downloadReport = async () => {
  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate delay

    const headers = [
      ...tableHeaders.map(h => h.label),
      'Item Code',
      'Fund Source',
      'DateOriginal',
      'entryDate',
      'salaryGrade',
      'salary',
      'position'

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
        employee['Fund Source'] || '',
        employee['DateOriginal'] || '',
        employee['salaryGrade'] || '',
        employee['entryDate'] || '',
        employee['position'] || '',
        employee['salary'] || '',
      ]
    })

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')



    if (window.api?.saveFile) {
      const filePath = await window.api.saveFile(csvContent, 'employee_report.csv')
      if (filePath) {
        toast.success('Report saved successfully', { position: 'bottom-right' })
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
