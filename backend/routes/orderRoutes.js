const express = require('express');
const {
  createOrder,
  getOrders,
  getOrderById,
  getOrderInvoice
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', getOrderInvoice);

module.exports = router;
