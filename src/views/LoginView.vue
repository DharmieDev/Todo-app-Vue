<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import {type LoginResponse } from '@/types/authTypes';
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';


const authStore = useAuthStore();
const router = useRouter();

const form = reactive<LoginResponse>({
  email: '',
  password: '',
})

const error = reactive({
  email: '',
  password: '',
})

const validate = () => {
  error.email = ''
  error.password = ''
  
  let isValid = true
  
  if (!form.email) {
    error.email = 'Email is required'
    isValid = false
  }

  if (!form.password) {
    error.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  const isValid = validate
  if (!isValid) return;

  try {
    await authStore.loginAction(form)
    alert('Login Successful')
    router.push('/')
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const response = err.response?.data
      if (response?.error) {
        Object.entries(
          response.error as Record<string, string[]>).forEach(([field, messages]) => {
            error[field as keyof typeof error] = messages?.[0] ?? ''
          })
      } else if (response?.message) {
        alert(response.message)
      }
      alert('Login failed')
    }
  }
  
}

</script>

<template>
<div class="flex justify-center items-center h-screen">
  <form
  @submit.prevent="handleSubmit"
  >
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-2xs md:w-xs border p-4">
          <div>
            <legend className="fieldset-legend">Email</legend>
            <!-- Email Field -->
            <input
            v-model="form.email"
              class="input border-none"
              placeholder="Enter your Email"
            />
            
              <p v-if="error.email" class="text-red-400">
                {{ error.email }}
              </p>
          </div>
     
        <!-- Password Field -->
          <div>
            <legend className="fieldset-legend">Password</legend>
            <input
            type="password"
            v-model="form.password"
              className="input border-none"
              placeholder="Enter your Password"
            />
            
              <p v-if="error.password" class="text-red-400">
                {{ error.password }}
              </p>
          </div>
      
      <button
        type="submit"
        class="btn  bg-gray-300 dark:bg-gray-700 hover:bg-gray-400  dark:hover:bg-gray-800"
      >
        Login
      </button>
    </fieldset>
  </form>
</div>
</template>