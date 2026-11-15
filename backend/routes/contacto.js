const express = require('express')
const Mensaje = require('../models/Mensaje')
const auth = require('../middleware/auth')
const router = express.Router()

// POST -> público, guarda un mensaje nuevo
router.post('/', async (req, res) => {
  const { nombre, email, presupuesto, dias, mensaje } = req.body

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

// GET -> solo admin, lista los mensajes
router.get('/', auth, async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 })
    res.json(mensajes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los mensajes' })
  }
})

// DELETE -> solo admin, elimina un mensaje
router.delete('/:id', auth, async (req, res) => {
  try {
    await Mensaje.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Mensaje eliminado' })
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo eliminar' })
  }
})

module.exports = router