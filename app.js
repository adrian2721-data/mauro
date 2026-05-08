require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const { checkUser } = require('./middlewares/auth');

// Inicializar app
const app = express();

// Conectar a Base de Datos
connectDB();

// Configuración de Vistas (EJS)
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method')); // Permite usar PUT y DELETE en formularios HTML
app.use(express.static(path.join(__dirname, 'public')));

// Middleware global para verificar usuario logueado en todas las vistas
app.use(checkUser);

// Rutas
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/recipes', require('./routes/recipes'));

// Manejador de errores 404
app.use((req, res, next) => {
  res.status(404).render('error', { 
    message: 'Página no encontrada',
    error: { status: 404 }
  });
});

// Middleware de manejo de errores global
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
  });
}

module.exports = app;
