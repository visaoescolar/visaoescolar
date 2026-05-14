# Visão Escolar - Sistema de Monitoramento Acadêmico

## Descrição

O Visão Escolar é um sistema de monitoramento acadêmico desenvolvido para auxiliar professores e coordenadores no acompanhamento das notas e frequência dos alunos. A plataforma oferece uma interface intuitiva para gestão escolar, permitindo o registro e consulta de dados acadêmicos de forma eficiente e organizada.

## Status Atual do Projeto

A arquitetura base do projeto já está configurada e operando de forma simultânea. O backend em Node.js e o frontend em Vue 3 estão integrados e podem ser executados juntos utilizando o Concurrently.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor
- **Express**: Framework web para Node.js
- **Vue 3**: Framework JavaScript progressivo para interfaces de usuário
- **Vite**: Ferramenta de build rápida para projetos Vue
- **Swagger**: Ferramenta para documentação de APIs
- **Concurrently**: Utilitário para executar múltiplos comandos simultaneamente

## Estrutura de Pastas

- **`/backend`**: Contém todo o código do servidor Node.js com Express, incluindo configurações de banco de dados, rotas, controllers, middlewares, services e models
- **`/frontend`**: Contém o código do frontend Vue 3 com Vite, incluindo componentes, views, router, store e assets
- **Raiz**: Arquivos de configuração geral do projeto, como `package.json` para gerenciamento de scripts, `docker-compose.yml` para configuração do banco de dados MySQL, e este `README.md`

## Como Rodar o Projeto

### Passo 1: Instalar dependências

Execute os comandos abaixo para instalar todas as dependências necessárias:

```bash
# Na raiz do projeto
npm install

# No diretório backend
cd backend
npm install

# No diretório frontend
cd ../frontend
npm install
```

### Passo 2: Executar o projeto

```bash
# Na raiz do projeto
npm run dev
```

Este comando iniciará o backend e frontend simultaneamente, permitindo o desenvolvimento integrado.

## Links de Acesso Rápido

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **Documentação Swagger**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Guia de Contribuição

Para manter a estabilidade do projeto, siga estas diretrizes ao realizar alterações:

1. **Trabalhando com Branches**
   - Nunca faça alterações diretamente na branch `main`.
   - Sempre crie uma nova branch para cada funcionalidade ou correção:
     ```bash
     git checkout -b feature/nome-da-sua-feature
     ```

2. **Antes de fazer o Commit**
   - Certifique-se de que `npm run dev` não apresenta erros no terminal.
   - Verifique se você não está incluindo arquivos sensíveis (como `.env`) que deveriam estar no `.gitignore`.
   - Confirme que o código segue o padrão do projeto.

3. **Padrão de Commits**
   - `feat:` para novas funcionalidades.
   - `fix:` para correção de bugs.
   - `docs:` para alterações na documentação.
   - `style:` para mudanças de formatação/visual que não afetam a lógica.

## Nota sobre o Banco de Dados

A integração com o MySQL está em fase de planejamento e será implementada em breve, incluindo a configuração completa do Docker e a criação das tabelas do sistema.

## Sujestão de prompt para finalizar trabalho

Analise as alterações que acabei de fazer no código e me ajude a realizar um commit seguro seguindo estas etapas:
Verifique se há algum erro de sintaxe óbvio.
Verifique se esqueci de adicionar algum arquivo novo ao git add ou se estou tentando enviar arquivos que deveriam ser ignorados (como node_modules ou .env).
Sugira uma mensagem de commit curta e clara seguindo o padrão 'Conventional Commits' (ex: feat: adiciona tela de login).
Se eu estiver na branch 'main', me avise para criar uma branch nova antes de prosseguir.
