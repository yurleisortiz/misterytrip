const mongoose = require('mongoose')

// Estructura de un paquete en la base de datos
const paqueteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  dias: { type: Number, required: true },
  precio: { type: Number, required: true },
  incluye: [String],
  img: String,
})

module.exports = mongoose.model('Paquete', paqueteSchema)
