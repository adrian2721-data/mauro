const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

describe('Pruebas Básicas de la Aplicación', () => {
  
  // Cerrar la conexión a la base de datos después de todas las pruebas
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Rutas Públicas', () => {
    test('GET / debe redirigir a /recipes', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/recipes');
    });

    test('GET /recipes debe retornar estado 200 y mostrar recetas', async () => {
      const response = await request(app).get('/recipes');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Descubre Recetas');
    });

    test('GET /auth/login debe retornar la vista de inicio de sesión', async () => {
      const response = await request(app).get('/auth/login');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Iniciar Sesión');
    });
  });

  describe('Manejo de Errores', () => {
    test('GET /ruta-no-existente debe devolver estado 404', async () => {
      const response = await request(app).get('/ruta-que-no-existe-12345');
      expect(response.statusCode).toBe(404);
      expect(response.text).toContain('Página no encontrada');
    });
  });

});