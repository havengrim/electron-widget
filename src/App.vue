<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 p-6">
      <Dashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import Dashboard from './components/Dashboard.vue';
</script>
