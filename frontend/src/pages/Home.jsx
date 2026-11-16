import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import ComoFunciona from '../components/ComoFunciona'
import TiposViaje from '../components/TiposViaje'
import Experiencias from '../components/Experiencias'
import RevelaPista from '../components/RevelaPista'
import './Home.css'
import Testimonios from '../components/Testimonios'

// Fondos y palabras que rotan juntos cada 5 segundos
const fondos = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1920&q=80',
]
const palabras = ['una playa', 'una montaña', 'una selva', 'una ciudad']

export default function Home() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setI((n) => (n + 1) % fondos.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <section className="hero">
        <AnimatePresence>
          <motion.div
            key={i}
            className="hero-fondo"
            style={{ backgroundImage: `url(${fondos[i]})` }}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        </AnimatePresence>

        <div className="hero-contenido">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Viaja sin saber <br /> a dónde vas
          </motion.h1>

          <motion.p
            className="hero-rota"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Tal vez te espera{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={palabras[i]}
                className="palabra"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                {palabras[i]}
              </motion.span>
            </AnimatePresence>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Cuéntanos tu presupuesto, los días que tienes y lo que te gusta.
            Nosotros elegimos el destino y tú lo descubres en el momento indicado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/paquetes" className="btn-hero">Descubrir mi viaje</Link>
          </motion.div>
        </div>

        <motion.div
          className="scroll-hint"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          ↓
        </motion.div>
      </section>

      <ComoFunciona />
      <TiposViaje />
      <Experiencias />
      <RevelaPista />

      <Testimonios /> 
      <section className="cta-quiz">
        <h2>Tu próxima aventura podría estar a solo un clic de distancia</h2>
        <p>Responde 4 preguntas y descubre el viaje sorpresa que va contigo.</p>
        <Link to="/quiz" className="btn-hero">Hacer el quiz</Link>
      </section>
    </>
  )
}