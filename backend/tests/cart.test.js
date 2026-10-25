const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const Product = require('../models/Product');
const User = require('../models/User');

describe('Shopping Cart API Tests', () => {
  let user;
  let token;
  let product1;
  let productOOS;

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
      name: 'Cart Buyer',
      email: 'cartbuyer@example.com',
      phone: '9876543210',
      password: 'Password123!'
    });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    product1 = await Product.create({
      sku: 'prod-01',
      name: 'Shimla Apples',
      brand: 'FarmFresh',
      category: 'Fruits & Vegetables',
      price: 100,
      unit: '₹100/kg',
      image: 'https://images.unsplash.com/apple.jpg',
      inStock: true,
      stockCount: 10,
      description: 'Apples'
    });

    productOOS = await Product.create({
      sku: 'prod-OOS',
      name: 'Out of Stock Product',
      brand: 'TestBrand',
      category: 'Groceries',
      price: 50,
      unit: '₹50/pack',
      image: 'https://images.unsplash.com/oos.jpg',
      inStock: false,
      stockCount: 0,
      description: 'Zero stock item'
    });
  });

  test('POST /api/cart - Adds item to cart and calculates subtotal & 5% GST', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1._id.toString(),
        quantity: 2
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.itemCount, 2);
    assert.equal(res.body.data.subtotal, 200);
    assert.equal(res.body.data.gst, 10); // 5% of 200
    assert.equal(res.body.data.grandTotal, 210);
  });

  test('POST /api/cart - Rejects adding out-of-stock product', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: productOOS._id.toString(),
        quantity: 1
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /out of stock/i);
  });

  test('POST /api/cart - Rejects quantity exceeding inventory stock', async () => {
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: product1._id.toString(),
        quantity: 15 // Stock is only 10
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
  });

  test('PATCH /api/cart/:productId - Updates quantity properly', async () => {
    // Add 2 items first
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product1._id.toString(), quantity: 2 });

    // Update to 4
    const res = await request(app)
      .patch(`/api/cart/${product1._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 4 });

    assert.equal(res.status, 200);
    assert.equal(res.body.data.itemCount, 4);
    assert.equal(res.body.data.subtotal, 400);
  });

  test('DELETE /api/cart/:productId - Removes item from cart', async () => {
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product1._id.toString(), quantity: 2 });

    const res = await request(app)
      .delete(`/api/cart/${product1._id}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.itemCount, 0);
  });

  test('DELETE /api/cart - Clears all cart contents', async () => {
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product1._id.toString(), quantity: 1 });

    const res = await request(app)
      .delete('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.data.items.length, 0);
  });

  test('POST /api/cart/validate-coupon - Validates SUPER10 and rejects invalid codes', async () => {
    const validRes = await request(app)
      .post('/api/cart/validate-coupon')
      .send({ code: 'SUPER10' });

    assert.equal(validRes.status, 200);
    assert.equal(validRes.body.coupon.discountPercent, 10);

    const invalidRes = await request(app)
      .post('/api/cart/validate-coupon')
      .send({ code: 'BOGUS99' });

    assert.equal(invalidRes.status, 400);
    assert.equal(invalidRes.body.success, false);
  });
});
