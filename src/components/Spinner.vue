<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gray-900 text-white"
  >
      <img :src="logoo" alt="logo" srcset="" class="h-24 w-24 animate-pulse">

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logoo from "../../src/assets/imgs/logoo.png";

const loading = ref(true)

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loading.value = false
  }, 20000) 
})
</script>
