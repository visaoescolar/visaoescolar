require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Visão Escolar',
      version: '0.1.0',
      description: 'API para o sistema de gestão escolar Visão Escolar',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.get('/', (req, res) => {
  res.json({ message: 'API Visão Escolar Rodando' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Conexão com o banco validada com sucesso.');
  } catch (error) {
    console.error('Erro ao validar conexão com o banco:', error.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
};

startServer();
