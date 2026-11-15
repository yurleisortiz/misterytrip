const express = require('express')
const Testimonio = require('../models/Testimonio')
const auth = require('../middleware/auth')
const router = express.Router()

// GET -> público, solo las experiencias aprobadas
router.get('/', async (req, res) => {
  try {
    const lista = await Testimonio.find({ aprobado: true }).sort({ fecha: -1 }).limit(12)
    res.json(lista)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las experiencias' })
  }
})

// GET /todos -> solo admin, incluye las pendientes
router.get('/todos', auth, async (req, res) => {
  try {
    res.json(await Testimonio.find().sort({ fecha: -1 }))
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las experiencias' })
  }
})

// POST -> público, queda pendiente hasta que el admin la apruebe
router.post('/', async (req, res) => {
  const { nombre, viaje, calificacion, comentario } = req.body
  const nota = Number(calificacion)

  if (!nombre || !comentario) {
    return res.status(400).json({ mensaje: 'Nombre y comentario son obligatorios' })
  }
  if (!(nota >= 1 && nota <= 5)) {
    return res.status(400).json({ mensaje: 'La calificación debe ser de 1 a 5' })
  }
  if (comentario.length > 400) {
    return res.status(400).json({ mensaje: 'El comentario es muy largo (máximo 400 letras)' })
  }

  try {
    await Testimonio.create({ nombre, viaje, calificacion: nota, comentario })
    res.status(201).json({ mensaje: 'Experiencia enviada' })
  } catch (error) {
    res.status(500).json({ mensaje: 'No se pudo guardar tu experiencia' })
  }
})

// PUT -> solo admin, aprueba o quita una experiencia
router.put('/:id', auth, async (req, res) => {
  try {
    const t = await Testimonio.findByIdAndUpdate(
      req.params.id,
      { aprobado: Boolean(req.body.aprobado) },
      { new: true }
    )
    res.json(t)
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo actualizar' })
  }
})

// DELETE -> solo admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Testimonio.findByIdAndDelete(req.params.id)
    res.json({ mensaje: 'Experiencia eliminada' })
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo eliminar' })
  }
})

module.exports = router