import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Mistery<span>Trip</span></h3>
          <p>Viajes sorpresa hechos a tu medida. Tú pones el presupuesto, nosotros el destino.</p>
        </div>
        <div>
          <h4>Explora</h4>
          <Link to="/">Inicio</Link>
          <Link to="/paquetes">Paquetes</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div>
          <h4>¿Listo?</h4>
          <Link to="/contacto" className="footer-btn">Cuéntanos tu viaje ideal</Link>
        </div>
      </div>
      <p className="footer-copy">© 2026 MisteryTrip. La aventura empieza antes de saber el destino.</p>
    </footer>
  )
}