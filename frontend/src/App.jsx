import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import RutaProtegida from './components/RutaProtegida'
import Home from './pages/Home'
import Paquetes from './pages/Paquetes'
import Contacto from './pages/Contacto'
import Quiz from './pages/Quiz'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  const location = useLocation()

  // Barra de progreso del scroll
  const { scrollYProgress } = useScroll()
  const barra = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  // Al cambiar de página, vuelve arriba
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <motion.div className="barra-scroll" style={{ scaleX: barra }} />
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/paquetes" element={<Paquetes />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
      <Chatbot />
    </>
  )
}