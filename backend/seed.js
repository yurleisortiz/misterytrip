require('dotenv').config()
const mongoose = require('mongoose')
const Paquete = require('./models/Paquete')

const datos = [
  { nombre: 'Sorpresa Express', tipo: 'Playa', dias: 2, precio: 450000, incluye: ['Transporte', 'Hospedaje 1 noche', 'Desayuno'], img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { nombre: 'Aventura Misteriosa', tipo: 'Aventura', dias: 3, precio: 750000, incluye: ['Transporte', 'Hospedaje 2 noches', 'Una actividad guiada'], img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80' },
  { nombre: 'Ruta Cultural', tipo: 'Cultura', dias: 3, precio: 650000, incluye: ['Transporte', 'Hospedaje 2 noches', 'Tour por la ciudad'], img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80' },
  { nombre: 'Escape Natural', tipo: 'Naturaleza', dias: 4, precio: 980000, incluye: ['Transporte', 'Hospedaje 3 noches', 'Comidas incluidas'], img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80' },
  { nombre: 'Gran Misterio', tipo: 'Sorpresa total', dias: 5, precio: 1500000, incluye: ['Transporte', 'Hospedaje 4 noches', 'Comidas', 'Actividades'], img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80' },
]

async function cargar() {
  await mongoose.connect(process.env.MONGO_URI)
  await Paquete.deleteMany()
  await Paquete.insertMany(datos)
  console.log('Paquetes cargados')
  process.exit()
}

cargar()