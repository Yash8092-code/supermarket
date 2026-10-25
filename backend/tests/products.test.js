const { test, describe, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const Product = require('../models/Product');

describe('Product Catalogue API Tests', () => {
  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    // Seed 3 sample products
    await Product.create([
      {
        sku: 'prod-01',
        name: 'Fresh Shimla Apples',
        brand: 'FarmFresh Organic',
        category: 'Fruits & Vegetables',
        price: 120,
        unit: '₹120/kg',
        image: 'https://images.unsplash.com/apple.jpg',
        inStock: true,
        stockCount: 50,
        isPopular: true,
        description: 'Crisp Shimla apples'
      },
      {
        sku: 'prod-04',
        name: 'Amul Taaza Milk',
        brand: 'Amul',
        category: 'Dairy & Bakery',
        price: 32,
        unit: '₹32/500ml',
        image: 'https://images.unsplash.com/milk.jpg',
        inStock: true,
        stockCount: 80,
        isPopular: true,
        description: 'Pasteurized milk'
      },
      {
        sku: 'prod-20',
        name: 'Vim Dishwash Gel',
        brand: 'Vim',
        category: 'Household Items',
        price: 120,
        unit: '₹120/500ml',
        image: 'https://images.unsplash.com/vim.jpg',
        inStock: false,
        stockCount: 0,
        isPopular: false,
        description: 'Dishwash liquid'
      }
    ]);
  });

  test('GET /api/products - Returns list of products with pagination', async () => {
    const res = await request(app).get('/api/products');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.total, 3);
    assert.equal(res.body.data.length, 3);
  });

  test('GET /api/products - Category filter works', async () => {
    const res = await request(app).get('/api/products?category=Dairy %26 Bakery');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 1);
    assert.equal(res.body.data[0].name, 'Amul Taaza Milk');
  });

  test('GET /api/products - Search query works on name and brand', async () => {
    const res = await request(app).get('/api/products?search=Amul');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 1);
    assert.equal(res.body.data[0].brand, 'Amul');
  });

  test('GET /api/products - In-stock filter excludes out of stock items', async () => {
    const res = await request(app).get('/api/products?inStock=true');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 2);
    const hasOutOfStock = res.body.data.some(p => p.sku === 'prod-20');
    assert.equal(hasOutOfStock, false);
  });

  test('GET /api/products - Sorting by price ascending and descending', async () => {
    const ascRes = await request(app).get('/api/products?sortBy=price-asc');
    assert.equal(ascRes.status, 200);
    assert.equal(ascRes.body.data[0].price, 32);

    const descRes = await request(app).get('/api/products?sortBy=price-desc');
    assert.equal(descRes.status, 200);
    assert.equal(descRes.body.data[0].price, 120);
  });

  test('GET /api/products/:id - Returns product by SKU or ObjectId', async () => {
    const res = await request(app).get('/api/products/prod-01');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.name, 'Fresh Shimla Apples');

    const notFound = await request(app).get('/api/products/prod-999');
    assert.equal(notFound.status, 404);
  });

  test('GET /api/products/categories - Returns categories list', async () => {
    const res = await request(app).get('/api/products/categories');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.categories));
    assert.ok(res.body.categories.includes('Fruits & Vegetables'));
  });
});
