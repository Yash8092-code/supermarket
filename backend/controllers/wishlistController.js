const mongoose = require('mongoose');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * Helper to get a product by ObjectId or SKU
 */
const findProduct = async (identifier) => {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const p = await Product.findById(identifier);
    if (p) return p;
  }
  return Product.findOne({ sku: identifier });
};

/**
 * @route   GET /api/wishlist
 * @desc    Get authenticated buyer's wishlist
 * @access  Private
 */
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    res.status(200).json({
      success: true,
      count: wishlist.products.length,
      data: wishlist.products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/wishlist/:productId
 * @desc    Add product to buyer wishlist
 * @access  Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await findProduct(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in catalogue.',
        errors: []
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const alreadySaved = wishlist.products.some(
      p => p.toString() === product._id.toString()
    );

    if (!alreadySaved) {
      wishlist.products.push(product._id);
      await wishlist.save();
    }

    const updated = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: `"${product.name}" added to saved items.`,
      count: updated.products.length,
      data: updated.products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/wishlist/:productId
 * @desc    Remove product from buyer wishlist
 * @access  Private
 */
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await findProduct(productId);
    const targetId = product ? product._id.toString() : productId;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    wishlist.products = wishlist.products.filter(
      p => p.toString() !== targetId
    );
    await wishlist.save();

    const updated = await Wishlist.findById(wishlist._id).populate('products');

    res.status(200).json({
      success: true,
      message: 'Item removed from saved items.',
      count: updated.products.length,
      data: updated.products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
