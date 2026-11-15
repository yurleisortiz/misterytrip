import { useState, useEffect } from 'react'
import { API_URL } from '../services/api'
import TarjetaPaquete from '../components/TarjetaPaquete'
import './Paquetes.css'

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [presupuesto, setPresupuesto] = useState('todos')
  const [dias, setDias] = useState('todos')

  // Pide los paquetes al backend al abrir la página
  useEffect(() => {
    fetch(`${API_URL}/api/paquetes`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((datos) => setPaquetes(datos))
      .catch(() => setError('No pudimos cargar los paquetes. Intenta de nuevo.'))
      .finally(() => setCargando(false))
  }, [])

  // Aplica los dos filtros a la lista
  const filtrados = paquetes.filter((p) => {
    const okPrecio = presupuesto === 'todos' || p.precio <= Number(presupuesto)
    const okDias = dias === 'todos' || p.dias === Number(dias)
    return okPrecio && okDias
  })

  return (
    <section className="paquetes">
      <h1>Elige tu paquete</h1>
      <p className="sub">Tú pones el presupuesto, nosotros el destino.</p>

      <div className="filtros">
        <select value={presupuesto} onChange={(e) => setPresupuesto(e.target.value)}>
          <option value="todos">Cualquier presupuesto</option>
          <option value="500000">Hasta $500.000</option>
          <option value="800000">Hasta $800.000</option>
          <option value="1000000">Hasta $1.000.000</option>
          <option value="2000000">Hasta $2.000.000</option>
        </select>

        <select value={dias} onChange={(e) => setDias(e.target.value)}>
          <option value="todos">Cualquier duración</option>
          <option value="2">2 días</option>
          <option value="3">3 días</option>
          <option value="4">4 días</option>
          <option value="5">5 días</option>
        </select>
      </div>

      {cargando && <p className="vacio">Cargando paquetes...</p>}
      {error && <p className="vacio error">{error}</p>}

      {!cargando && !error && filtrados.length === 0 && (
        <p className="vacio">No hay paquetes con esos filtros. Prueba con otros.</p>
      )}

      <div className="grid-paquetes">
        {filtrados.map((p) => (
          <TarjetaPaquete key={p._id} paquete={p} />
        ))}
      </div>
    </section>
  )
}
