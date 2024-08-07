const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Rutas principales
router.get('/', noteController.getAllNotes);
router.get('/add', noteController.getAddNotePage);
router.post('/add', noteController.addNote);
router.get('/edit/:id', noteController.getEditNotePage);
router.post('/edit/:id', noteController.updateNote);
router.get('/delete/:id', noteController.deleteNote);

// Rutas de categorías
router.get('/categories', noteController.getCategories);
router.post('/add-category', noteController.addCategory);
router.get('/delete-category/:id', noteController.deleteCategory);
router.get('/filter/:categoryId', noteController.filterByCategory);

// Ruta de búsqueda
router.get('/api/search', noteController.searchNotes);

module.exports = router;