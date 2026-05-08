const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail } = require('../services/emailService');

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Opciones para la cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
};

exports.getLogin = (req, res) => {
  if (req.user) return res.redirect('/recipes');
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que vengan los datos
    if (!email || !password) {
      return res.render('auth/login', { error: 'Por favor ingrese email y contraseña' });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Credenciales inválidas' });
    }

    // Generar token y cookie
    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Error al iniciar sesión' });
  }
};

exports.getRegister = (req, res) => {
  if (req.user) return res.redirect('/recipes');
  res.render('auth/register', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      return res.render('auth/register', { error: 'Todos los campos son obligatorios' });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
      return res.render('auth/register', { error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.render('auth/register', { error: 'El usuario ya existe' });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role: 'user' // Por defecto
    });

    // Enviar email de bienvenida asíncronamente (sin bloquear la respuesta)
    sendWelcomeEmail(user.email, user.name);

    // Generar token y cookie
    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    res.redirect('/recipes');
  } catch (error) {
    console.error(error);
    res.render('auth/register', { error: 'Error al registrar usuario' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
};
