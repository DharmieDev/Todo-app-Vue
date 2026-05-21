<script setup lang="ts">
import LoadingSpinner from './components/LoadingSpinner.vue';
import NavBar from './components/NavBar.vue';
import TodoPageView from './views/TodoPageView.vue';

</script>


<template>
 <Suspense>
   <template #default>
     <div>
       <NavBar />
       <TodoPageView />
     </div>
   </template>

   <template #fallback>
     <div>
       <LoadingSpinner />
     </div>
   </template>
 </Suspense>
</template>

<style>

</style>
