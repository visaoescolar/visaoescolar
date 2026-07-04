const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_seguro';

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = { id: payload.id, tipo: payload.tipo };
    return next();
  } catch (error) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado.' });
  }
}

function verificarPapel(...papeisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !papeisPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ sucesso: false, mensagem: 'Você não tem permissão para acessar este recurso.' });
    }
    return next();
  };
}

module.exports = { verificarToken, verificarPapel, JWT_SECRET };
