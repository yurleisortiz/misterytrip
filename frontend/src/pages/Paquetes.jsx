import { useState, useEffect, useRef } from 'react'
import { API_URL } from '../services/api'
import TarjetaPaquete from '../components/TarjetaPaquete'
import './Paquetes.css'

const opciones = [
  { valor: 'recomendados', texto: 'Recomendados' },
  { valor: 'novedades', texto: 'Novedades' },
  { valor: 'menor', texto: 'Precio: menor a mayor' },
  { valor: 'mayor', texto: 'Precio: mayor a menor' },
  { valor: 'dias', texto: 'Duración: más corta' },
]

// Ordena una copia de la lista según la opción elegida
function ordenar(lista, criterio) {
  const copia = [...lista]
  if (criterio === 'recomendados') return copia.sort((a, b) => a._id.localeCompare(b._id))
  if (criterio === 'novedades') return copia.sort((a, b) => b._id.localeCompare(a._id))
  if (criterio === 'menor') return copia.sort((a, b) => a.precio - b.precio)
  if (criterio === 'mayor') return copia.sort((a, b) => b.precio - a.precio)
  return copia.sort((a, b) => a.dias - b.dias)
}

export default function Paquetes() {
  const [paquetes, setPaquetes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [presupuesto, setPresupuesto] = useState('todos')
  const [dias, setDias] = useState('todos')
  const [orden, setOrden] = useState('recomendados')
  const [menu, setMenu] = useState(false)
  const caja = useRef(null)

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

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const fuera = (e) => {
      if (caja.current && !caja.current.contains(e.target)) setMenu(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  // Aplica los filtros y luego el orden
  const filtrados = ordenar(
    paquetes.filter((p) => {
      const okPrecio = presupuesto === 'todos' || p.precio <= Number(presupuesto)
      const okDias = dias === 'todos' || p.dias === Number(dias)
      return okPrecio && okDias
    }),
    orden
  )

  const actual = opciones.find((o) => o.valor === orden)

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

        <div className="ordenar" ref={caja}>
          <button type="button" className="ordenar-boton" onClick={() => setMenu(!menu)}>
            Ordenar: {actual.texto} <span>{menu ? '▴' : '▾'}</span>
          </button>

          {menu && (
            <ul className="ordenar-menu">
              {opciones.map((o) => (
                <li key={o.valor}>
                  <button
                    type="button"
                    onClick={() => {
                      setOrden(o.valor)
                      setMenu(false)
                    }}
                  >
                    <span className="check">{orden === o.valor ? '✓' : ''}</span>
                    {o.texto}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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