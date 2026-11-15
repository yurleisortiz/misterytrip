const express = require('express')
const Paquete = require('../models/Paquete')
const auth = require('../middleware/auth')
const router = express.Router()

// GET -> público, lista todos
router.get('/', async (req, res) => {
  try {
    const paquetes = await Paquete.find().sort({ precio: 1 })
    res.json(paquetes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los paquetes' })
  }
})

// POST -> solo admin, crea un paquete
router.post('/', auth, async (req, res) => {
  try {
    const nuevo = await Paquete.create(req.body)
    res.status(201).json(nuevo)
  } catch (error) {
    res.status(400).json({ mensaje: 'Datos del paquete inválidos' })
  }
})

// PUT -> solo admin, edita un paquete
router.put('/:id', auth, async (req, res) => {
  try {
    const editado = await Paquete.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(editado)
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo editar el paquete' })
  }
})

// DELETE -> solo admin, elimina un paquete
router.delete('/:id', auth, async (req, res) => {
  try {
    await Paquete.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Paquete eliminado' })
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo eliminar el paquete' })
  }
})

module.exports = router