const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * Valid promotional vouchers
 */
const VALID_COUPONS = {
  SUPER10: { code: 'SUPER10', discountPercent: 10, description: '10% Instant Supermarket Discount' },
  WELCOME50: { code: 'WELCOME50', discountPercent: 15, description: '15% VIP Welcome Voucher' }
};

/**
 * Helper to fetch a product by ObjectId or SKU
 */
const findProduct = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const p = await Product.findById(identifier);
    if (p) return p;
  }
  return Product.findOne({ sku: identifier });
};

/**
 * @route   GET /api/cart
 * @desc    Get authenticated buyer's cart with latest prices and stock
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const validCart = [];

    // Filter out any products that might have been removed from the database
    let changed = false;
    for (const item of user.cart) {
      if (item.product) {
        validCart.push({
          product: item.product,
          quantity: item.quantity
        });
      } else {
        changed = true;
      }
    }

    if (changed) {
      user.cart = validCart;
      await user.save();
    }

    // Server-side calculation of subtotal and estimated 5% GST
    const subtotal = validCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const gst = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = Math.round((subtotal + gst) * 100) / 100;

    res.status(200).json({
      success: true,
      data: {
        items: validCart,
        itemCount: validCart.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        gst,
        grandTotal
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart
 * @desc    Add product to cart or increment quantity
 * @access  Private
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const addQty = parseInt(quantity, 10);

    if (isNaN(addQty) || addQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer.',
        errors: [{ field: 'quantity', message: 'Quantity must be >= 1' }]
      });
    }

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
        errors: []
      });
    }

    if (!product.inStock || product.stockCount === 0) {
      return res.status(409).json({
        success: false,
        message: `Sorry, "${product.name}" is currently out of stock.`,
        errors: []
      });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === product._id.toString()
    );

    let newQuantity = addQty;
    if (existingIndex > -1) {
      newQuantity = user.cart[existingIndex].quantity + addQty;
      if (newQuantity > product.stockCount) {
        return res.status(409).json({
          success: false,
          message: `Cannot add more than available supermarket stock (${product.stockCount} available).`,
          errors: []
        });
      }
      user.cart[existingIndex].quantity = newQuantity;
    } else {
      if (addQty > product.stockCount) {
        return res.status(409).json({
          success: false,
          message: `Only ${product.stockCount} units available in stock.`,
          errors: []
        });
      }
      user.cart.push({ product: product._id, quantity: addQty });
    }

    await user.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/cart/:productId
 * @desc    Update specific item quantity in cart
 * @access  Private
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const newQty = parseInt(quantity, 10);

    if (isNaN(newQty)) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity number is required.',
        errors: []
      });
    }

    const user = await User.findById(req.user._id);
    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId || item.product.sku === productId
    );

    if (newQty <= 0) {
      // Remove item if quantity set to 0 or below
      if (itemIndex > -1) {
        user.cart.splice(itemIndex, 1);
        await user.save();
      }
      return getCart(req, res, next);
    }

    const product = await findProduct(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in catalogue.',
        errors: []
      });
    }

    if (newQty > product.stockCount) {
      return res.status(409).json({
        success: false,
        message: `Maximum store stock for ${product.name} is ${product.stockCount}.`,
        errors: []
      });
    }

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = newQty;
    } else {
      user.cart.push({ product: product._id, quantity: newQty });
    }

    await user.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove an individual item from cart
 * @access  Private
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    const product = await findProduct(productId);
    const targetId = product ? product._id.toString() : productId;

    user.cart = user.cart.filter(item => item.product.toString() !== targetId);
    await user.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items in cart
 * @access  Private
 */
const clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Shopping cart cleared successfully.',
      data: {
        items: [],
        itemCount: 0,
        subtotal: 0,
        gst: 0,
        grandTotal: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart/sync
 * @desc    Merge localStorage cart into authenticated user cart
 * @access  Private
 */
const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    const user = await User.findById(req.user._id);

    for (const localItem of items) {
      const prodIdentifier = localItem.productId || (localItem.product && (localItem.product._id || localItem.product.id || localItem.product.sku));
      if (!prodIdentifier) continue;

      const product = await findProduct(prodIdentifier);
      if (!product || !product.inStock || product.stockCount === 0) continue;

      const qty = Math.min(product.stockCount, Math.max(1, parseInt(localItem.quantity, 10) || 1));
      const existing = user.cart.find(
        i => i.product.toString() === product._id.toString()
      );

      if (existing) {
        existing.quantity = Math.min(product.stockCount, existing.quantity + qty);
      } else {
        user.cart.push({ product: product._id, quantity: qty });
      }
    }

    await user.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart/validate-coupon
 * @desc    Validate voucher coupon code
 * @access  Public
 */
const validateCoupon = async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a coupon code.'
    });
  }

  const normalized = code.trim().toUpperCase();
  const coupon = VALID_COUPONS[normalized];

  if (!coupon) {
    return res.status(400).json({
      success: false,
      message: `Invalid voucher code "${code}". Try using "SUPER10".`
    });
  }

  res.status(200).json({
    success: true,
    message: `Voucher "${coupon.code}" verified! ${coupon.discountPercent}% discount applicable.`,
    coupon
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  validateCoupon,
  VALID_COUPONS
};
