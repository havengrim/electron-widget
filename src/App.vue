<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-blue-600 mb-6">Welcome to the Vite + Vue 3 + Electron + TypeScript App</h1>
      <div class="flex space-x-4 justify-center mb-8">
        <img alt="Vite logo" class="w-24 h-24" src="./assets/vite.svg" />
        <img alt="Vue logo" class="w-24 h-24" src="./assets/logo.png" />
        <img alt="Electron logo" class="w-24 h-24" src="./assets/electron.png" />
        <img alt="TS logo" class="w-24 h-24" src="./assets/ts.png" />
      </div>
      <HelloWorld msg="Vite + Vue 3 + Electron + TypeScript" />
      <p class="mt-4 text-xl text-gray-700">Using the following technologies:</p>
      <div class="flex space-x-4 justify-center mt-4">
        <img alt="vue router logo" class="w-20 h-20" src="./assets/vueRouter.png" />
        <img alt="pinia logo" class="w-20 h-20" src="./assets/pinia.svg" />
      </div>
    </div>
    <div class="mt-8 px-4 py-2 bg-white rounded-lg shadow-lg max-w-lg w-full text-center">
      <p class="text-gray-500">This project uses:</p>
      <ul class="mt-2 space-y-2 text-sm text-gray-700">
        <li>Vite for fast build tools</li>
        <li>Vue 3 for modern reactive UI</li>
        <li>Electron for desktop apps</li>
        <li>TypeScript for static type-checking</li>
        <li>Pinia for state management</li>
        <li>Vue Router for routing</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles */
</style>
