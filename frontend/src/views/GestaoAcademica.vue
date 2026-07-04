<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <!-- Botão Voltar -->
          <RouterLink
            to="/dashboard"
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
          </RouterLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Gestão Acadêmica</h1>
            <p class="text-gray-600 mt-1">Gerenciar cursos, disciplinas, turmas e professores</p>
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
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-graduation-cap"></i>
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
            <i class="fa-solid fa-book-open"></i>
            Disciplinas
          </span>
        </button>
        <button
          @click="abaAtiva = 'turmas'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'turmas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-users-rectangle"></i>
            Turmas
          </span>
        </button>
        <button
          @click="abaAtiva = 'professores'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'professores'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-chalkboard-user"></i>
            Professores
          </span>
        </button>
        <button
          @click="abaAtiva = 'horarios'"
          :class="[
            'px-4 py-3 font-medium border-b-2 transition-colors',
            abaAtiva === 'horarios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          ]"
        >
          <span class="flex items-center gap-2">
            <i class="fa-solid fa-clock"></i>
            Horários
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
            <input
              v-model="formCurso.sigla"
              type="text"
              placeholder="Sigla (ex: DS)"
              required
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

      <!-- Aba Turmas -->
      <div v-if="abaAtiva === 'turmas'" class="space-y-6">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Adicionar Nova Turma</h2>
          <form @submit.prevent="criarTurma" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              v-model="formTurma.descricao"
              type="text"
              placeholder="Ex: 1º Ano A"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="carregandoTurmas"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ carregandoTurmas ? 'Adicionando...' : 'Adicionar' }}
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

        <!-- Tabela de Turmas -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div v-if="carregandoTurmas" class="p-6 text-center text-gray-600">
            Carregando turmas...
          </div>
          <div v-else-if="turmas.length === 0" class="p-6 text-center text-gray-600">
            Nenhuma turma cadastrada ainda
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Descrição</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="turma in turmas" :key="turma.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900">#{{ turma.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ turma.descricao }}</td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarTurma(turma.id)"
                    :disabled="deletandoTurma === turma.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 text-xs font-medium"
                  >
                    {{ deletandoTurma === turma.id ? 'Deletando...' : 'Deletar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Aba Professores -->
      <div v-if="abaAtiva === 'professores'" class="space-y-6">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Cadastrar Novo Professor</h2>
          <p class="text-sm text-gray-500 -mt-3 mb-4">Preencha os campos para registrar o professor e vinculá-lo a um curso e disciplina.</p>

          <form @submit.prevent="salvarProfessor" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                v-model="formProf.nome"
                type="text"
                placeholder="Nome completo"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="formProf.cpf"
                type="text"
                placeholder="CPF"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="formProf.email"
                type="email"
                placeholder="E-mail institucional"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                v-model="formProf.senha"
                type="password"
                placeholder="Senha de acesso"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                v-model="formProf.curso_id"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um curso...</option>
                <option v-for="curso in cursos" :key="curso.id" :value="curso.id">{{ curso.nome }}</option>
              </select>
              <select
                v-model="formProf.disciplina_id"
                required
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma disciplina...</option>
                <option v-for="disc in disciplinasFiltradasProf" :key="disc.id" :value="disc.id">{{ disc.nome }}</option>
              </select>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="cadastrandoProfessor"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ cadastrandoProfessor ? 'Cadastrando...' : 'Cadastrar Professor' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Mensagens de Erro/Sucesso -->
        <div v-if="mensagemErro" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {{ mensagemErro }}
        </div>
        <div v-if="mensagemSucesso" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          {{ mensagemSucesso }}
        </div>

        <!-- Tabela de Professores -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div v-if="carregandoProfessores" class="p-6 text-center text-gray-600">
            Carregando professores...
          </div>
          <div v-else-if="professores.length === 0" class="p-6 text-center text-gray-600">
            Nenhum professor cadastrado ainda
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">E-mail</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Turma / Disciplina</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="professor in professores" :key="professor.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ professor.nome }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ professor.email }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <span v-if="professor.vinculos.length === 0" class="text-gray-400">Sem vínculo</span>
                  <span v-else>{{ professor.vinculos.join(', ') }}</span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <span :class="professor.status === 'Ativo' ? 'text-emerald-600 font-semibold' : 'text-gray-400 font-semibold'">
                    {{ professor.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm">
                  <button
                    v-if="professor.status === 'Ativo'"
                    @click="desligarProfessor(professor.id)"
                    :disabled="desligandoProfessor === professor.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 text-xs font-medium"
                  >
                    {{ desligandoProfessor === professor.id ? 'Desligando...' : 'Desligar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Aba Horários -->
      <div v-if="abaAtiva === 'horarios'" class="space-y-6">
        <!-- Formulário de Criação -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Adicionar Novo Horário</h2>
          <p class="text-sm text-gray-500 -mt-3 mb-4">Define em que dia da semana e horário uma turma/disciplina/professor tem aula. É a partir daqui que os cards de chamada do dia são gerados.</p>

          <form @submit.prevent="criarHorario" class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              v-model.number="formHorario.grade_professor_id"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o vínculo...</option>
              <option v-for="v in vinculos" :key="v.grade_professor_id" :value="v.grade_professor_id">{{ v.label }}</option>
            </select>
            <select
              v-model.number="formHorario.dia_semana"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Dia da semana...</option>
              <option v-for="(dia, idx) in diasSemana" :key="idx" :value="idx">{{ dia }}</option>
            </select>
            <input
              v-model="formHorario.hora_inicio"
              type="time"
              required
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              :disabled="carregandoHorarios"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {{ carregandoHorarios ? 'Adicionando...' : 'Adicionar' }}
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

        <!-- Tabela de Horários -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div v-if="carregandoHorarios" class="p-6 text-center text-gray-600">
            Carregando horários...
          </div>
          <div v-else-if="horarios.length === 0" class="p-6 text-center text-gray-600">
            Nenhum horário cadastrado ainda
          </div>
          <table v-else class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Professor</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Turma</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Disciplina</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dia</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Horário</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horario in horarios" :key="horario.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ horario.professor_nome }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ horario.turma_descricao }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ horario.disciplina_descricao }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ horario.dia_semana_nome }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ horario.hora_inicio }}</td>
                <td class="px-6 py-4 text-sm">
                  <button
                    @click="deletarHorario(horario.id)"
                    :disabled="deletandoHorario === horario.id"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 text-xs font-medium"
                  >
                    {{ deletandoHorario === horario.id ? 'Removendo...' : 'Remover' }}
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
import { ref, computed, onMounted } from 'vue'
import api from '../api/index.js'
import { useAuth } from '../composables/useAuth.js'
import { useConfirm } from '../composables/useConfirm.js'

