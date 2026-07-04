<template>
  <div class="bg-slate-100 font-sans text-slate-700 antialiased flex min-h-screen">

    <AppSidebar />

    <!-- Main -->
    <main class="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

      <!-- Header -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div>
          <h1 class="text-xl font-bold text-slate-800 tracking-wide uppercase">
            Lançamento de Notas & Frequência
          </h1>
          <p class="text-xs text-slate-400 mt-0.5">
            <span v-if="userRole === 'coordenador'">Modo de visualização — apenas o(a) professor(a) responsável pode editar notas e frequência.</span>
            <span v-else>Selecione os parâmetros para abrir a planilha da turma.</span>
          </p>
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <!-- Turma -->
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Turma
            </label>
            <select v-model="filtroTurma" @change="onTurmaChange"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option v-for="t in turmasList" :key="t.id" :value="t.id">{{ t.descricao }}</option>
            </select>
          </div>

          <!-- Disciplina -->
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Disciplina
            </label>
            <select v-model="filtroDisciplina" @change="carregarAlunos"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option v-for="d in disciplinasList" :key="d.id" :value="d.id">{{ d.descricao }}</option>
            </select>
          </div>

          <!-- Período -->
          <div>
            <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Período Avaliativo
            </label>
            <select v-model="filtroPeriodo" @change="carregarAlunos"
              class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1º Bimestre</option>
              <option value="2">2º Bimestre</option>
              <option value="3">3º Bimestre</option>
              <option value="4">4º Bimestre</option>
            </select>
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

      <!-- Status & Actions -->
      <section
        class="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div class="flex items-center gap-4 text-sm">
          <div class="text-slate-500">
            <i class="fa-solid fa-circle-info text-blue-500 mr-1.5"></i>
            Status:
            <span class="font-semibold text-amber-500" v-if="!publicado">
              Aguardando Envio
            </span>
            <span class="font-semibold text-emerald-500" v-else>
              Publicado no Sistema
            </span>
          </div>

          <div class="text-slate-300">|</div>

          <div class="text-slate-500">
            Alunos na planilha:
            <span class="font-bold text-slate-700">{{ listagemAlunos.length }}</span>
          </div>
        </div>

        <!-- Buttons -->
        <div v-if="userRole !== 'coordenador'" class="flex items-center gap-3">
          <button @click="salvarRascunho" :disabled="salvando"
            class="bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
          >
            <i class="fa-solid fa-floppy-disk"></i>
            Salvar Rascunho
          </button>

          <button @click="publicar" :disabled="salvando"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-xl transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
            Publicar no Sistema
          </button>
        </div>
        <span v-else class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <i class="fa-solid fa-eye"></i>
          Somente visualização
        </span>
      </section>

      <!-- Alert Banners -->
      <div v-if="alertMessage" class="p-4 rounded-xl text-sm font-semibold border"
        :class="alertType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'">
        {{ alertMessage }}
      </div>

      <!-- Table Area -->
      <section
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 p-6"
      >
        <div class="overflow-x-auto">
          <div v-if="carregando" class="text-center py-12 text-slate-400 font-medium">
            Carregando listagem de alunos...
          </div>
          <div v-else-if="!filtroTurma || !filtroDisciplina" class="text-center py-12 text-slate-400 font-medium">
            Selecione uma Turma e uma Disciplina para visualizar a planilha.
          </div>
          <div v-else-if="listagemAlunos.length === 0" class="text-center py-12 text-slate-400 font-medium">
            Nenhum aluno matriculado nesta turma/disciplina.
          </div>
          <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th class="py-3 px-4">Matrícula</th>
                <th class="py-3 px-4">Nome do Aluno</th>
                <th class="py-3 px-4 w-32">Nota (0.0 - 10.0)</th>
                <th class="py-3 px-4 w-32">Frequência (%)</th>
                <th class="py-3 px-4 text-center w-40">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in listagemAlunos" :key="aluno.id" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-4 text-sm font-medium text-slate-500">{{ aluno.matricula }}</td>
                <td class="py-4 px-4 text-sm font-semibold text-slate-800">{{ aluno.nome }}</td>
                <td class="py-2 px-4">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    v-model.number="aluno.nota"
                    @input="validarNota(aluno)"
                    :disabled="userRole === 'coordenador'"
                    class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="py-2 px-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    v-model.number="aluno.frequencia"
                    @input="validarFrequencia(aluno)"
                    :disabled="userRole === 'coordenador'"
                    class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </td>
                <td class="py-4 px-4 text-center">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                    :class="obterStatusClasses(aluno)"
                  >
                    {{ calcularStatus(aluno) }}
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
import { ref, onMounted } from 'vue'
import api from '../api/index.js'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuth } from '../composables/useAuth.js'

