const express = require('express');
const router = express.Router();
const { 
  getRecipes, 
  getNewRecipe, 
  createRecipe, 
  getRecipe, 
  getEditRecipe, 
  updateRecipe, 
  deleteRecipe 
} = require('../controllers/recipeController');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Rutas públicas
router.get('/', getRecipes);

// Rutas protegidas para creación
router.get('/new', protect, getNewRecipe);
router.post('/', protect, upload.single('image'), createRecipe);

// Rutas públicas de detalle (debe ir después de /new)
router.get('/:id', getRecipe);

// Rutas protegidas para edición y eliminación
router.get('/:id/edit', protect, getEditRecipe);
router.put('/:id', protect, upload.single('image'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
