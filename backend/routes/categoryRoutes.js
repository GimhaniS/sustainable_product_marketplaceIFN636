const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  deleteCategory,
} = require('../controllers/CategoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .delete(protect, deleteCategory);

module.exports = router;