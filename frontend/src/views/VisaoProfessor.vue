<template>
  <div class="bg-slate-100 font-sans text-slate-700 antialiased flex min-h-screen">

    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 class="text-xl font-bold text-slate-800 tracking-wide uppercase">
            Visão Geral da Turma
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            Acompanhe o desempenho de notas e frequência consolidada de seus estudantes.
          </p>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <!-- Filtro Turma -->
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Turma</label>
            <select v-model="filtroTurma" @change="atualizarDisciplinasEDados"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="t in turmasList" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <!-- Filtro Disciplina -->
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Disciplina</label>
            <select v-model="filtroDisciplina" @change="recalcularDados"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option v-for="d in disciplinasList" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <!-- Avatar / User Profile -->
          <div class="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
            <div class="text-right flex flex-col justify-center">
              <span class="text-sm font-bold text-slate-800">{{ nomeUsuario }}</span>
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Professor(a)</span>
            </div>
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="Avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200" />
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="card in cards" :key="card.title"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span class="text-xs uppercase font-bold text-slate-400 tracking-wider">
            {{ card.title }}
          </span>
          <div class="flex items-center gap-3 mt-2">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg', card.bg, card.color]">
              <i :class="card.icon"></i>
            </div>
            <span class="text-3xl font-extrabold text-slate-800">
              {{ card.value }}
            </span>
          </div>
        </div>
      </section>

      <!-- Charts & Student Distribution -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-8 h-[350px]">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Distribuição de Médias - {{ filtroTurma }} ({{ filtroDisciplina }})
          </h3>
          <canvas ref="distribuicaoChart"></canvas>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:col-span-4 h-[350px] flex flex-col justify-between">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Status de Aprovação da Turma
            </h3>
            <canvas ref="statusChart" class="max-h-[220px]"></canvas>
          </div>
        </div>
      </section>

      <!-- Students Table -->
      <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
        <div class="flex items-center justify-between border-b pb-4">
          <h2 class="text-lg font-bold text-slate-800">
            Boletim Consolidado dos Alunos
          </h2>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">
            {{ totalAlunos }} alunos cadastrados
          </span>
        </div>

        <div class="overflow-x-auto">
          <div v-if="carregando" class="text-center py-12 text-slate-400 font-medium">
            Carregando boletins da turma...
          </div>
          <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th class="py-3 px-4">Matrícula</th>
                <th class="py-3 px-4">Nome do Aluno</th>
                <th class="py-3 px-4 text-center">Nota 1</th>
                <th class="py-3 px-4 text-center">Nota 2</th>
                <th class="py-3 px-4 text-center">Nota 3</th>
                <th class="py-3 px-4 text-center">Média Final</th>
                <th class="py-3 px-4 text-center">Frequência</th>
                <th class="py-3 px-4 text-center">Situação</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in boletins" :key="aluno.id" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-4 text-sm font-semibold text-slate-500">{{ aluno.matricula }}</td>
                <td class="py-4 px-4 text-sm font-bold text-slate-800">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {{ aluno.nome.charAt(0) }}
                    </div>
                    <span>{{ aluno.nome }}</span>
                  </div>
                </td>
                <td class="py-4 px-4 text-center text-sm font-medium text-slate-600">{{ aluno.nota1.toFixed(1) }}</td>
                <td class="py-4 px-4 text-center text-sm font-medium text-slate-600">{{ aluno.nota2.toFixed(1) }}</td>
                <td class="py-4 px-4 text-center text-sm font-medium text-slate-600">{{ aluno.nota3.toFixed(1) }}</td>
                <td class="py-4 px-4 text-center text-sm font-bold" :class="aluno.mediaFinal < 6 ? 'text-red-500' : 'text-slate-800'">
                  {{ aluno.mediaFinal.toFixed(1) }}
                </td>
                <td class="py-4 px-4 text-center text-sm font-semibold" :class="aluno.frequencia < 75 ? 'text-amber-500' : 'text-slate-600'">
                  {{ aluno.frequencia }}%
                </td>
                <td class="py-4 px-4 text-center">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold" :class="situacaoClasses(aluno.situacao)">
                    {{ aluno.situacao }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import api from '../api/index.js'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuth } from '../composables/useAuth.js'

const { usuario: usuarioObj, nomeUsuario, userRole } = useAuth()

const filtroTurma = ref('')
const filtroDisciplina = ref('')

const carregando = ref(false)
const listagemAlunos = ref([])
const boletins = ref([])

// Listas dinâmicas
const turmasList = ref([])
const disciplinasList = ref([])
const atribuicoesRaw = ref([])

const distribuicaoChart = ref(null)
const statusChart = ref(null)

let chartInstance1 = null
let chartInstance2 = null

// Atualizar disciplinas com base na turma selecionada
const atualizarDisciplinasEDados = () => {
  if (atribuicoesRaw.value.length > 0) {
    const filteredDiscs = atribuicoesRaw.value
      .filter(a => a.turma_descricao === filtroTurma.value)
      .map(a => a.disciplina_descricao)
    
    disciplinasList.value = [...new Set(filteredDiscs)]
    
    if (disciplinasList.value.length > 0) {
      if (!disciplinasList.value.includes(filtroDisciplina.value)) {
        filtroDisciplina.value = disciplinasList.value[0]
      }
    } else {
      filtroDisciplina.value = ''
    }
  }
  recalcularDados()
}

