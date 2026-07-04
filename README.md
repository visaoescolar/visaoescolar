# Visão Escolar - Sistema de Monitoramento Acadêmico

## Descrição

O Visão Escolar é um sistema de monitoramento acadêmico para professores e coordenadores pedagógicos acompanharem notas e frequência dos alunos. O backend é uma API REST em Node.js/Express com MySQL (via Sequelize) e o frontend é uma SPA em Vue 3.

## Tecnologias

- **Backend**: Node.js, Express, Sequelize, MySQL, JWT (`jsonwebtoken`), `bcryptjs`
- **Frontend**: Vue 3, Vite, Vue Router, Tailwind CSS, Chart.js, Axios
- **Orquestração**: `concurrently` (sobe backend e frontend juntos a partir da raiz)

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Um servidor MySQL acessível localmente (porta padrão 3306), com um banco vazio criado (ex: `CREATE DATABASE visaoescolar;`)

### Passo 1: Instalar dependências

```bash
# na raiz do projeto
npm install

# no backend
cd backend
npm install

# no frontend
cd ../frontend
npm install
```

### Passo 2: Configurar o banco

Edite `backend/.env` com as credenciais do seu MySQL (veja a seção "Variáveis de ambiente" mais abaixo). O `.env` já vem com valores de exemplo prontos para um MySQL local padrão.

### Passo 3: Subir backend + frontend juntos

```bash
# na raiz do projeto
npm run dev
```

Isso roda `concurrently` para subir o backend (`nodemon src/server.js`) e o frontend (`vite`) ao mesmo tempo. Na primeira subida, o Sequelize cria as 15 tabelas automaticamente.

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

Também é possível rodar cada lado separadamente: `npm run dev` dentro de `backend/`, e `npm run dev` dentro de `frontend/`.

### Passo 4 (opcional): popular o banco com dados de teste

```bash
cd backend
npm run seed
```

Isso cria, de forma idempotente (pode rodar de novo sem duplicar):
- 1 curso ("Ensino Médio"), 1 disciplina ("Matemática")
- 2 turmas ("1º Ano A" e "1º Ano B"), vinculadas ao mesmo professor
- 40 alunos (20 por turma), com notas e frequência lançadas nos 4 bimestres

Ao final, o script imprime o login/senha do professor criado. Para testar como coordenador, cadastre uma conta pela tela de login escolhendo "Coordenador(a) Pedagógico(a)" — qualquer coordenador enxerga os dados de todas as turmas, incluindo as do seed.

### Criando contas de teste manualmente

Não existe usuário pré-cadastrado obrigatório: use a tela de login → "Solicitar cadastro" (ou `POST /api/auth/registrar`) para criar um professor ou um coordenador. O cadastro pede `nome`, `email`, `senha` e `tipo_usuario` (`professor` ou `coordenador`).

### Scripts disponíveis

| Onde | Comando | O que faz |
|---|---|---|
| raiz | `npm run dev` | sobe backend + frontend juntos |
| raiz | `npm run backend` | sobe só o backend (via `--prefix`) |
| raiz | `npm run frontend` | sobe só o frontend (via `--prefix`) |
| `backend/` | `npm run dev` | backend com nodemon (reinicia ao salvar) |
| `backend/` | `npm run seed` | popula o banco com dados de teste |
| `frontend/` | `npm run dev` | frontend com hot-reload (Vite) |
| `frontend/` | `npm run build` | build de produção em `frontend/dist` |

---

## Como o Backend funciona

Tudo vive em `backend/src`:

```
backend/src/
  server.js              # entrypoint: carrega .env, monta Express, registra rotas em /api
  middlewares/auth.js     # verificarToken (JWT) e verificarPapel(...papeis) (RBAC)
  routes/                 # um arquivo por recurso, todas montadas sob /api em routes/index.js
  controllers/            # lógica de negócio de cada rota
  services/                # serviços auxiliares (ex: cálculo de estatísticas)
  database/
    database.js           # instância do Sequelize (lê credenciais do .env)
    index.js               # registra as associações entre todos os models e sincroniza o schema
    models/                 # um arquivo por tabela
    seed.js                 # script para popular o banco com dados de teste
```

### Autenticação e autorização

- Login (`POST /api/auth/login`) valida e-mail/senha e devolve um JWT assinado com `{ id, tipo }`, onde `tipo` é `professor` ou `coordenador`.
- Toda rota protegida usa o middleware `verificarToken` (valida o JWT, popula `req.usuario`) e, quando a ação é exclusiva do coordenador, também `verificarPapel('coordenador')` (responde `403` se o papel não bater).
- Não existe sessão de "aluno" no frontend — alunos são apenas registros gerenciados pelo coordenador, sem login próprio na aplicação.

### Papéis e o que cada um pode fazer na API

