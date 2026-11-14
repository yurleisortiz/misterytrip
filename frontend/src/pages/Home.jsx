import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-contenido">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Viaja sin saber <br /> a dónde vas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Cuéntanos tu presupuesto, los días que tienes y lo que te gusta.
          Nosotros elegimos el destino y tú lo descubres en el momento indicado.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/paquetes" className="btn-hero">Descubrir mi viaje</Link>
        </motion.div>
      </div>
    </section>
  )
}