// Carregar alunos e turmas atribuídas
const carregarDadosIniciais = async () => {
  carregando.value = true
  try {
    // 1. Buscar atribuições de turmas do professor logado
    if (usuarioObj.id) {
      const resAtrib = await api.get(`/professores/${usuarioObj.id}/turmas`)
      if (resAtrib.data.sucesso && resAtrib.data.dados.length > 0) {
        atribuicoesRaw.value = resAtrib.data.dados
        
        const uniqueTurmas = [...new Set(atribuicoesRaw.value.map(a => a.turma_descricao))]
        turmasList.value = uniqueTurmas
        
        if (uniqueTurmas.length > 0) {
          filtroTurma.value = uniqueTurmas[0]
          
          const initialDiscs = atribuicoesRaw.value
            .filter(a => a.turma_descricao === filtroTurma.value)
            .map(a => a.disciplina_descricao)
          disciplinasList.value = [...new Set(initialDiscs)]
          
          if (disciplinasList.value.length > 0) {
            filtroDisciplina.value = disciplinasList.value[0]
          }
        }
      }
    }
    await recalcularDados()
  } catch (error) {
    console.error('Erro ao carregar dados do professor:', error)
  } finally {
    carregando.value = false
  }
}

// Recalcular boletins com dados reais do banco
const recalcularDados = async () => {
  if (!filtroTurma.value || !filtroDisciplina.value) return
  
  const atribuicao = atribuicoesRaw.value.find(
    a => a.turma_descricao === filtroTurma.value && a.disciplina_descricao === filtroDisciplina.value
  )

  let tId = null
  let dId = null
  if (atribuicao) {
    tId = atribuicao.turma_id
    dId = atribuicao.disciplina_id
  } else {
    if (atribuicoesRaw.value.length === 0) {
      boletins.value = []
      nextTick(() => {
        renderizarGraficos()
      })
      return
    }
  }

  carregando.value = true
  try {
    const res = await api.get('/professores/boletim-consolidado', {
      params: {
        turma_id: tId,
        disciplina_id: dId
      }
    })
    if (res.data.sucesso) {
      boletins.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar boletim consolidado:', error)
    boletins.value = []
  } finally {
    carregando.value = false
    nextTick(() => {
      renderizarGraficos()
    })
  }
}

// Estilo dos status
const situacaoClasses = (situacao) => {
  if (situacao === 'Aprovado') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
  } else if (situacao === 'Recuperação') {
    return 'bg-amber-50 text-amber-700 border border-amber-100'
  } else {
    return 'bg-red-50 text-red-700 border border-red-100'
  }
}

// Cálculos reativos
const totalAlunos = computed(() => boletins.value.length)

const mediaTurma = computed(() => {
  if (boletins.value.length === 0) return '0.0'
  const soma = boletins.value.reduce((acc, a) => acc + a.mediaFinal, 0)
  return (soma / boletins.value.length).toFixed(1)
})

const frequenciaMedia = computed(() => {
  if (boletins.value.length === 0) return '0%'
  const soma = boletins.value.reduce((acc, a) => acc + a.frequencia, 0)
  return Math.round(soma / boletins.value.length) + '%'
})

const alunosEmRisco = computed(() => {
  return boletins.value.filter(a => a.mediaFinal < 6 || a.frequencia < 75).length
})

const cards = computed(() => [
  {
    title: 'Média da Turma',
    value: mediaTurma.value,
    icon: 'fa-solid fa-graduation-cap',
    bg: 'bg-blue-50',
    color: 'text-blue-500'
  },
  {
    title: 'Frequência Média',
    value: frequenciaMedia.value,
    icon: 'fa-solid fa-calendar-check',
    bg: 'bg-emerald-50',
    color: 'text-emerald-500'
  },
  {
    title: 'Total de Estudantes',
    value: totalAlunos.value.toString(),
    icon: 'fa-solid fa-users',
    bg: 'bg-indigo-50',
    color: 'text-indigo-500'
  },
  {
    title: 'Alunos em Risco',
    value: alunosEmRisco.value.toString(),
    icon: 'fa-solid fa-circle-exclamation',
    bg: 'bg-rose-50',
    color: 'text-rose-500'
  }
])

// Desenho de Gráficos
const renderizarGraficos = () => {
  if (chartInstance1) chartInstance1.destroy()
  if (chartInstance2) chartInstance2.destroy()

  const aprovados = boletins.value.filter(a => a.situacao === 'Aprovado').length
  const recuperacao = boletins.value.filter(a => a.situacao === 'Recuperação').length
  const reprovados = boletins.value.filter(a => a.situacao === 'Reprovado').length

  // Gráfico 1: Barras - Média por Aluno
  if (distribuicaoChart.value) {
    const labels = boletins.value.map(a => a.nome.split(' ')[0])
    const medias = boletins.value.map(a => a.mediaFinal)
    
    chartInstance1 = new Chart(distribuicaoChart.value, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Média Final',
          data: medias,
          backgroundColor: medias.map(m => m >= 6.0 ? '#3b82f6' : '#ef4444'),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { min: 0, max: 10 }
        }
      }
    })
  }

  // Gráfico 2: Doughnut - Proporções
  if (statusChart.value) {
    chartInstance2 = new Chart(statusChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Aprovado', 'Recuperação', 'Reprovado'],
        datasets: [{
          data: [aprovados, recuperacao, reprovados],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12 } }
        }
      }
    })
  }
}

onMounted(() => {
  carregarDadosIniciais()
})
</script>

<style scoped>
</style>
