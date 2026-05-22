<template>
  <div class="flex min-h-screen bg-slate-100">
    <!-- Sidebar Lateral -->
    <aside
      class="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-6 md:block"
    >
      <div class="mb-10">
        <p
          class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700"
        >
          Visão Escolar
        </p>
        <h2 class="mt-4 text-2xl font-bold text-slate-900">
          Painel de Controle
        </h2>
      </div>

      <nav class="space-y-3">
        <RouterLink
          to="/gestao-academica"
          class="w-full block text-center rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          Gestão Acadêmica
        </RouterLink>
        <button
          @click="logout"
          class="w-full rounded-2xl border border-slate-200 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Sair
        </button>
      </nav>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="flex-1 p-6 md:p-10 overflow-y-auto">
      <!-- Header -->
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8"
      >
        <div>
          <p
            class="text-sm font-medium uppercase tracking-[0.2em] text-slate-500"
          >
            Dashboard
          </p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">
            Bem-vindo, {{ nomeUsuario }}!
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="logout"
            class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Sair do Sistema
          </button>
        </div>
      </div>

      <!-- Cards de Resumo Rápido -->
      <div class="grid gap-4 md:grid-cols-3 mb-8">
        <article
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <p class="text-sm font-medium text-slate-500">Total de Alunos</p>
          <p class="mt-4 text-4xl font-bold text-slate-900">
            {{ totalAlunos }}
          </p>
          <p class="mt-2 text-xs text-slate-400">Alunos matriculados ativos.</p>
        </article>

        <article
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <p class="text-sm font-medium text-slate-500">
            Média Geral da Escola
          </p>
          <p class="mt-4 text-4xl font-bold text-slate-900">{{ mediaGeral }}</p>
          <p class="mt-2 text-xs text-slate-400">
            Baseado em todas as avaliações.
          </p>
        </article>

        <article
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <p class="text-sm font-medium text-slate-500">Alunos em Risco</p>
          <p class="mt-4 text-4xl font-bold text-rose-600">
            {{ alunosEmRisco }}
          </p>
          <p class="mt-2 text-xs text-slate-400">Desempenho abaixo de 6.0.</p>
        </article>
      </div>

      <!-- Estatísticas de Avaliações (Requisito: Min, Max, Média, Mediana) -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">
          Estatísticas de Avaliações
        </h2>
        <div class="grid gap-4 grid-cols-2 md:grid-cols-5">
          <div class="rounded-2xl bg-blue-600 p-4 text-white shadow-md">
            <p class="text-xs opacity-80 uppercase font-bold">Total</p>
            <p class="text-2xl font-bold">{{ estatisticas.total }}</p>
          </div>
          <div class="rounded-2xl bg-red-500 p-4 text-white shadow-md">
            <p class="text-xs opacity-80 uppercase font-bold">Mínima</p>
            <p class="text-2xl font-bold">{{ estatisticas.minima }}</p>
          </div>
          <div class="rounded-2xl bg-green-600 p-4 text-white shadow-md">
            <p class="text-xs opacity-80 uppercase font-bold">Máxima</p>
            <p class="text-2xl font-bold">{{ estatisticas.maxima }}</p>
          </div>
          <div class="rounded-2xl bg-purple-600 p-4 text-white shadow-md">
            <p class="text-xs opacity-80 uppercase font-bold">Média</p>
            <p class="text-2xl font-bold">{{ estatisticas.media }}</p>
          </div>
          <div class="rounded-2xl bg-amber-500 p-4 text-white shadow-md">
            <p class="text-xs opacity-80 uppercase font-bold">Mediana</p>
            <p class="text-2xl font-bold">{{ estatisticas.mediana }}</p>
          </div>
        </div>
      </div>

      <!-- Seção de Gráficos -->
      <div class="grid gap-6 lg:grid-cols-2 mb-8">
        <section
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <h2 class="text-lg font-semibold text-slate-900">
            Desempenho por Disciplina
          </h2>
          <div
            class="mt-4 h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400"
          >
            [Gráfico de Barras aqui]
          </div>
        </section>

        <section
          class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <h2 class="text-lg font-semibold text-slate-900">Frequência</h2>
          <div
            class="mt-4 h-64 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400"
          >
            [Gráfico de Pizza aqui]
          </div>
        </section>
      </div>

      <!-- Tabela de Alunos -->
      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 class="text-xl font-semibold text-slate-900 mb-4">
          Lista de Alunos
        </h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead>
              <tr class="text-left text-sm font-semibold text-slate-600">
                <th class="pb-3">Aluno</th>
                <th class="pb-3">Matrícula</th>
                <th class="pb-3">Turma</th>
                <th class="pb-3 text-right">Média</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr
                v-for="aluno in alunos"
                :key="aluno.id"
                class="hover:bg-slate-50"
              >
                <td class="py-3">{{ aluno.nome }}</td>
                <td class="py-3">{{ aluno.matricula }}</td>
                <td class="py-3">{{ aluno.turma }}</td>
                <td
                  class="py-3 text-right font-bold"
                  :class="aluno.media < 6 ? 'text-red-500' : 'text-slate-900'"
                >
                  {{ aluno.media.toFixed(1) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Mensagem de Erro -->
      <div
        v-if="errorMessage"
        class="mt-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200"
      >
        {{ errorMessage }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../api/index.js";

const router = useRouter();
const nomeUsuario = ref("Usuário");
const alunos = ref([]);
const estatisticas = ref({
  total: 0,
  minima: 0,
  maxima: 0,
  media: 0,
  mediana: 0,
});
const errorMessage = ref("");

const totalAlunos = computed(() => alunos.value.length);
const mediaGeral = computed(() => {
  if (!alunos.value.length) return "0.0";
  const sum = alunos.value.reduce((acc, aluno) => acc + Number(aluno.media), 0);
  return (sum / alunos.value.length).toFixed(1);
});
const alunosEmRisco = computed(
  () => alunos.value.filter((aluno) => Number(aluno.media) < 6).length,
);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/");
};

const loadDashboard = async () => {
  try {
    // 1. Carregar alunos e dados gerais
    const resStats = await api.get("/dashboard-stats");
    alunos.value = resStats.data.alunos || [];

    // 2. Carregar estatísticas matemáticas (Mín, Máx, Mediana)
    const resMath = await api.get("/api/dashboard/estatisticas");
    if (resMath.data.sucesso) {
      estatisticas.value = resMath.data.dados;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = "Erro ao conectar com o servidor.";
    if (error.response?.status === 401) logout();
  }
};

onMounted(() => {
  loadDashboard();
});
</script>
