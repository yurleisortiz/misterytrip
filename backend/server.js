require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// Permite que el frontend se conecte y que lleguen datos JSON
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.json({ ok: true, app: 'MisteryTrip API' }))
app.use('/api/paquetes', require('./routes/paquetes'))
app.use('/api/contacto', require('./routes/contacto'))  

const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado')
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`))
  })
  .catch((error) => console.error('Error de conexión:', error.message))