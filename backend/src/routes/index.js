const { Router } = require('express');
const alunoRoutes = require('./alunoRoutes');
const professorRoutes = require('./professorRoutes');
const cursoRoutes = require('./cursoRoutes');
const authRoutes = require('./authRoutes');
const disciplinaRoutes = require('./disciplinaRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const notasFrequenciaRoutes = require('./notasFrequenciaRoutes');
const turmaRoutes = require('./turmaRoutes');
const chamadaRoutes = require('./chamadaRoutes');
const horarioRoutes = require('./horarioRoutes');
const notificacaoRoutes = require('./notificacaoRoutes');

const routes = Router();

// Injeta os prefixos das rotas na aplicação
routes.use(alunoRoutes);
routes.use(professorRoutes);
routes.use(cursoRoutes);
routes.use(authRoutes);
routes.use(disciplinaRoutes);
routes.use(dashboardRoutes);
routes.use(notasFrequenciaRoutes);
routes.use(turmaRoutes);
routes.use(chamadaRoutes);
routes.use(horarioRoutes);
routes.use(notificacaoRoutes);

module.exports = routes;