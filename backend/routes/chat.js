const express = require('express')
const Paquete = require('../models/Paquete')
const router = express.Router()

const MODELO = process.env.GEMINI_MODEL || 'gemini-3.8-flash'

// POST /api/chat -> recibe el historial y devuelve la respuesta de la IA
router.post('/', async (req, res) => {
  const { mensajes } = req.body
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return res.status(400).json({ mensaje: 'Escribe un mensaje' })
  }

  try {
    // El catálogo real se lee de la base de datos para que la IA conozca los paquetes
    const paquetes = await Paquete.find()
    const catalogo = paquetes
      .map((p) => `- ${p.nombre} (${p.tipo}): ${p.dias} días, $${p.precio.toLocaleString('es-CO')} COP. Incluye: ${p.incluye.join(', ')}`)
      .join('\n')

    const instrucciones = `Eres el asistente de MisteryTrip, una plataforma de viajes sorpresa en Colombia.
Tono: cercano, emocionante y misterioso. Respondes en español, en máximo 4 frases, sin markdown ni asteriscos.

REGLAS:
- Nunca reveles el destino de un paquete. Solo da pistas del tipo de experiencia (clima, ambiente, actividades).
- Recomienda solo paquetes de esta lista, según presupuesto, días y gustos del usuario:
${catalogo}
- Si preguntan algo que no tiene que ver con viajes o MisteryTrip, redirige con amabilidad.
- Si el usuario quiere reservar, invítalo a escribir desde la página de Contacto.
- Si te piden un texto (mensaje de regalo, invitación, pista misteriosa), escríbelo listo para copiar.`

    // Gemini exige que el historial empiece con un mensaje del usuario
    const contents = mensajes.slice(-10).map((m) => ({
      role: m.rol === 'bot' ? 'model' : 'user',
      parts: [{ text: String(m.texto).slice(0, 500) }],
    }))
    while (contents.length && contents[0].role === 'model') contents.shift()

    const respuesta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: instrucciones }] },
          contents,
        }),
      }
    )

    const datos = await respuesta.json()
    if (!respuesta.ok) {
      console.error('Error de Gemini:', JSON.stringify(datos))
      return res.status(502).json({ mensaje: 'La IA no está disponible ahora' })
    }

    const texto = datos.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')
    res.json({ respuesta: texto || 'No pude responder eso. ¿Me lo dices de otra forma?' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al hablar con la IA' })
  }
})

module.exports = router