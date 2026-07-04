require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
require('./database'); // Garante que a conexão/sincronização do banco execute ao iniciar o app

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Injeta o hub de rotas no servidor
app.use('/api', routes); // Todas as rotas terão o prefixo '/api' (Ex: http://localhost:3000/api/alunos)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});