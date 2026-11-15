import { Navigate } from 'react-router-dom'
import { getToken } from '../services/api'

// Si no hay sesión, manda al login
export default function RutaProtegida({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}