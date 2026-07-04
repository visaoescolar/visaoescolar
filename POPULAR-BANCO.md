# Como popular o banco de dados — Visão Escolar

Este guia explica como preparar o MySQL, popular o banco com dados de teste e quais credenciais usar para acessar o sistema.

---

## Visão geral

| Etapa | O que faz | Comando |
|-------|-----------|---------|
| Subir o backend | Cria/sincroniza as **15 tabelas** (schema vazio) | `npm run dev` (na raiz) ou `npm run dev` em `backend/` |
| Popular dados de teste | Insere cursos, turmas, alunos, notas etc. | `npm run seed` em `backend/` |

> **Importante:** subir o backend **não** insere dados de teste. Isso só acontece ao rodar o seed (ou ao cadastrar usuários manualmente).

---

## Pré-requisitos

1. **Node.js 18+** instalado.
2. **MySQL** rodando localmente (porta padrão `3306`).
3. **Banco vazio criado** no MySQL:

```sql
CREATE DATABASE visaoescolar;
```

4. **Arquivo `backend/.env`** configurado com as credenciais do MySQL:

```env
PORT=3000
JWT_SECRET=<segredo para assinar os tokens>
DB_NAME=visaoescolar
DB_USER=root
DB_PASS=<sua senha do MySQL>
DB_HOST=localhost
DB_PORT=3306
```

5. Dependências instaladas (`npm install` na raiz, em `backend/` e em `frontend/`).

---

## Passo a passo para popular o banco

### 1. Criar as tabelas (primeira vez)

Na raiz do projeto:

```bash
npm run dev
```

Aguarde a mensagem de conexão com o MySQL e sincronização das tabelas. Pode encerrar o servidor depois (`Ctrl+C`) ou deixá-lo rodando.

Alternativa — só o backend:

```bash
cd backend
npm run dev
```

### 2. Executar o seed

Em outro terminal:

```bash
cd backend
npm run seed
```

Equivalente direto:

```bash
node src/database/seed.js
```

O script é **idempotente**: pode ser executado mais de uma vez sem duplicar registros (usa `findOrCreate`).

Ao final, o terminal exibe um resumo com as credenciais do professor criado.

### 3. Acessar o sistema

Com backend e frontend rodando (`npm run dev` na raiz):

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api

---

## O que o seed cria

| Item | Detalhe |
|------|---------|
| Curso | Ensino Médio (sigla EM) |
| Disciplina | Matemática (MAT100) |
| Turmas | 1º Ano A e 1º Ano B |
| Professor | Um professor vinculado às **duas** turmas |
| Alunos | 40 no total (20 por turma) |
| Notas e frequência | Lançadas nos **4 bimestres** do ano letivo atual |
| Semestre / período | 1º Semestre (ano atual) · Matutino |

---

## Credenciais de acesso

### Banco de dados (MySQL)

Use os valores definidos em `backend/.env`:

| Campo | Variável | Exemplo |
|-------|----------|---------|
| Host | `DB_HOST` | `localhost` |
| Porta | `DB_PORT` | `3306` |
| Banco | `DB_NAME` | `visaoescolar` |
| Usuário | `DB_USER` | `root` |
| Senha | `DB_PASS` | *(a que você configurou)* |

---

### Aplicação web — Professor (criado pelo seed)

| Campo | Valor |
|-------|-------|
| **E-mail (login)** | `prof.duasturmas@escola.com` |
| **Senha** | `senha123` |
| **Papel** | Professor |
| **Nome** | Professor(a) Seed |

Esse usuário enxerga as turmas **1º Ano A** e **1º Ano B** (Matemática) no Dashboard, Visão Professor e Notas/Frequência.

---

### Aplicação web — Coordenador(a) pedagógico(a)

O seed **não** cria coordenador. Cadastre manualmente:

1. Acesse http://localhost:5173
2. Clique em **Solicitar cadastro**
3. Preencha nome, e-mail, senha
4. Selecione **Coordenador(a) Pedagógico(a)**

Qualquer coordenador cadastrado vê **todos** os dados da instituição, incluindo turmas e alunos do seed, além de poder usar **Gestão Acadêmica** (cursos, disciplinas, turmas, professores).

**Exemplo de cadastro via API** (`POST /api/auth/registrar`):

```json
{
  "nome": "Maria Coordenadora",
  "email": "coord@escola.com",
  "senha": "minhasenha123",
  "tipo_usuario": "coordenador"
}
```

---

### Alunos (somente no banco — sem login na aplicação)

O seed cria usuários de aluno no banco, mas **não há tela de login para alunos** no frontend. Eles existem como registros gerenciados pelo coordenador (listagem, notas, frequência).

Padrão de login/senha gerados (referência, se consultar o banco diretamente):

| Turma | E-mail (padrão) | Senha |
|-------|-----------------|-------|
| 1º Ano A | `aluno.a01@escola.com` … `aluno.a20@escola.com` | `123456` |
| 1º Ano B | `aluno.b01@escola.com` … `aluno.b20@escola.com` | `123456` |

Matrículas seguem o padrão `{ANO}A01` … `{ANO}A20` e `{ANO}B01` … `{ANO}B20` (ex.: `20261A01`).

---

## Popular sem o seed (manual)

Se preferir não usar o script de seed:

1. Suba o backend (tabelas criadas automaticamente).
2. Na tela de login, use **Solicitar cadastro** para criar um **professor** ou **coordenador**.
3. Como coordenador, use **Gestão Acadêmica** para cadastrar cursos, disciplinas, turmas e professores.
4. Em **Alunos**, cadastre os alunos e lance notas/frequência em **Notas/Frequência**.

Não existe usuário obrigatório pré-cadastrado fora do seed.

---

## Solução de problemas

| Problema | Possível causa | O que fazer |
|----------|----------------|-------------|
| Erro de conexão ao rodar o seed | Tabelas ainda não existem | Rode o backend pelo menos uma vez antes do seed |
| `Access denied` no MySQL | `.env` incorreto | Confira `DB_USER`, `DB_PASS`, `DB_HOST` e se o banco `DB_NAME` existe |
| Seed “não duplica” mas dados parecem iguais | Comportamento esperado | O script reutiliza registros existentes com os mesmos identificadores |
| Login do professor falha | E-mail ou senha errados | Use exatamente `prof.duasturmas@escola.com` / `senha123` |

---

## Referência rápida de comandos

```bash
# Criar tabelas + subir API e frontend
npm run dev

# Popular banco (dentro de backend/)
cd backend
npm run seed
```

Script fonte: `backend/src/database/seed.js`