const { usuario: usuarioObj, nomeUsuario, userRole } = useAuth()

const filtroTurma = ref('')
const filtroDisciplina = ref('')
const filtroPeriodo = ref('1')

const publicado = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
const carregando = ref(false)
const salvando = ref(false)

const turmasList = ref([])
const disciplinasList = ref([])
const atribuicoesRaw = ref([])
const listagemAlunos = ref([])

const carregarDadosIniciais = async () => {
  carregando.value = true
  try {
    if (userRole.value === 'coordenador') {
      // Coordenador navega livremente entre todas as turmas/disciplinas, em modo de leitura.
      const [resTurmas, resDisciplinas] = await Promise.all([
        api.get('/turmas'),
        api.get('/disciplinas')
      ])
      if (resTurmas.data.sucesso) {
        turmasList.value = resTurmas.data.dados.map(t => ({ id: t.id, descricao: t.descricao }))
      }
      if (resDisciplinas.data.sucesso) {
        disciplinasList.value = resDisciplinas.data.dados.map(d => ({ id: d.id, descricao: d.nome }))
      }
      if (turmasList.value.length > 0) filtroTurma.value = turmasList.value[0].id
      if (disciplinasList.value.length > 0) filtroDisciplina.value = disciplinasList.value[0].id
      if (filtroTurma.value && filtroDisciplina.value) await carregarAlunos()
    } else if (usuarioObj.id) {
      const resAtrib = await api.get(`/professores/${usuarioObj.id}/turmas`)
      if (resAtrib.data.sucesso && resAtrib.data.dados.length > 0) {
        atribuicoesRaw.value = resAtrib.data.dados

        const uniqueTurmas = []
        const seenTurmas = new Set()
        atribuicoesRaw.value.forEach(a => {
          if (!seenTurmas.has(a.turma_id)) {
            seenTurmas.add(a.turma_id)
            uniqueTurmas.push({ id: a.turma_id, descricao: a.turma_descricao })
          }
        })
        turmasList.value = uniqueTurmas

        if (uniqueTurmas.length > 0) {
          filtroTurma.value = uniqueTurmas[0].id
          atualizarDisciplinas()
          await carregarAlunos()
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar turmas/disciplinas:', error)
    mostrarAlerta('Erro ao carregar turmas atribuídas.', 'danger')
  } finally {
    carregando.value = false
  }
}

const atualizarDisciplinas = () => {
  const filteredDiscs = []
  const seenDiscs = new Set()
  atribuicoesRaw.value
    .filter(a => a.turma_id === parseInt(filtroTurma.value))
    .forEach(a => {
      if (!seenDiscs.has(a.disciplina_id)) {
        seenDiscs.add(a.disciplina_id)
        filteredDiscs.push({ id: a.disciplina_id, descricao: a.disciplina_descricao })
      }
    })
  disciplinasList.value = filteredDiscs
  if (filteredDiscs.length > 0) {
    if (!filteredDiscs.some(d => d.id === filtroDisciplina.value)) {
      filtroDisciplina.value = filteredDiscs[0].id
    }
  } else {
    filtroDisciplina.value = ''
  }
}

const onTurmaChange = () => {
  if (userRole.value !== 'coordenador') {
    atualizarDisciplinas()
  }
  carregarAlunos()
}

const carregarAlunos = async () => {
  if (!filtroTurma.value || !filtroDisciplina.value) return
  carregando.value = true
  publicado.value = false
  try {
    const res = await api.get('/notas-frequencia', {
      params: {
        turma_id: filtroTurma.value,
        disciplina_id: filtroDisciplina.value,
        periodo: filtroPeriodo.value,
        usuario_id: usuarioObj.id
      }
    })
    if (res.data.sucesso) {
      listagemAlunos.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar planilha de notas:', error)
    mostrarAlerta('Erro ao carregar planilha do banco de dados.', 'danger')
  } finally {
    carregando.value = false
  }
}

const validarNota = (aluno) => {
  if (aluno.nota < 0) aluno.nota = 0
  if (aluno.nota > 10) aluno.nota = 10
}

const validarFrequencia = (aluno) => {
  if (aluno.frequencia < 0) aluno.frequencia = 0
  if (aluno.frequencia > 100) aluno.frequencia = 100
}

const calcularStatus = (aluno) => {
  if (aluno.nota === null || aluno.nota === undefined || aluno.nota === '') return 'Pendente'
  const notaVal = parseFloat(aluno.nota)
  const freqVal = aluno.frequencia !== null && aluno.frequencia !== undefined ? parseFloat(aluno.frequencia) : 100

  if (notaVal >= 6.0 && freqVal >= 75) {
    return 'Aprovado'
  } else if (notaVal < 6.0 && notaVal >= 4.0 && freqVal >= 75) {
    return 'Recuperação'
  } else {
    return 'Reprovado'
  }
}

const obterStatusClasses = (aluno) => {
  const status = calcularStatus(aluno)
  if (status === 'Aprovado') {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
  } else if (status === 'Recuperação') {
    return 'bg-amber-50 text-amber-700 border border-amber-100'
  } else if (status === 'Pendente') {
    return 'bg-slate-50 text-slate-500 border border-slate-200'
  } else {
    return 'bg-red-50 text-red-700 border border-red-100'
  }
}

const mostrarAlerta = (msg, type = 'success') => {
  alertMessage.value = msg
  alertType.value = type
  setTimeout(() => {
    alertMessage.value = ''
  }, 4000)
}

const salvarRascunho = async () => {
  salvando.value = true
  try {
    const res = await api.post('/notas-frequencia', {
      turma_id: filtroTurma.value,
      disciplina_id: filtroDisciplina.value,
      periodo: filtroPeriodo.value,
      usuario_id: usuarioObj.id,
      dados: listagemAlunos.value.map(aluno => ({
        matricula_id: aluno.matricula_id,
        nota: aluno.nota,
        frequencia: aluno.frequencia
      }))
    })

    if (res.data.sucesso) {
      mostrarAlerta('Rascunho de notas e frequência salvo com sucesso no banco de dados!', 'success')
      await carregarAlunos()
    }
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error)
    mostrarAlerta('Erro ao salvar rascunho no servidor.', 'danger')
  } finally {
    salvando.value = false
  }
}

const publicar = async () => {
  let valid = true
  for (const aluno of listagemAlunos.value) {
    if (aluno.nota === null || aluno.nota === undefined || aluno.nota === '' || isNaN(aluno.nota) ||
        aluno.frequencia === null || aluno.frequencia === undefined || aluno.frequencia === '' || isNaN(aluno.frequencia)) {
      valid = false
      break
    }
  }

  if (!valid) {
    mostrarAlerta('Erro ao publicar. Por favor, certifique-se de que todos os alunos têm notas e frequências preenchidas de forma válida.', 'danger')
    return
  }

  salvando.value = true
  try {
    const res = await api.post('/notas-frequencia', {
      turma_id: filtroTurma.value,
      disciplina_id: filtroDisciplina.value,
      periodo: filtroPeriodo.value,
      usuario_id: usuarioObj.id,
      dados: listagemAlunos.value.map(aluno => ({
        matricula_id: aluno.matricula_id,
        nota: aluno.nota,
        frequencia: aluno.frequencia
      }))
    })

    if (res.data.sucesso) {
      publicado.value = true
      mostrarAlerta('Notas e frequências publicadas com sucesso no banco de dados!', 'success')
      await carregarAlunos()
    }
  } catch (error) {
    console.error('Erro ao publicar dados:', error)
    mostrarAlerta('Erro ao publicar dados no servidor.', 'danger')
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  carregarDadosIniciais()
})
</script>
