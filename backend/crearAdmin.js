require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Usuario = require('./models/Usuario')

async function crear() {
  await mongoose.connect(process.env.MONGO_URI)
  await Usuario.deleteMany()

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
  await Usuario.create({ email: process.env.ADMIN_EMAIL, password })

  console.log('Admin creado:', process.env.ADMIN_EMAIL)
  process.exit()
}

crear()