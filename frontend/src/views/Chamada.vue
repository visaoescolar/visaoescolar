<template>
  <div class="bg-slate-100 font-sans text-slate-700 antialiased flex min-h-screen">

    <AppSidebar />

    <!-- Main -->
    <main class="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

      <!-- Header -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <button v-if="modo === 'lista'" @click="voltarParaCards"
            class="text-slate-400 hover:text-blue-600 transition p-2 rounded-lg hover:bg-slate-50"
            title="Voltar para as aulas do dia"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <h1 class="text-xl font-bold text-slate-800 tracking-wide uppercase">
              Chamada
            </h1>
            <p class="text-xs text-slate-400 mt-0.5">
              <span v-if="modo === 'cards'">Aulas do dia. Selecione uma aula para fazer a chamada.</span>
              <span v-else-if="userRole === 'coordenador'">Modo de visualização — apenas o(a) professor(a) responsável pode registrar a chamada.</span>
              <span v-else>{{ cardSelecionado?.disciplina_descricao }} — {{ cardSelecionado?.turma_descricao }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <!-- Navegação de Data -->
          <div class="flex items-center gap-2">
            <button @click="mudarDia(-1)" class="text-slate-400 hover:text-blue-600 transition p-2 rounded-lg hover:bg-slate-50">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div>
              <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1 text-center">
                Data
              </label>
              <input type="date" v-model="filtroData" @change="onDataChange"
                class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button @click="mudarDia(1)" class="text-slate-400 hover:text-blue-600 transition p-2 rounded-lg hover:bg-slate-50">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Avatar -->
          <div class="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
            <div class="text-right flex flex-col justify-center">
              <span class="text-sm font-bold text-slate-800">{{ nomeUsuario }}</span>
              <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{{ userRole === 'coordenador' ? 'Coordenador(a)' : 'Professor(a)' }}</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="Avatar"
              class="w-9 h-9 rounded-full object-cover border border-slate-200"
            >
          </div>
        </div>
      </header>

      <!-- Alert Banners -->
      <div v-if="alertMessage" class="p-4 rounded-xl text-sm font-semibold border"
        :class="alertType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'">
        {{ alertMessage }}
      </div>

      <!-- ===================== MODO CARDS ===================== -->
      <section v-if="modo === 'cards'" class="flex-1">
        <div v-if="carregandoCards" class="text-center py-12 text-slate-400 font-medium">
          Carregando aulas do dia...
        </div>
        <div v-else-if="aulasDoDia.length === 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-12 text-slate-400 font-medium">
          Nenhuma aula cadastrada para este dia.
          <RouterLink v-if="userRole === 'coordenador'" to="/gestao-academica" class="text-blue-600 hover:underline ml-1">
            Cadastrar horário
          </RouterLink>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="card in aulasDoDia"
            :key="card.horario_id"
            @click="abrirChamada(card)"
            class="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition flex flex-col gap-3"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                <i class="fa-solid fa-clock mr-1"></i>{{ card.hora_inicio }}
              </span>
              <span
                class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                :class="card.chamada_feita ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ card.chamada_feita ? 'Chamada feita' : 'Pendente' }}
              </span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">{{ card.disciplina_descricao }}</h3>
              <p class="text-sm text-slate-500">{{ card.turma_descricao }}</p>
              <p v-if="card.professor_nome" class="text-xs text-slate-400 mt-1">{{ card.professor_nome }}</p>
            </div>
          </button>
        </div>
      </section>

      <!-- ===================== MODO LISTA (chamada da aula selecionada) ===================== -->
      <template v-else>
        <!-- Status & Actions -->
        <section
          class="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm"
        >
          <div class="flex items-center gap-4 text-sm">
            <div class="text-slate-500">
              <i class="fa-solid fa-circle-info text-blue-500 mr-1.5"></i>
              Status:
              <span class="font-semibold text-amber-500" v-if="!aulaId">
                Chamada não lançada nesta data
              </span>
              <span class="font-semibold text-emerald-500" v-else>
                Chamada lançada
              </span>
            </div>

            <div class="text-slate-300">|</div>

            <div class="text-slate-500">
              Alunos na turma:
              <span class="font-bold text-slate-700">{{ listagemAlunos.length }}</span>
            </div>

            <div class="text-slate-300">|</div>

            <div class="text-slate-500">
              Presentes:
              <span class="font-bold text-emerald-600">{{ totalPresentes }}</span>
              / Faltas:
              <span class="font-bold text-red-500">{{ totalFaltas }}</span>
            </div>
          </div>

          <!-- Buttons -->
          <div v-if="userRole !== 'coordenador'" class="flex items-center gap-3">
            <button @click="marcarTodosPresentes" :disabled="salvando || listagemAlunos.length === 0"
              class="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-sm px-4 py-2 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
            >
              <i class="fa-solid fa-user-check"></i>
              Marcar Todos Presentes
            </button>

            <button @click="salvarChamada" :disabled="salvando || listagemAlunos.length === 0"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <i class="fa-solid fa-cloud-arrow-up"></i>
              Salvar Chamada
            </button>
          </div>
          <span v-else class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-eye"></i>
            Somente visualização
          </span>
        </section>

        <!-- Table Area -->
        <section
          class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 p-6"
        >
          <div class="overflow-x-auto">
            <div v-if="carregando" class="text-center py-12 text-slate-400 font-medium">
              Carregando chamada...
            </div>
            <div v-else-if="listagemAlunos.length === 0" class="text-center py-12 text-slate-400 font-medium">
              Nenhum aluno matriculado nesta turma/disciplina.
            </div>
            <table v-else class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th class="py-3 px-4">Matrícula</th>
                  <th class="py-3 px-4">Nome do Aluno</th>
                  <th class="py-3 px-4 text-center w-48">Presença</th>
                  <th class="py-3 px-4">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in listagemAlunos" :key="aluno.matricula_id" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="py-4 px-4 text-sm font-medium text-slate-500">{{ aluno.matricula }}</td>
                  <td class="py-4 px-4 text-sm font-semibold text-slate-800">{{ aluno.nome }}</td>
                  <td class="py-2 px-4">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="aluno.presente = true"
                        :disabled="userRole === 'coordenador'"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:cursor-not-allowed"
                        :class="aluno.presente === true ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'"
                      >
                        Presente
                      </button>
                      <button
                        @click="aluno.presente = false"
                        :disabled="userRole === 'coordenador'"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:cursor-not-allowed"
                        :class="aluno.presente === false ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500'"
                      >
                        Falta
                      </button>
                    </div>
                  </td>
                  <td class="py-2 px-4">
                    <input
                      type="text"
                      v-model="aluno.observacao"
                      :disabled="userRole === 'coordenador'"
                      placeholder="Opcional"
                      class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuth } from '../composables/useAuth.js'

