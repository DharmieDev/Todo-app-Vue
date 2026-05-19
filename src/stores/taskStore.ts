import { addTask, deleteTask, fetchTasks, updateTask, type CreateTaskParams, type FetchTasksParams, type UpdateTaskParams } from "@/api/tasksApi";
import type { Task } from "@/types/Task";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([])
  const total = ref(0)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const filter = reactive<FetchTasksParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "ALL",
    sort: "ASC"
  })
  
  const searchInput = ref("")
  const loadTasks = async () => {
    const token = localStorage.getItem("token")
  
    if (!token) return
    loading.value = true
    try {
      const response = await fetchTasks(filter)
      tasks.value = response.tasks
      total.value = response.total
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  const applySearch = async () => {
    filter.search = searchInput.value
    filter.page = 1 
    await loadTasks()
  }

  const createTaskAction = async (
  payload: CreateTaskParams
  ) => {
    const tempTask: Task = {
      id: Date.now().toString(),
      name: payload.name,
      description: payload.description,
      priority: payload.priority,
      status: payload.status,
      completedAt: Date.now().toLocaleString(),
      createdAt: Date.now().toLocaleString(),
      updatedAt: Date.now().toLocaleString(),
    }
    // optimistic update
    tasks.value.unshift(tempTask)

    try {
      const saved = await addTask(payload)
      
      const index = tasks.value.findIndex(
        t => t.id === tempTask.id)
      if (index !== -1) {
          tasks.value[index] = saved
        }
    } catch {
      tasks.value = tasks.value.filter(
        t => t.id !== tempTask.id
      )
    }
    await loadTasks()
  }

  const deleteTaskAction = async (
    id: string
  ) => {
    const backup = [...tasks.value]
    tasks.value = tasks.value.filter(
      t => t.id !== id
    )

    try {
      await deleteTask(id)
    } catch {
      tasks.value = backup
    }
  }

  const updateTaskAction = async ({
    id,
    updates
  }: UpdateTaskParams) => {
    const task = tasks.value.find(
      t => t.id === id
    )
    if (!task) return
    const backup = { ...task }
    Object.assign(task, updates)

    try {
      await updateTask({id, updates})
    } catch {
      Object.assign(task, backup)
    }
  }

  return {
    tasks,
    total,
    loading,
    error,
    filter,
    searchInput,
    applySearch,
    loadTasks,
    createTaskAction,
    deleteTaskAction,
    updateTaskAction,
  }
})