| Recurso | Professor | Coordenador (pedagoga) |
|---|---|---|
| `GET /alunos`, `/alunos/:id` | ✅ leitura | ✅ leitura |
| `POST/PUT/DELETE /alunos` | ❌ | ✅ |
| `GET /turmas` | ✅ leitura | ✅ leitura |
| `POST/DELETE /turmas` | ❌ | ✅ |
| `GET/POST/DELETE /cursos` | ❌ | ✅ |
| `GET/POST/DELETE /disciplinas` | ❌ | ✅ |
| `GET/POST/PUT/DELETE /professores` | ❌ | ✅ |
| `GET /professores/:usuarioId/turmas` | ✅ (próprias turmas) | ✅ |
| `GET/POST /notas-frequencia` | ✅ | ✅ |
| `GET /professores/boletim-consolidado` | ✅ | ✅ |
| `GET /dashboard-stats` | ✅ (só vê os números das turmas em que leciona) | ✅ (vê a instituição inteira) |

`GET /dashboard-stats` é a mesma rota para os dois papéis, mas o `DashboardController` lê `req.usuario.tipo`: se for `professor`, filtra todas as estatísticas (alunos, médias, frequência, evolução por bimestre) pelas turmas vinculadas a ele via `GradeProfessor`; se for `coordenador`, devolve os números globais.

### Modelo de dados (resumo)

`Usuario` (login) → `Pessoa` (1 pessoa por usuário) → `Aluno` / `Professor` / `Coordenador` (papel da pessoa).
`Curso` → `Disciplina` → `Grade` (combinação curso + turma + disciplina + semestre + período) → `GradeProfessor` (vincula um professor a uma `Grade`) → `Aula` (uma aula por bimestre) → `Avaliacao` (nota) / `Frequencia` (presença), cada uma ligada a uma `Matricula` (aluno numa `Grade`).

### Variáveis de ambiente (`backend/.env`)

```
PORT=3000
JWT_SECRET=<segredo para assinar os tokens>
DB_NAME=visaoescolar
DB_USER=root
DB_PASS=<senha do MySQL>
DB_HOST=localhost
DB_PORT=3306
```

O schema (15 tabelas) é criado/sincronizado automaticamente ao subir o backend (`sequelize.sync({ alter: true })` em `database/index.js`) — não é preciso rodar migrations manualmente, só ter um banco MySQL vazio com o nome configurado em `DB_NAME`.

---

## Como o Frontend funciona

Tudo vive em `frontend/src`:

```
frontend/src/
  main.js                  # bootstrap do Vue + router
  App.vue                  # raiz da aplicação + <ConfirmDialog /> global
  router/index.js           # rotas + guarda de autenticação/papel
  api/index.js               # cliente axios (injeta o Bearer token automaticamente)
  composables/
    useAuth.js               # usuário logado, papel, logout
    useConfirm.js             # diálogo de confirmação global (usado em todo botão de excluir)
  components/
    AppSidebar.vue            # menu lateral compartilhado entre as telas internas
    ConfirmDialog.vue          # modal de confirmação (Cancelar/Confirmar)
  views/
    Login.vue                  # login + cadastro (escolhe papel professor/coordenador)
    Dashboard.vue                # estatísticas (escopo varia por papel, ver acima)
    Alunos.vue                    # listagem (todos) + cadastro/edição/exclusão (só coordenador)
    GestaoAcademica.vue            # exclusiva do coordenador: abas Cursos / Disciplinas / Turmas / Professores
    VisaoProfessor.vue              # boletim consolidado das turmas do professor logado
    NotasFrequencia.vue              # lançamento de notas e frequência por turma/disciplina/bimestre
```

### Autenticação no frontend

- O token e os dados do usuário (`{ nome, email, tipo_usuario }`) ficam em `localStorage` após o login.
- `router/index.js` bloqueia qualquer rota com `meta.requiresAuth` se não houver token (redireciona para `/`), e rotas com `meta.role: 'coordenador'` (hoje só `/gestao-academica`) redirecionam para `/dashboard` se o usuário logado não for coordenador.
- `AppSidebar.vue` também esconde o link "Gestão" do menu quando o usuário não é coordenador — é proteção de UI, mas a proteção que importa de verdade é a do backend (rotas com `verificarPapel`).

### Telas por papel

- **Professor**: Dashboard (só as próprias turmas), Alunos (somente leitura), Visão Professor, Notas/Frequência.
- **Coordenador (pedagoga)**: tudo o que o professor vê + Dashboard global + Alunos com cadastro/edição/exclusão + Gestão Acadêmica (Cursos, Disciplinas, Turmas, Professores).

---

## Guia de Contribuição

1. **Branches**: nunca commitar direto na `main`; crie uma branch por funcionalidade (`git checkout -b feature/nome-da-feature`).
2. **Antes do commit**: confirme que `npm run dev` sobe sem erros e que você não está incluindo `.env`, `node_modules` ou outros arquivos sensíveis.
3. **Padrão de commits**: `feat:`, `fix:`, `docs:`, `style:` (Conventional Commits).
