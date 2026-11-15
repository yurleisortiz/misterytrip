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
  const [testimonios, setTestimonios] = useState([])
  const [form, setForm] = useState(vacio)
  const [editando, setEditando] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const salir = () => {
    cerrarSesion()
    navigate('/login')
  }

  // Trae paquetes, mensajes y experiencias. Si el token venció, cierra la sesión
  const cargar = async () => {
    try {
      setPaquetes(await apiFetch('/api/paquetes'))
      setMensajes(await apiFetch('/api/contacto'))
      setTestimonios(await apiFetch('/api/testimonios/todos'))
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

  const eliminar = async (ruta, texto) => {
    if (!window.confirm(texto)) return
    try {
      await apiFetch(ruta, { method: 'DELETE' })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  // Aprueba o quita una experiencia de la página
  const cambiarAprobado = async (id, aprobado) => {
    try {
      await apiFetch(`/api/testimonios/${id}`, { method: 'PUT', body: JSON.stringify({ aprobado }) })
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const pendientes = testimonios.filter((t) => !t.aprobado).length

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
        <button className={tab === 'experiencias' ? 'tab activa' : 'tab'} onClick={() => setTab('experiencias')}>
          Experiencias ({pendientes} pendientes)
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
                  <button className="rojo" onClick={() => eliminar(`/api/paquetes/${p._id}`, '¿Eliminar este paquete?')}>
                    Eliminar
                  </button>
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
                <button className="rojo" onClick={() => eliminar(`/api/contacto/${m._id}`, '¿Eliminar este mensaje?')}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'experiencias' && (
        <div className="tabla">
          {testimonios.length === 0 && <p className="admin-cargando">Aún no hay experiencias.</p>}
          {testimonios.map((t) => (
            <div className="fila-admin mensaje" key={t._id}>
              <div>
                <strong>{t.nombre}</strong>
                <span>
                  {'★'.repeat(t.calificacion)}{'☆'.repeat(5 - t.calificacion)}
                  {t.viaje && ` · ${t.viaje}`} · {new Date(t.fecha).toLocaleDateString('es-CO')}
                </span>
                <span className={t.aprobado ? 'estado-ok' : 'estado-pend'}>
                  {t.aprobado ? 'Publicada' : 'Pendiente'}
                </span>
                <p>{t.comentario}</p>
              </div>
              <div className="acciones">
                {t.aprobado ? (
                  <button className="gris" onClick={() => cambiarAprobado(t._id, false)}>Ocultar</button>
                ) : (
                  <button onClick={() => cambiarAprobado(t._id, true)}>Aprobar</button>
                )}
                <button className="rojo" onClick={() => eliminar(`/api/testimonios/${t._id}`, '¿Eliminar esta experiencia?')}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}