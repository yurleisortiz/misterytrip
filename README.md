# MisteryTrip

Plataforma web de viajes sorpresa. El usuario elige presupuesto, duración y gustos, y el destino se revela en el momento indicado.

- **Página publicada:** https://yurleisortiz.github.io/misterytrip/
- **API (Render):** https://misterytrip.onrender.com

## Funcionalidades

### Para el viajero
- Página de inicio con marca propia, fondo que cambia solo y animaciones
- Catálogo de paquetes con filtros por presupuesto y duración
- Menú **Ordenar** (recomendados, novedades, precio y duración)
- Página de **detalle** de cada paquete con galería, qué incluye, plan por días y tarjeta de reserva
- **Quiz** "Encuentra tu viaje": 4 preguntas y recomienda un paquete real del catálogo
- Tarjetas interactivas de tipos de viaje y carta "Revela tu pista"
- **Experiencias** de otros viajeros, con formulario para compartir la tuya
- Formulario de contacto que guarda los mensajes en la base de datos
- Chatbot con IA que conoce los paquetes y habla con el tono de la marca (nunca revela el destino)

### Para el administrador
- Login con token JWT
- Panel privado para crear, editar y eliminar paquetes
- Bandeja de mensajes de contacto
- Moderación de experiencias: aprobar, ocultar o eliminar

## Tecnologías
- **Frontend:** React, Vite, React Router, Framer Motion
- **Backend:** Node.js, Express
- **Base de datos:** MongoDB Atlas (Mongoose)
- **Autenticación:** JWT y bcrypt
- **IA:** Gemini API
- **Despliegue:** GitHub Pages (frontend) y Render (backend)

## Estructura
```
misterytrip/
├── frontend/
│   └── src/
│       ├── components/   # Navbar, Footer, Chatbot, TarjetaPaquete, Testimonios...
│       ├── pages/        # Home, Paquetes, Detalle, Quiz, Contacto, Login, Admin
│       └── services/     # conexión con la API
└── backend/
    ├── models/           # Paquete, Mensaje, Testimonio, Usuario
    ├── routes/           # paquetes, contacto, testimonios, auth, chat
    └── middleware/       # protección de rutas con JWT
```

## Cómo correrlo en local

1. Clonar el repositorio.
2. Backend:
```
cd backend
npm install
npm run dev
```
3. Frontend:
```
cd frontend
npm install
npm run dev
```

## Variables de entorno

`backend/.env`
```
PORT=4000
MONGO_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GEMINI_API_KEY=
GEMINI_MODEL=
```

`frontend/.env`
```
VITE_API_URL=http://localhost:4000
```

## Crear el administrador
```
cd backend
npm run admin
```

## Cargar los paquetes iniciales
```
cd backend
npm run seed
```

## Despliegue
- Cada `git push` a `main` redespliega el backend en Render.
- GitHub Actions construye el frontend y lo publica en GitHub Pages.
- La variable `VITE_API_URL` se guarda en GitHub (Settings, Secrets and variables, Actions, Variables).