import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue';
import ErrorPage from '@/components/ErrorPage.vue';

const TodoPage = defineAsyncComponent({
  loader: () => import('../views/TodoPageView.vue'),
  errorComponent: ErrorPage
})
const Login = defineAsyncComponent({
  loader: () => import('../views/LoginView.vue'),
  errorComponent: ErrorPage
})
const NotFound = defineAsyncComponent({
  loader: () => import('../views/NotFound.vue'),
  errorComponent: ErrorPage
})
const Register = defineAsyncComponent({
  loader: () => import('../views/RegisterView.vue'),
  errorComponent: ErrorPage
})
const AddTodo = defineAsyncComponent({
  loader: () => import('../views/AddTodoView.vue'),
  errorComponent: ErrorPage
})
const TodoDetails = defineAsyncComponent({
  loader: () => import('../views/TodoDetails.vue'),
  errorComponent: ErrorPage
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: TodoPage
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/add',
      name: 'add-todo',
      component: AddTodo
    },
    {
      path: '/task/:id',
      name: 'todo-details',
      component: TodoDetails
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ],
})

export default router
