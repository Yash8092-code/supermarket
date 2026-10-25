const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { VALID_COUPONS } = require('./cartController');

/**
 * Generate a unique invoice number: SMS-INV-2026-XXXX
 */
const generateInvoiceNumber = async () => {
  let isUnique = false;
  let invoiceNo = '';
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    invoiceNo = `SMS-INV-2026-${randomSuffix}`;
    const exists = await Order.findOne({ invoiceNo });
    if (!exists) {
      isUnique = true;
    }
  }

  return invoiceNo;
};

/**
 * @route   POST /api/orders
 * @desc    Create new order from checkout and generate invoice
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerMobile,
      deliveryAddress,
      paymentMethod = 'Cash',
      items = [],
      couponCode = ''
    } = req.body;

    // Validate customer identification
    const buyerName = (customerName || req.user.name || '').trim();
    const mobile = (customerMobile || req.user.phone || '').trim();

    if (!buyerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required.',
        errors: [{ field: 'customerName', message: 'Name is required' }]
      });
    }

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Customer mobile number is required.',
        errors: [{ field: 'customerMobile', message: 'Mobile is required' }]
      });
    }

    // Determine items to order
    let checkoutItems = items;
    if (!checkoutItems || checkoutItems.length === 0) {
      // Fallback: check user's server-side cart
      const user = await User.findById(req.user._id).populate('cart.product');
      if (user.cart && user.cart.length > 0) {
        checkoutItems = user.cart.map(i => ({
          productId: i.product._id,
          quantity: i.quantity
        }));
      }
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping cart is empty. Please add items before checking out.',
        errors: []
      });
    }

    // Server-side inventory & price verification
    const orderItemsSnapshot = [];
    let subtotal = 0;
    const inventoryUpdates = [];

    for (const item of checkoutItems) {
      const prodId = item.productId || (item.product && (item.product._id || item.product.id || item.product.sku)) || item.sku;
      const requestedQty = parseInt(item.quantity, 10);

      if (isNaN(requestedQty) || requestedQty < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity specified for item.`,
          errors: []
        });
      }

      let product;
      if (mongoose.Types.ObjectId.isValid(prodId)) {
        product = await Product.findById(prodId);
      }
      if (!product) {
        product = await Product.findOne({ sku: prodId });
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID/SKU "${prodId}" not found in supermarket catalogue.`,
          errors: []
        });
      }

      if (!product.inStock || product.stockCount < requestedQty) {
        return res.status(409).json({
          success: false,
          message: `Insufficient inventory for "${product.name}". Only ${product.stockCount} left in stock.`,
          errors: [{ field: product.sku, message: `Available: ${product.stockCount}, Requested: ${requestedQty}` }]
        });
      }

      const itemTotal = Math.round(product.price * requestedQty * 100) / 100;
      subtotal += itemTotal;

      orderItemsSnapshot.push({
        product: product._id,
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        unit: product.unit,
        image: product.image,
        price: product.price,
        quantity: requestedQty,
        lineTotal: itemTotal
      });

      inventoryUpdates.push({
        productId: product._id,
        decrementBy: requestedQty,
        remainingStock: product.stockCount - requestedQty
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // Server-side coupon verification
    let discount = 0;
    let validatedCoupon = '';
    if (couponCode && typeof couponCode === 'string') {
      const normalizedCode = couponCode.trim().toUpperCase();
      if (VALID_COUPONS[normalizedCode]) {
        const percent = VALID_COUPONS[normalizedCode].discountPercent;
        discount = Math.round(subtotal * (percent / 100) * 100) / 100;
        validatedCoupon = normalizedCode;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    // 5% standard GST retail grocery assumption
    const gst = Math.round(taxableAmount * 0.05 * 100) / 100;
    const grandTotal = Math.round((taxableAmount + gst) * 100) / 100;

    const invoiceNo = await generateInvoiceNumber();

    // Create and save Order
    const order = await Order.create({
      buyer: req.user._id,
      invoiceNo,
      customerName: buyerName,
      customerMobile: mobile,
      deliveryAddress: (deliveryAddress || req.user.address || '').trim(),
      items: orderItemsSnapshot,
      itemCount: orderItemsSnapshot.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      gst,
      discount,
      couponCode: validatedCoupon,
      grandTotal,
      paymentMethod,
      paymentStatus: 'Simulated Paid',
      status: 'Completed',
      orderDate: new Date()
    });

    // Decrement inventory for each purchased product
    for (const update of inventoryUpdates) {
      await Product.findByIdAndUpdate(update.productId, {
        $inc: { stockCount: -update.decrementBy },
        $set: { inStock: update.remainingStock > 0 }
      });
    }

    // Clear buyer's cart in database
    await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

    res.status(201).json({
      success: true,
      message: `Supermarket bill generated successfully! Invoice No: ${order.invoiceNo}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get order history for authenticated buyer
 * @access  Private
 */
const getOrders = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ buyer: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ buyer: req.user._id })
    ]);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details (ownership protected)
 * @access  Private
 */
const getOrderById = async (req, res, next) => {
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
        message: 'Order not found.',
        errors: []
      });
    }

    // Verify ownership
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view this order.',
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders/:id/invoice
 * @desc    Get formatted invoice data for printing (ownership protected)
 * @access  Private
 */
const getOrderInvoice = async (req, res, next) => {
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

    // Verify ownership
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this invoice.',
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
  createOrder,
  getOrders,
  getOrderById,
  getOrderInvoice
};
