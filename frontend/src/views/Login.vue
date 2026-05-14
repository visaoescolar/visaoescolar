<template>
  <section class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-1 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-pulse">
      <div class="bg-white rounded-lg shadow-lg">
        <Transition
          enter-active-class="transition-all duration-300 ease-in-out"
          leave-active-class="transition-all duration-300 ease-in-out"
          enter-from-class="opacity-0 transform translate-x-4"
          leave-to-class="opacity-0 transform -translate-x-4"
          mode="out-in"
        >
          <!-- TELA DE LOGIN -->
          <article v-if="!modoCadastro" key="login" class="p-8" aria-label="Tela de login">
            <header class="text-center mb-8">
              <span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">Visão Escolar</span>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">Entrar</h1>
              <p class="text-gray-600">Acompanhe o desempenho acadêmico dos seus alunos.</p>
            </header>

            <form class="space-y-6" @submit.prevent="entrar">
              <div>
                <label for="usuario-login" class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input
                  id="usuario-login"
                  v-model="usuarioLogin"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label for="senha-login" class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <input
                  id="senha-login"
                  v-model="senhaLogin"
                  type="password"
                  placeholder="Digite sua senha"
                  required
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div v-if="mensagemLogin" class="p-3 rounded-lg" :class="erroLogin ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'">
                <p class="text-sm font-medium">{{ mensagemLogin }}</p>
              </div>

              <button
                type="submit"
                class="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="carregandoLogin"
              >
                {{ carregandoLogin ? 'Autenticando...' : 'Entrar no Sistema' }}
              </button>
            </form>

            <p class="text-center mt-6 text-gray-600">
              Ainda não tem acesso?
              <button type="button" class="text-blue-600 hover:text-blue-800 font-medium ml-1" @click="irParaCadastro">Solicitar cadastro</button>
            </p>
          </article>

          <!-- TELA DE CADASTRO -->
          <article v-else key="cadastro" class="p-8" aria-label="Cadastro de usuario">
            <header class="text-center mb-8">
              <span class="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">Visão Escolar</span>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">Criar conta</h1>
              <p class="text-gray-600">Preencha os dados para acessar a plataforma pedagógica.</p>
            </header>

            <form class="space-y-6" @submit.prevent="cadastrar">
              <div>
                <label for="nome-cadastro" class="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  id="nome-cadastro"
                  v-model="nomeCadastro"
                  type="text"
                  placeholder="Ex: Ana Souza"
                  required
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label for="usuario-cadastro" class="block text-sm font-medium text-gray-700 mb-2">E-mail Institucional</label>
                <input
                  id="usuario-cadastro"
                  v-model="usuarioCadastro"
                  type="email"
                  placeholder="ana.souza@escola.com"
                  required
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label for="tipo-usuario" class="block text-sm font-medium text-gray-700 mb-2">Eu sou:</label>
                <select
                  id="tipo-usuario"
                  v-model="tipoUsuario"
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="professor">Professor(a)</option>
                  <option value="coordenador">Coordenador(a) Pedagógico(a)</option>
                </select>
              </div>

              <div>
                <label for="senha-cadastro" class="block text-sm font-medium text-gray-700 mb-2">Defina uma Senha</label>
                <input
                  id="senha-cadastro"
                  v-model="senhaCadastro"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  class="w-full border border-gray-300 rounded-lg bg-gray-50 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div v-if="erroCadastro" class="text-red-600 text-sm text-center">
                {{ erroCadastro }}
              </div>

              <button
                type="submit"
                class="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="carregandoCadastro"
              >
                {{ carregandoCadastro ? 'Processando...' : 'Finalizar Cadastro' }}
              </button>
            </form>

            <p class="text-center mt-6 text-gray-600">
              Já possui conta?
              <button type="button" class="text-blue-600 hover:text-blue-800 font-medium ml-1" @click="irParaLogin">Voltar ao login</button>
            </p>
          </article>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index.js'

const router = useRouter()

const modoCadastro = ref(false)
const usuarioLogin = ref('')
const senhaLogin = ref('')
const nomeCadastro = ref('')
const usuarioCadastro = ref('')
const senhaCadastro = ref('')
const tipoUsuario = ref('professor')
const erroCadastro = ref('')
const mensagemLogin = ref('')
const erroLogin = ref(false)
const carregandoLogin = ref(false)
const carregandoCadastro = ref(false)

const irParaCadastro = () => { modoCadastro.value = true }
const irParaLogin = () => { modoCadastro.value = false }

async function entrar() {
  mensagemLogin.value = ''
  erroLogin.value = false
  carregandoLogin.value = true
  try {
    const res = await api.post('/login', {
      email: usuarioLogin.value,
      senha: senhaLogin.value
    })
    localStorage.setItem('token', res.data.token)
    mensagemLogin.value = 'Login realizado com sucesso! Redirecionando...'
    erroLogin.value = false
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (err) {
    mensagemLogin.value = err.response?.data?.message || 'E-mail ou senha incorretos.'
    erroLogin.value = true
  } finally {
    carregandoLogin.value = false
  }
}

async function cadastrar() {
  erroCadastro.value = ''
  carregandoCadastro.value = true
  try {
    await api.post('/usuarios', {
      nome: nomeCadastro.value,
      email: usuarioCadastro.value,
      senha: senhaCadastro.value,
      tipo_usuario: tipoUsuario.value
    })
    modoCadastro.value = false
    mensagemLogin.value = 'Cadastro realizado! Faça login.'
  } catch (err) {
    erroCadastro.value = 'Erro ao cadastrar. Tente outro e-mail.'
  } finally {
    carregandoCadastro.value = false
  }
}
</script>