const express = require('express')
const Paquete = require('../models/Paquete')
const router = express.Router()

// GET /api/paquetes -> lista todos
router.get('/', async (req, res) => {
  try {
    const paquetes = await Paquete.find().sort({ precio: 1 })
    res.json(paquetes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los paquetes' })
  }
})

module.exports = router
