const Order = require('../models/Order');
const mongoose = require('mongoose');

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices for logged-in buyer
 * @access  Private
 */
const getInvoices = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .select('invoiceNo orderDate grandTotal paymentMethod paymentStatus status itemCount')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map(o => ({
        id: o._id,
        invoiceNo: o.invoiceNo,
        date: o.orderDate,
        amount: o.grandTotal,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        itemCount: o.itemCount
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/invoices/:id
 * @desc    Get single invoice details by invoiceNo or order ID
 * @access  Private
 */
const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order;

    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findById(id).lean();
    }
    if (!order) {
      order = await Order.findOne({ invoiceNo: id }).lean();
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found.',
        errors: []
      });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this invoice.',
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      data: {
        invoiceNo: order.invoiceNo,
        orderDate: order.orderDate,
        customerName: order.customerName,
        customerMobile: order.customerMobile,
        deliveryAddress: order.deliveryAddress,
        items: order.items,
        subtotal: order.subtotal,
        gst: order.gst,
        discount: order.discount,
        couponCode: order.couponCode,
        grandTotal: order.grandTotal,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        storeDetails: {
          storeName: 'SuperMart SAS',
          subtitle: 'Supermarket Automation Software • Retail POS',
          address: 'Salt Lake Sector V, Kolkata, West Bengal - 700091',
          gstin: '19AAACS2026M1Z8',
          fssai: '12822019000412'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInvoices,
  getInvoiceById
};
