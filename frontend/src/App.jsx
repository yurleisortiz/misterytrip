import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Paquetes from './pages/Paquetes'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/paquetes" element={<Paquetes />} />
      </Routes>
    </>
  )
}