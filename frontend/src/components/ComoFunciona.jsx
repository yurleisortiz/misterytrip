import { motion } from 'framer-motion'
import './ComoFunciona.css'

const pasos = [
  { num: '01', titulo: 'Cuéntanos tu plan', texto: 'Elige tu presupuesto, los días que tienes y lo que te gusta.' },
  { num: '02', titulo: 'Nosotros elegimos', texto: 'Diseñamos un viaje sorpresa hecho a tu medida.' },
  { num: '03', titulo: 'Descúbrelo a tiempo', texto: 'Tu destino se revela en el momento indicado.' },
]

export default function ComoFunciona() {
  return (
    <section className="como">
      <h2>¿Cómo funciona?</h2>
      <div className="como-grid">
        {pasos.map((p, i) => (
          <motion.div
            key={p.num}
            className="como-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <span>{p.num}</span>
            <h3>{p.titulo}</h3>
            <p>{p.texto}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}