const { logout } = useAuth()
const { confirmar } = useConfirm()

// Estado
const abaAtiva = ref('cursos')
const cursos = ref([])
const disciplinas = ref([])
const turmas = ref([])
const professores = ref([])
const horarios = ref([])
const vinculos = ref([])
const carregandoCursos = ref(false)
const carregandoDisciplinas = ref(false)
const carregandoTurmas = ref(false)
const carregandoProfessores = ref(false)
const carregandoHorarios = ref(false)
const deletandoCurso = ref(null)
const deletandoDisciplina = ref(null)
const deletandoTurma = ref(null)
const deletandoHorario = ref(null)
const desligandoProfessor = ref(null)
const cadastrandoProfessor = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// Formulários
const formCurso = ref({
  nome: '',
  sigla: '',
  descricao: ''
})

const formDisciplina = ref({
  nome: '',
  codigo: '',
  carga_horaria: 60,
  curso_id: ''
})

const formTurma = ref({
  descricao: ''
})

const formProf = ref({
  nome: '',
  cpf: '',
  email: '',
  senha: '',
  curso_id: '',
  disciplina_id: ''
})

const formHorario = ref({
  grade_professor_id: '',
  dia_semana: '',
  hora_inicio: ''
})

const disciplinasFiltradasProf = computed(() => {
  if (!formProf.value.curso_id) return []
  return disciplinas.value.filter(d => d.curso_id === parseInt(formProf.value.curso_id))
})

