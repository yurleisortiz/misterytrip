import { useState } from 'react'
import { motion } from 'framer-motion'
import './Experiencias.css'

const experiencias = [
  {
    nombre: 'Playa',
    texto: 'Mar turquesa, arena blanca y atardeceres que no se olvidan.',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  },
  {
    nombre: 'Aventura',
    texto: 'Montañas, senderos y adrenalina para quienes buscan más.',
    img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=900&q=80',
  },
  {
    nombre: 'Cultura',
    texto: 'Ciudades con historia, comida local y gente por conocer.',
    img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=80',
  },
  {
    nombre: 'Naturaleza',
    texto: 'Selvas, cascadas y paisajes para desconectarte de todo.',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  },
]

export default function Experiencias() {
  const [actual, setActual] = useState(0)
  const exp = experiencias[actual]

  return (
    <section className="exp">
      <h2>Tu próxima experiencia</h2>

      <div className="exp-caja">
        <motion.img
          key={exp.img}
          src={exp.img}
          alt={exp.nombre}
          className="exp-img"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div className="exp-info">
          <h3>{exp.nombre}</h3>
          <p>{exp.texto}</p>
          <div className="exp-miniaturas">
            {experiencias.map((e, i) => (
              <button
                key={e.nombre}
                className={i === actual ? 'mini activa' : 'mini'}
                onClick={() => setActual(i)}
              >
                <img src={e.img} alt={e.nombre} />
                <span>{e.nombre}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
