const mongoose = require('mongoose')

// Experiencia enviada por un viajero. Solo se muestra si el admin la aprueba.
const testimonioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, maxlength: 60 },
  viaje: { type: String, trim: true, maxlength: 80 },
  calificacion: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, required: true, trim: true, maxlength: 400 },
  aprobado: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Testimonio', testimonioSchema)