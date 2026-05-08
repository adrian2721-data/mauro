const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  ingredients: {
    type: [String],
    required: [true, 'Los ingredientes son obligatorios']
  },
  instructions: {
    type: String,
    required: [true, 'Las instrucciones son obligatorias']
  },
  category: {
    type: String,
    enum: ['Desayuno', 'Almuerzo', 'Cena', 'Postre', 'Bebida', 'Otro'],
    default: 'Otro'
  },
  image: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
