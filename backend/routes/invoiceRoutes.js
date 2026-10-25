const express = require('express');
const { getInvoices, getInvoiceById } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getInvoices);
router.get('/:id', getInvoiceById);

module.exports = router;
