<template>
  <section class="min-h-screen bg-slate-100">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
        <div class="mb-10">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Visão Escolar</p>
          <h2 class="mt-4 text-2xl font-bold text-slate-900">Painel de Controle</h2>
        </div>

        <nav class="space-y-3">
          <button
            @click="logout"
            class="w-full rounded-2xl border border-slate-200 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Sair
          </button>
        </nav>
      </aside>

      <main class="flex-1 p-6 md:p-10">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">Bem-vindo ao Dashboard do Visão Escolar!</h1>
          </div>

          <div class="flex items-center gap-3">
            <button
              @click="logout"
              class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Sair
            </button>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-8">
          <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">Total de Alunos</p>
            <p class="mt-6 text-4xl font-bold text-slate-900">{{ totalAlunos }}</p>
            <p class="mt-3 text-sm text-slate-500">Alunos cadastrados no painel fictício.</p>
          </article>

          <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">Média Geral da Escola</p>
            <p class="mt-6 text-4xl font-bold text-slate-900">{{ mediaGeral }}</p>
            <p class="mt-3 text-sm text-slate-500">Média aritmética das notas dos alunos.</p>
          </article>

          <article class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p class="text-sm font-medium text-slate-500">Alunos em Risco</p>
            <p class="mt-6 text-4xl font-bold text-rose-600">{{ alunosEmRisco }}</p>
            <p class="mt-3 text-sm text-slate-500">Alunos com desempenho abaixo de 6.0.</p>
          </article>
        </div>

        <div class="grid gap-6 xl:grid-cols-2 mb-8">
          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Desempenho por Disciplina</h2>
                <p class="text-sm text-slate-500">Gráfico de barras com médias por matéria.</p>
              </div>
            </div>
            <div class="h-72 rounded-[1.5rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-500">
              Gráfico aqui
            </div>
          </section>

          <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div class="mb-4 flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">Frequência</h2>
                <p class="text-sm text-slate-500">Porcentagem de presença e faltas.</p>
              </div>
            </div>
            <div class="h-72 rounded-[1.5rem] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-500">
              Gráfico aqui
            </div>
          </section>
        </div>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-xl font-semibold text-slate-900">Alunos</h2>
              <p class="text-sm text-slate-500">Lista de alunos com média de rendimento.</p>
            </div>
            <p class="text-sm text-slate-500">Dados fictícios carregados do backend mock.</p>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 text-sm">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Aluno</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Matrícula</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Turma</th>
                  <th class="px-4 py-3 text-left font-semibold text-slate-700">Média</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="aluno in alunos" :key="aluno.id">
                  <td class="px-4 py-4 text-slate-700">{{ aluno.nome }}</td>
                  <td class="px-4 py-4 text-slate-700">{{ aluno.matricula }}</td>
                  <td class="px-4 py-4 text-slate-700">{{ aluno.turma }}</td>
                  <td class="px-4 py-4 font-semibold" :class="aluno.media < 6 ? 'text-rose-600' : 'text-slate-900'">{{ aluno.media.toFixed(1) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div v-if="errorMessage" class="mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-rose-200">
          {{ errorMessage }}
        </div>
      </main>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()
const alunos = ref([])
const desempenhoGeral = ref({ labels: [], datasets: [] })
const frequenciaGeral = ref({ labels: [], datasets: [] })
const loading = ref(true)
const errorMessage = ref('')

const totalAlunos = computed(() => alunos.value.length)
const mediaGeral = computed(() => {
  if (!alunos.value.length) return '0.0'
  const sum = alunos.value.reduce((acc, aluno) => acc + Number(aluno.media), 0)
  return (sum / alunos.value.length).toFixed(1)
})
const alunosEmRisco = computed(() => alunos.value.filter((aluno) => Number(aluno.media) < 6).length)

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}

const loadDashboard = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    router.push('/')
    return
  }

  try {
    const response = await api.get('/dashboard-stats')
    alunos.value = response.data.alunos || []
    desempenhoGeral.value = response.data.desempenhoGeral || { labels: [], datasets: [] }
    frequenciaGeral.value = response.data.frequenciaGeral || { labels: [], datasets: [] }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao carregar os dados do dashboard.'
    if (error.response?.status === 401) {
      logout()
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})
</script>
