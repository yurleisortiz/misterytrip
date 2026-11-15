export const API_URL = import.meta.env.VITE_API_URL

// El token del admin se guarda en el navegador
export const getToken = () => localStorage.getItem('token')
export const guardarToken = (t) => localStorage.setItem('token', t)
export const cerrarSesion = () => localStorage.removeItem('token')

// fetch que agrega el token automáticamente
export async function apiFetch(ruta, opciones = {}) {
  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...opciones.headers,
    },
  })
  const datos = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(datos.mensaje || 'Error en la petición')
  return datos
}