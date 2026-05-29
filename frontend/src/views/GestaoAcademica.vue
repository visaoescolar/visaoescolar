<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Corrigido com Botão Voltar -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <!-- Botão Voltar -->
          <button
            @click="router.push('/dashboard')"
            class="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            title="Voltar ao Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestão Acadêmica</h1>
            <p class="text-gray-600 mt-1">Gerenciar cursos e disciplinas</p>
          </div>
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
              : 'border-transparent text-gray-600 hover:text-gray-900',
          ]"
        >
          Cursos
        </button>
        <button
          @click="abaAtiva = 'disciplinas'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'disciplinas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900',
          ]"
        >
          Disciplinas
        </button>
      </div>

      <!-- Aba Cursos -->
      <div v-if="abaAtiva === 'cursos'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Adicionar Novo Curso
          </h2>
          <form
            @submit.prevent="criarCurso"
            class="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              v-model="formCurso.nome"
              type="text"
              placeholder="Nome do curso"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formCurso.codigo"
              type="text"
              placeholder="Código"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formCurso.descricao"
              type="text"
              placeholder="Descrição"
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="carregandoCursos"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ carregandoCursos ? "Adicionando..." : "Adicionar" }}
            </button>
          </form>
        </div>

        <div
          v-if="mensagemErro"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ mensagemErro }}
        </div>
        <div
          v-if="mensagemSucesso"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg"
        >
          {{ mensagemSucesso }}
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table v-if="cursos.length > 0" class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Nome
                </th>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Código
                </th>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="curso in cursos"
                :key="curso.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ curso.nome }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ curso.codigo }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarCurso(curso.id)"
                    class="text-red-600 hover:underline"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="p-6 text-center text-gray-500">
            Nenhum curso encontrado.
          </div>
        </div>
      </div>

      <!-- Aba Disciplinas -->
      <div v-if="abaAtiva === 'disciplinas'" class="space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Adicionar Nova Disciplina
          </h2>
          <form
            @submit.prevent="criarDisciplina"
            class="grid grid-cols-1 md:grid-cols-5 gap-4"
          >
            <input
              v-model="formDisciplina.nome"
              type="text"
              placeholder="Nome"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model="formDisciplina.codigo"
              type="text"
              placeholder="Código"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              v-model.number="formDisciplina.carga_horaria"
              type="number"
              placeholder="Carga"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              v-model.number="formDisciplina.curso_id"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
              Adicionar
            </button>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table v-if="disciplinas.length > 0" class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Nome
                </th>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Carga
                </th>
                <th
                  class="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="disciplina in disciplinas"
                :key="disciplina.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ disciplina.nome }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ disciplina.carga_horaria }}h
                </td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarDisciplina(disciplina.id)"
                    class="text-red-600 hover:underline"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="p-6 text-center text-gray-500">
            Nenhuma disciplina encontrada.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/index.js";

export default {
  name: "GestaoAcademica",
  setup() {
    const router = useRouter();

    const abaAtiva = ref("cursos");
    const cursos = ref([]);
    const disciplinas = ref([]);
    const carregandoCursos = ref(false);
    const carregandoDisciplinas = ref(false);
    const deletandoCurso = ref(null);
    const deletandoDisciplina = ref(null);
    const mensagemErro = ref("");
    const mensagemSucesso = ref("");

    const formCurso = ref({ nome: "", codigo: "", descricao: "" });
    const formDisciplina = ref({
      nome: "",
      codigo: "",
      carga_horaria: 60,
      curso_id: "",
    });

    // CORREÇÃO: Removido o prefixo "/api" das chamadas para evitar duplicação
    const carregarCursos = async () => {
      try {
        carregandoCursos.value = true;
        const response = await api.get("/cursos");
        if (response.data.sucesso) {
          cursos.value = response.data.dados;
        }
      } catch (erro) {
        mensagemErro.value = "Erro ao carregar cursos";
      } finally {
        carregandoCursos.value = false;
      }
    };

    const carregarDisciplinas = async () => {
      try {
        carregandoDisciplinas.value = true;
        const response = await api.get("/disciplinas");
        if (response.data.sucesso) {
          disciplinas.value = response.data.dados;
        }
      } catch (erro) {
        mensagemErro.value = "Erro ao carregar disciplinas";
      } finally {
        carregandoDisciplinas.value = false;
      }
    };

    const criarCurso = async () => {
      try {
        carregandoCursos.value = true;
        const response = await api.post("/cursos", formCurso.value);
        if (response.data.sucesso) {
          formCurso.value = { nome: "", codigo: "", descricao: "" };
          await carregarCursos();
          mensagemSucesso.value = "Curso criado com sucesso!";
        }
      } catch (erro) {
        mensagemErro.value = "Erro ao criar curso";
      } finally {
        carregandoCursos.value = false;
        setTimeout(() => {
          mensagemErro.value = "";
          mensagemSucesso.value = "";
        }, 3000);
      }
    };

    const deletarCurso = async (id) => {
      try {
        const response = await api.delete(`/cursos/${id}`);
        if (response.data.sucesso) {
          await carregarCursos();
        }
      } catch (erro) {
        mensagemErro.value = "Erro ao deletar";
      }
    };

    const criarDisciplina = async () => {
      try {
        carregandoDisciplinas.value = true;
        const response = await api.post("/disciplinas", formDisciplina.value);
        if (response.data.sucesso) {
          formDisciplina.value = {
            nome: "",
            codigo: "",
            carga_horaria: 60,
            curso_id: "",
          };
          await carregarDisciplinas();
          mensagemSucesso.value = "Disciplina criada!";
        }
      } catch (erro) {
        mensagemErro.value = "Erro ao criar disciplina";
      } finally {
        carregandoDisciplinas.value = false;
        setTimeout(() => {
          mensagemErro.value = "";
          mensagemSucesso.value = "";
        }, 3000);
      }
    };

    const deletarDisciplina = async (id) => {
      try {
        await api.delete(`/disciplinas/${id}`);
        await carregarDisciplinas();
      } catch (erro) {
        mensagemErro.value = "Erro ao deletar";
      }
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      router.push("/");
    };

    onMounted(() => {
      carregarCursos();
      carregarDisciplinas();
    });

    return {
      router, // Adicionado ao return para funcionar no @click do template
      abaAtiva,
      cursos,
      disciplinas,
      carregandoCursos,
      carregandoDisciplinas,
      mensagemErro,
      mensagemSucesso,
      formCurso,
      formDisciplina,
      criarCurso,
      deletarCurso,
      criarDisciplina,
      deletarDisciplina,
      logout,
    };
  },
};
</script>
