const express = require('express');
const {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductById
} = require('../controllers/productController');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
