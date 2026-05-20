import { createRouter, createWebHistory } from 'vue-router'

const TodoPage = () => import('../views/TodoPageView.vue')
const Login = () => import('../views/LoginView.vue')
const NotFound = () => import('../views/NotFound.vue')
const Register = () => import('../views/RegisterView.vue')
const AddTodo = () => import('../views/AddTodoView.vue')
const TodoDetails = () => import('../views/TodoDetails.vue')

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
