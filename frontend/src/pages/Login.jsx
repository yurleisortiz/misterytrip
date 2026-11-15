import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL, guardarToken } from '../services/api'
import './Contacto.css'

export default function Login() {
  const navigate = useNavigate()
  const [datos, setDatos] = useState({ email: '', password: '' })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cambiar = (e) => setDatos({ ...datos, [e.target.name]: e.target.value })

  const entrar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      })
      const resp = await res.json()
      if (!res.ok) throw new Error(resp.mensaje)

      guardarToken(resp.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <section className="contacto">
      <form className="contacto-form" onSubmit={entrar}>
        <h1>Panel de administrador</h1>
        <input name="email" type="email" placeholder="Correo" value={datos.email} onChange={cambiar} />
        <input name="password" type="password" placeholder="Contraseña" value={datos.password} onChange={cambiar} />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="aviso mal">{error}</p>}
      </form>
    </section>
  )
}