const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  validateCoupon
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Coupon validation can be public
router.post('/validate-coupon', validateCoupon);

// All other cart operations require authentication
router.use(protect);

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);
router.post('/sync', syncCart);

module.exports = router;
