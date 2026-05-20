<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { type RegisterResponse } from '@/types/authTypes';
import axios from 'axios';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive<RegisterResponse>({
  name: "",
  email: "",
  password: ""
})

const error = reactive({
  name: "",
  email: "",
  password: ""
})
const validate = () => {
  error.name = "";
  error.email = "";
  error.password = "";

  let isValid = true;

  if (!form.name) {
    error.name = "Username is required";
    isValid = false;
  }

  if (!form.email) {
    error.email = "Email is required";
    isValid = false;
  }

  if (!form.password) {
    error.password = "Password is required";
    isValid = false;
  }

  return isValid;
}

const handleSubmit =  async () => {
  const isValid = validate();

  if (!isValid) return;

  try {
    await authStore.registerAction(form)
    alert("Registration successful")

    router.push("/login")
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const response = err.response?.data
      if (response?.error) {
        Object.entries(
          response.error as Record<string, string[]>).forEach(
          ([field, messages]) => {
            error[field as keyof typeof error] = messages?.[0] ?? ""
          }
        )
      } else if (response?.message) {
          alert(response.message)
      }
    }
    alert("Registration failed")
  }
} 

</script>

<template>
<div class="flex justify-center items-center h-screen">
  <form
  @submit.prevent="handleSubmit"
  >
    <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-2xs md:w-xs border p-4">
      <legend class="fieldset-legend">Register</legend>
      
      <!-- Name Field -->
          <div>
            <label class="label">Name</label>
            <input
              v-model="form.name"
              class="input border-none"
              placeholder="Enter your Name"
            />
              <p 
              v-if="error.name"
              class="text-red-400">
                {{error.name}}
              </p>
          </div>
          
          <!-- Email Field -->
          <div>
            <label class="label">Email</label>
            <input
              v-model="form.email"
              class="input border-none"
              placeholder="Enter your Email"
            />
              <p v-if="error.email" class="text-red-400">
                {{error.email}}
              </p>
          </div>

          <!-- Password Field -->
          <div>
            <label class="label">Password</label>
            <input
              v-model="form.password"
              class="input border-none"
              placeholder="Enter your Password"
              type="password"
            />
              <p v-if="error.password" class="text-red-400">
                {{error.password}}
              </p>
          </div>
     
      <button
        type="submit"
        class="btn  bg-gray-300 dark:bg-gray-700 hover:bg-gray-400  dark:hover:bg-gray-800"
      >
        Register
      </button>
    </fieldset>
  </form>
</div>
</template>