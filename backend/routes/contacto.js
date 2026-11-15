const express = require('express')
const Mensaje = require('../models/Mensaje')
const router = express.Router()

// POST /api/contacto -> guarda un mensaje nuevo
router.post('/', async (req, res) => {
  const { nombre, email, presupuesto, dias, mensaje } = req.body

  // Validación en el servidor
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ mensaje: 'Nombre, correo y mensaje son obligatorios' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ mensaje: 'El correo no es válido' })
  }

  try {
    await Mensaje.create({ nombre, email, presupuesto, dias, mensaje })
    res.status(201).json({ mensaje: 'Mensaje enviado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'No se pudo guardar el mensaje' })
  }
})

module.exports = router
