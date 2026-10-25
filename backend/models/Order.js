const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    sku: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerMobile: {
      type: String,
      required: true,
      trim: true
    },
    deliveryAddress: {
      type: String,
      trim: true,
      default: ''
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [val => val.length > 0, 'An order must contain at least one item']
    },
    itemCount: {
      type: Number,
      required: true,
      min: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    gst: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    couponCode: {
      type: String,
      default: '',
      trim: true
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Credit/Debit Card'],
      default: 'Cash'
    },
    paymentStatus: {
      type: String,
      enum: ['Simulated Paid', 'Pending', 'Cancelled'],
      default: 'Simulated Paid'
    },
    status: {
      type: String,
      enum: ['Completed', 'Processing', 'Cancelled'],
      default: 'Completed'
    },
    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
