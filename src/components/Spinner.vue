<template>
                <div v-if="loading" class="flex justify-center items-center fixed inset-0 bg-gray-900 ">
                  <!-- Use maz-ui loading spinner -->
                   <span>HRiQ</span>
                  <MazFullscreenLoader :loading="loading" color="white" size="50px" />
                </div>
              </template>
              
              <script setup>
              import { ref } from 'vue'

              const loading = ref(true)
              
              // Simulate loading process (e.g., wait for Electron app to load)
              setTimeout(() => {
                loading.value = false
              }, 10000) 
              </script>
              
              <style scoped>
              /* Optional styling for spinner */
              </style>
              