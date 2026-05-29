<template>
  <!-- Container Principal: Ajustado para centralizar e dar espaço no topo em telas pequenas -->
  <section
    class="min-h-screen w-full flex items-center justify-center bg-blue-600 relative overflow-hidden p-4 sm:p-6"
  >
    <!-- Padrão de fundo: Escondido em telas muito pequenas para limpar o visual -->
    <div
      class="absolute inset-0 opacity-10 pointer-events-none hidden sm:block"
    >
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <pattern
          id="edu-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="50" cy="50" r="2" fill="white" />
          <path d="M20 20l10 10M80 20l-10 10" stroke="white" stroke-width="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#edu-pattern)" />
      </svg>
    </div>

    <!-- Card Principal: Largura total no celular, limitado no PC -->
    <div
      class="relative w-full max-w-[420px] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-6 pt-14 sm:p-8 sm:pt-16 transition-all mt-10 mb-4"
    >
      <!-- Logo Flutuante: Círculo feito via código -->
      <div
        class="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-2 shadow-xl flex items-center justify-center border-4 border-blue-50 overflow-hidden"
      >
        <img
          src="../assets/Logo.png"
          class="w-full h-full object-contain"
          alt="Logo"
        />
      </div>

      <Transition name="fade-slide" mode="out-in">
        <!-- TELA DE LOGIN -->
        <article v-if="!modoCadastro" key="login">
          <header class="text-center mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-blue-700 mb-1">
              Visão Escolar
            </h1>
            <div
              class="w-10 h-1 bg-blue-600 mx-auto rounded-full mb-4 sm:mb-6"
            ></div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Entrar</h2>
            <p class="text-gray-500 text-xs sm:text-sm mt-2 px-2">
              Acompanhe o desempenho acadêmico dos seus alunos.
            </p>
          </header>

          <form class="space-y-4 sm:space-y-5" @submit.prevent="entrar">
            <div>
              <label
                class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase ml-1"
                >E-mail</label
              >
              <div class="relative mt-1">
                <Mail
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
                />
                <input
                  v-model="usuarioLogin"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  class="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base transition-all"
                />
              </div>
            </div>

            <div>
              <label
                class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase ml-1"
                >Senha</label
              >
              <div class="relative mt-1">
                <Lock
                  class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
                />
                <input
                  v-model="senhaLogin"
                  type="password"
                  placeholder="Digite sua senha"
                  required
                  class="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm sm:text-base transition-all"
                />
              </div>
            </div>

            <div
              v-if="mensagemLogin"
              :class="erroLogin ? 'text-red-500' : 'text-green-500'"
              class="text-xs sm:text-sm text-center font-medium"
            >
              {{ mensagemLogin }}
            </div>

            <button
              type="submit"
              :disabled="carregandoLogin"
              class="w-full py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 text-sm sm:text-base"
            >
              {{ carregandoLogin ? "Autenticando..." : "Entrar no Sistema" }}
            </button>
          </form>

          <footer
            class="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm"
          >
            Ainda não tem acesso?
            <button
              @click="irParaCadastro"
              class="text-blue-600 font-bold hover:underline ml-1"
            >
              Solicitar cadastro
            </button>
          </footer>
        </article>

        <!-- TELA DE CADASTRO (Ajustada para mobile) -->
        <article v-else key="cadastro">
          <header class="text-center mb-6">
            <h1 class="text-2xl font-extrabold text-blue-700">Visão Escolar</h1>
            <h2 class="text-lg font-bold text-gray-800 mt-2">Criar conta</h2>
          </header>

          <form class="space-y-3 sm:space-y-4" @submit.prevent="cadastrar">
            <input
              v-model="nomeCadastro"
              type="text"
              placeholder="Nome Completo"
              required
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />

            <input
              v-model="usuarioCadastro"
              type="email"
              placeholder="E-mail Institucional"
              required
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />

            <select
              v-model="tipoUsuario"
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            >
              <option value="professor">Professor(a)</option>
              <option value="coordenador">Coordenador(a)</option>
            </select>

            <input
              v-model="senhaCadastro"
              type="password"
              placeholder="Defina uma Senha"
              required
              class="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />

            <div v-if="erroCadastro" class="text-red-500 text-xs text-center">
              {{ erroCadastro }}
            </div>

            <button
              type="submit"
              :disabled="carregandoCadastro"
              class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 text-sm"
            >
              {{ carregandoCadastro ? "Processando..." : "Finalizar Cadastro" }}
            </button>
          </form>

          <p class="text-center mt-5 text-gray-500 text-xs">
            Já possui conta?
            <button
              @click="irParaLogin"
              class="text-blue-600 font-bold hover:underline ml-1"
            >
              Voltar ao login
            </button>
          </p>
        </article>
      </Transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock } from "lucide-vue-next"; // Removi o GraduationCap que não estava sendo usado no template
import api from "../api/index.js";

const router = useRouter();

const modoCadastro = ref(false);
const usuarioLogin = ref("");
const senhaLogin = ref("");
const nomeCadastro = ref("");
const usuarioCadastro = ref("");
const senhaCadastro = ref("");
const tipoUsuario = ref("professor");
const erroCadastro = ref("");
const mensagemLogin = ref("");
const erroLogin = ref(false);
const carregandoLogin = ref(false);
const carregandoCadastro = ref(false);

const limparCampos = () => {
  // Limpa campos de Login
  usuarioLogin.value = "";
  senhaLogin.value = "";

  // Limpa campos de Cadastro
  nomeCadastro.value = "";
  usuarioCadastro.value = "";
  senhaCadastro.value = "";
  tipoUsuario.value = "professor"; // Volta ao padrão

  // Limpa mensagens de erro
  erroCadastro.value = "";
  mensagemLogin.value = "";
};

const irParaCadastro = () => {
  limparCampos();
  modoCadastro.value = true;
};
const irParaLogin = () => {
  limparCampos();
  modoCadastro.value = false;
};

async function entrar() {
  mensagemLogin.value = "";
  erroLogin.value = false;
  carregandoLogin.value = true;
  try {
    // CORREÇÃO: A rota agora é /auth/login (assumindo que seu api/index.js já tem o /api)
    const res = await api.post("/auth/login", {
      email: usuarioLogin.value,
      senha: senhaLogin.value,
    });

    // CORREÇÃO: O token agora vem dentro de res.data.dados.token (conforme o AuthService que criamos)
    if (res.data.sucesso) {
      localStorage.setItem("token", res.data.dados.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.dados.usuario));

      mensagemLogin.value = "Login realizado! Redirecionando...";
      setTimeout(() => router.push("/dashboard"), 500);
    }
  } catch (err) {
    mensagemLogin.value =
      err.response?.data?.mensagem || "E-mail ou senha incorretos.";
    erroLogin.value = true;
  } finally {
    carregandoLogin.value = false;
  }
}

async function cadastrar() {
  erroCadastro.value = "";
  carregandoCadastro.value = true;
  try {
    await api.post("/auth/registrar", {
      nome: nomeCadastro.value,
      email: usuarioCadastro.value,
      senha: senhaCadastro.value,
      tipo_usuario: tipoUsuario.value,
    });

    // Limpa os campos antes de voltar para a tela de login
    limparCampos();

    modoCadastro.value = false;
    mensagemLogin.value = "Cadastro realizado! Faça login.";
  } catch (err) {
    erroCadastro.value = err.response?.data?.mensagem || "Erro ao cadastrar.";
  } finally {
    carregandoCadastro.value = false;
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
