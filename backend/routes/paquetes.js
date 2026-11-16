const express = require('express')
const mongoose = require('mongoose')
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

// GET /:id -> público, un solo paquete
router.get('/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ mensaje: 'Paquete no encontrado' })
  }
  try {
    const paquete = await Paquete.findById(req.params.id)
    if (!paquete) return res.status(404).json({ mensaje: 'Paquete no encontrado' })
    res.json(paquete)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el paquete' })
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