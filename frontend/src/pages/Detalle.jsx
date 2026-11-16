import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_URL } from '../services/api'
import './Detalle.css'

// Arma el plan por días sin revelar el destino
function armarPlan(dias) {
  return Array.from({ length: dias }, (_, i) => {
    if (i === 0) return 'Llegada y pista de bienvenida'
    if (i === dias - 1) return 'Revelación final y regreso'
    return 'Actividad sorpresa'
  })
}

export default function Detalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paquete, setPaquete] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [fecha, setFecha] = useState('')
  const [personas, setPersonas] = useState(2)

  useEffect(() => {
    fetch(`${API_URL}/api/paquetes/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error('Este paquete no existe.')
        if (!res.ok) throw new Error('No pudimos cargar el paquete. Intenta de nuevo.')
        return res.json()
      })
      .then(setPaquete)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <p className="detalle-estado">Cargando paquete...</p>
  if (error)
    return (
      <div className="detalle-estado">
        <p className="error">{error}</p>
        <Link to="/paquetes">Volver a paquetes</Link>
      </div>
    )

  const total = paquete.precio * personas

  // Lleva al formulario de contacto con el mensaje ya escrito
  const reservar = () => {
    const cuando = fecha ? ` para el ${fecha}` : ''
    navigate('/contacto', {
      state: {
        mensaje: `Quiero reservar "${paquete.nombre}" para ${personas} persona(s)${cuando}.`,
      },
    })
  }

  return (
    <motion.section className="detalle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Link to="/paquetes" className="detalle-volver">← Volver a paquetes</Link>

      <div className="galeria">
        <div className="foto grande"><img src={paquete.img} alt="Destino secreto" /></div>
        <div className="foto"><img src={paquete.img} alt="" style={{ objectPosition: 'left' }} /></div>
        <div className="foto"><img src={paquete.img} alt="" style={{ objectPosition: 'right' }} /></div>
        <span className="candado">🔒 Destino secreto</span>
      </div>

      <div className="detalle-grid">
        <div>
          <span className="etiqueta">{paquete.tipo}</span>
          <h1>{paquete.nombre}</h1>
          <p className="secreto">Se revela en el momento indicado</p>

          <div className="datos">
            <div>🗓️ {paquete.dias} días</div>
            <div>🛏️ {Math.max(paquete.dias - 1, 1)} noches</div>
            <div>🚌 Transporte</div>
          </div>

          <h2>Qué incluye</h2>
          <ul className="incluye">
            {paquete.incluye.map((item) => (
              <li key={item}>✔ {item}</li>
            ))}
          </ul>

          <h2>Tu plan por días</h2>
          <div className="plan">
            {armarPlan(paquete.dias).map((texto, i) => (
              <div key={i}><span>Día {i + 1}</span> · {texto}</div>
            ))}
          </div>
        </div>

        <aside className="reserva">
          <p className="mini">Precio por persona</p>
          <p className="precio-grande">${paquete.precio.toLocaleString('es-CO')} COP</p>

          <label>Fecha del viaje</label>
          <input type="date" value={fecha} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setFecha(e.target.value)} />

          <label>Personas</label>
          <input type="number" min="1" max="10" value={personas} onChange={(e) => setPersonas(Math.min(10, Math.max(1, Number(e.target.value) || 1)))} />

          <p className="total">Total: <strong>${total.toLocaleString('es-CO')} COP</strong></p>
          <button onClick={reservar}>Reservar este viaje</button>
          <p className="mini centro">No revelamos el destino hasta la fecha</p>
        </aside>
      </div>
    </motion.section>
  )
}