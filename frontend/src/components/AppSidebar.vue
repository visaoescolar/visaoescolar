<template>
  <aside class="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6">
    <div class="text-blue-600 text-3xl mb-4">
      <i class="fa-solid fa-graduation-cap"></i>
    </div>

    <nav class="flex flex-col gap-2 w-full px-2">
      <RouterLink to="/dashboard" :class="linkClass('/dashboard')">
        <i class="fa-solid fa-house text-lg mb-1"></i> Início
      </RouterLink>
      <RouterLink v-if="userRole === 'coordenador'" to="/gestao-academica" :class="linkClass('/gestao-academica')">
        <i class="fa-solid fa-folder-open text-lg mb-1"></i> Gestão
      </RouterLink>
      <RouterLink to="/alunos" :class="linkClass('/alunos')">
        <i class="fa-solid fa-user-group text-lg mb-1"></i> Alunos
      </RouterLink>
      <RouterLink to="/visao-professor" :class="linkClass('/visao-professor')">
        <i class="fa-solid fa-chalkboard-user text-lg mb-1"></i> Professor
      </RouterLink>
      <RouterLink to="/notas" :class="linkClass('/notas')">
        <i class="fa-solid fa-pen-to-square text-lg mb-1"></i> Notas
      </RouterLink>
      <RouterLink to="/chamada" :class="linkClass('/chamada')">
        <i class="fa-solid fa-clipboard-check text-lg mb-1"></i> Chamada
      </RouterLink>
    </nav>

    <button @click="logout" class="mt-auto text-red-500 hover:text-red-700 flex flex-col items-center p-2 rounded-xl text-[10px] font-bold transition-colors" title="Sair do sistema">
      <i class="fa-solid fa-right-from-bracket text-lg mb-1"></i> Sair
    </button>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const route = useRoute()
const { userRole, logout } = useAuth()

const baseClass = 'flex flex-col items-center p-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-50 transition'
const activeClass = 'flex flex-col items-center p-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50'

const linkClass = (path) => (route.path === path ? activeClass : baseClass)
</script>
