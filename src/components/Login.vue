<!-- src/pages/LoginPage.vue -->
<template>
  <div>
    <button @click="login" class="bg-blue-500 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGoogleLogin } from '../composables/useGoogleLogin'
const { login } = useGoogleLogin()
</script>
