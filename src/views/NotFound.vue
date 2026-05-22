<script setup lang="ts">
import router from '@/router/routerTasks';


</script>

<template>
<div class="fixed inset-0 flex flex-col items-center justify-center z-50">
  <span class="text-8xl font-bold">404</span>
  <h1>Not Found</h1>
  <p>The page you are looking for does not exist.</p>
  <button @click="router.push('/')" class="btn">
    Go Home
  </button>
</div>
</template>