// Métodos
const carregarCursos = async () => {
  try {
    carregandoCursos.value = true
    const response = await api.get('/cursos')
    if (response.data.sucesso) {
      cursos.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar cursos:', erro)
    mensagemErro.value = 'Erro ao carregar cursos'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoCursos.value = false
  }
}

const carregarDisciplinas = async () => {
  try {
    carregandoDisciplinas.value = true
    const response = await api.get('/disciplinas')
    if (response.data.sucesso) {
      disciplinas.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar disciplinas:', erro)
    mensagemErro.value = 'Erro ao carregar disciplinas'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoDisciplinas.value = false
  }
}

const criarCurso = async () => {
  try {
    carregandoCursos.value = true
    const response = await api.post('/cursos', {
      descricao: formCurso.value.nome, // O banco chama o nome de 'descricao'
      sigla: formCurso.value.sigla
    })

    if (response.data.sucesso) {
      formCurso.value = { nome: '', codigo: '', descricao: '' }
      await carregarCursos()
      mensagemSucesso.value = 'Curso criado com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao criar curso:', erro)
    if (erro.response?.data?.mensagem) {
      mensagemErro.value = erro.response.data.mensagem
    } else {
      mensagemErro.value = 'Erro ao criar curso'
    }
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoCursos.value = false
  }
}

const deletarCurso = async (id) => {
  const ok = await confirmar({
    titulo: 'Excluir Curso',
    mensagem: 'Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.',
    textoConfirmar: 'Excluir'
  })
  if (!ok) return

  try {
    deletandoCurso.value = id
    const response = await api.delete(`/cursos/${id}`)

    if (response.data.sucesso) {
      await carregarCursos()
      mensagemSucesso.value = 'Curso deletado com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao deletar curso:', erro)
    mensagemErro.value = 'Erro ao deletar curso'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    deletandoCurso.value = null
  }
}

const criarDisciplina = async () => {
  try {
    carregandoDisciplinas.value = true
    const response = await api.post('/disciplinas', {
      nome: formDisciplina.value.nome,
      codigo: formDisciplina.value.codigo,
      carga_horaria: formDisciplina.value.carga_horaria,
      curso_id: formDisciplina.value.curso_id
    })

    if (response.data.sucesso) {
      formDisciplina.value = { nome: '', codigo: '', carga_horaria: 60, curso_id: '' }
      await carregarDisciplinas()
      mensagemSucesso.value = 'Disciplina criada com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao criar disciplina:', erro)
    if (erro.response?.data?.mensagem) {
      mensagemErro.value = erro.response.data.mensagem
    } else {
      mensagemErro.value = 'Erro ao criar disciplina'
    }
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoDisciplinas.value = false
  }
}

const deletarDisciplina = async (id) => {
  const ok = await confirmar({
    titulo: 'Excluir Disciplina',
    mensagem: 'Tem certeza que deseja excluir esta disciplina? Esta ação não pode ser desfeita.',
    textoConfirmar: 'Excluir'
  })
  if (!ok) return

  try {
    deletandoDisciplina.value = id
    const response = await api.delete(`/disciplinas/${id}`)

    if (response.data.sucesso) {
      await carregarDisciplinas()
      mensagemSucesso.value = 'Disciplina deletada com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao deletar disciplina:', erro)
    mensagemErro.value = 'Erro ao deletar disciplina'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    deletandoDisciplina.value = null
  }
}

const nomeCursoPorId = (cursoId) => {
  const curso = cursos.value.find(c => c.id === cursoId)
  return curso ? curso.nome : 'Desconhecido'
}

const carregarTurmas = async () => {
  try {
    carregandoTurmas.value = true
    const response = await api.get('/turmas')
    if (response.data.sucesso) {
      turmas.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar turmas:', erro)
    mensagemErro.value = 'Erro ao carregar turmas'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoTurmas.value = false
  }
}

const criarTurma = async () => {
  try {
    carregandoTurmas.value = true
    const response = await api.post('/turmas', {
      descricao: formTurma.value.descricao
    })

    if (response.data.sucesso) {
      formTurma.value = { descricao: '' }
      await carregarTurmas()
      mensagemSucesso.value = 'Turma criada com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao criar turma:', erro)
    if (erro.response?.data?.erro) {
      mensagemErro.value = erro.response.data.erro
    } else {
      mensagemErro.value = 'Erro ao criar turma'
    }
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoTurmas.value = false
  }
}

const deletarTurma = async (id) => {
  const ok = await confirmar({
    titulo: 'Excluir Turma',
    mensagem: 'Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.',
    textoConfirmar: 'Excluir'
  })
  if (!ok) return

  try {
    deletandoTurma.value = id
    const response = await api.delete(`/turmas/${id}`)

    if (response.data.sucesso) {
      await carregarTurmas()
      mensagemSucesso.value = 'Turma deletada com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao deletar turma:', erro)
    mensagemErro.value = 'Erro ao deletar turma'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    deletandoTurma.value = null
  }
}

const carregarProfessores = async () => {
  try {
    carregandoProfessores.value = true
    const response = await api.get('/professores')
    if (response.data.sucesso) {
      professores.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar professores:', erro)
    mensagemErro.value = 'Erro ao carregar professores'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoProfessores.value = false
  }
}

const salvarProfessor = async () => {
  cadastrandoProfessor.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  try {
    const response = await api.post('/professores', {
      nome: formProf.value.nome,
      cpf: formProf.value.cpf,
      email: formProf.value.email,
      senha: formProf.value.senha,
      curso_id: formProf.value.curso_id,
      disciplina_id: formProf.value.disciplina_id
    })
    if (response.data.sucesso) {
      formProf.value = { nome: '', cpf: '', email: '', senha: '', curso_id: '', disciplina_id: '' }
      await carregarProfessores()
      mensagemSucesso.value = 'Professor cadastrado e vinculado com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 4000)
    }
  } catch (erro) {
    console.error('Erro ao cadastrar professor:', erro)
    mensagemErro.value = erro.response?.data?.erro || erro.response?.data?.mensagem || 'Erro ao cadastrar professor.'
    setTimeout(() => (mensagemErro.value = ''), 4000)
  } finally {
    cadastrandoProfessor.value = false
  }
}

const desligarProfessor = async (id) => {
  const ok = await confirmar({
    titulo: 'Desligar Professor',
    mensagem: 'Deseja realmente desligar este professor? Ele perderá o acesso ao sistema.',
    textoConfirmar: 'Desligar'
  })
  if (!ok) return

  try {
    desligandoProfessor.value = id
    const response = await api.delete(`/professores/${id}`)
    if (response.data.sucesso) {
      await carregarProfessores()
      mensagemSucesso.value = 'Professor desligado com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao desligar professor:', erro)
    mensagemErro.value = 'Erro ao desligar professor'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    desligandoProfessor.value = null
  }
}

const carregarVinculos = async () => {
  try {
    const response = await api.get('/horarios/vinculos')
    if (response.data.sucesso) {
      vinculos.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar vínculos:', erro)
  }
}

const carregarHorarios = async () => {
  try {
    carregandoHorarios.value = true
    const response = await api.get('/horarios')
    if (response.data.sucesso) {
      horarios.value = response.data.dados
    }
  } catch (erro) {
    console.error('Erro ao carregar horários:', erro)
    mensagemErro.value = 'Erro ao carregar horários'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoHorarios.value = false
  }
}

const criarHorario = async () => {
  try {
    carregandoHorarios.value = true
    const response = await api.post('/horarios', {
      grade_professor_id: formHorario.value.grade_professor_id,
      dia_semana: formHorario.value.dia_semana,
      hora_inicio: formHorario.value.hora_inicio
    })

    if (response.data.sucesso) {
      formHorario.value = { grade_professor_id: '', dia_semana: '', hora_inicio: '' }
      await carregarHorarios()
      mensagemSucesso.value = 'Horário cadastrado com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao cadastrar horário:', erro)
    mensagemErro.value = erro.response?.data?.mensagem || 'Erro ao cadastrar horário'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    carregandoHorarios.value = false
  }
}

const deletarHorario = async (id) => {
  const ok = await confirmar({
    titulo: 'Remover Horário',
    mensagem: 'Tem certeza que deseja remover este horário?',
    textoConfirmar: 'Remover'
  })
  if (!ok) return

  try {
    deletandoHorario.value = id
    const response = await api.delete(`/horarios/${id}`)

    if (response.data.sucesso) {
      await carregarHorarios()
      mensagemSucesso.value = 'Horário removido com sucesso!'
      setTimeout(() => (mensagemSucesso.value = ''), 3000)
    }
  } catch (erro) {
    console.error('Erro ao remover horário:', erro)
    mensagemErro.value = 'Erro ao remover horário'
    setTimeout(() => (mensagemErro.value = ''), 3000)
  } finally {
    deletandoHorario.value = null
  }
}

onMounted(() => {
  carregarCursos()
  carregarDisciplinas()
  carregarTurmas()
  carregarProfessores()
  carregarVinculos()
  carregarHorarios()
})
</script>

<style scoped>
.transition-colors {
  transition: background-color 0.2s ease;
}
</style>
