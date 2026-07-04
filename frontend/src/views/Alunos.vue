<template>
  <div class="bg-slate-100 font-sans text-slate-700 antialiased flex min-h-screen">

    <AppSidebar />

    <!-- Main -->
    <div class="flex-1 p-6 flex flex-col gap-6 overflow-x-hidden">

      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-4 mb-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-wrap gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800 tracking-wide uppercase">
            Gestão de Alunos
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Gerencie e cadastre os estudantes da instituição de ensino.
          </p>
        </div>

        <button v-if="userRole === 'coordenador'" @click="exibirFormCadastro = !exibirFormCadastro"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold text-sm shadow-sm flex items-center gap-2">
          <i class="fa-solid" :class="exibirFormCadastro ? 'fa-list' : 'fa-plus'"></i>
          {{ exibirFormCadastro ? 'Visualizar Alunos' : 'Adicionar Novo Aluno' }}
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="mensagemErro" class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
        {{ mensagemErro }}
      </div>
      <div v-if="mensagemSucesso" class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
        {{ mensagemSucesso }}
      </div>

      <!-- Aba 1: Formulário de Cadastro -->
      <div v-if="exibirFormCadastro" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-4xl animate-fadeIn">
        <h2 class="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Preencha os Dados do Estudante</h2>
        
        <form class="space-y-6" @submit.prevent="salvarAluno">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Nome Completo *</label>
              <input type="text" v-model="form.nome" placeholder="Ex: Lucas Santos" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">E-mail Institucional *</label>
              <input type="email" v-model="form.email" placeholder="lucas.santos@aluno.com" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">CPF *</label>
              <input type="text" v-model="form.cpf" placeholder="Ex: 123.456.789-00" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Data de Nascimento</label>
              <input type="date" v-model="form.data_nascimento"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Telefone</label>
              <input type="text" v-model="form.telefone" placeholder="(00) 90000-0000"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Filiação (Nome da Mãe/Pai)</label>
              <input type="text" v-model="form.filiacao" placeholder="Ex: Maria Lima"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-600 mb-2">Endereço Completo</label>
            <input type="text" v-model="form.endereco" placeholder="Ex: Rua A, 123 - Centro"
              class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Matrícula *</label>
              <input type="text" v-model="form.matricula" placeholder="Ex: EM241009" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Data de Ingresso</label>
              <input type="date" v-model="form.data_ingresso"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Status do Aluno</label>
              <select v-model="form.status_aluno"
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
                <option value="Trancado">Trancado</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Curso *</label>
              <select v-model="form.curso_id" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                <option value="">Selecione um curso...</option>
                <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nome }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-600 mb-2">Turma *</label>
              <select v-model="form.turma_id" required
                class="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                <option value="">Selecione uma turma...</option>
                <option v-for="turma in turmas" :key="turma.id" :value="turma.id">{{ turma.descricao }}</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button type="button" @click="exibirFormCadastro = false"
              class="px-5 py-2.5 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 font-semibold text-sm">
              Cancelar
            </button>
            <button type="submit" :disabled="salvando"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-sm disabled:opacity-50">
              {{ salvando ? 'Salvando...' : 'Salvar Aluno' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Aba 2: Listagem de Alunos -->
      <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
        
        <!-- Filtros de Pesquisa -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div class="flex gap-4 flex-wrap flex-1 max-w-2xl">
            <!-- Buscar por Nome -->
            <div class="flex-1 min-w-[200px]">
              <input type="text" v-model="buscaNome" placeholder="Buscar aluno por nome..."
                class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm">
            </div>

            <!-- Filtrar por Turma -->
            <div class="w-48">
              <select v-model="filtroTurma"
                class="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm">
                <option value="">Todas as Turmas</option>
                <option v-for="turma in turmas" :key="turma.id" :value="turma.descricao">{{ turma.descricao }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabela -->
        <div class="overflow-x-auto">
          <div v-if="carregando" class="text-center py-12 text-slate-400 font-medium">
            Carregando listagem de alunos...
          </div>
          <div v-else-if="alunosFiltrados.length === 0" class="text-center py-12 text-slate-400 font-medium">
            Nenhum aluno encontrado.
          </div>
          <table v-else class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th class="py-3 px-4">Matrícula</th>
                <th class="py-3 px-4">Nome do Aluno</th>
                <th class="py-3 px-4">E-mail</th>
                <th class="py-3 px-4">Curso</th>
                <th class="py-3 px-4">Turma</th>
                <th class="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="aluno in alunosFiltrados" :key="aluno.id" class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td class="py-4 px-4 text-sm font-semibold text-slate-500">{{ aluno.matricula }}</td>
                <td class="py-4 px-4 text-sm font-bold text-slate-800">{{ aluno.nome }}</td>
                <td class="py-4 px-4 text-sm text-slate-600">{{ aluno.email }}</td>
                <td class="py-4 px-4 text-sm text-slate-600">{{ aluno.nome_curso || 'Sem curso' }}</td>
                <td class="py-4 px-4 text-sm text-slate-600">
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    {{ aluno.nome_turma || aluno.turma || 'Sem turma' }}
                  </span>
                </td>
                <td class="py-2 px-4 text-center">
                  <button v-if="userRole === 'coordenador'" @click="confirmarExclusao(aluno)" :disabled="excluindo === aluno.id"
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" title="Excluir Aluno">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/index.js'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuth } from '../composables/useAuth.js'
import { useConfirm } from '../composables/useConfirm.js'

const { userRole } = useAuth()
const { confirmar } = useConfirm()

const listagemAlunos = ref([])
const cursos = ref([])
const turmas = ref([])
const carregando = ref(false)
const salvando = ref(false)
const excluindo = ref(null)

const buscaNome = ref('')
const filtroTurma = ref('')
const exibirFormCadastro = ref(false)

const mensagemErro = ref('')
const mensagemSucesso = ref('')

const form = ref({
  nome: '',
  email: '',
  cpf: '',
  data_nascimento: '',
  telefone: '',
  endereco: '',
  matricula: '',
  filiacao: '',
  data_ingresso: '',
  status_aluno: 'Ativo',
  curso_id: '',
  turma_id: ''
})

const carregarAlunos = async () => {
  carregando.value = true
  try {
    const res = await api.get('/alunos')
    if (res.data.sucesso) {
      listagemAlunos.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
  } finally {
    carregando.value = false
  }
}

const carregarCursos = async () => {
  try {
    const res = await api.get('/cursos')
    if (res.data.sucesso) {
      cursos.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar cursos:', error)
  }
}

const carregarTurmas = async () => {
  try {
    const res = await api.get('/turmas')
    if (res.data.sucesso) {
      turmas.value = res.data.dados
    }
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
  }
}

const salvarAluno = async () => {
  salvando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    const res = await api.post('/alunos', form.value)
    if (res.data.sucesso) {
      mensagemSucesso.value = 'Estudante cadastrado com sucesso!'
      form.value = {
        nome: '',
        email: '',
        cpf: '',
        data_nascimento: '',
        matricula: '',
        curso_id: '',
        turma_id: ''
      }
      await carregarAlunos()
      setTimeout(() => {
        exibirFormCadastro.value = false
        mensagemSucesso.value = ''
      }, 1500)
    }
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error)
    mensagemErro.value = error.response?.data?.mensagem || 'Erro ao cadastrar estudante.'
  } finally {
    salvando.value = false
  }
}

const confirmarExclusao = async (aluno) => {
  const ok = await confirmar({
    titulo: 'Excluir Estudante',
    mensagem: `Tem certeza que deseja excluir o aluno ${aluno.nome}? Esta ação não pode ser desfeita.`,
    textoConfirmar: 'Excluir'
  })
  if (!ok) return

  excluindo.value = aluno.id
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    const res = await api.delete(`/alunos/${aluno.id}`)
    if (res.data.sucesso) {
      mensagemSucesso.value = 'Estudante excluído com sucesso!'
      await carregarAlunos()
      setTimeout(() => {
        mensagemSucesso.value = ''
      }, 3000)
    }
  } catch (error) {
    console.error('Erro ao deletar aluno:', error)
    mensagemErro.value = 'Erro ao excluir estudante.'
  } finally {
    excluindo.value = null
  }
}

const alunosFiltrados = computed(() => {
  return listagemAlunos.value.filter(aluno => {
    const bateNome = (aluno.nome || '').toLowerCase().includes(buscaNome.value.toLowerCase())
    const turmaComparar = aluno.nome_turma || aluno.turma || 'Sem turma'
    const bateTurma = !filtroTurma.value || turmaComparar === filtroTurma.value
    return bateNome && bateTurma
  })
})

onMounted(() => {
  carregarAlunos()
  carregarTurmas()
  if (userRole.value === 'coordenador') {
    carregarCursos()
  }
})
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
