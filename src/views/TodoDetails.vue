<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useTaskStore } from '@/stores/taskStore';
import {type Priority, type Status} from '@/types/TaskTypes';
import { ChevronLeft } from '@boxicons/vue';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter()
const route = useRoute()

const taskStore = useTaskStore()
const error = ref<string | null>(null)
const { loading } = storeToRefs(taskStore)

watch(() => route.params.id, async (id) => {
  if (typeof id !== "string") return
  await taskStore.getTaskAction(id)
}, {immediate: true})


const handlePriorityChange = async (
  e: Event
) => {
  if (!taskStore.task) return
  const target = e.target as HTMLSelectElement

  await taskStore.updateTaskAction({
    id: taskStore.task.id,
    updates: {
      priority: target.value as Priority 
    }
  })
}

const handleStatusChange = async (
  e: Event
) => {
  if (!taskStore.task) return
  const target = e.target as HTMLSelectElement

  await taskStore.updateTaskAction({
    id: taskStore.task.id,
    updates: {
      status: target.value as Status
    }
  })
}

const handleDelete = async () => {
  if (!taskStore.task?.id) return
  try {
    await taskStore.deleteTaskAction(
      taskStore.task.id
    )
    router.push('/')
  } catch (err) {
    if (err instanceof Error) error.value = err.message
  }
}

</script>

<template>
<!-- Loading -->
<div v-if="loading" class="w-full h-screen flex items-center justify-center">
  <LoadingSpinner />
</div>

<!-- Error -->
<div v-else-if="
taskStore.error || !taskStore.task">
  <span class="text-red-600">Error fetching data</span>
</div>

<div v-else class="flex flex-col gap-10 m-9">
  <button @click="router.back()" class="btn w-[20%] md:hidden">
    <ChevronLeft/>
  </button>
  
  <span>{{ taskStore.task.id }}</span>
  <h2 class="text-3xl font-bold wrap-break-word">
    {{ taskStore.task.name }}
  </h2>
  <p class="wrap-break-word">
    Description: {{taskStore.task.description}}
  </p>
  <p>Status: {{ taskStore.task.status }}</p>
  <div>
    <p class="text-[13px]">
      Priority: {{ taskStore.task.priority }}
    </p>
    <p class="text-[13px]">
      Created At: {{ taskStore.task.createdAt }}
    </p>
    <p class="text-[13px]">
      Updated At: {{ taskStore.task.updatedAt }}
    </p>
  </div>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-5">
      <select
      :value="taskStore.task.priority"
      @change="handlePriorityChange"
        class="select light: bg-gray-300 dark:bg-gray-700 w-[50%] border-none"
      >
        <option disabled value="">Select Priority</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <select
        :value="taskStore.task.status"
        @change="handleStatusChange"
        class="select light: bg-gray-300  dark:bg-gray-700 w-[50%] border-none"
      >
        <option>Select Status</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN PROGRESS</option>
        <option value="DONE">DONE</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
    <button @click="handleDelete" class="btn btn-error w-[30%]">
      Delete
    </button>
  </div>
</div>
</template>