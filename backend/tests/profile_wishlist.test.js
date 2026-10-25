const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

describe('Profile, Wishlist, and Dashboard API Tests', () => {
  let user, token, product;

  before(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_supermart_sas_12345';
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    user = await User.create({
      name: 'Yash Kumar',
      email: 'yash@example.com',
      phone: '+91 9876543210',
      password: 'Password123!',
      city: 'Kolkata, West Bengal',
      address: 'Salt Lake Sector V',
      role: 'buyer'
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    product = await Product.create({
      sku: 'prod-01',
      name: 'Fresh Apples',
      brand: 'FarmFresh',
      category: 'Fruits & Vegetables',
      price: 120,
      unit: '₹120/kg',
      image: 'https://images.unsplash.com/apple.jpg',
      inStock: true,
      stockCount: 20,
      description: 'Apples'
    });
  });

  test('GET /api/profile & PATCH /api/profile - Retrieves and updates allowed profile fields', async () => {
    const getRes = await request(app)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.data.name, 'Yash Kumar');

    // Update profile
    const patchRes = await request(app)
      .patch('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Yash K. Thakur',
        city: 'New Town, Kolkata',
        role: 'admin' // Protected field: should NOT change role
      });

    assert.equal(patchRes.status, 200);
    assert.equal(patchRes.body.data.name, 'Yash K. Thakur');
    assert.equal(patchRes.body.data.city, 'New Town, Kolkata');
    assert.equal(patchRes.body.data.role, 'buyer'); // Role remained buyer
  });

  test('POST /api/wishlist/:productId & DELETE - Adds to wishlist, prevents duplicate, and removes', async () => {
    // Add to wishlist
    const addRes = await request(app)
      .post(`/api/wishlist/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(addRes.status, 200);
    assert.equal(addRes.body.count, 1);

    // Duplicate add should not increase count
    const dupRes = await request(app)
      .post(`/api/wishlist/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(dupRes.status, 200);
    assert.equal(dupRes.body.count, 1);

    // Remove from wishlist
    const delRes = await request(app)
      .delete(`/api/wishlist/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(delRes.status, 200);
    assert.equal(delRes.body.count, 0);
  });

  test('GET /api/dashboard/stats - Returns real dynamic buyer metrics', async () => {
    // Empty initial state
    const emptyStats = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(emptyStats.status, 200);
    assert.equal(emptyStats.body.data.stats.totalOrders, 0);
    assert.equal(emptyStats.body.data.stats.lifetimeSpend, 0);

    // Create an order
    await Order.create({
      buyer: user._id,
      invoiceNo: 'SMS-INV-2026-3333',
      customerName: 'Yash Kumar',
      customerMobile: '9876543210',
      items: [{ sku: 'prod-01', name: 'Apples', price: 120, quantity: 2, lineTotal: 240 }],
      itemCount: 2,
      subtotal: 240,
      gst: 12,
      grandTotal: 252,
      paymentMethod: 'Cash'
    });

    const populatedStats = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(populatedStats.status, 200);
    assert.equal(populatedStats.body.data.stats.totalOrders, 1);
    assert.equal(populatedStats.body.data.stats.lifetimeSpend, 252);
    assert.equal(populatedStats.body.data.recentOrders.length, 1);
  });

  test('GET /api/health - Returns 200 and operational server info', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.version);
    assert.ok(res.body.database);
  });
});
