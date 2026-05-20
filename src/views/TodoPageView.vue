<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useTaskStore } from '@/stores/taskStore';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const taskStore = useTaskStore()
const {
  tasks,
  total,
  loading,
  error,
  filter
} = storeToRefs(taskStore)
const route = useRoute()
const isDetailPage = computed(
  () => route.path.includes("/task/")
)
const isAddPage = computed(
  () => route.path.includes("/add")
)
const totalPages = computed(() => {
 return Math.ceil(total.value / 10)
})

watch(() => [
  filter.value.page,
  filter.value.search,
  filter.value.status
], () => {
  taskStore.loadTasks()
}, { immediate: true })
</script>

<template>
<div class="grid grid-cols-1 md:grid-cols-2 m-2 p-4 gap-6">
  <div :class="isDetailPage || isAddPage ? 'hidden md:block' : 'block'" class="flex flex-col gap-6 min-w-0">
    
    <!-- {/* Filter*/} -->
    <select
    v-model="filter.status"
    @change="filter.page = 1"
      class="btn w-30 p-2.5 rounded-md select"
    >
      <option value="ALL">All</option>
      <option value="TODO">Todo</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="DONE">Done</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
    <!-- loading spinner -->
    <div v-if="loading">
      <LoadingSpinner />
    </div>

    <!-- Error -->
    <div v-else-if="error">
      {{ error }}
    </div>

    <!-- Tasks -->
    <ul v-else
      class="flex flex-col gap-5">
        <li v-for="task in tasks" :key="task.id">
          <RouterLink :to="`/task/${task.id}`">
            <h2>{{ task.id }}</h2>
            <div class="flex flex-col">
              <h2 class="text-[20px] font-bold wrap-break-word">Name: {{ task.name }}</h2>
              <p class="text-[16px] wrap-break-word">Description: {{ task.description }}</p>
              <p>Status: {{ task.status }}</p>
            </div>
          </RouterLink>
        </li>
    </ul>

    <!-- {/* Pagination*/} -->
    <div class="join">
      <button
        class="join-item btn"
        :disabled="filter.page === 1"
        @click="filter.page--"
      >
        «
      </button>
      <button class="join-item btn">
        {{ filter.page }} of {{ totalPages }}
      </button>
      <button
        class="join-item btn light"
        :disabled="filter.page >= totalPages"
        @click="filter.page++"
      >
        »
      </button>
    </div>
  </div>
  <div :class="isDetailPage || isAddPage ? 'block' : 'hidden md:block'">
    <RouterView />
    <!-- {/* Add Todo Form */} -->
  </div>
</div>
</template>
