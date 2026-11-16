import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './TarjetaPaquete.css'

export default function TarjetaPaquete({ paquete }) {
  const { nombre, tipo, dias, precio, incluye, img } = paquete

  return (
    <motion.article
      className="tarjeta"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <img src={img} alt={nombre} />
      <div className="tarjeta-cuerpo">
        <span className="etiqueta">{tipo}</span>
        <h3>{nombre}</h3>
        <p className="destino">Destino sorpresa 🎁</p>
        <ul>
          <li>🗓️ {dias} días</li>
          {incluye.map((item) => (
            <li key={item}>✔ {item}</li>
          ))}
        </ul>
        <p className="precio">${precio.toLocaleString('es-CO')} COP</p>
        <Link to={`/paquete/${paquete._id}`} className="btn-elegir">Ver detalle</Link>
      </div>
    </motion.article>
  )
}