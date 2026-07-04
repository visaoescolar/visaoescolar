<template>
  <div class="bg-slate-100 font-sans text-slate-700 antialiased flex min-h-screen">

    <AppSidebar />

    <!-- Main -->
    <main class="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

      <!-- Header -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h1 class="text-xl font-bold text-slate-800 tracking-wide uppercase">
          Painel de Gestão Acadêmica |
          <span class="text-blue-600 font-extrabold">VISÃO ESCOLAR</span>
        </h1>

        <div class="flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <div class="relative">
              <button @click="mostrarNotificacoes = !mostrarNotificacoes" class="relative text-slate-400 hover:text-slate-600 transition">
                <i class="fa-solid fa-bell text-xl"></i>
                <span v-if="notificacoes.length > 0" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {{ notificacoes.length }}
                </span>
              </button>

              <!-- Backdrop para fechar ao clicar fora -->
              <div v-if="mostrarNotificacoes" class="fixed inset-0 z-30" @click="mostrarNotificacoes = false"></div>

              <!-- Dropdown -->
              <div v-if="mostrarNotificacoes" class="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 overflow-hidden">
                <div class="px-4 py-3 border-b border-slate-100">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Notificações</span>
                </div>
                <div v-if="carregandoNotificacoes" class="px-4 py-6 text-center text-sm text-slate-400">
                  Carregando...
                </div>
                <div v-else-if="notificacoes.length === 0" class="px-4 py-6 text-center text-sm text-slate-400">
                  Nenhuma notificação no momento.
                </div>
                <template v-else>
                  <button
                    v-for="notificacao in notificacoes"
                    :key="notificacao.id"
                    @click="abrirNotificacao(notificacao)"
                    class="w-full text-left px-4 py-3 border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition flex items-start gap-3"
                  >
                    <span
                      class="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                      :class="notificacao.severidade === 'alerta' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'"
                    >
                      <i :class="notificacao.icone"></i>
                    </span>
                    <span class="text-sm text-slate-600">{{ notificacao.mensagem }}</span>
                  </button>
                </template>
              </div>
            </div>

            <div class="text-right flex flex-col justify-center">
              <span class="text-sm font-bold text-slate-800">{{ nomeUsuario }}</span>
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{{ userRole === 'coordenador' ? 'Coordenador(a)' : 'Professor(a)' }}</span>
            </div>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200" />
          </div>
        </div>
      </header>

      <!-- Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div v-for="card in cards" :key="card.title"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">
            {{ card.title }}
          </span>

          <div class="flex items-center gap-3 mt-2">
            <div :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
              card.bg,
              card.color
            ]">
              <i :class="card.icon"></i>
            </div>

            <span class="text-4xl font-extrabold text-slate-800">
              {{ card.value }}
            </span>
          </div>
        </div>

      </section>

      <!-- Charts -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-4 h-[400px]">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Desempenho por Disciplina
          </h3>

          <canvas ref="rankingChart"></canvas>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-5 h-[400px]">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Evolução de Notas
          </h3>

          <canvas ref="evolutionChart"></canvas>
        </div>

        <div class="lg:col-span-3 flex flex-col gap-6">

          <!-- Pizza -->
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center h-[400px]">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 self-start">
              Frequência Geral
            </h3>

            <canvas ref="approvalChart"></canvas>
          </div>

        </div>

      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import api from '../api/index.js'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuth } from '../composables/useAuth.js'

const { nomeUsuario, userRole } = useAuth()
const router = useRouter()

const rankingChart = ref(null)
const evolutionChart = ref(null)
const approvalChart = ref(null)

const notificacoes = ref([])
const carregandoNotificacoes = ref(false)
const mostrarNotificacoes = ref(false)

const carregarNotificacoes = async () => {
  carregandoNotificacoes.value = true
  try {
    const res = await api.get('/notificacoes')
    if (res.data.sucesso) {
      notificacoes.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  } finally {
    carregandoNotificacoes.value = false
  }
}

const abrirNotificacao = (notificacao) => {
  mostrarNotificacoes.value = false
  if (notificacao.link) router.push(notificacao.link)
}

const totalAlunos = ref(0)
const mediaGeral = ref('0.0')
const alunosRisco = ref(0)
const taxaAprovacao = ref('0.0%')

const cards = computed(() => [
  {
    title: 'Média Geral por Aluno',
    value: mediaGeral.value,
    icon: 'fa-solid fa-user',
    bg: 'bg-emerald-50',
    color: 'text-emerald-500'
  },
  {
    title: 'Total de Alunos',
    value: totalAlunos.value.toString(),
    icon: 'fa-solid fa-users',
    bg: 'bg-indigo-50',
    color: 'text-indigo-500'
  },
  {
    title: 'Alunos em Risco',
    value: alunosRisco.value.toString(),
    icon: 'fa-solid fa-triangle-exclamation',
    bg: 'bg-rose-50',
    color: 'text-rose-500'
  },
  {
    title: 'Taxa de Aprovação',
    value: taxaAprovacao.value,
    icon: 'fa-solid fa-circle-check',
    bg: 'bg-teal-50',
    color: 'text-teal-500'
  }
])

onMounted(async () => {
  carregarNotificacoes()
  try {
    const res = await api.get('/dashboard-stats')
    if (res.data.sucesso) {
      const stats = res.data.dados
      
      totalAlunos.value = stats.totalAlunos || 0
      mediaGeral.value = stats.mediaGeral || '0.0'
      alunosRisco.value = stats.alunosRisco || 0
      taxaAprovacao.value = stats.taxaAprovacao || '0.0%'

      // 1. Desempenho por Disciplina (rankingChart)
      if (rankingChart.value) {
        new Chart(rankingChart.value, {
          type: 'bar',
          data: stats.desempenhoGeral,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            }
          }
        })
      }

      // 2. Frequência Geral (approvalChart)
      if (approvalChart.value) {
        new Chart(approvalChart.value, {
          type: 'pie',
          data: stats.frequenciaGeral,
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }

      // 3. Evolução de Notas (média geral por bimestre)
      if (evolutionChart.value) {
        new Chart(evolutionChart.value, {
          type: 'line',
          data: stats.evolucaoNotas,
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        })
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
})
</script>
