const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  // Si es una petición API/JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }

  // Si es una vista
  res.render('error', {
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
};

module.exports = errorHandler;
