import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, cerrarSesion } from '../services/api'
import './Admin.css'

const vacio = { nombre: '', tipo: '', dias: '', precio: '', incluye: '', img: '' }

export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('paquetes')
  const [paquetes, setPaquetes] = useState([])
  const [mensajes, setMensajes] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  // Trae paquetes y mensajes. Si el token venció, cierra la sesión
  const cargar = async () => {
    try {
      setPaquetes(await apiFetch('/api/paquetes'))
      setMensajes(await apiFetch('/api/contacto'))
    } catch (err) {
      if (err.message.includes('Sesión') || err.message.includes('autorizado')) return salir()
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  // Crea o edita un paquete según el modo
  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    const cuerpo = {
      nombre: form.nombre,
      tipo: form.tipo,
      img: form.img,
      dias: Number(form.dias),
      precio: Number(form.precio),
      incluye: form.incluye.split(',').map((s) => s.trim()).filter(Boolean),
    }
    try {
      if (editando) {
        await apiFetch(`/api/paquetes/${editando}`, { method: 'PUT', body: JSON.stringify(cuerpo) })
      } else {
        await apiFetch('/api/paquetes', { method: 'POST', body: JSON.stringify(cuerpo) })
      }
      setForm(vacio)
      setEditando(null)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const editar = (p) => {
    setEditando(p._id)
    setForm({
      nombre: p.nombre,
      tipo: p.tipo,
      dias: p.dias,
      precio: p.precio,
      incluye: p.incluye.join(', '),
      img: p.img || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminarPaquete = async (id) => {
    if (!window.confirm('¿Eliminar este paquete?')) return
    try {
      await apiFetch(`/api/paquetes/${id}`, { method: 'DELETE' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminarMensaje = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return
    try {
      await apiFetch(`/api/contacto/${id}`, { method: 'DELETE' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  if (cargando) return <p className="admin-cargando">Cargando panel...</p>

  return (
    <section className="admin">
      <div className="admin-top">
        <h1>Panel de administrador</h1>
        <button className="btn-salir" onClick={salir}>Cerrar sesión</button>
      </div>

      <div className="tabs">
        <button className={tab === 'paquetes' ? 'tab activa' : 'tab'} onClick={() => setTab('paquetes')}>
          Paquetes ({paquetes.length})
        </button>
        <button className={tab === 'mensajes' ? 'tab activa' : 'tab'} onClick={() => setTab('mensajes')}>
          Mensajes ({mensajes.length})
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {tab === 'paquetes' && (
        <>
          <form className="admin-form" onSubmit={guardar}>
            <h2>{editando ? 'Editar paquete' : 'Nuevo paquete'}</h2>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={cambiar} required />
            <input name="tipo" placeholder="Tipo (Playa, Aventura...)" value={form.tipo} onChange={cambiar} required />
            <input name="dias" type="number" placeholder="Días" value={form.dias} onChange={cambiar} required />
            <input name="precio" type="number" placeholder="Precio en COP" value={form.precio} onChange={cambiar} required />
            <input name="incluye" placeholder="Incluye (separado por comas)" value={form.incluye} onChange={cambiar} />
            <input name="img" placeholder="URL de la imagen" value={form.img} onChange={cambiar} />
            <div className="admin-botones">
              <button type="submit">{editando ? 'Guardar cambios' : 'Crear paquete'}</button>
              {editando && (
                <button type="button" className="gris" onClick={() => { setEditando(null); setForm(vacio) }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="tabla">
            {paquetes.map((p) => (
              <div className="fila-admin" key={p._id}>
                <div>
                  <strong>{p.nombre}</strong>
                  <span>{p.tipo} · {p.dias} días · ${p.precio.toLocaleString('es-CO')}</span>
                </div>
                <div className="acciones">
                  <button onClick={() => editar(p)}>Editar</button>
                  <button className="rojo" onClick={() => eliminarPaquete(p._id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'mensajes' && (
        <div className="tabla">
          {mensajes.length === 0 && <p className="admin-cargando">Aún no hay mensajes.</p>}
          {mensajes.map((m) => (
            <div className="fila-admin mensaje" key={m._id}>
              <div>
                <strong>{m.nombre}</strong>
                <span>{m.email} · {new Date(m.fecha).toLocaleDateString('es-CO')}</span>
                {(m.presupuesto || m.dias) && <span>{m.presupuesto} {m.dias}</span>}
                <p>{m.mensaje}</p>
              </div>
              <div className="acciones">
                <button className="rojo" onClick={() => eliminarMensaje(m._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}