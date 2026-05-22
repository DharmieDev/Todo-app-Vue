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
      name: 'home',
      component: TodoPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/tasks/:id',
          name: 'todo-details',
          components: {
            right: TodoDetails,
          }
        },
        {
          path: '/add',
          name: 'add-todo',
          components: {
            right: AddTodo
          }
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return "/login"
  }

  if (to.meta.requiresGuest && token) {
    return "/"
  }
})

export default router