const { usuario: usuarioObj, nomeUsuario, userRole } = useAuth()

const hoje = new Date().toISOString().slice(0, 10)

const modo = ref('cards') // 'cards' | 'lista'
const filtroData = ref(hoje)

const carregandoCards = ref(false)
const aulasDoDia = ref([])
const cardSelecionado = ref(null)

const filtroTurma = ref('')
const filtroDisciplina = ref('')

const aulaId = ref(null)
const alertMessage = ref('')
const alertType = ref('success')
const carregando = ref(false)
const salvando = ref(false)

const listagemAlunos = ref([])

const totalPresentes = computed(() => listagemAlunos.value.filter(a => a.presente === true).length)
const totalFaltas = computed(() => listagemAlunos.value.filter(a => a.presente === false).length)

const mostrarAlerta = (msg, type = 'success') => {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    alertMessage.value = ''
  }, 4000)
}

const carregarAulasDoDia = async () => {
  carregandoCards.value = true
  try {
    const res = await api.get('/chamada/aulas-do-dia', {
      params: { data: filtroData.value, usuario_id: usuarioObj.id }
    })
    if (res.data.sucesso) {
      aulasDoDia.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar aulas do dia:', error)
    mostrarAlerta('Erro ao carregar aulas do dia.', 'danger')
  } finally {
    carregandoCards.value = false
  }
}

const mudarDia = (delta) => {
  const [ano, mes, dia] = filtroData.value.split('-').map(Number)
  const d = new Date(ano, mes - 1, dia)
  d.setDate(d.getDate() + delta)
  filtroData.value = d.toISOString().slice(0, 10)
  onDataChange()
}

const onDataChange = () => {
  if (modo.value === 'cards') {
    carregarAulasDoDia()
  } else {
    carregarChamada()
  }
}

const abrirChamada = (card) => {
  cardSelecionado.value = card
  filtroTurma.value = card.turma_id
  filtroDisciplina.value = card.disciplina_id
  modo.value = 'lista'
  carregarChamada()
}

const voltarParaCards = () => {
  modo.value = 'cards'
  cardSelecionado.value = null
  carregarAulasDoDia()
}

const carregarChamada = async () => {
  if (!filtroTurma.value || !filtroDisciplina.value || !filtroData.value) return
  carregando.value = true
  try {
    const res = await api.get('/chamada', {
      params: {
        turma_id: filtroTurma.value,
        disciplina_id: filtroDisciplina.value,
        data: filtroData.value,
        usuario_id: usuarioObj.id
      }
    })
    if (res.data.sucesso) {
      aulaId.value = res.data.dados.aula_id
      listagemAlunos.value = res.data.dados.alunos
    }
  } catch (error) {
    console.error('Erro ao carregar chamada:', error)
    mostrarAlerta('Erro ao carregar chamada do servidor.', 'danger')
  } finally {
    carregando.value = false
  }
}

const marcarTodosPresentes = () => {
  listagemAlunos.value.forEach(aluno => { aluno.presente = true })
}

const salvarChamada = async () => {
  const faltando = listagemAlunos.value.some(a => a.presente === null || a.presente === undefined)
  if (faltando) {
    mostrarAlerta('Marque presente ou falta para todos os alunos antes de salvar.', 'danger')
    return
  }

  salvando.value = true
  try {
    const res = await api.post('/chamada', {
      turma_id: filtroTurma.value,
      disciplina_id: filtroDisciplina.value,
      data: filtroData.value,
      usuario_id: usuarioObj.id,
      presencas: listagemAlunos.value.map(aluno => ({
        matricula_id: aluno.matricula_id,
        presente: aluno.presente,
        observacao: aluno.observacao
      }))
    })

    if (res.data.sucesso) {
      mostrarAlerta('Chamada salva com sucesso!', 'success')
      await carregarChamada()
    }
  } catch (error) {
    console.error('Erro ao salvar chamada:', error)
    mostrarAlerta('Erro ao salvar chamada no servidor.', 'danger')
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  carregarAulasDoDia()
})
</script>
