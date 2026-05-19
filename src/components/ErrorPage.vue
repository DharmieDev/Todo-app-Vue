<script setup lang="ts">
defineProps<{
  error: Error
}>()
</script>

<template>
	<div>
		<h2>Something went wrong</h2>
		<p class="text-red-600" v-if="error">{{ error.message }}</p>
	</div>
</template>