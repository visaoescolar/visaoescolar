<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestão Acadêmica</h1>
          <p class="text-gray-600 mt-2">Gerenciar cursos e disciplinas</p>
        </div>
        <button
          @click="logout"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex gap-4 mb-8 border-b border-gray-200">
        <button
          @click="abaAtiva = 'cursos'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'cursos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
            </svg>
            Cursos
          </span>
        </button>
        <button
          @click="abaAtiva = 'disciplinas'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'disciplinas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
            </svg>
            Disciplinas
          </span>
        </button>
      </div>

      <!-- Aba Cursos -->
      <div v-if="abaAtiva === 'cursos'" class="space-y-6">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Adicionar Novo Curso</h2>
          <form @submit.prevent="criarCurso" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              v-model="formCurso.nome"
              type="text"
              placeholder="Nome do curso"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formCurso.codigo"
              type="text"
              placeholder="Código"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formCurso.descricao"
              type="text"
              placeholder="Descrição"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="carregandoCursos"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ carregandoCursos ? 'Adicionando...' : 'Adicionar' }}
            </button>
          </form>
        </div>

        <!-- Mensagens de Erro/Sucesso -->
        <div v-if="mensagemErro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {{ mensagemErro }}
        </div>
        <div v-if="mensagemSucesso" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {{ mensagemSucesso }}
        </div>

        <!-- Tabela de Cursos -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div v-if="carregandoCursos" class="p-6 text-center text-gray-600">
            Carregando cursos...
          </div>
          <div v-else-if="cursos.length === 0" class="p-6 text-center text-gray-600">
            Nenhum curso cadastrado ainda
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="curso in cursos" :key="curso.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900">#{{ curso.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ curso.nome }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ curso.codigo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ curso.descricao }}</td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarCurso(curso.id)"
                    :disabled="deletandoCurso === curso.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 text-xs font-medium"
                  >
                    {{ deletandoCurso === curso.id ? 'Deletando...' : 'Deletar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Aba Disciplinas -->
      <div v-if="abaAtiva === 'disciplinas'" class="space-y-6">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Adicionar Nova Disciplina</h2>
          <form @submit.prevent="criarDisciplina" class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              v-model="formDisciplina.nome"
              type="text"
              placeholder="Nome da disciplina"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formDisciplina.codigo"
              type="text"
              placeholder="Código"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model.number="formDisciplina.carga_horaria"
              type="number"
              placeholder="Carga Horária"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model.number="formDisciplina.curso_id"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um curso</option>
              <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                {{ curso.nome }}
              </option>
            </select>
            <button
              type="submit"
              :disabled="carregandoDisciplinas"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ carregandoDisciplinas ? 'Adicionando...' : 'Adicionar' }}
            </button>
          </form>
        </div>

        <!-- Mensagens de Erro/Sucesso -->
        <div v-if="mensagemErro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {{ mensagemErro }}
        </div>
        <div v-if="mensagemSucesso" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {{ mensagemSucesso }}
        </div>

        <!-- Tabela de Disciplinas -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div v-if="carregandoDisciplinas" class="p-6 text-center text-gray-600">
            Carregando disciplinas...
          </div>
          <div v-else-if="disciplinas.length === 0" class="p-6 text-center text-gray-600">
            Nenhuma disciplina cadastrada ainda
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Código</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Carga Horária</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Curso</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="disciplina in disciplinas" :key="disciplina.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900">#{{ disciplina.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ disciplina.nome }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ disciplina.codigo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ disciplina.carga_horaria }}h</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ nomeCursoPorId(disciplina.curso_id) }}</td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarDisciplina(disciplina.id)"
                    :disabled="deletandoDisciplina === disciplina.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 text-xs font-medium"
                  >
                    {{ deletandoDisciplina === disciplina.id ? 'Deletando...' : 'Deletar' }}
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

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/index.js';

