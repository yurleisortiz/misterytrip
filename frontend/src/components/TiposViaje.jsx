import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './TiposViaje.css'

const tipos = [
  { emoji: '🏖️', titulo: 'Escapada tropical', texto: 'Mar, arena y atardeceres. Ideal para desconectarte del todo.' },
  { emoji: '🌿', titulo: 'Aventura y naturaleza', texto: 'Senderos, montañas y adrenalina para quienes buscan más.' },
  { emoji: '🏛️', titulo: 'Cultura y ciudad', texto: 'Historia, comida local y calles que cuentan historias.' },
  { emoji: '💕', titulo: 'Viaje en pareja', texto: 'Planes románticos y sorpresas para vivir juntos.' },
]

export default function TiposViaje() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section className="tipos">
      <h2>¿Qué tipo de viajero eres?</h2>
      <p className="tipos-sub">Toca una tarjeta y descubre más.</p>

      <div className="tipos-grid">
        {tipos.map((t, i) => (
          <motion.div
            key={t.titulo}
            className="tipo"
            onClick={() => setAbierta(abierta === i ? null : i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <div className={abierta === i ? 'tipo-int volteada' : 'tipo-int'}>
              <div className="tipo-cara tipo-frente">
                <span>{t.emoji}</span>
                <h3>{t.titulo}</h3>
              </div>
              <div className="tipo-cara tipo-atras">
                <p>{t.texto}</p>
                <Link to="/quiz" onClick={(e) => e.stopPropagation()}>Encontrar mi viaje →</Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}