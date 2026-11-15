import { useState, useRef, useEffect } from 'react'
import { API_URL } from '../services/api'
import './Chatbot.css'

const saludo = {
  rol: 'bot',
  texto: '¡Hola! Soy el asistente de MisteryTrip ✈️ Cuéntame tu presupuesto, cuántos días tienes y qué te gusta, y te armo una pista de tu viaje sorpresa.',
}

export default function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([saludo])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const fin = useRef(null)

  // Baja el scroll al último mensaje
  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  const enviar = async (e) => {
    e.preventDefault()
    if (!texto.trim() || cargando) return

    const nuevos = [...mensajes, { rol: 'user', texto: texto.trim() }]
    setMensajes(nuevos)
    setTexto('')
    setCargando(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: nuevos }),
      })
      const datos = await res.json()
      if (!res.ok) throw new Error(datos.mensaje)
      setMensajes([...nuevos, { rol: 'bot', texto: datos.respuesta }])
    } catch (err) {
      setMensajes([...nuevos, { rol: 'bot', texto: 'Uy, algo falló. Intenta de nuevo en un momento.', error: true }])
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
      <button className="chat-boton" onClick={() => setAbierto(!abierto)} aria-label="Abrir chat">
        {abierto ? '✕' : '💬'}
      </button>

      {abierto && (
        <div className="chat-panel">
          <div className="chat-cabecera">Asistente MisteryTrip</div>

          <div className="chat-mensajes">
            {mensajes.map((m, i) => (
              <p key={i} className={`burbuja ${m.rol} ${m.error ? 'error' : ''}`}>{m.texto}</p>
            ))}
            {cargando && <p className="burbuja bot escribiendo">Escribiendo...</p>}
            <div ref={fin} />
          </div>

          <form className="chat-form" onSubmit={enviar}>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu mensaje..."
              maxLength={300}
            />
            <button type="submit" disabled={cargando}>➤</button>
          </form>
        </div>
      )}
    </>
  )
}