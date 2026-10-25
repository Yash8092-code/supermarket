const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const User = require('../models/User');

describe('Authentication API Tests', () => {
  before(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_key_supermart_sas_12345';
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  test('POST /api/auth/register - Successfully registers new buyer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        city: 'Kolkata',
        address: 'Sector V'
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'john@example.com');
    assert.equal(res.body.user.role, 'buyer');

    // Verify password is encrypted in database
    const saved = await User.findOne({ email: 'john@example.com' }).select('+password');
    assert.notEqual(saved.password, 'Password123!');
  });

  test('POST /api/auth/register - Rejects duplicate email registration', async () => {
    await User.create({
      name: 'Existing Buyer',
      email: 'existing@example.com',
      phone: '9876543210',
      password: 'Password123!'
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'existing@example.com',
        phone: '1234567890',
        password: 'Password123!',
        confirmPassword: 'Password123!'
      });

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already exists/i);
  });

  test('POST /api/auth/register - Rejects password mismatch and short passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Short Pass',
        email: 'short@example.com',
        phone: '9876543210',
        password: 'short',
        confirmPassword: 'different'
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.length > 0);
  });

  test('POST /api/auth/login - Successfully logs in with valid credentials', async () => {
    await User.create({
      name: 'Valid Buyer',
      email: 'valid@example.com',
      phone: '9876543210',
      password: 'Password123!'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'valid@example.com',
        password: 'Password123!'
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.name, 'Valid Buyer');
  });

  test('POST /api/auth/login - Rejects incorrect password', async () => {
    await User.create({
      name: 'Valid Buyer',
      email: 'valid@example.com',
      phone: '9876543210',
      password: 'Password123!'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'valid@example.com',
        password: 'WrongPassword!'
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('GET /api/auth/me - Protected route rejects missing token and accepts valid token', async () => {
    // 1. Missing token
    const unauthRes = await request(app).get('/api/auth/me');
    assert.equal(unauthRes.status, 401);

    // 2. Valid token
    const user = await User.create({
      name: 'Auth Buyer',
      email: 'auth@example.com',
      phone: '9876543210',
      password: 'Password123!'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'auth@example.com', password: 'Password123!' });

    const authRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    assert.equal(authRes.status, 200);
    assert.equal(authRes.body.user.email, 'auth@example.com');
  });
});
