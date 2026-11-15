import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { API_URL } from '../services/api'
import './Testimonios.css'

const vacio = { nombre: '', viaje: '', calificacion: 5, comentario: '' }
const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function Testimonios() {
  const [lista, setLista] = useState([])
  const [i, setI] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState(vacio)
  const [estado, setEstado] = useState('inicial') // inicial | enviando | ok | error
  const [aviso, setAviso] = useState('')

  // Trae las experiencias aprobadas
  useEffect(() => {
    fetch(`${API_URL}/api/testimonios`)
      .then((res) => res.json())
      .then(setLista)
      .catch(() => setLista([]))
      .finally(() => setCargando(false))
  }, [])

  // Cambia de experiencia cada 6 segundos
  useEffect(() => {
    if (lista.length < 2) return
    const timer = setInterval(() => setI((n) => (n + 1) % lista.length), 6000)
    return () => clearInterval(timer)
  }, [lista])

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    if (!datos.nombre.trim() || !datos.comentario.trim()) {
      setEstado('error')
      setAviso('Completa tu nombre y tu experiencia.')
      return
    }

    setEstado('enviando')
    try {
      const res = await fetch(`${API_URL}/api/testimonios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const resp = await res.json()
      if (!res.ok) throw new Error(resp.mensaje)

      setEstado('ok')
      setAviso('¡Gracias! Tu experiencia se publicará cuando la revisemos.')
      setDatos(vacio)
    } catch (err) {
      setEstado('error')
      setAviso(err.message || 'No se pudo enviar. Intenta de nuevo.')
    }
  }

  const actual = lista[i]

  return (
    <section className="testi">
      <h2>Lo que cuentan nuestros viajeros</h2>

      {cargando && <p className="testi-vacio">Cargando experiencias...</p>}

      {!cargando && lista.length === 0 && (
        <p className="testi-vacio">Aún no hay experiencias. ¡Sé la primera persona en contar la tuya!</p>
      )}

      {actual && (
        <div className="testi-caja">
          <AnimatePresence mode="wait">
            <motion.div
              key={actual._id}
              className="testi-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="testi-estrellas">{estrellas(actual.calificacion)}</div>
              <p className="testi-texto">“{actual.comentario}”</p>
              <strong>{actual.nombre}</strong>
              {actual.viaje && <span>{actual.viaje}</span>}
            </motion.div>
          </AnimatePresence>

          <div className="testi-puntos">
            {lista.map((t, n) => (
              <button
                key={t._id}
                className={n === i ? 'punto activo' : 'punto'}
                onClick={() => setI(n)}
                aria-label={`Experiencia ${n + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      <form className="testi-form" onSubmit={enviar}>
        <h3>Cuéntanos tu experiencia</h3>

        <div className="testi-fila">
          <input name="nombre" placeholder="Tu nombre" value={datos.nombre} onChange={cambiar} maxLength={60} />
          <input name="viaje" placeholder="¿Qué viaje hiciste? (opcional)" value={datos.viaje} onChange={cambiar} maxLength={80} />
        </div>

        <div className="testi-nota">
          <span>Tu calificación:</span>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className={n <= datos.calificacion ? 'estrella on' : 'estrella'}
              onClick={() => setDatos({ ...datos, calificacion: n })}
              aria-label={`${n} estrellas`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          name="comentario"
          rows="4"
          placeholder="¿Cómo fue tu viaje sorpresa?"
          value={datos.comentario}
          onChange={cambiar}
          maxLength={400}
        />

        <button type="submit" className="testi-enviar" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando...' : 'Compartir mi experiencia'}
        </button>

        {aviso && <p className={estado === 'ok' ? 'testi-aviso ok' : 'testi-aviso mal'}>{aviso}</p>}
      </form>
    </section>
  )
}