require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
// TODO: Remova o comentário abaixo quando integrar com MySQL
// const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Visão Escolar",
      version: "0.1.0",
      description: "API para o sistema de gestão escolar Visão Escolar",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Dados fake para teste (remover quando integrar com banco de dados)
const usuariosFake = [
  {
    email: "ana@escola.com",
    senha: "123",
    nome: "Ana Souza",
    tipo: "professor",
  },
  {
    email: "carlos@escola.com",
    senha: "123",
    nome: "Carlos Mendes",
    tipo: "coordenador",
  },
];

// Dados fictícios para o Dashboard
const alunos = [
  { id: 1, nome: "João Silva", matricula: "2024001", turma: "9º A", media: 7.8 },
  { id: 2, nome: "Maria Santos", matricula: "2024002", turma: "9º A", media: 8.5 },
  { id: 3, nome: "Pedro Costa", matricula: "2024003", turma: "9º B", media: 6.9 },
  { id: 4, nome: "Ana Paula", matricula: "2024004", turma: "9º B", media: 9.2 },
  { id: 5, nome: "Carlos Oliveira", matricula: "2024005", turma: "9º A", media: 7.4 },
  { id: 6, nome: "Fernanda Lima", matricula: "2024006", turma: "9º C", media: 8.1 },
];

const desempenhoGeral = {
  labels: ["Matemática", "Português", "Ciências", "História", "Inglês"],
  datasets: [
    {
      label: "Média por Disciplina",
      data: [7.5, 8.2, 7.9, 8.4, 7.1],
      backgroundColor: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    },
  ],
};

const frequenciaGeral = {
  labels: ["Presença", "Faltas"],
  datasets: [
    {
      data: [92, 8],
      backgroundColor: ["#10b981", "#ef4444"],
    },
  ],
};

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Rota de teste
 *     description: Retorna uma mensagem de teste indicando que a API está rodando
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API Visão Escolar Rodando"
 */
app.get("/", (req, res) => {
  res.json({ message: "API Visão Escolar Rodando" });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica o usuário
 *     description: Valida email e senha e retorna um token se as credenciais forem válidas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ana@escola.com"
 *               senha:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     tipo:
 *                       type: string
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ message: "E-mail e senha são obrigatórios." });
  }

  const usuario = usuariosFake.find(
    (u) => u.email === email && u.senha === senha,
  );

  if (!usuario) {
    return res.status(401).json({ message: "E-mail ou senha incorretos." });
  }

  const { senha: _, ...usuarioSemSenha } = usuario;
  res.status(200).json({
    token: "token-fake-123",
    usuario: usuarioSemSenha,
  });
});

/**
 * @swagger
 * /dashboard-stats:
 *   get:
 *     summary: Obtém estatísticas do dashboard
 *     description: Retorna dados fictícios de alunos, desempenho geral e frequência. Requer token de autenticação.
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de autenticação (Bearer token-fake-123)
 *     responses:
 *       200:
 *         description: Estatísticas do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alunos:
 *                   type: array
 *                 desempenhoGeral:
 *                   type: object
 *                 frequenciaGeral:
 *                   type: object
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.get("/dashboard-stats", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.substring(7);

  if (token !== "token-fake-123") {
    return res.status(401).json({ message: "Token inválido." });
  }

  res.status(200).json({
    alunos,
    desempenhoGeral,
    frequenciaGeral,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Start server (Modo Mock - sem conexão com banco de dados)
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  console.log("Modo: Mock (dados fictícios)");
});
