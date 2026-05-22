<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore';
import type { Priority, Status } from '@/types/TaskTypes';
import { ChevronLeft } from '@boxicons/vue';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';


const form = reactive({
  name: "",
  description: "",
  priority: "LOW" as Priority,
  status: "TODO" as Status
})
const taskStore = useTaskStore()
const router = useRouter()
const isLoading = computed(() => taskStore.loading)

const handleSubmit = async () => {
  console.log("Submit working")
  if (!form.name.trim()) return

  await taskStore.createTaskAction({
    name: form.name,
    description: form.description,
    priority: form.priority,
    status: form.status
  })

  form.name = ""
  form.description = ""
  form.priority = "LOW" 
  form.status = "TODO" 

}


</script>

<template>
<div>
  <button @click="router.back()"
    class="btn md:hidden"
  >
    <ChevronLeft />
  </button>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-5 m-10">

    <!-- Name input -->
    <input
      type="text"
      v-model="form.name"
      placeholder="Task name..."
      class="input"
      required
    />
    <!-- Description input -->
    <textarea
      v-model="form.description"
      placeholder="Enter description"
      className="textarea"
    />
    <div className="flex gap-3">
      <select
      v-model="form.priority"
        class="select bg-gray-700 md:w-[20%] border-none"
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
      <select
      v-model="form.status"
        class="select bg-gray-700 md:w-[20%] border-none"
      >
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
    <button type="submit" class="btn w-40" :disabled="isLoading">
      {{isLoading ? "Loading..." : "Add Todo"}}
    </button>
  </form>
</div>
</template>