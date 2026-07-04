import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import GestaoAcademica from '../views/GestaoAcademica.vue'
import NotasFrequencia from '../views/NotasFrequencia.vue'
import Alunos from '../views/Alunos.vue'
import VisaoProfessor from '../views/VisaoProfessor.vue'
import Chamada from '../views/Chamada.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/alunos',
    name: 'Alunos',
    component: Alunos,
    meta: { requiresAuth: true }
  },
  {
    path: '/gestao-academica',
    name: 'GestaoAcademica',
    component: GestaoAcademica,
    meta: { requiresAuth: true, role: 'coordenador' }
  },
  {
    path: '/notas',
    name: 'Notas',
    component: NotasFrequencia,
    meta: { requiresAuth: true }
  },
  {
    path: '/visao-professor',
    name: 'VisaoProfessor',
    component: VisaoProfessor,
    meta: { requiresAuth: true }
  },
  {
    path: '/chamada',
    name: 'Chamada',
    component: Chamada,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/')
    return
  }

  if (to.path === '/' && token) {
    next('/dashboard')
    return
  }

  if (to.meta.role && token) {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    const userRole = usuario.tipo_usuario || usuario.tipo || 'professor'
    if (userRole !== to.meta.role) {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
