# QA_GUIDE.md - Roteiro de Testes Manuais

## Objetivo

Validar as regras de negócio e a experiência do usuário (UX) da plataforma Visão Escolar. Este documento serve como referência para testadores manuais durante o desenvolvimento e manutenção do sistema.

---

## Personas

### Persona 1: Professora Ana
- **Rol**: Professor(a)
- **Acesso**: Dashboard, visualização de notas e frequência dos alunos, atualização de notas por disciplina
- **Permissões**: Leitura e escrita em notas/frequência das próprias disciplinas

### Persona 2: Coordenador Carlos
- **Rol**: Coordenador(a) Pedagógico(a)
- **Acesso**: Dashboard administrativo, visualização global de todas as turmas, relatórios de desempenho
- **Permissões**: Leitura de todos os dados + gerenciamento de usuários e cadastros

---

## Roteiro de Teste - Módulo Autenticação (ATUAL)

### Cenário 1: Criar Conta como Professor
**Pré-requisito**: Acessar a página de login

**Passos**:
1. Clicar em "Solicitar cadastro"
2. Preencher "Nome Completo" com "Ana Souza"
3. Preencher "E-mail Institucional" com "ana.souza@escola.com"
4. Selecionar "Professor(a)" no campo "Eu sou:"
5. Preencher "Defina uma Senha" com "senha123"
6. Clicar em "Finalizar Cadastro"

**Resultado Esperado**:
- Mensagem de sucesso: "Cadastro realizado! Faça login."
- Retorno à tela de login
- Campos devem estar vazios novamente

**Validações Adicionais**:
- Tentar enviar o formulário sem preencher um campo obrigatório (validar mensagem de erro do navegador)
- E-mail duplicado deve retornar erro: "Erro ao cadastrar. Tente outro e-mail."

---

### Cenário 2: Criar Conta como Coordenador
**Pré-requisito**: Acessar a página de login

**Passos**:
1. Clicar em "Solicitar cadastro"
2. Preencher "Nome Completo" com "Carlos Oliveira"
3. Preencher "E-mail Institucional" com "carlos.oliveira@escola.com"
4. Selecionar "Coordenador(a) Pedagógico(a)" no campo "Eu sou:"
5. Preencher "Defina uma Senha" com "senha456"
6. Clicar em "Finalizar Cadastro"

**Resultado Esperado**:
- Mensagem de sucesso: "Cadastro realizado! Faça login."
- Retorno à tela de login

---

### Cenário 3: Login com Credenciais Válidas
**Pré-requisito**: Contar com Professor Ana ou Coordenador Carlos já cadastrado

**Passos**:
1. Na tela de login, preencher "E-mail" com "ana.souza@escola.com"
2. Preencher "Senha" com "senha123"
3. Clicar em "Entrar no Sistema"

**Resultado Esperado**:
- Redirect para "/dashboard"
- Token armazenado em localStorage
- Página de dashboard carrega com sucesso

---

### Cenário 4: Login com Credenciais Inválidas
**Pré-requisito**: Estar na tela de login

**Passos Variante A (E-mail inexistente)**:
1. Preencher "E-mail" com "usuario_inexistente@escola.com"
2. Preencher "Senha" com "qualquer_senha"
3. Clicar em "Entrar no Sistema"

**Passos Variante B (Senha errada)**:
1. Preencher "E-mail" com "ana.souza@escola.com"
2. Preencher "Senha" com "senha_errada"
3. Clicar em "Entrar no Sistema"

**Resultado Esperado** (ambas variantes):
- Mensagem de erro: "E-mail ou senha incorretos."
- Manutenção na tela de login
- Token NÃO é armazenado em localStorage

---

## Regras de Ouro (Business Rules)

### Notas
- **Intervalo válido**: 0.0 a 10.0 (máximo 2 casas decimais)
- **Aprovação**: Nota ≥ 6.0
- **Recuperação**: Alunos com nota < 6.0 têm direito a prova de recuperação
- **Validação**: Apenas professor(a) responsável pela disciplina pode lançar notas

### Frequência
- **Intervalo válido**: 0% a 100% (registrado por aula)
- **Mínimo obrigatório**: 75% de presença para aprovação
- **Abono**: Faltas abonadas não contam contra a frequência total
- **Reporte**: Coordenador(a) pode visualizar alunos com frequência < 75%

### Matrícula
- **Contexto**: Um aluno pode estar matriculado em múltiplas turmas ao longo dos anos
- **Status possível**: matriculado, evadido, aprovado, reprovado
- **Histórico**: Cada matrícula possui data_matricula e status_aluno

---

## Como Reportar um Bug

### Modelo de Bug Report

```
## Título do Bug
[Resumo breve e descritivo do problema]

### Severidade
[ ] Crítica (sistema não funciona) [ ] Alta (recurso quebrado) [ ] Média (recurso com defeito) [ ] Baixa (ux/estética)

### Passos para Reproduzir
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

### Resultado Esperado
[Descrever o comportamento esperado]

### Resultado Obtido
[Descrever o comportamento atual/problema]

### Screenshots/Vídeos
[Anexar evidências]

### Ambiente
- Navegador: [ex: Chrome 120]
- Versão do Projeto: [ex: v0.1.0]
- Persona Testada: [Professor / Coordenador]

### Notas Adicionais
[Contexto adicional se necessário]
```

---

## Checklist de Testes Recomendados

### Autenticação
- [ ] Cadastro como Professor com todos os campos preenchidos
- [ ] Cadastro como Coordenador com todos os campos preenchidos
- [ ] Validação de campos obrigatórios
- [ ] Validação de e-mail duplicado
- [ ] Login com credenciais válidas
- [ ] Login com e-mail inexistente
- [ ] Login com senha incorreta
- [ ] Verificar se token é armazenado após login bem-sucedido

### UX / Responsividade
- [ ] Testar em desktop (1920x1080)
- [ ] Testar em tablet (768x1024)
- [ ] Testar em mobile (375x667)
- [ ] Validar transições entre login e cadastro
- [ ] Validar feedback visual de carregamento

---

## ATUALIZAÇÃO PARA O QA_GUIDE.md
### Roteiro de Teste - Dashboard
- Verificar se o nome do usuário logado aparece na tela do Dashboard após login.
- Verificar se os gráficos de Desempenho por Disciplina e Frequência são exibidos corretamente e não apresentam erro de carregamento.
- Testar o botão de Logout e confirmar que, após sair, o usuário é redirecionado para a tela de login e não consegue acessar /dashboard sem autenticação.

---

## Status do Documento
- **Versão**: 1.0
- **Última Atualização**: 14 de maio de 2026
- **Módulos Cobertos**: Autenticação
- **Próximos Módulos**: Dashboard, Notas, Frequência, Relatórios
