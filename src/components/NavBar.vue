<script setup lang="ts">
import router from '@/router/routerTasks';
import { useAuthStore } from '@/stores/authStore';
import { useTaskStore } from '@/stores/taskStore';
import { MenuRight } from '@boxicons/vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const taskStore = useTaskStore()
const { searchInput } = storeToRefs(taskStore);
const open = ref(false);
const {logout} = useAuthStore()

</script>

<template>
<div class="navbar  bg-gray-200 dark:bg-gray-700 shadow-sm ">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl text-[16px] md:text-2xl">
      To-Do App
    </a>
  </div>
  <input
    type="text"
    placeholder="Search"
    class="input input-bordered w-auto"
    v-model="searchInput"
    @keydown.enter="taskStore.applySearch()"
  />
  <!-- Mobile Menu Icon-->
  <button class="btn btn-ghost btn-circle">
    <MenuRight
    @click="open = !open"
      class="md:hidden" width="42" height="42" />
  </button>
  <!-- Desktop Menu-->
  <div>
    <ul class="hidden md:menu md:flex md:menu-horizontal px-1 gap-2">
      <li>
        <RouterLink to="/login">Login</RouterLink>
      </li>
      <li>
        <RouterLink to="/register">Register</RouterLink>
      </li>
      <li>
        <RouterLink to="/">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/add">Add Todo</RouterLink>
      </li>
      <li>
        <button
          class="btn hover:bg-gray-600"
          @click="
          () => {
            logout();
            router.push('/login')
          }
          "
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
  <!-- Mobile Dropdown menu-->
    <ul 
    v-if="open"
    class="absolute top-16 right-4 bg-base-200 rounded-box shadow-lg p-3 md:hidden menu menu-vertical">
      <li>
        <RouterLink to="/login" @click="open = false">Login</RouterLink>
      </li>
      <li>
        <RouterLink to="/register" @click="open = false">Register</RouterLink>
      </li>
      <li>
        <RouterLink to="/" @click="open = false">Home</RouterLink>
      </li>
      <li>
        <RouterLink to="/add" @click="open = false">Add Todo</RouterLink>
      </li>
      <li>
        <button
          class="btn hover:bg-gray-600"
          @click="() => {
            logout();
            router.push('/login')
          }
          "
        >
          Logout
        </button>
      </li>
    </ul>
</div>
</template>