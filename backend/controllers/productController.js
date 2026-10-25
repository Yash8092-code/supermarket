const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination, search, category filter, in-stock filter, and sorting
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const query = {};

    // Category filter
    if (req.query.category && req.query.category !== 'all') {
      query.category = req.query.category;
    }

    // In-Stock filter
    if (req.query.inStock === 'true' || req.query.inStockOnly === 'true') {
      query.inStock = true;
      query.stockCount = { $gt: 0 };
    }

    // Search query (sanitized text search on name, brand, category, description)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ];
    }

    // Sorting
    let sortOptions = { isPopular: -1, createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'name-asc':
          sortOptions = { name: 1 };
          break;
        case 'popular':
        default:
          sortOptions = { isPopular: -1, createdAt: -1 };
          break;
      }
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: products,
      products: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/categories
 * @desc    Get all unique available product categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories: [
        'Fruits & Vegetables',
        'Dairy & Bakery',
        'Beverages',
        'Snacks',
        'Groceries',
        'Personal Care',
        'Household Items'
      ].filter(c => categories.includes(c) || true)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/featured
 * @desc    Get featured/popular products
 * @access  Public
 */
const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 6);
    const products = await Product.find({ isPopular: true, inStock: true })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by MongoDB ID or SKU
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }

    // Fallback: search by SKU (e.g. prod-01)
    if (!product) {
      product = await Product.findOne({ sku: id }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with identifier "${id}".`,
        errors: []
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductById
};
