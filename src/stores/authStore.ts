import { getMe, loginUser, registerUser } from "@/api/authApi";
import { type User, type LoginResponse, type RegisterResponse } from "@/types/authTypes";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const User = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(
    localStorage.getItem("token")
  )

  const registerAction = async (
  payload: RegisterResponse
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await registerUser(payload)
      return response
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginAction = async (
  payload: LoginResponse
  ) => {
    loading.value = true
    error.value = null

    try {
      const data = await loginUser(payload)
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("token", data.refreshToken)

      token.value = data.accessToken
      User.value = data.user
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  const geMeAction = async () => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) return
    loading.value = true

    try {
      const response = await getMe()
      User.value = response
    } catch (err) {
      logout()
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")

    token.value = null
    User.value = null
  }

  return {
    User,
    loading,
    error,
    token,
    registerAction,
    loginAction,
    geMeAction,
    logout,
  }
  
})