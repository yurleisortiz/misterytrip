const mongoose = require('mongoose')

// Mensaje enviado desde el formulario de contacto
const mensajeSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  presupuesto: String,
  dias: String,
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Mensaje', mensajeSchema)