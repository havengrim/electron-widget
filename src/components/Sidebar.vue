
<template>
  <div class="fixed top-0 left-0">
    <aside class="flex flex-col items-center w-18 h-screen py-8 overflow-y-auto bg-gray-800 text-gray-200 border-r rtl:border-l rtl:border-r-0">
      <nav class="flex flex-col items-center flex-1 space-y-6">
        <a href="#">
          <img class="w-auto h-6 filter brightness-110 saturate-50" src="https://merakiui.com/images/logo.svg" alt="Logo" />
        </a>

        <router-link to="/" class="flex flex-col items-center">
          <div class="flex flex-col justify-center items-center gap-0 p-1.5 text-gray-200 focus:outline-none transition-colors duration-200 rounded-lg hover:bg-gray-700">
            <span href="#" class="flex flex-col items-center">
              <HomeIcon class="w-5 h-5" />
            </span>
            <span class="text-sm">Home</span>
          </div>
        </router-link>
        <router-link to="/about" class="flex flex-col items-center">
            <div class="flex flex-col justify-center items-center gap-0 p-1.5 text-gray-200 focus:outline-none transition-colors duration-200 rounded-lg hover:bg-gray-700">
              <span class="flex flex-col items-center">
                <FileTextIcon class="w-5 h-5" />
              </span>
              <span class="text-sm">Contract</span>
            </div>
          </router-link>

        <router-link to="/generate" class="flex flex-col items-center">

          <div class="flex flex-col justify-center items-center gap-0 p-1.5 text-gray-200 focus:outline-none transition-colors duration-200 rounded-lg hover:bg-gray-700">
            <span href="#" class="flex flex-col items-center">
              <GenerateIcon class="w-5 h-5" />
            </span>
            <span class="text-sm">Generate</span>
          </div>
        </router-link>
      </nav>

      <div class="flex flex-col space-y-6">
        <a href="#" class="p-1.5 text-gray-300 focus:outline-none transition-colors duration-200 rounded-lg hover:bg-gray-700">
          <SettingsIcon class="w-6 h-6" />
        </a>

        <a href="#" class="p-1.5 text-gray-900 focus:outline-none transition-colors duration-200 rounded-lg bg-gray-200 hover:bg-gray-900">
          <LogOutIcon class="w-6 h-6" />
        </a>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  Home,
  FileText,
  Settings,
  LogOut,
  Activity,
  ChartColumn
} from 'lucide-vue-next'


export default defineComponent({
  components: {
    HomeIcon: Home,
    FileTextIcon: FileText,
    GenerateIcon: ChartColumn,
    SettingsIcon: Settings,
    LogOutIcon: LogOut
  }
})
</script>

<style scoped>

</style>
