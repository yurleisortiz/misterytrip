import { useState } from 'react'
import './RevelaPista.css'

const pistas = [
  'Hay mar, pero no es el que imaginas.',
  'Vas a madrugar para ver el amanecer más bonito de tu vida.',
  'Allí el café sabe distinto y el atardecer se aplaude.',
  'Lleva zapatos cómodos: vas a caminar entre montañas.',
  'Habrá hamaca. Es todo lo que puedo decir.',
  'La comida de allá te va a arruinar todas las demás.',
]

export default function RevelaPista() {
  const [volteada, setVolteada] = useState(false)
  const [pista, setPista] = useState(pistas[0])

  // Al voltear, elige una pista al azar
  const voltear = () => {
    if (!volteada) setPista(pistas[Math.floor(Math.random() * pistas.length)])
    setVolteada(!volteada)
  }

  return (
    <section className="revela">
      <h2>¿Te animas a una pista?</h2>
      <p>Toca la carta y descubre un secreto de tu próximo viaje.</p>

      <div className="carta" onClick={voltear}>
        <div className={volteada ? 'carta-interior volteada' : 'carta-interior'}>
          <div className="cara frente">
            <span>?</span>
            <small>Toca para revelar</small>
          </div>
          <div className="cara atras">
            <p>{pista}</p>
            <small>Toca para volver a jugar</small>
          </div>
        </div>
      </div>
    </section>
  )
}