const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'Product SKU/ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Fruits & Vegetables',
        'Dairy & Bakery',
        'Beverages',
        'Snacks',
        'Groceries',
        'Personal Care',
        'Household Items'
      ],
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit / packaging is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    fallback: {
      type: String,
      default: ''
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockCount: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock count cannot be negative'],
      default: 20
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    rating: {
      type: String,
      default: '4.7 (100+)'
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual for dynamic availability based on stock count
productSchema.virtual('isAvailable').get(function () {
  return this.inStock && this.stockCount > 0;
});

// Configure JSON serialization
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
