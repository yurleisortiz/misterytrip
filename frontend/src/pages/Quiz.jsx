import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { API_URL } from '../services/api'
import './Quiz.css'

const preguntas = [
  {
    clave: 'tipo',
    titulo: '¿Qué estás buscando?',
    opciones: [
      { texto: '🏖️ Playa y descanso', valor: 'Playa' },
      { texto: '🌿 Aventura y adrenalina', valor: 'Aventura' },
      { texto: '🏛️ Cultura y ciudad', valor: 'Cultura' },
      { texto: '🌳 Naturaleza', valor: 'Naturaleza' },
      { texto: '🎲 Que me sorprendan del todo', valor: 'Sorpresa total' },
    ],
  },
  {
    clave: 'presupuesto',
    titulo: '¿Cuál es tu presupuesto?',
    opciones: [
      { texto: 'Hasta $500.000', valor: 500000 },
      { texto: 'Hasta $800.000', valor: 800000 },
      { texto: 'Hasta $1.000.000', valor: 1000000 },
      { texto: 'Más de $1.000.000', valor: 2000000 },
    ],
  },
  {
    clave: 'dias',
    titulo: '¿Cuántos días tienes?',
    opciones: [
      { texto: '2 días', valor: 2 },
      { texto: '3 días', valor: 3 },
      { texto: '4 días', valor: 4 },
      { texto: '5 días', valor: 5 },
    ],
  },
  {
    clave: 'compania',
    titulo: '¿Con quién viajas?',
    opciones: [
      { texto: '🧍 Solo/a', valor: 'solo' },
      { texto: '💕 En pareja', valor: 'pareja' },
      { texto: '🎉 Con amigos', valor: 'amigos' },
      { texto: '👨‍👩‍👧 En familia', valor: 'familia' },
    ],
  },
]

const perfiles = {
  Playa: 'Buscas desconectarte, escuchar el mar y dejar que el tiempo pase lento.',
  Aventura: 'Buscas adrenalina, caminos nuevos y historias para contar después.',
  Cultura: 'Buscas descubrir lugares con historia, sabores locales y gente por conocer.',
  Naturaleza: 'Buscas aire limpio, paisajes enormes y silencio para recargarte.',
  'Sorpresa total': 'Buscas vivir algo diferente sin planear nada.',
}
const companias = {
  solo: 'Un viaje para ti y tus ideas.',
  pareja: 'Una aventura para compartir en pareja.',
  amigos: 'Una aventura para reír con tu grupo.',
  familia: 'Una experiencia para toda la familia.',
}

// Elige el paquete que mejor se ajusta a las respuestas
function recomendar(paquetes, r) {
  const alcanzan = paquetes.filter((p) => p.precio <= r.presupuesto)
  const lista = alcanzan.length ? alcanzan : [...paquetes].sort((a, b) => a.precio - b.precio).slice(0, 1)
  return lista
    .map((p) => ({
      p,
      puntos: (p.tipo === r.tipo ? 3 : 0) + (p.dias === r.dias ? 2 : 0) + (p.dias <= r.dias ? 1 : 0),
    }))
    .sort((a, b) => b.puntos - a.puntos)[0].p
}

export default function Quiz() {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [paquetes, setPaquetes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/paquetes`)
      .then((res) => res.json())
      .then(setPaquetes)
      .catch(() => setError('No pudimos cargar los paquetes. Intenta de nuevo.'))
  }, [])

  const elegir = (clave, valor) => {
    setRespuestas({ ...respuestas, [clave]: valor })
    setPaso(paso + 1)
  }

  const reiniciar = () => {
    setRespuestas({})
    setPaso(0)
  }

  const terminado = paso >= preguntas.length
  const pregunta = preguntas[paso]
  const recomendado = terminado && paquetes.length ? recomendar(paquetes, respuestas) : null

  return (
    <section className="quiz">
      {!terminado && (
        <>
          <div className="quiz-barra">
            <motion.div animate={{ width: `${(paso / preguntas.length) * 100}%` }} />
          </div>
          <p className="quiz-paso">Pregunta {paso + 1} de {preguntas.length}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={paso}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h1>{pregunta.titulo}</h1>
              <div className="quiz-opciones">
                {pregunta.opciones.map((o) => (
                  <button key={o.texto} onClick={() => elegir(pregunta.clave, o.valor)}>
                    {o.texto}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {terminado && (
        <motion.div className="resultado" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {error && <p className="aviso mal">{error}</p>}
          {!error && !recomendado && <p>Preparando tu aventura...</p>}

          {recomendado && (
            <>
              <h1>✨ Tu aventura ideal está lista</h1>
              <p className="perfil">
                {perfiles[respuestas.tipo]} {companias[respuestas.compania]} Nosotros nos encargamos del misterio.
              </p>

              <ul className="checks">
                <li>Destino: 🔒 Secreto</li>
                <li>Tipo de aventura: ✓ {respuestas.tipo}</li>
                <li>Duración: ✓ {respuestas.dias} días</li>
                <li>Presupuesto: ✓ Seleccionado</li>
              </ul>

              <div className="progreso">
                <motion.div
                  className="progreso-barra"
                  initial={{ width: 0 }}
                  animate={{ width: '80%' }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </div>
              <small>80% · Estamos preparando tu aventura</small>

              <div className="rec-tarjeta">
                <img src={recomendado.img} alt="Destino secreto" />
                <div>
                  <span className="etiqueta">{recomendado.tipo}</span>
                  <h3>{recomendado.nombre}</h3>
                  <p>{recomendado.dias} días · ${recomendado.precio.toLocaleString('es-CO')} COP</p>
                  <p className="secreto">Destino: 🔒 se revela en el momento indicado</p>
                </div>
              </div>

              <div className="quiz-botones">
                <Link to="/contacto" className="btn-hero">Quiero este viaje</Link>
                <button className="gris" onClick={reiniciar}>Repetir quiz</button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </section>
  )
}