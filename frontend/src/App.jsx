import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import RutaProtegida from './components/RutaProtegida'
import Home from './pages/Home'
import Paquetes from './pages/Paquetes'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RutaProtegida><Admin /></RutaProtegida>} />
      </Routes>
    </>
  )
} 