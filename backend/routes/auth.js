const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const router = express.Router()

// POST /api/auth/login -> devuelve un token si las credenciales son correctas
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ email: (email || '').toLowerCase() })
    const correcto = usuario && (await bcrypt.compare(password || '', usuario.password))

    if (!correcto) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' })
    }

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión' })
  }
})

module.exports = router
