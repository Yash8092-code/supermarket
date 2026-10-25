const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

describe('Orders and Checkout API Tests', () => {
  let buyer1, token1;
  let buyer2, token2;
  let product1, product2;

  before(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_supermart_sas_12345';
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    buyer1 = await User.create({
      name: 'Yash Kumar',
      email: 'yash@example.com',
      phone: '+91 9876543210',
      password: 'Password123!',
      address: 'Kolkata Sector V'
    });
    token1 = jwt.sign({ id: buyer1._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    buyer2 = await User.create({
      name: 'Other Buyer',
      email: 'other@example.com',
      phone: '+91 1122334455',
      password: 'Password123!'
    });
    token2 = jwt.sign({ id: buyer2._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    product1 = await Product.create({
      sku: 'prod-01',
      name: 'Basmati Rice',
      brand: 'India Gate',
      category: 'Groceries',
      price: 200,
      unit: '₹200/kg',
      image: 'https://images.unsplash.com/rice.jpg',
      inStock: true,
      stockCount: 20,
      description: 'Rice'
    });

    product2 = await Product.create({
      sku: 'prod-04',
      name: 'Amul Milk',
      brand: 'Amul',
      category: 'Dairy & Bakery',
      price: 30,
      unit: '₹30/pack',
      image: 'https://images.unsplash.com/milk.jpg',
      inStock: true,
      stockCount: 50,
      description: 'Milk'
    });
  });

  test('POST /api/orders - Creates order, decrements stock, calculates 5% GST, and generates invoice', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        customerName: 'Yash Kumar',
        customerMobile: '+91 9876543210',
        deliveryAddress: 'Kolkata Sector V',
        paymentMethod: 'UPI',
        couponCode: 'SUPER10', // 10% discount
        items: [
          { productId: product1._id.toString(), quantity: 2 }, // 2 * 200 = 400
          { productId: product2._id.toString(), quantity: 1 }  // 1 * 30  = 30
        ]
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.order.invoiceNo.startsWith('SMS-INV-2026-'));

    const order = res.body.order;
    assert.equal(order.subtotal, 430);
    assert.equal(order.discount, 43); // 10% of 430
    // Taxable = 430 - 43 = 387. 5% GST = 19.35
    assert.equal(order.gst, 19.35);
    assert.equal(order.grandTotal, 406.35);

    // Verify inventory decreased in DB
    const updatedProd1 = await Product.findById(product1._id);
    assert.equal(updatedProd1.stockCount, 18); // 20 - 2

    const updatedProd2 = await Product.findById(product2._id);
    assert.equal(updatedProd2.stockCount, 49); // 50 - 1
  });

  test('POST /api/orders - Rejects checkout when requested quantity exceeds available inventory', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        customerName: 'Yash Kumar',
        customerMobile: '+91 9876543210',
        paymentMethod: 'Cash',
        items: [{ productId: product1._id.toString(), quantity: 25 }] // only 20 in stock
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /insufficient inventory/i);

    // Verify stock is untouched
    const prod = await Product.findById(product1._id);
    assert.equal(prod.stockCount, 20);
  });

  test('GET /api/orders - Returns only authenticated buyer orders', async () => {
    // Create order for buyer1
    await Order.create({
      buyer: buyer1._id,
      invoiceNo: 'SMS-INV-2026-1111',
      customerName: 'Yash Kumar',
      customerMobile: '9876543210',
      items: [{ sku: 'prod-01', name: 'Rice', price: 200, quantity: 1, lineTotal: 200 }],
      itemCount: 1,
      subtotal: 200,
      gst: 10,
      grandTotal: 210,
      paymentMethod: 'Cash'
    });

    // Create order for buyer2
    await Order.create({
      buyer: buyer2._id,
      invoiceNo: 'SMS-INV-2026-2222',
      customerName: 'Other Buyer',
      customerMobile: '1122334455',
      items: [{ sku: 'prod-04', name: 'Milk', price: 30, quantity: 1, lineTotal: 30 }],
      itemCount: 1,
      subtotal: 30,
      gst: 1.5,
      grandTotal: 31.5,
      paymentMethod: 'Cash'
    });

    const res1 = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token1}`);

    assert.equal(res1.status, 200);
    assert.equal(res1.body.total, 1);
    assert.equal(res1.body.data[0].invoiceNo, 'SMS-INV-2026-1111');
  });

  test('GET /api/orders/:id and invoice - Prevents buyer from accessing another buyer order', async () => {
    const order2 = await Order.create({
      buyer: buyer2._id,
      invoiceNo: 'SMS-INV-2026-9999',
      customerName: 'Other Buyer',
      customerMobile: '1122334455',
      items: [{ sku: 'prod-04', name: 'Milk', price: 30, quantity: 1, lineTotal: 30 }],
      itemCount: 1,
      subtotal: 30,
      gst: 1.5,
      grandTotal: 31.5,
      paymentMethod: 'Cash'
    });

    // Buyer 1 attempts to access Buyer 2's order
    const res = await request(app)
      .get(`/api/orders/${order2._id}`)
      .set('Authorization', `Bearer ${token1}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);

    // Buyer 1 attempts to access Buyer 2's invoice
    const invRes = await request(app)
      .get(`/api/orders/${order2._id}/invoice`)
      .set('Authorization', `Bearer ${token1}`);

    assert.equal(invRes.status, 403);
  });
});
