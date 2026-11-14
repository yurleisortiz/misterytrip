import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const cerrar = () => setAbierto(false)

  return (
    <header className="navbar">
      <Link to="/" className="logo">Mistery<span>Trip</span></Link>

      <nav className={abierto ? 'links abierto' : 'links'}>
        <Link to="/" onClick={cerrar}>Inicio</Link>
        <Link to="/paquetes" onClick={cerrar}>Paquetes</Link>
        <Link to="/contacto" onClick={cerrar}>Contacto</Link>
      </nav>

      <Link to="/paquetes" className="btn-nav">Reserva ya</Link>
      <button className="burger" onClick={() => setAbierto(!abierto)} aria-label="Menú">☰</button>
    </header>
  )
}