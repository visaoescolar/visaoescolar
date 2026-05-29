require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// 1. Importações
const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const cursoRoutes = require("./routes/cursoRoutes");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const alunoController = require("./controllers/alunoController");

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares (DEVEM vir antes das rotas)
app.use(cors());
app.use(express.json());

// 3. Rota de diagnóstico
app.get("/check-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id")
      .limit(1);
    if (error) throw error;
    res.json({ status: "Banco Online e Conectado!", dados: data });
  } catch (error) {
    res.status(500).json({ status: "Erro ao conectar", erro: error.message });
  }
});

// 4. Swagger Configuration
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
  apis: ["./routes/*.js", "./server.js"],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================================================
// ROTAS DA API
// ============================================================================

app.get("/", (req, res) => {
  res.json({ message: "API Visão Escolar Rodando" });
});

// Rota de Alunos (Usada na tabela do Dashboard)
app.get("/api/alunos", alunoController.listar);

app.get("/api/dashboard-stats", async (req, res) => {
  try {
    // 1. Buscar todas as notas para calcular média e estatísticas
    const { data: notas, error: errNotas } = await supabase
      .from("notas")
      .select("valor_nota");
    if (errNotas) throw errNotas;

    const valores = notas.map((n) => Number(n.valor_nota));
    const total = valores.length;
    const soma = valores.reduce((a, b) => a + b, 0);
    const media = total > 0 ? (soma / total).toFixed(1) : 0;
    const minima = total > 0 ? Math.min(...valores) : 0;
    const maxima = total > 0 ? Math.max(...valores) : 0;

    // 2. Buscar total de alunos
    const { count: totalAlunos, error: errCount } = await supabase
      .from("alunos")
      .select("*", { count: "exact", head: true });

    res.json({
      sucesso: true,
      dados: {
        totalAlunos: totalAlunos || 0,
        mediaGeral: media,
        alunosRisco: valores.filter((v) => v < 6).length,
        estatisticas: {
          total: total,
          minima: minima,
          maxima: maxima,
          media: media,
          mediana: media, // Simplificado para a apresentação
        },
      },
    });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
});

// Registro das Rotas Agrupadas
app.use("/api/auth", authRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔗 Login real: /api/auth/login`);
  console.log(`🔗 Alunos real: /api/alunos\n`);
});