export default {
  name: 'GestaoAcademica',
  setup() {
    const router = useRouter();
    
    // Estado
    const abaAtiva = ref('cursos');
    const cursos = ref([]);
    const disciplinas = ref([]);
    const carregandoCursos = ref(false);
    const carregandoDisciplinas = ref(false);
    const deletandoCurso = ref(null);
    const deletandoDisciplina = ref(null);
    const mensagemErro = ref('');
    const mensagemSucesso = ref('');

    // Formulários
    const formCurso = ref({
      nome: '',
      codigo: '',
      descricao: ''
    });

    const formDisciplina = ref({
      nome: '',
      codigo: '',
      carga_horaria: 60,
      curso_id: ''
    });

    // Métodos
    const carregarCursos = async () => {
      try {
        carregandoCursos.value = true;
        const response = await api.get('/api/cursos');
        if (response.data.sucesso) {
          cursos.value = response.data.dados;
        }
      } catch (erro) {
        console.error('Erro ao carregar cursos:', erro);
        mensagemErro.value = 'Erro ao carregar cursos';
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        carregandoCursos.value = false;
      }
    };

    const carregarDisciplinas = async () => {
      try {
        carregandoDisciplinas.value = true;
        const response = await api.get('/api/disciplinas');
        if (response.data.sucesso) {
          disciplinas.value = response.data.dados;
        }
      } catch (erro) {
        console.error('Erro ao carregar disciplinas:', erro);
        mensagemErro.value = 'Erro ao carregar disciplinas';
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        carregandoDisciplinas.value = false;
      }
    };

    const criarCurso = async () => {
      try {
        carregandoCursos.value = true;
        const response = await api.post('/api/cursos', {
          nome: formCurso.value.nome,
          codigo: formCurso.value.codigo,
          descricao: formCurso.value.descricao
        });

        if (response.data.sucesso) {
          formCurso.value = { nome: '', codigo: '', descricao: '' };
          await carregarCursos();
          mensagemSucesso.value = 'Curso criado com sucesso!';
          setTimeout(() => (mensagemSucesso.value = ''), 3000);
        }
      } catch (erro) {
        console.error('Erro ao criar curso:', erro);
        if (erro.response?.data?.mensagem) {
          mensagemErro.value = erro.response.data.mensagem;
        } else {
          mensagemErro.value = 'Erro ao criar curso';
        }
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        carregandoCursos.value = false;
      }
    };

    const deletarCurso = async (id) => {
      try {
        deletandoCurso.value = id;
        const response = await api.delete(`/api/cursos/${id}`);

        if (response.data.sucesso) {
          await carregarCursos();
          mensagemSucesso.value = 'Curso deletado com sucesso!';
          setTimeout(() => (mensagemSucesso.value = ''), 3000);
        }
      } catch (erro) {
        console.error('Erro ao deletar curso:', erro);
        mensagemErro.value = 'Erro ao deletar curso';
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        deletandoCurso.value = null;
      }
    };

    const criarDisciplina = async () => {
      try {
        carregandoDisciplinas.value = true;
        const response = await api.post('/api/disciplinas', {
          nome: formDisciplina.value.nome,
          codigo: formDisciplina.value.codigo,
          carga_horaria: formDisciplina.value.carga_horaria,
          curso_id: formDisciplina.value.curso_id
        });

        if (response.data.sucesso) {
          formDisciplina.value = { nome: '', codigo: '', carga_horaria: 60, curso_id: '' };
          await carregarDisciplinas();
          mensagemSucesso.value = 'Disciplina criada com sucesso!';
          setTimeout(() => (mensagemSucesso.value = ''), 3000);
        }
      } catch (erro) {
        console.error('Erro ao criar disciplina:', erro);
        if (erro.response?.data?.mensagem) {
          mensagemErro.value = erro.response.data.mensagem;
        } else {
          mensagemErro.value = 'Erro ao criar disciplina';
        }
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        carregandoDisciplinas.value = false;
      }
    };

    const deletarDisciplina = async (id) => {
      try {
        deletandoDisciplina.value = id;
        const response = await api.delete(`/api/disciplinas/${id}`);

        if (response.data.sucesso) {
          await carregarDisciplinas();
          mensagemSucesso.value = 'Disciplina deletada com sucesso!';
          setTimeout(() => (mensagemSucesso.value = ''), 3000);
        }
      } catch (erro) {
        console.error('Erro ao deletar disciplina:', erro);
        mensagemErro.value = 'Erro ao deletar disciplina';
        setTimeout(() => (mensagemErro.value = ''), 3000);
      } finally {
        deletandoDisciplina.value = null;
      }
    };

    const nomeCursoPorId = (cursoId) => {
      const curso = cursos.value.find(c => c.id === cursoId);
      return curso ? curso.nome : 'Desconhecido';
    };

    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      router.push('/');
    };

    // Lifecycle
    onMounted(() => {
      carregarCursos();
      carregarDisciplinas();
    });

    return {
      abaAtiva,
      cursos,
      disciplinas,
      carregandoCursos,
      carregandoDisciplinas,
      deletandoCurso,
      deletandoDisciplina,
      mensagemErro,
      mensagemSucesso,
      formCurso,
      formDisciplina,
      criarCurso,
      deletarCurso,
      criarDisciplina,
      deletarDisciplina,
      nomeCursoPorId,
      logout
    };
  }
};
</script>

<style scoped>
/* Adicionar animações de transição suave */
.transition-colors {
  transition: background-color 0.2s ease;
}
</style>
