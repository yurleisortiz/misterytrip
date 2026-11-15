import { useState } from 'react'
import { motion } from 'framer-motion'
import { API_URL } from '../services/api'
import './Contacto.css'

const vacio = { nombre: '', email: '', presupuesto: '', dias: '', mensaje: '' }

export default function Contacto() {
  const [datos, setDatos] = useState(vacio)
  const [estado, setEstado] = useState('inicial') // inicial | enviando | ok | error
  const [aviso, setAviso] = useState('')

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()

    // Validación en el navegador
    if (!datos.nombre || !datos.email || !datos.mensaje) {
      setEstado('error')
      setAviso('Completa nombre, correo y mensaje.')
      return
    }

    setEstado('enviando')
    try {
      const res = await fetch(`${API_URL}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const resp = await res.json()
      if (!res.ok) throw new Error(resp.mensaje)

      setEstado('ok')
      setAviso('¡Mensaje enviado! Te escribiremos pronto.')
      setDatos(vacio)
    } catch (error) {
      setEstado('error')
      setAviso(error.message || 'No se pudo enviar. Intenta de nuevo.')
    }
  }

  return (
    <section className="contacto">
      <motion.form
        className="contacto-form"
        onSubmit={enviar}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Cuéntanos tu viaje ideal</h1>
        <p className="sub">Escríbenos y armamos tu sorpresa.</p>

        <input name="nombre" placeholder="Tu nombre" value={datos.nombre} onChange={cambiar} />
        <input name="email" type="email" placeholder="Tu correo" value={datos.email} onChange={cambiar} />

        <div className="fila">
          <select name="presupuesto" value={datos.presupuesto} onChange={cambiar}>
            <option value="">Presupuesto</option>
            <option value="Hasta $500.000">Hasta $500.000</option>
            <option value="Hasta $1.000.000">Hasta $1.000.000</option>
            <option value="Más de $1.000.000">Más de $1.000.000</option>
          </select>
          <select name="dias" value={datos.dias} onChange={cambiar}>
            <option value="">Duración</option>
            <option value="2 días">2 días</option>
            <option value="3 días">3 días</option>
            <option value="4 a 5 días">4 a 5 días</option>
          </select>
        </div>

        <textarea name="mensaje" rows="5" placeholder="¿Qué te gusta? ¿Qué quieres vivir?" value={datos.mensaje} onChange={cambiar} />

        <button type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
        </button>

        {aviso && <p className={estado === 'ok' ? 'aviso ok' : 'aviso mal'}>{aviso}</p>}
      </motion.form>
    </section>
  )
}