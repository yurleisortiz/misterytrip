const jwt = require('jsonwebtoken')

// Revisa que la petición traiga un token válido
module.exports = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return res.status(401).json({ mensaje: 'No autorizado' })

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ mensaje: 'Sesión inválida o vencida' })
  }
}
