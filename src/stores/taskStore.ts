import { addTask, deleteTask, fetchTasks, getTask, updateTask, type CreateTaskParams, type FetchTasksParams, type UpdateTaskParams } from "@/api/tasksApi";
import type { Task } from "@/types/TaskTypes";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { ref } from "vue";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([])
  const task = ref<Task | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filter = reactive<FetchTasksParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "ALL",
    priority: "LOW",
    sort: "ASC",
    all: false
  })
  
  const searchInput = ref("")
  
  const loadTasks = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      error.value = "No authentication token found"
      return
    }
    loading.value = true
    error.value = null
    
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
      id: new Date().toString(),
      name: payload.name,
      description: payload.description,
      priority: payload.priority,
      status: payload.status,
      completedAt: new Date().toLocaleString(),
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
    }
    // optimistic update
    tasks.value.unshift(tempTask)
    total.value++

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
      total.value--
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
      total.value--
    } catch (err) {
      if (err instanceof Error) error.value = err.message
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
    } catch (err) {
      if (err instanceof Error) error.value = err.message
      Object.assign(task, backup)
    }
  }

  const getTaskAction = async (id: string) => {
    loading.value = true
    error.value = null
  
    try {
      const response = await getTask(id)
      task.value = response
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
    }
      } finally {
        loading.value =false
      }
  }

  return {
    tasks,
    task,
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
    getTaskAction,
  }
})

