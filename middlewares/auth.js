const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en las cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario del token
    req.user = await User.findById(decoded.id).select('-password');
    res.locals.user = req.user; // Para usar en las vistas
    
    next();
  } catch (error) {
    console.error(error);
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).render('error', {
        message: 'No tienes permiso para realizar esta acción',
        error: { status: 403 }
      });
    }
    next();
  };
};

// Middleware para pasar el usuario a las vistas si está logueado (sin proteger la ruta)
const checkUser = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      res.locals.user = req.user;
    } catch (error) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = { protect, authorize, checkUser };
