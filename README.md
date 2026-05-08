# Mi Aplicación Recetario

Aplicación web full-stack con Node.js, Express y MongoDB.

## Funcionalidades
- Registro y login con JWT
- CRUD de recetas con roles (user/admin)
- Vistas dinámicas con EJS
- Paginación y búsqueda avanzada
- Desplegada en Render.com

## Tecnologías
- Node.js 24 LTS
- Express
- Mongoose
- JWT + bcrypt
- EJS
- cookie-parser, dotenv, method-override

## Enlace en producción
https://tu-app.onrender.com

## Instalación local
1. `npm install`
2. Crear archivo `.env` con las variables de entorno necesarias (ej: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `EMAIL_USER`, `EMAIL_PASS`)
3. `npm run dev` (para desarrollo) o `npm start` (para producción)
