import { addTask, deleteTask, fetchTasks, getTask, updateTask, type CreateTaskParams, type FetchTasksParams, type UpdateTaskParams } from "@/api/tasksApi";
import { type Priority, type Status } from "@/types/TaskTypes";

import type { Task } from "@/types/TaskTypes";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
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
    sort: "DESC",
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
      id: uuidv4(),
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
      return saved
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
    const listTask = tasks.value.find(
      t => t.id === id
    )

    const detailTask = task.value?.id === id ? task.value : null

    const listBackup = listTask ? { ...listTask } : null

    const detainBackup = detailTask ? { ...detailTask } : null

    if (listTask) {
      Object.assign(listTask, updates)
    }

    if (detailTask) {
      Object.assign(detailTask, updates)
    }

    try {
      await updateTask({id, updates})
    } catch (err) {
      if (err instanceof Error) error.value = err.message

      if (listTask && listBackup) {
        Object.assign(listTask, listBackup)
      }

      if (detailTask && detainBackup) {
        Object.assign(detailTask, detainBackup)
      }
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

